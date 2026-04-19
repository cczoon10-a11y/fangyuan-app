import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe,
  Module, Injectable, NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './news.entity';
import { Public, AdminOnly, CurrentUser } from '../auth/auth.decorators';
import { AuthUser } from '../auth/auth.types';
import { paginate } from '../common/pagination.util';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class NewsService {
  constructor(@InjectRepository(News) private repo: Repository<News>) {}

  listPublished(query: PaginationDto & { category?: number; featured?: boolean }) {
    const qb = this.repo.createQueryBuilder('n')
      .where('n.status = :s', { s: 'published' })
      .orderBy('n.published_at', 'DESC');
    if (query.category) qb.andWhere('n.category_id = :c', { c: query.category });
    if (query.featured) qb.andWhere('n.is_featured = true');
    return paginate<News>(qb, query);
  }

  async findOne(id: number) {
    const n = await this.repo.findOne({ where: { id } });
    if (!n) throw new NotFoundException();
    return n;
  }

  async incrementView(id: number) {
    await this.repo.increment({ id }, 'viewCount', 1);
    return { success: true };
  }

  listAll(query: PaginationDto) {
    const qb = this.repo.createQueryBuilder('n').orderBy('n.created_at', 'DESC');
    return paginate<News>(qb, query);
  }

  create(user: AuthUser, d: Partial<News>) {
    return this.repo.save({ ...d, authorId: user.id });
  }

  async update(id: number, d: Partial<News>) {
    await this.findOne(id);
    await this.repo.update(id, d);
    return this.findOne(id);
  }

  async publish(id: number) {
    await this.findOne(id);
    await this.repo.update(id, { status: 'published', publishedAt: new Date() });
    return { success: true };
  }

  async unpublish(id: number) {
    await this.repo.update(id, { status: 'draft' });
    return { success: true };
  }

  async remove(id: number) {
    const r = await this.repo.delete(id);
    if (!r.affected) throw new NotFoundException();
    return { success: true };
  }
}

@ApiTags('公共 · 资讯')
@Controller('news')
export class PublicNewsController {
  constructor(private s: NewsService) {}
  @Public() @Get() list(@Query() q: any) { return this.s.listPublished(q); }
  @Public() @Get(':id') detail(@Param('id', ParseIntPipe) id: number) { return this.s.findOne(id); }
  @Public() @Post(':id/view') view(@Param('id', ParseIntPipe) id: number) { return this.s.incrementView(id); }
}

@ApiTags('管理员 · 资讯')
@ApiBearerAuth() @AdminOnly()
@Controller('admin/news')
export class AdminNewsController {
  constructor(private s: NewsService) {}
  @Get() list(@Query() q: PaginationDto) { return this.s.listAll(q); }
  @Get(':id') detail(@Param('id', ParseIntPipe) id: number) { return this.s.findOne(id); }
  @Post() create(@CurrentUser() u: AuthUser, @Body() d: Partial<News>) { return this.s.create(u, d); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() d: Partial<News>) { return this.s.update(id, d); }
  @Post(':id/publish') publish(@Param('id', ParseIntPipe) id: number) { return this.s.publish(id); }
  @Post(':id/unpublish') unpub(@Param('id', ParseIntPipe) id: number) { return this.s.unpublish(id); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.s.remove(id); }
}

@Module({
  imports: [TypeOrmModule.forFeature([News])],
  controllers: [PublicNewsController, AdminNewsController],
  providers: [NewsService],
})
export class NewsModule {}
