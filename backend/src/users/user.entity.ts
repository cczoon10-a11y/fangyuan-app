import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 20, unique: true })
  phone: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 100 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nickname: string;

  @Column({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true })
  avatarUrl: string;

  @Column({ type: 'smallint', default: 0 })
  gender: number;

  @Column({ type: 'varchar', length: 10, default: 'zh-CN' })
  language: string;

  @Column({ name: 'is_vip', type: 'boolean', default: false })
  isVip: boolean;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;
}
