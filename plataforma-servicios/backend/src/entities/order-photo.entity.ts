import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PhotoStage } from '../common/enums';
import { Order } from './order.entity';
import { OrderUpdate } from './order-update.entity';
import { User } from './user.entity';

/** Fotos "Antes / Durante / Después" subidas por los técnicos. */
@Entity('order_photos')
export class OrderPhoto {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (o) => o.photos, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => OrderUpdate, (u) => u.photos, { nullable: true, onDelete: 'SET NULL' })
  update: OrderUpdate | null;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'varchar', length: 20, default: PhotoStage.DURING })
  stage: PhotoStage;

  @Column({ type: 'varchar', length: 255, nullable: true })
  caption: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  uploadedBy: User | null;

  @CreateDateColumn()
  createdAt: Date;
}
