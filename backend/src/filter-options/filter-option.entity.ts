import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('filter_options')
export class FilterOption {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 30 })
  category: string;

  @Column({ type: 'varchar', length: 50 })
  label: string;

  @Column({ name: 'label_en', type: 'varchar', length: 50, nullable: true })
  labelEn: string;

  @Column({ name: 'label_km', type: 'varchar', length: 50, nullable: true })
  labelKm: string;

  @Column({ name: 'value_min', type: 'numeric', precision: 15, scale: 2, nullable: true })
  valueMin: number;

  @Column({ name: 'value_max', type: 'numeric', precision: 15, scale: 2, nullable: true })
  valueMax: number;

  @Column({ name: 'value_str', type: 'varchar', length: 50, nullable: true })
  valueStr: string;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ name: 'is_hot', type: 'boolean', default: false })
  isHot: boolean;

  @Column({ name: 'is_enabled', type: 'boolean', default: true })
  isEnabled: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 50 })
  sortOrder: number;

  @Column({ name: 'monthly_clicks', type: 'int', default: 0 })
  monthlyClicks: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
