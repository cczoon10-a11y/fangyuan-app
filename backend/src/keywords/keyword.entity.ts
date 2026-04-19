import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('keywords')
export class Keyword {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'name_en', type: 'varchar', length: 50, nullable: true })
  nameEn: string;

  @Column({ name: 'name_km', type: 'varchar', length: 50, nullable: true })
  nameKm: string;

  @Column({ type: 'varchar', length: 20, default: 'hot_search' })
  type: string;

  @Column({ type: 'varchar', length: 20, default: 'gold' })
  style: string;

  @Column({ name: 'show_on_home', type: 'boolean', default: false })
  showOnHome: boolean;

  @Column({ name: 'show_on_search', type: 'boolean', default: true })
  showOnSearch: boolean;

  @Column({ name: 'is_enabled', type: 'boolean', default: true })
  isEnabled: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 50 })
  sortOrder: number;

  @Column({ name: 'related_listings_count', type: 'int', default: 0 })
  relatedListingsCount: number;

  @Column({ name: 'monthly_searches', type: 'int', default: 0 })
  monthlySearches: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
