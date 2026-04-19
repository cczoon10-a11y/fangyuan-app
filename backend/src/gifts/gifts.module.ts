import {
  Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe,
  Module, Injectable, BadRequestException, NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Gift, Exchange } from './gift.entities';
import { Public, AdminOnly, AgentOnly, CurrentUser } from '../auth/auth.decorators';
import { AuthUser } from '../auth/auth.types';

@Injectable()
export class GiftsService {
  constructor(
    @InjectRepository(Gift) private giftRepo: Repository<Gift>,
    @InjectRepository(Exchange) private exRepo: Repository<Exchange>,
    private ds: DataSource,
  ) {}

  listEnabled() {
    return this.giftRepo.find({ where: { isEnabled: true }, order: { sortOrder: 'ASC' } });
  }

  listAll() { return this.giftRepo.find({ order: { sortOrder: 'ASC' } }); }

  async findOne(id: number) {
    const g = await this.giftRepo.findOne({ where: { id } });
    if (!g) throw new NotFoundException();
    return g;
  }

  create(d: Partial<Gift>) { return this.giftRepo.save(this.giftRepo.create(d)); }
  async update(id: number, d: Partial<Gift>) {
    await this.findOne(id); await this.giftRepo.update(id, d); return this.findOne(id);
  }
  async remove(id: number) {
    const r = await this.giftRepo.delete(id);
    if (!r.affected) throw new NotFoundException();
    return { success: true };
  }

  /** 经纪人兑换 — 事务安全 */
  async exchange(agentId: number, giftId: number) {
    return this.ds.transaction(async (mgr) => {
      // 锁定 gift 行
      const gift = await mgr.query(`SELECT * FROM gifts WHERE id = $1 FOR UPDATE`, [giftId]);
      if (!gift[0]) throw new NotFoundException('礼品不存在');
      if (!gift[0].is_enabled) throw new BadRequestException('礼品已下架');
      if (gift[0].stock <= 0) throw new BadRequestException('礼品库存不足');

      const cost = gift[0].points_cost;

      // 锁定积分行
      const balance = await mgr.query(
        `SELECT * FROM points_balance WHERE agent_id = $1 FOR UPDATE`,
        [agentId],
      );
      if (!balance[0] || balance[0].balance < cost) {
        throw new BadRequestException('积分不足');
      }

      // 扣积分
      const newBalance = balance[0].balance - cost;
      await mgr.query(
        `UPDATE points_balance SET balance = $1, lifetime_spent = lifetime_spent + $2, updated_at = NOW() WHERE agent_id = $3`,
        [newBalance, cost, agentId],
      );

      // 写积分流水
      await mgr.query(
        `INSERT INTO points_history(agent_id, delta, balance_after, type, related_id, description) VALUES($1, $2, $3, 'exchange', $4, $5)`,
        [agentId, -cost, newBalance, giftId, `兑换 ${gift[0].name}`],
      );

      // 扣库存
      await mgr.query(
        `UPDATE gifts SET stock = stock - 1, total_exchanged = total_exchanged + 1 WHERE id = $1`,
        [giftId],
      );

      // 创建兑换记录
      const res = await mgr.query(
        `INSERT INTO exchanges(agent_id, gift_id, gift_snapshot, points_cost, status) VALUES($1, $2, $3, $4, 'pending_fulfillment') RETURNING *`,
        [agentId, giftId, JSON.stringify(gift[0]), cost],
      );

      // 写通知给管理员
      await mgr.query(
        `INSERT INTO notifications(recipient_type, recipient_id, type, title, body)
         SELECT 'admin', id, 'new_exchange', '新兑换待核发', $1 FROM admins WHERE is_active = true`,
        [`经纪人兑换了 ${gift[0].name},请尽快核发`],
      );

      return {
        exchange_id: res[0].id,
        status: 'pending_fulfillment',
        points_deducted: cost,
        new_balance: newBalance,
      };
    });
  }

  listExchanges(agentId: number) {
    return this.exRepo.find({ where: { agentId }, order: { createdAt: 'DESC' } });
  }

  listAllExchanges() { return this.exRepo.find({ order: { createdAt: 'DESC' } }); }

  async fulfill(exchangeId: number, adminId: number, trackingNo?: string) {
    const ex = await this.exRepo.findOne({ where: { id: exchangeId } });
    if (!ex) throw new NotFoundException();
    if (ex.status !== 'pending_fulfillment') throw new BadRequestException();

    await this.exRepo.update(exchangeId, {
      status: 'fulfilled',
      fulfilledBy: adminId,
      fulfilledAt: new Date(),
      trackingNo,
    });

    await this.ds.query(
      `INSERT INTO notifications(recipient_type, recipient_id, type, title, body, data)
       VALUES('agent', $1, 'exchange_fulfilled', '您的礼品已发出', $2, $3)`,
      [ex.agentId, `快递单号: ${trackingNo || '无'}`, JSON.stringify({ exchange_id: exchangeId })],
    );
    return { success: true };
  }
}

@ApiTags('公共 · 礼品')
@Controller('public/gifts')
export class PublicGiftsController {
  constructor(private s: GiftsService) {}
  @Public() @Get() list() { return this.s.listEnabled(); }
}

@ApiTags('经纪人 · 商城')
@ApiBearerAuth() @AgentOnly()
@Controller('agent')
export class AgentGiftsController {
  constructor(private s: GiftsService) {}
  @Get('gifts') list() { return this.s.listEnabled(); }
  @Post('exchanges') exchange(@CurrentUser() u: AuthUser, @Body() body: { gift_id: number }) {
    return this.s.exchange(u.id, body.gift_id);
  }
  @Get('exchanges') myExchanges(@CurrentUser() u: AuthUser) { return this.s.listExchanges(u.id); }
}

@ApiTags('管理员 · 礼品')
@ApiBearerAuth() @AdminOnly()
@Controller('admin')
export class AdminGiftsController {
  constructor(private s: GiftsService) {}
  @Get('gifts') list() { return this.s.listAll(); }
  @Post('gifts') create(@Body() d: Partial<Gift>) { return this.s.create(d); }
  @Patch('gifts/:id') update(@Param('id', ParseIntPipe) id: number, @Body() d: Partial<Gift>) { return this.s.update(id, d); }
  @Delete('gifts/:id') remove(@Param('id', ParseIntPipe) id: number) { return this.s.remove(id); }
  @Get('exchanges') exchanges() { return this.s.listAllExchanges(); }
  @Post('exchanges/:id/fulfill') fulfill(
    @CurrentUser() u: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { tracking_no?: string },
  ) {
    return this.s.fulfill(id, u.id, body.tracking_no);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Gift, Exchange])],
  controllers: [PublicGiftsController, AgentGiftsController, AdminGiftsController],
  providers: [GiftsService],
})
export class GiftsModule {}
