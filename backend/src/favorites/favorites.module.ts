import {
  Controller, Get, Post, Delete, Body, Param, ParseIntPipe,
  Module, Injectable, ConflictException, NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite, FavoriteGroup } from './favorite.entity';
import { UserOnly, CurrentUser } from '../auth/auth.decorators';
import { AuthUser } from '../auth/auth.types';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite) private repo: Repository<Favorite>,
    @InjectRepository(FavoriteGroup) private groupRepo: Repository<FavoriteGroup>,
  ) {}

  list(userId: number) {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async add(userId: number, listingId: number, groupId?: number) {
    try {
      return await this.repo.save({ userId, listingId, groupId });
    } catch (e) {
      throw new ConflictException('已收藏');
    }
  }

  async remove(userId: number, listingId: number) {
    const r = await this.repo.delete({ userId, listingId });
    if (!r.affected) throw new NotFoundException('未找到该收藏');
    return { success: true };
  }

  listGroups(userId: number) {
    return this.groupRepo.find({ where: { userId }, order: { sortOrder: 'ASC' } });
  }

  createGroup(userId: number, name: string) {
    return this.groupRepo.save({ userId, name });
  }

  async deleteGroup(userId: number, id: number) {
    const g = await this.groupRepo.findOne({ where: { id, userId } });
    if (!g) throw new NotFoundException();
    await this.groupRepo.delete(id);
    return { success: true };
  }
}

@ApiTags('用户 · 收藏')
@ApiBearerAuth() @UserOnly()
@Controller('user/favorites')
export class FavoritesController {
  constructor(private s: FavoritesService) {}

  @Get()
  list(@CurrentUser() u: AuthUser) { return this.s.list(u.id); }

  @Post()
  add(@CurrentUser() u: AuthUser, @Body() body: { listing_id: number; group_id?: number }) {
    return this.s.add(u.id, body.listing_id, body.group_id);
  }

  @Delete(':listingId')
  remove(@CurrentUser() u: AuthUser, @Param('listingId', ParseIntPipe) id: number) {
    return this.s.remove(u.id, id);
  }

  @Get('groups')
  groups(@CurrentUser() u: AuthUser) { return this.s.listGroups(u.id); }

  @Post('groups')
  createGroup(@CurrentUser() u: AuthUser, @Body() body: { name: string }) {
    return this.s.createGroup(u.id, body.name);
  }

  @Delete('groups/:id')
  deleteGroup(@CurrentUser() u: AuthUser, @Param('id', ParseIntPipe) id: number) {
    return this.s.deleteGroup(u.id, id);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, FavoriteGroup])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
