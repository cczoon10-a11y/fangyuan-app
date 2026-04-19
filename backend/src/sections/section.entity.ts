import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'name_en', type: 'varchar', length: 50, nullable: true })
  nameEn: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subtitle: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  icon: string;

  @Column({ name: 'icon_url', type: 'varchar', length: 500, nullable: true })
  iconUrl: string;

  @Column({ name: 'theme_color', type: 'varchar', length: 20, nullable: true })
  themeColor: string;

  @Column({ name: 'banner_url', type: 'varchar', length: 500, nullable: true })
  bannerUrl: string;

  @Column({ name: 'is_enabled', type: 'boolean', default: true })
  isEnabled: boolean;

  @Column({ name: 'is_featured', type: 'boolean', default: true })
  isFeatured: boolean;

  @Column({ name: 'show_count', type: 'boolean', default: true })
  showCount: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 50 })
  sortOrder: number;

  @Column({ name: 'listings_count', type: 'int', default: 0 })
  listingsCount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
