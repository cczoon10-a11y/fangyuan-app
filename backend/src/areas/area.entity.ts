import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('areas')
export class Area {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'name_en', type: 'varchar', length: 50, nullable: true })
  nameEn: string;

  @Column({ name: 'name_km', type: 'varchar', length: 50, nullable: true })
  nameKm: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string;

  @Column({ name: 'description_en', type: 'varchar', length: 200, nullable: true })
  descriptionEn: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  icon: string;

  @Column({ type: 'numeric', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'numeric', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({ type: 'varchar', length: 20, default: 'normal' })
  level: string;

  @Column({ name: 'is_hot', type: 'boolean', default: false })
  isHot: boolean;

  @Column({ name: 'is_enabled', type: 'boolean', default: true })
  isEnabled: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 50 })
  sortOrder: number;

  @Column({ name: 'listings_count', type: 'int', default: 0 })
  listingsCount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
