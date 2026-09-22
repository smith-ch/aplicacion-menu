import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { ServiceItem } from './service.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (o) => o.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => ServiceItem, { nullable: true, onDelete: 'SET NULL', eager: true })
  service: ServiceItem | null;

  /** Copia del nombre del servicio al momento de la orden. */
  @Column({ type: 'varchar', length: 140 })
  serviceName: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  notes: string | null;
}
