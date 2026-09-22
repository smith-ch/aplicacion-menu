import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { AuthUser } from '../common/current-user.decorator';
import {
  DocumentType, ORDER_STATUS_LABELS, OrderSource, OrderStatus, PaymentMethod, PaymentRecordStatus, PaymentStatus, PhotoStage, Role,
} from '../common/enums';
import { orderCode } from '../common/utils';
import { ConcrebillService } from '../concrebill/concrebill.service';
import {
  BillingDocument, Order, OrderItem, OrderPhoto, OrderUpdate, Payment, Review, ServiceItem, User,
} from '../entities';
import {
  AdminPaymentDto, ChangeStatusDto, ClientPaymentDto, CreateOrderDto, DocumentDto, ReviewDto, ReviewPaymentDto, UpdateOrderDto,
} from './orders.dto';

const TECH_ALLOWED: OrderStatus[] = [OrderStatus.SURVEY, OrderStatus.IN_PROGRESS, OrderStatus.COMPLETED];

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(OrderUpdate) private readonly updates: Repository<OrderUpdate>,
    @InjectRepository(OrderPhoto) private readonly photos: Repository<OrderPhoto>,
    @InjectRepository(ServiceItem) private readonly services: Repository<ServiceItem>,
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
    @InjectRepository(BillingDocument) private readonly documents: Repository<BillingDocument>,
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly concrebill: ConcrebillService,
    private readonly auth: AuthService,
  ) {}

  // ================== Creación ==================

  async create(dto: CreateOrderDto, user?: AuthUser) {
    const ids = [...new Set(dto.items.map((i) => i.serviceId))];
    const found = await this.services.findBy({ id: In(ids) });
    if (found.length !== ids.length) throw new BadRequestException('Uno de los servicios seleccionados no existe');
    const byId = new Map(found.map((s) => [s.id, s]));

    const isStaff = user?.role === Role.ADMIN || user?.role === Role.TECHNICIAN;
    const email = dto.contactEmail.toLowerCase().trim();
    // El cliente autenticado queda vinculado; si es un invitado con correo registrado también se vincula.
    const client = user && !isStaff
      ? await this.users.findOneBy({ id: user.id })
      : await this.users.findOneBy({ email, role: Role.CLIENT });

    const { items, source, ...fields } = dto;
    let order = this.orders.create({
      ...fields,
      contactEmail: email,
      client: client ?? null,
      source: isStaff && source ? source : OrderSource.WEB,
      items: items.map((i) => ({
        service: byId.get(i.serviceId)!, serviceName: byId.get(i.serviceId)!.name, quantity: i.quantity ?? 1, notes: i.notes ?? null,
      }) as OrderItem),
    });
    order = await this.orders.save(order);
    order.code = orderCode(order.id);
    await this.orders.update(order.id, { code: order.code });

    await this.updates.save(this.updates.create({
      order: { id: order.id }, status: OrderStatus.RECEIVED, visibleToClient: true,
      author: isStaff ? { id: user!.id } : null,
      message: 'Solicitud recibida. Un supervisor te contactará para coordinar el levantamiento.',
    }));

    // Sincroniza el cliente con Concrebill (completa RNC/Cédula si no lo tenía)
    if (client) {
      if (!client.documentId && dto.documentId) client.documentId = dto.documentId;
      if (!client.address) client.address = dto.address;
      if (!client.phone) client.phone = dto.contactPhone;
      await this.users.save(client);
      await this.auth.syncClient(client);
    }
    return { id: order.id, code: order.code };
  }

  // ================== Lectura ==================

  async detail(id: number, user: AuthUser) {
    const order = await this.orders.findOne({
      where: { id },
      relations: { client: true, technician: true, items: true, review: true, documents: true, payments: true },
    });
    if (!order) throw new NotFoundException('Orden no encontrada');
    this.assertAccess(order, user);

    const isClient = user.role === Role.CLIENT;
    const updates = await this.updates.find({
      where: { order: { id }, ...(isClient ? { visibleToClient: true } : {}) },
      relations: { photos: true },
      order: { createdAt: 'DESC' },
    });
    const photos = await this.photos.find({ where: { order: { id } }, order: { createdAt: 'ASC' } });
    const result = { ...order, updates, photos, statusLabel: ORDER_STATUS_LABELS[order.status] };
    if (isClient) {
      delete (result as Partial<Order>).internalNotes;
    }
    return result;
  }

  listForClient(user: AuthUser) {
    return this.orders.find({
      where: { client: { id: user.id } },
      relations: { items: true, review: true },
      order: { createdAt: 'DESC' },
    });
  }

  async listForStaff(user: AuthUser, filters: { status?: string; q?: string; technicianId?: string; source?: string }) {
    const qb = this.orders.createQueryBuilder('o')
      .leftJoinAndSelect('o.items', 'items')
      .leftJoinAndSelect('o.technician', 'technician')
      .leftJoinAndSelect('o.client', 'client')
      .orderBy('o.createdAt', 'DESC');
    if (user.role === Role.TECHNICIAN) qb.andWhere('technician.id = :tid', { tid: user.id });
    else if (filters.technicianId) qb.andWhere('technician.id = :tid', { tid: Number(filters.technicianId) });
    if (filters.status) qb.andWhere('o.status = :status', { status: filters.status });
    if (filters.source) qb.andWhere('o.source = :source', { source: filters.source });
    if (filters.q) {
      qb.andWhere('(LOWER(o.contactName) LIKE :q OR LOWER(o.contactEmail) LIKE :q OR o.contactPhone LIKE :q OR LOWER(o.code) LIKE :q OR LOWER(o.address) LIKE :q)',
        { q: `%${filters.q.toLowerCase()}%` });
    }
    return qb.getMany();
  }

  /** Seguimiento público con código + correo (para órdenes de invitados). */
  async track(code: string, email: string) {
    const order = await this.orders.findOne({ where: { code: code?.trim().toUpperCase() }, relations: { items: true } });
    if (!order || order.contactEmail !== email?.toLowerCase().trim()) throw new NotFoundException('No encontramos una orden con esos datos');
    const updates = await this.updates.find({ where: { order: { id: order.id }, visibleToClient: true }, order: { createdAt: 'DESC' } });
    return {
      code: order.code, status: order.status, statusLabel: ORDER_STATUS_LABELS[order.status], createdAt: order.createdAt,
      scheduledAt: order.scheduledAt, items: order.items.map((i) => ({ serviceName: i.serviceName, quantity: i.quantity })),
      updates: updates.map((u) => ({ status: u.status, message: u.message, createdAt: u.createdAt })),
    };
  }

  // ================== Gestión (staff) ==================

  async update(id: number, dto: UpdateOrderDto, user: AuthUser) {
    const order = await this.getOrder(id);
    const { technicianId, quotedAmount, ...rest } = dto;
    Object.assign(order, rest);
    if (quotedAmount !== undefined) order.quotedAmount = quotedAmount != null ? String(quotedAmount) : null;
    if (technicianId !== undefined) {
      if (technicianId) {
        const tech = await this.users.findOneBy({ id: technicianId });
        if (!tech || tech.role === Role.CLIENT) throw new BadRequestException('Técnico inválido');
        order.technician = tech;
        await this.log(order.id, user, `Cuadrilla asignada: ${tech.name}${tech.specialty ? ` (${tech.specialty})` : ''}.`, null, true);
      } else order.technician = null;
    }
    if (rest.scheduledAt) {
      await this.log(order.id, user, `Visita/ejecución programada para ${new Date(rest.scheduledAt).toLocaleString('es-DO')}.`, null, true);
    }
    await this.orders.save(order);
    return this.detail(id, user);
  }

  async changeStatus(id: number, dto: ChangeStatusDto, user: AuthUser) {
    const order = await this.getOrder(id);
    this.assertAccess(order, user);
    if (user.role === Role.TECHNICIAN && !TECH_ALLOWED.includes(dto.status)) {
      throw new ForbiddenException('Los técnicos sólo pueden marcar Levantamiento, Ejecución o Completada');
    }
    order.status = dto.status;
    await this.orders.save(order);
    const defaults: Partial<Record<OrderStatus, string>> = {
      [OrderStatus.SURVEY]: 'Nuestro supervisor está realizando el levantamiento de tu espacio.',
      [OrderStatus.QUOTED]: 'Tu cotización está lista. Revísala en la sección Documentos.',
      [OrderStatus.IN_PROGRESS]: 'Iniciamos la ejecución del proyecto. Recibirás reportes diarios con fotos.',
      [OrderStatus.COMPLETED]: '¡Trabajo completado! Cuéntanos cómo te fue evaluando el servicio.',
      [OrderStatus.CANCELLED]: 'La orden fue cancelada.',
    };
    await this.log(id, user, dto.message || defaults[dto.status] || `Estado: ${ORDER_STATUS_LABELS[dto.status]}`, dto.status, true);
    return this.detail(id, user);
  }

  /** Reporte de avance con fotos (antes / durante / después). */
  async addProgress(id: number, user: AuthUser, message: string, stage: PhotoStage, visible: boolean, files: Express.Multer.File[], urls: string[]) {
    const order = await this.getOrder(id);
    this.assertAccess(order, user);
    const update = await this.log(id, user, message, null, visible);
    if (urls.length) {
      await this.photos.save(urls.map((url, i) => this.photos.create({
        order: { id }, update: { id: update.id }, url, stage, caption: files[i]?.originalname ?? null, uploadedBy: { id: user.id },
      })));
    }
    return this.detail(id, user);
  }

  async deletePhoto(photoId: number) {
    await this.photos.delete(photoId);
    return { ok: true };
  }

  // ================== Evaluación ==================

  async review(id: number, user: AuthUser, dto: ReviewDto) {
    const order = await this.orders.findOne({ where: { id }, relations: { client: true, review: true } });
    if (!order) throw new NotFoundException();
    this.assertAccess(order, user);
    if (order.status !== OrderStatus.COMPLETED) throw new BadRequestException('Podrás evaluar cuando el trabajo esté completado');
    if (order.review) throw new BadRequestException('Esta orden ya fue evaluada');
    const review = await this.reviews.save(this.reviews.create({ ...dto, order: { id } }));
    await this.log(id, user, `El cliente evaluó el servicio con ${dto.rating}/5 estrellas.`, null, false);
    return review;
  }

  // ================== Documentos (Concrebill) ==================

  async addDocument(id: number, dto: DocumentDto, user: AuthUser) {
    await this.getOrder(id);
    const doc = await this.documents.save(this.documents.create({
      ...dto, amount: String(dto.amount), order: { id }, origin: dto.concrebillId ? 'concrebill' : 'manual',
    }));
    if (dto.type === DocumentType.QUOTE) {
      await this.orders.update(id, { quotedAmount: String(dto.amount), status: OrderStatus.QUOTED });
      await this.log(id, user, `Cotización ${dto.number} disponible por ${this.money(dto.amount)}.`, OrderStatus.QUOTED, true);
    } else if (dto.type === DocumentType.INVOICE) {
      await this.log(id, user, `Factura ${dto.number} emitida por ${this.money(dto.amount)}.`, null, true);
    }
    return doc;
  }

  async updateDocument(docId: number, dto: Partial<DocumentDto>) {
    const doc = await this.documents.findOneBy({ id: docId });
    if (!doc) throw new NotFoundException();
    const { amount, ...rest } = dto;
    Object.assign(doc, rest);
    if (amount !== undefined) doc.amount = String(amount);
    return this.documents.save(doc);
  }

  async deleteDocument(docId: number) {
    await this.documents.delete(docId);
    return { ok: true };
  }

  /** Trae de Concrebill las cotizaciones/facturas cuyo campo `reference` es el código de la orden. */
  async syncDocuments(id: number) {
    const order = await this.orders.findOne({ where: { id }, relations: { client: true, documents: true } });
    if (!order) throw new NotFoundException();
    if (!order.client?.concrebillClientId) throw new BadRequestException('El cliente aún no está sincronizado con Concrebill');
    const remote = await this.concrebill.listClientDocuments(order.client.concrebillClientId);
    let created = 0;
    for (const d of remote.filter((r) => r.reference === order.code)) {
      const existing = order.documents.find((x) => x.concrebillId === d.id);
      const data = {
        type: d.type as DocumentType, number: d.number, amount: String(d.amount), currency: d.currency || 'DOP', status: d.status,
        issuedAt: d.issuedAt ?? null, dueDate: d.dueDate ?? null, fileUrl: d.pdfUrl ?? null, concrebillId: d.id, origin: 'concrebill',
      };
      if (existing) await this.documents.update(existing.id, data);
      else { await this.documents.save(this.documents.create({ ...data, order: { id } })); created++; }
    }
    return { synced: remote.length, created, mode: this.concrebill.enabled ? 'api' : 'simulado' };
  }

  // ================== Pagos ==================

  /** Pago por transferencia: el cliente sube el comprobante y queda "en revisión". */
  async clientPayment(id: number, user: AuthUser, dto: ClientPaymentDto, receiptUrl: string | null) {
    const order = await this.orders.findOne({ where: { id }, relations: { client: true } });
    if (!order) throw new NotFoundException();
    this.assertAccess(order, user);
    if (!receiptUrl) throw new BadRequestException('Adjunta el comprobante de la transferencia');
    const payment = await this.payments.save(this.payments.create({
      order: { id }, method: PaymentMethod.TRANSFER, amount: String(dto.amount), reference: dto.reference ?? null,
      bank: dto.bank ?? null, receiptUrl, document: dto.documentId ? { id: dto.documentId } : null,
    }));
    if (order.paymentStatus !== PaymentStatus.PAID) await this.orders.update(id, { paymentStatus: PaymentStatus.REVIEW });
    await this.log(id, user, `Comprobante de transferencia recibido por ${this.money(dto.amount)}. En validación.`, null, true);
    return payment;
  }

  async adminPayment(id: number, user: AuthUser, dto: AdminPaymentDto) {
    await this.getOrder(id);
    const payment = await this.payments.save(this.payments.create({
      order: { id }, method: dto.method, amount: String(dto.amount), reference: dto.reference ?? null, bank: dto.bank ?? null,
      notes: dto.notes ?? null, document: dto.documentId ? { id: dto.documentId } : null,
    }));
    return this.reviewPayment(payment.id, user, { status: PaymentRecordStatus.APPROVED, notes: dto.notes });
  }

  listPayments(status?: string) {
    return this.payments.find({
      where: status ? { status: status as PaymentRecordStatus } : {},
      relations: { order: true },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Validar / rechazar un pago. Al validar se registra en Concrebill
   * ("Registrar pago y emitir recibo para la factura X").
   */
  async reviewPayment(paymentId: number, user: AuthUser, dto: ReviewPaymentDto) {
    const payment = await this.payments.findOne({ where: { id: paymentId }, relations: { order: true } });
    if (!payment) throw new NotFoundException();
    if (payment.status !== PaymentRecordStatus.PENDING) throw new BadRequestException('Este pago ya fue procesado');
    payment.status = dto.status;
    payment.notes = dto.notes ?? payment.notes;
    payment.reviewedBy = { id: user.id } as User;
    const orderId = payment.order.id;

    if (dto.status === PaymentRecordStatus.APPROVED) {
      const invoice = payment.document
        ?? (await this.documents.findOne({ where: { order: { id: orderId }, type: DocumentType.INVOICE }, order: { createdAt: 'DESC' } }));
      const res = await this.concrebill.registerPayment({
        invoiceId: invoice?.concrebillId || invoice?.number || payment.order.code || String(orderId),
        amount: Number(payment.amount), method: payment.method, reference: payment.reference,
        date: new Date().toISOString().slice(0, 10),
      });
      if (res) {
        payment.concrebillPaymentId = res.id;
        if (res.receiptNumber) {
          await this.documents.save(this.documents.create({
            order: { id: orderId }, type: DocumentType.RECEIPT, number: res.receiptNumber, amount: payment.amount,
            status: 'emitido', fileUrl: res.receiptUrl ?? null, concrebillId: res.id, origin: 'concrebill',
            issuedAt: new Date().toISOString().slice(0, 10),
          }));
        }
      }
      await this.payments.save(payment);
      await this.log(orderId, user, `Pago de ${this.money(Number(payment.amount))} validado. ¡Gracias!`, null, true);
    } else {
      await this.payments.save(payment);
      await this.log(orderId, user, `El comprobante de pago fue rechazado${dto.notes ? `: ${dto.notes}` : '.'}`, null, true);
    }
    await this.recomputePaymentStatus(orderId);
    return this.payments.findOne({ where: { id: paymentId }, relations: { order: true } });
  }

  private async recomputePaymentStatus(orderId: number) {
    const order = await this.orders.findOne({ where: { id: orderId }, relations: { payments: true, documents: true } });
    if (!order) return;
    const paid = order.payments.filter((p) => p.status === PaymentRecordStatus.APPROVED).reduce((s, p) => s + Number(p.amount), 0);
    const pending = order.payments.some((p) => p.status === PaymentRecordStatus.PENDING);
    const invoices = order.documents.filter((d) => d.type === DocumentType.INVOICE && d.status !== 'anulada');
    const due = invoices.length ? invoices.reduce((s, d) => s + Number(d.amount), 0) : Number(order.quotedAmount ?? 0);
    const status = due > 0 && paid >= due ? PaymentStatus.PAID : pending ? PaymentStatus.REVIEW : PaymentStatus.PENDING;
    await this.orders.update(orderId, { paymentStatus: status });
    if (status === PaymentStatus.PAID) {
      for (const inv of invoices) await this.documents.update(inv.id, { status: 'pagada' });
    }
  }

  // ================== Helpers ==================

  private async getOrder(id: number) {
    const order = await this.orders.findOne({ where: { id }, relations: { client: true, technician: true } });
    if (!order) throw new NotFoundException('Orden no encontrada');
    return order;
  }

  private assertAccess(order: Order, user: AuthUser) {
    if (user.role === Role.ADMIN) return;
    if (user.role === Role.TECHNICIAN && order.technician?.id === user.id) return;
    if (user.role === Role.CLIENT && order.client?.id === user.id) return;
    throw new ForbiddenException('No tienes acceso a esta orden');
  }

  private log(orderId: number, user: AuthUser | undefined, message: string, status: string | null, visibleToClient: boolean) {
    return this.updates.save(this.updates.create({
      order: { id: orderId }, author: user ? { id: user.id } : null, message, status, visibleToClient,
    }));
  }

  private money(n: number) {
    return `RD$ ${n.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
