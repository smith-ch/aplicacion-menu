import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentMethod, PaymentRecordStatus } from '../common/enums';
import { Order } from './order.entity';
import { BillingDocument } from './document.entity';
import { User } from './user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (o) => o.payments, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => BillingDocument, { nullable: true, onDelete: 'SET NULL', eager: true })
  document: BillingDocument | null;

  @Column({ type: 'varchar', length: 20 })
  method: PaymentMethod;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  reference: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  bank: string | null;

  /** Comprobante de transferencia subido por el cliente. */
  @Column({ type: 'varchar', length: 500, nullable: true })
  receiptUrl: string | null;

  @Column({ type: 'varchar', length: 20, default: PaymentRecordStatus.PENDING })
  status: PaymentRecordStatus;

  /** Id de transacción en la pasarela (PayPal / Azul / Stripe). */
  @Column({ type: 'varchar', length: 120, nullable: true })
  gatewayTransactionId: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  concrebillPaymentId: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  reviewedBy: User | null;

  @CreateDateColumn()
  createdAt: Date;
}
