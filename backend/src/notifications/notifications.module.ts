import {
  Controller, Get, Patch, Post, Param, ParseIntPipe, Body,
  Module, Injectable,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, Device } from './notification.entities';
import { CurrentUser } from '../auth/auth.decorators';
import { AuthUser } from '../auth/auth.types';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private repo: Repository<Notification>,
    @InjectRepository(Device) private deviceRepo: Repository<Device>,
  ) {}

  list(recipientType: string, recipientId: number) {
    return this.repo.find({
      where: { recipientType, recipientId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async unreadCount(recipientType: string, recipientId: number) {
    const count = await this.repo.count({
      where: { recipientType, recipientId, isRead: false },
    });
    return { count };
  }

  async markRead(id: number) {
    await this.repo.update(id, { isRead: true, readAt: new Date() });
    return { success: true };
  }

  async markAllRead(recipientType: string, recipientId: number) {
    await this.repo.update(
      { recipientType, recipientId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
    return { success: true };
  }

  async registerDevice(user: AuthUser, body: Partial<Device>) {
    await this.deviceRepo.save({
      ownerType: user.type,
      ownerId: user.id,
      ...body,
    });
    return { success: true };
  }
}

@ApiTags('通知')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private s: NotificationsService) {}

  @Get()
  list(@CurrentUser() u: AuthUser) { return this.s.list(u.type, u.id); }

  @Get('unread-count')
  unread(@CurrentUser() u: AuthUser) { return this.s.unreadCount(u.type, u.id); }

  @Patch(':id/read')
  read(@Param('id', ParseIntPipe) id: number) { return this.s.markRead(id); }

  @Post('read-all')
  readAll(@CurrentUser() u: AuthUser) { return this.s.markAllRead(u.type, u.id); }

  @Post('devices')
  device(@CurrentUser() u: AuthUser, @Body() body: any) { return this.s.registerDevice(u, body); }
}

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Device])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
