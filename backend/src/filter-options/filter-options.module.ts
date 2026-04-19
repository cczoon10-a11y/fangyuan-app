import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe,
  Module, Injectable, NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterOption } from './filter-option.entity';
import { Public, AdminOnly } from '../auth/auth.decorators';

@Injectable()
export class FilterOptionsService {
  constructor(@InjectRepository(FilterOption) private repo: Repository<FilterOption>) {}
  listByCategory(category: string, onlyEnabled = true) {
    return this.repo.find({
      where: onlyEnabled ? { category, isEnabled: true } : { category },
      order: { sortOrder: 'ASC' },
    });
  }
  async findOne(id: number) {
    const x = await this.repo.findOne({ where: { id } });
    if (!x) throw new NotFoundException();
    return x;
  }
  create(d: Partial<FilterOption>) { return this.repo.save(this.repo.create(d)); }
  async update(id: number, d: Partial<FilterOption>) {
    await this.findOne(id); await this.repo.update(id, d); return this.findOne(id);
  }
  async remove(id: number) {
    const r = await this.repo.delete(id);
    if (!r.affected) throw new NotFoundException();
    return { success: true };
  }
  async reorder(ids: number[]) {
    for (let i = 0; i < ids.length; i++) {
      await this.repo.update(ids[i], { sortOrder: i + 1 });
    }
    return { success: true };
  }
}

@ApiTags('公共 · 筛选选项')
@Controller('public/filter-options')
export class PublicFilterOptionsController {
  constructor(private s: FilterOptionsService) {}
  @Public() @Get() list(@Query('category') category: string) {
    return this.s.listByCategory(category, true);
  }
}

@ApiTags('管理员 · 筛选选项')
@ApiBearerAuth() @AdminOnly()
@Controller('admin/filter-options')
export class AdminFilterOptionsController {
  constructor(private s: FilterOptionsService) {}
  @Get() list(@Query('category') category: string) { return this.s.listByCategory(category, false); }
  @Post() create(@Body() d: Partial<FilterOption>) { return this.s.create(d); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() d: Partial<FilterOption>) { return this.s.update(id, d); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.s.remove(id); }
  @Post('reorder') reorder(@Body() body: { ids: number[] }) { return this.s.reorder(body.ids); }
}

@Module({
  imports: [TypeOrmModule.forFeature([FilterOption])],
  controllers: [PublicFilterOptionsController, AdminFilterOptionsController],
  providers: [FilterOptionsService],
})
export class FilterOptionsModule {}
