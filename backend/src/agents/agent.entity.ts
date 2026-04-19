import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum AgentStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  DISABLED = 'disabled',
  REJECTED = 'rejected',
}

export enum AgentLevel {
  NORMAL = 'normal',
  SENIOR = 'senior',
  GOLD = 'gold',
  DIAMOND = 'diamond',
  BLACK_DIAMOND = 'black_diamond',
}

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 20, unique: true })
  phone: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 100 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true })
  avatarUrl: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  organization: string;

  @Column({ name: 'experience_years', type: 'int', default: 0 })
  experienceYears: number;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'skill_areas', type: 'int', array: true, default: [] })
  skillAreas: number[];

  @Index()
  @Column({ type: 'varchar', length: 20, default: AgentLevel.NORMAL })
  level: AgentLevel;

  @Index()
  @Column({ type: 'varchar', length: 20, default: AgentStatus.PENDING })
  status: AgentStatus;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ name: 'id_card_front_url', type: 'varchar', length: 500, nullable: true })
  idCardFrontUrl: string;

  @Column({ name: 'id_card_back_url', type: 'varchar', length: 500, nullable: true })
  idCardBackUrl: string;

  @Column({ name: 'license_url', type: 'varchar', length: 500, nullable: true })
  licenseUrl: string;

  @Column({ type: 'numeric', precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({ name: 'service_count', type: 'int', default: 0 })
  serviceCount: number;

  @Column({ name: 'listings_count', type: 'int', default: 0 })
  listingsCount: number;

  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true })
  approvedAt: Date;

  @Column({ name: 'approved_by', type: 'bigint', nullable: true })
  approvedBy: number;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
