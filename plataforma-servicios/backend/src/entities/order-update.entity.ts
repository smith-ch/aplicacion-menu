import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';
import { OrderPhoto } from './order-photo.entity';

/** Bitácora de la orden: cambios de estado y reportes diarios de avance. */
@Entity('order_updates')
export class OrderUpdate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (o) => o.updates, { onDelete: 'CASCADE' })
  order: Order;

  @Column({ type: 'varchar', length: 30, nullable: true })
  status: string | null;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean', default: true })
  visibleToClient: boolean;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL', eager: true })
  author: User | null;

  @OneToMany(() => OrderPhoto, (p) => p.update)
  photos: OrderPhoto[];

  @CreateDateColumn()
  createdAt: Date;
}
