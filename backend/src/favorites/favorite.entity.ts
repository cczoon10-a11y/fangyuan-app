import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  Index,
} from 'typeorm';

@Entity('favorites')
@Unique(['userId', 'listingId'])
export class Favorite {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ name: 'listing_id', type: 'bigint' })
  listingId: number;

  @Column({ name: 'group_id', type: 'bigint', nullable: true })
  groupId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}

@Entity('favorite_groups')
export class FavoriteGroup {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'sort_order', type: 'int', default: 50 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
