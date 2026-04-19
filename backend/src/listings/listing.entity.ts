import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

export enum ListingStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  ONLINE = 'online',
  OFFLINE = 'offline',
  REJECTED = 'rejected',
}

export enum PublisherType {
  ADMIN = 'admin',
  AGENT = 'agent',
}

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ name: 'title_en', type: 'varchar', length: 200, nullable: true })
  titleEn: string;

  @Column({ name: 'title_km', type: 'varchar', length: 200, nullable: true })
  titleKm: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'description_en', type: 'text', nullable: true })
  descriptionEn: string;

  @Column({ name: 'description_km', type: 'text', nullable: true })
  descriptionKm: string;

  @Index()
  @Column({ name: 'section_id', type: 'bigint', nullable: true })
  sectionId: number;

  @Index()
  @Column({ name: 'area_id', type: 'bigint', nullable: true })
  areaId: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  bedroom: string;

  @Column({ type: 'smallint', nullable: true })
  bathroom: number;

  @Column({ name: 'area_sqm', type: 'numeric', precision: 10, scale: 2, nullable: true })
  areaSqm: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  floor: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  orientation: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  price: number;

  @Column({ name: 'price_usd', type: 'numeric', precision: 15, scale: 2 })
  priceUsd: number;

  @Column({ name: 'price_khr', type: 'numeric', precision: 20, scale: 2, nullable: true })
  priceKhr: number;

  @Column({ name: 'price_cny', type: 'numeric', precision: 15, scale: 2, nullable: true })
  priceCny: number;

  @Column({ name: 'price_per_sqm', type: 'numeric', precision: 10, scale: 2, nullable: true })
  pricePerSqm: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ownership: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  developer: string;

  @Column({ name: 'completion_year', type: 'int', nullable: true })
  completionYear: number;

  @Column({ name: 'property_fee', type: 'numeric', precision: 8, scale: 2, nullable: true })
  propertyFee: number;

  @Column({ name: 'indoor_amenities', type: 'int', array: true, default: [] })
  indoorAmenities: number[];

  @Column({ name: 'nearby_amenities', type: 'int', array: true, default: [] })
  nearbyAmenities: number[];

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ type: 'numeric', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'numeric', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  landmark: string;

  @Column({ name: 'nearby_poi', type: 'jsonb', nullable: true })
  nearbyPoi: any;

  @Column({ name: 'cover_image', type: 'varchar', length: 500, nullable: true })
  coverImage: string;

  @Column({ name: 'images_count', type: 'int', default: 0 })
  imagesCount: number;

  @Column({ name: 'has_vr', type: 'boolean', default: false })
  hasVr: boolean;

  @Column({ name: 'has_video', type: 'boolean', default: false })
  hasVideo: boolean;

  @Column({ name: 'vr_url', type: 'varchar', length: 500, nullable: true })
  vrUrl: string;

  @Column({ name: 'video_url', type: 'varchar', length: 500, nullable: true })
  videoUrl: string;

  @Index()
  @Column({ type: 'varchar', length: 20, default: ListingStatus.DRAFT })
  status: ListingStatus;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ name: 'reviewed_at', type: 'timestamptz', nullable: true })
  reviewedAt: Date;

  @Column({ name: 'reviewed_by', type: 'bigint', nullable: true })
  reviewedBy: number;

  @Column({ name: 'publisher_type', type: 'varchar', length: 10 })
  publisherType: PublisherType;

  @Column({ name: 'publisher_id', type: 'bigint' })
  publisherId: number;

  @Column({ type: 'text', array: true, default: [] })
  badges: string[];

  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ name: 'featured_order', type: 'int', nullable: true })
  featuredOrder: number;

  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @Column({ name: 'favorite_count', type: 'int', default: 0 })
  favoriteCount: number;

  @Column({ name: 'contact_count', type: 'int', default: 0 })
  contactCount: number;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;
}
