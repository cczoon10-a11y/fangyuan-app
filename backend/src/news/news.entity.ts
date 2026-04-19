import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ name: 'title_en', type: 'varchar', length: 200, nullable: true })
  titleEn: string;

  @Column({ name: 'title_km', type: 'varchar', length: 200, nullable: true })
  titleKm: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  summary: string;

  @Column({ name: 'summary_en', type: 'varchar', length: 500, nullable: true })
  summaryEn: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'content_en', type: 'text', nullable: true })
  contentEn: string;

  @Column({ name: 'content_km', type: 'text', nullable: true })
  contentKm: string;

  @Column({ name: 'cover_image', type: 'varchar', length: 500, nullable: true })
  coverImage: string;

  @Column({ name: 'category_id', type: 'bigint', nullable: true })
  categoryId: number;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ name: 'author_id', type: 'bigint', nullable: true })
  authorId: number;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: string;

  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ name: 'is_top', type: 'boolean', default: false })
  isTop: boolean;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt: Date;

  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
