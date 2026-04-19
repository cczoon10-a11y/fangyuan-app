import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('gifts')
export class Gift {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'name_en', type: 'varchar', length: 100, nullable: true })
  nameEn: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  category: string;

  @Column({ name: 'points_cost', type: 'int' })
  pointsCost: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ name: 'is_enabled', type: 'boolean', default: true })
  isEnabled: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 50 })
  sortOrder: number;

  @Column({ name: 'total_exchanged', type: 'int', default: 0 })
  totalExchanged: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

@Entity('exchanges')
export class Exchange {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'agent_id', type: 'bigint' })
  agentId: number;

  @Column({ name: 'gift_id', type: 'bigint' })
  giftId: number;

  @Column({ name: 'gift_snapshot', type: 'jsonb' })
  giftSnapshot: any;

  @Column({ name: 'points_cost', type: 'int' })
  pointsCost: number;

  @Column({ type: 'varchar', length: 30, default: 'pending_fulfillment' })
  status: string;

  @Column({ name: 'tracking_no', type: 'varchar', length: 100, nullable: true })
  trackingNo: string;

  @Column({ name: 'fulfilled_by', type: 'bigint', nullable: true })
  fulfilledBy: number;

  @Column({ name: 'fulfilled_at', type: 'timestamptz', nullable: true })
  fulfilledAt: Date;

  @Column({ name: 'received_at', type: 'timestamptz', nullable: true })
  receivedAt: Date;

  @Column({ name: 'cancelled_reason', type: 'text', nullable: true })
  cancelledReason: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
