import {
  Controller, Get,
  Module, Injectable,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PointsBalance, PointsHistory, PointsRule } from './points.entities';
import { AgentOnly, CurrentUser } from '../auth/auth.decorators';
import { AuthUser } from '../auth/auth.types';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(PointsBalance) private balanceRepo: Repository<PointsBalance>,
    @InjectRepository(PointsHistory) private historyRepo: Repository<PointsHistory>,
    @InjectRepository(PointsRule) private ruleRepo: Repository<PointsRule>,
  ) {}

  async getBalance(agentId: number) {
    let row = await this.balanceRepo.findOne({ where: { agentId } });
    if (!row) row = await this.balanceRepo.save({ agentId, balance: 0, lifetimeEarned: 0, lifetimeSpent: 0 });
    return row;
  }

  getHistory(agentId: number) {
    return this.historyRepo.find({ where: { agentId }, order: { createdAt: 'DESC' }, take: 50 });
  }

  getRules() {
    return this.ruleRepo.find({ where: { isEnabled: true } });
  }

  getAgentLevel(lifetimeEarned: number) {
    if (lifetimeEarned >= 5000) return 'black_diamond';
    if (lifetimeEarned >= 2000) return 'diamond';
    if (lifetimeEarned >= 600) return 'gold';
    if (lifetimeEarned >= 200) return 'senior';
    return 'normal';
  }
}

@ApiTags('经纪人 · 积分')
@ApiBearerAuth() @AgentOnly()
@Controller('agent/points')
export class AgentPointsController {
  constructor(private s: PointsService) {}
  @Get('balance') balance(@CurrentUser() u: AuthUser) { return this.s.getBalance(u.id); }
  @Get('history') history(@CurrentUser() u: AuthUser) { return this.s.getHistory(u.id); }
  @Get('rules') rules() { return this.s.getRules(); }
}

@Module({
  imports: [TypeOrmModule.forFeature([PointsBalance, PointsHistory, PointsRule])],
  controllers: [AgentPointsController],
  providers: [PointsService],
  exports: [PointsService],
})
export class PointsModule {}
