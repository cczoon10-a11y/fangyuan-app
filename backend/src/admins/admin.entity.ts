import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  OPERATOR = 'operator',
  CONTENT_EDITOR = 'content_editor',
}

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 100 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true })
  avatarUrl: string;

  @Column({ type: 'varchar', length: 20, default: AdminRole.OPERATOR })
  role: AdminRole;

  @Column({ type: 'jsonb', nullable: true })
  permissions: Record<string, any>;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
