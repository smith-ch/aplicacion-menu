import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceItem } from './service.entity';

/** Pilar estratégico (A: Adecuación, B: Mantenimiento, C: Tecnología). */
@Entity('pillars')
export class Pillar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  code: string;

  @Column({ type: 'varchar', length: 140 })
  title: string;

  @Column({ type: 'varchar', length: 140, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  /** Nombre de ícono lucide (ej. "paint-roller"). */
  @Column({ type: 'varchar', length: 60, nullable: true })
  icon: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  color: string | null;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @OneToMany(() => ServiceItem, (s) => s.pillar)
  services: ServiceItem[];
}
