import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

/** Evaluación del cliente al completar el trabajo ("Tú evalúas"). */
@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order, (o) => o.review, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'int', nullable: true })
  punctuality: number | null;

  @Column({ type: 'int', nullable: true })
  quality: number | null;

  @Column({ type: 'int', nullable: true })
  cleanliness: number | null;

  @Column({ type: 'int', nullable: true })
  communication: number | null;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @Column({ type: 'boolean', default: false })
  wouldRecommend: boolean;

  /** El admin puede publicarla como testimonio en la landing. */
  @Column({ type: 'boolean', default: false })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
