import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DocumentType } from '../common/enums';
import { Order } from './order.entity';

/**
 * Cotizaciones, facturas (con NCF) y recibos. Se generan en Concrebill y aquí
 * se guarda la referencia para mostrarlos en el portal del cliente.
 */
@Entity('documents')
export class BillingDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (o) => o.documents, { onDelete: 'CASCADE' })
  order: Order;

  @Column({ type: 'varchar', length: 20 })
  type: DocumentType;

  /** Número de documento o NCF. */
  @Column({ type: 'varchar', length: 60 })
  number: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  amount: string;

  @Column({ type: 'varchar', length: 5, default: 'DOP' })
  currency: string;

  /** pendiente | pagada | anulada | aprobada */
  @Column({ type: 'varchar', length: 20, default: 'pendiente' })
  status: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  fileUrl: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  concrebillId: string | null;

  /** concrebill | manual */
  @Column({ type: 'varchar', length: 20, default: 'manual' })
  origin: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  issuedAt: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  dueDate: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
