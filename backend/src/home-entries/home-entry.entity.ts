import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('home_entries')
export class HomeEntry {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'name_en', type: 'varchar', length: 50, nullable: true })
  nameEn: string;

  @Column({ name: 'name_km', type: 'varchar', length: 50, nullable: true })
  nameKm: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  icon: string;

  @Column({ name: 'icon_url', type: 'varchar', length: 500, nullable: true })
  iconUrl: string;

  @Column({ name: 'bg_color', type: 'varchar', length: 20 })
  bgColor: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  badge: string;

  @Column({ name: 'jump_type', type: 'varchar', length: 20 })
  jumpType: string;

  @Column({ name: 'jump_target', type: 'varchar', length: 500, nullable: true })
  jumpTarget: string;

  @Column({ name: 'jump_extra', type: 'jsonb', nullable: true })
  jumpExtra: any;

  @Column({ name: 'is_enabled', type: 'boolean', default: true })
  isEnabled: boolean;

  @Column({ name: 'login_required', type: 'boolean', default: false })
  loginRequired: boolean;

  @Column({ name: 'show_count', type: 'boolean', default: false })
  showCount: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 50 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
