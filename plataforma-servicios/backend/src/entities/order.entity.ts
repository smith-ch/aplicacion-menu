import {
  Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { OrderSource, OrderStatus, PaymentStatus } from '../common/enums';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
import { OrderUpdate } from './order-update.entity';
import { OrderPhoto } from './order-photo.entity';
import { Review } from './review.entity';
import { BillingDocument } from './document.entity';
import { Payment } from './payment.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  code: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  client: User | null;

  // Datos de contacto (permiten órdenes de invitados y por WhatsApp/Instagram)
  @Column({ type: 'varchar', length: 120 })
  contactName: string;

  @Column({ type: 'varchar', length: 160 })
  contactEmail: string;

  @Column({ type: 'varchar', length: 30 })
  contactPhone: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  documentId: string | null;

  // Detalles del espacio
  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 30 })
  propertyType: string;

  @Column({ type: 'varchar', length: 20, default: 'normal' })
  urgency: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  areaSize: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  preferredDate: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  preferredTime: string | null;

  /** presencial | virtual */
  @Column({ type: 'varchar', length: 20, default: 'presencial' })
  visitType: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'varchar', length: 20, default: OrderSource.WEB })
  source: OrderSource;

  @Column({ type: 'varchar', length: 30, default: OrderStatus.RECEIVED })
  status: OrderStatus;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  technician: User | null;

  /** Fecha/hora programada por el equipo (texto ISO para compatibilidad sqlite/postgres). */
  @Column({ type: 'varchar', length: 30, nullable: true })
  scheduledAt: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  quotedAmount: string | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  estimatedDelivery: string | null;

  @Column({ type: 'varchar', length: 20, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ type: 'text', nullable: true })
  internalNotes: string | null;

  @OneToMany(() => OrderItem, (i) => i.order, { cascade: true })
  items: OrderItem[];

  @OneToMany(() => OrderUpdate, (u) => u.order)
  updates: OrderUpdate[];

  @OneToMany(() => OrderPhoto, (p) => p.order)
  photos: OrderPhoto[];

  @OneToMany(() => BillingDocument, (d) => d.order)
  documents: BillingDocument[];

  @OneToMany(() => Payment, (p) => p.order)
  payments: Payment[];

  @OneToOne(() => Review, (r) => r.order)
  review: Review | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
