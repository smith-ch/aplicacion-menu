import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Pillar } from './pillar.entity';

/** Ficha de servicio del catálogo. */
@Entity('services')
export class ServiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pillar, (p) => p.services, { eager: true, onDelete: 'SET NULL', nullable: true })
  pillar: Pillar | null;

  @Column({ type: 'varchar', length: 140 })
  name: string;

  @Column({ type: 'varchar', length: 160, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 300 })
  shortDescription: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  /** Lista de puntos que incluye el servicio. */
  @Column({ type: 'simple-json', nullable: true })
  features: string[] | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  icon: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  /** Precio de referencia opcional ("Desde RD$ ..."). La cotización oficial sale de Concrebill. */
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  priceFrom: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  priceNote: string | null;

  @Column({ type: 'boolean', default: false })
  featured: boolean;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
