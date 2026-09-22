import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationLog } from '../entities';

export interface ConcrebillClientPayload {
  name: string;
  documentId?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  externalId?: string;
}

export interface ConcrebillPaymentPayload {
  invoiceId: string;
  amount: number;
  method: string;
  reference?: string | null;
  date?: string;
}

export interface ConcrebillDocument {
  id: string;
  type: 'cotizacion' | 'factura' | 'recibo';
  number: string;
  amount: number;
  currency: string;
  status: string;
  issuedAt?: string;
  dueDate?: string;
  pdfUrl?: string;
  /** Referencia externa: el código de orden de la web (ej. ORD-000012). */
  reference?: string;
}

/**
 * Puente hacia Concrebill (ERP / core financiero) vía API REST.
 *
 * La web NO calcula impuestos ni emite comprobantes: sólo sincroniza clientes,
 * consulta cotizaciones/facturas y registra pagos. Con CONCREBILL_ENABLED=false
 * trabaja en modo simulado para poder operar el MVP mientras se obtiene acceso
 * a la API. Todas las llamadas quedan en la bitácora `integration_logs`.
 *
 * Los endpoints usados (ajustables cuando se tenga la documentación oficial):
 *   POST /clients                     → crear/actualizar cliente
 *   GET  /clients/:id/documents       → cotizaciones y facturas del cliente
 *   POST /invoices/:id/payments       → registrar pago y emitir recibo
 */
@Injectable()
export class ConcrebillService {
  private readonly logger = new Logger(ConcrebillService.name);

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(IntegrationLog) private readonly logs: Repository<IntegrationLog>,
  ) {}

  get enabled(): boolean {
    return this.config.get('CONCREBILL_ENABLED') === 'true';
  }

  async upsertClient(payload: ConcrebillClientPayload, existingId?: string | null): Promise<string | null> {
    const res = await this.call<{ id: string }>('upsertClient', 'POST', '/clients', { ...payload, id: existingId ?? undefined },
      () => ({ id: existingId ?? `CB-CLI-${Date.now().toString(36).toUpperCase()}` }));
    return res?.id ?? null;
  }

  async listClientDocuments(clientId: string): Promise<ConcrebillDocument[]> {
    const res = await this.call<{ data: ConcrebillDocument[] }>('listDocuments', 'GET', `/clients/${encodeURIComponent(clientId)}/documents`, undefined,
      () => ({ data: [] }));
    return res?.data ?? [];
  }

  async registerPayment(payload: ConcrebillPaymentPayload): Promise<{ id: string; receiptNumber?: string; receiptUrl?: string } | null> {
    return this.call('registerPayment', 'POST', `/invoices/${encodeURIComponent(payload.invoiceId)}/payments`, payload,
      () => ({ id: `CB-PAY-${Date.now().toString(36).toUpperCase()}`, receiptNumber: `REC-${Date.now().toString().slice(-6)}` }));
  }

  /** Ejecuta la petición (o la simulación) y la registra en la bitácora. Nunca lanza: devuelve null en error. */
  private async call<T>(action: string, method: string, path: string, body: unknown, mock: () => T): Promise<T | null> {
    if (!this.enabled) {
      const response = mock();
      await this.logs.save(this.logs.create({ action, status: 'simulado', request: { method, path, body }, response: response as object }));
      return response;
    }
    const base = this.config.get<string>('CONCREBILL_BASE_URL', '').replace(/\/$/, '');
    try {
      const res = await fetch(base + path, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.get('CONCREBILL_API_KEY', '')}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 500)}`);
      await this.logs.save(this.logs.create({ action, status: 'ok', request: { method, path, body }, response: data }));
      return data as T;
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      this.logger.error(`Concrebill ${action} falló: ${error}`);
      await this.logs.save(this.logs.create({ action, status: 'error', request: { method, path, body }, error }));
      return null;
    }
  }
}
