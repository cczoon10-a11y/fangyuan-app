import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ name: 'recipient_type', type: 'varchar', length: 10 })
  recipientType: string;

  @Column({ name: 'recipient_id', type: 'bigint' })
  recipientId: number;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  body: string;

  @Column({ type: 'jsonb', nullable: true })
  data: any;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  @Column({ name: 'read_at', type: 'timestamptz', nullable: true })
  readAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'owner_type', type: 'varchar', length: 10 })
  ownerType: string;

  @Column({ name: 'owner_id', type: 'bigint' })
  ownerId: number;

  @Column({ name: 'fcm_token', type: 'varchar', length: 500, unique: true })
  fcmToken: string;

  @Column({ type: 'varchar', length: 10 })
  platform: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  locale: string;

  @Column({ name: 'app_version', type: 'varchar', length: 20, nullable: true })
  appVersion: string;

  @Column({ name: 'device_model', type: 'varchar', length: 100, nullable: true })
  deviceModel: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
