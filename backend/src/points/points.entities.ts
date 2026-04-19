import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('points_balance')
export class PointsBalance {
  @PrimaryColumn({ name: 'agent_id', type: 'bigint' })
  agentId: number;

  @Column({ type: 'int', default: 0 })
  balance: number;

  @Column({ name: 'lifetime_earned', type: 'int', default: 0 })
  lifetimeEarned: number;

  @Column({ name: 'lifetime_spent', type: 'int', default: 0 })
  lifetimeSpent: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

@Entity('points_history')
export class PointsHistory {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'agent_id', type: 'bigint' })
  agentId: number;

  @Column({ type: 'int' })
  delta: number;

  @Column({ name: 'balance_after', type: 'int' })
  balanceAfter: number;

  @Column({ type: 'varchar', length: 30 })
  type: string;

  @Column({ name: 'related_id', type: 'bigint', nullable: true })
  relatedId: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'admin_id', type: 'bigint', nullable: true })
  adminId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}

@Entity('points_rules')
export class PointsRule {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  action: string;

  @Column({ type: 'int' })
  points: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_enabled', type: 'boolean', default: true })
  isEnabled: boolean;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
