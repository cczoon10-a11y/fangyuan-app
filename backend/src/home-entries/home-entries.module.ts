import {
  Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe,
  Module, Injectable, NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { HomeEntry } from './home-entry.entity';
import { Public, AdminOnly } from '../auth/auth.decorators';

@Injectable()
export class HomeEntriesService {
  constructor(
    @InjectRepository(HomeEntry) private repo: Repository<HomeEntry>,
    private ds: DataSource,
  ) {}

  async getPublicConfig() {
    const entries = await this.repo.find({
      where: { isEnabled: true },
      order: { sortOrder: 'ASC' },
    });
    const layoutRow = await this.ds.query(`SELECT layout FROM home_layout LIMIT 1`);
    const layout = layoutRow[0]?.layout || '4-column';
    return { layout, entries };
  }

  findAll() { return this.repo.find({ order: { sortOrder: 'ASC' } }); }

  async findOne(id: number) {
    const x = await this.repo.findOne({ where: { id } });
    if (!x) throw new NotFoundException();
    return x;
  }

  create(data: Partial<HomeEntry>) { return this.repo.save(this.repo.create(data)); }

  async update(id: number, data: Partial<HomeEntry>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const r = await this.repo.delete(id);
    if (!r.affected) throw new NotFoundException();
    return { success: true };
  }

  /** 批量更新(A-29 用) */
  async batchUpdate(body: { layout?: string; entries: HomeEntry[] }) {
    return this.ds.transaction(async (mgr) => {
      if (body.layout) {
        await mgr.query(
          `INSERT INTO home_layout(id, layout) VALUES(1, $1)
           ON CONFLICT(id) DO UPDATE SET layout = EXCLUDED.layout, updated_at = NOW()`,
          [body.layout],
        );
      }
      for (let i = 0; i < body.entries.length; i++) {
        const e = body.entries[i];
        if (e.id) {
          await mgr.update(HomeEntry, e.id, { ...e, sortOrder: i + 1 });
        } else {
          await mgr.save(HomeEntry, { ...e, sortOrder: i + 1 });
        }
      }
      return { success: true };
    });
  }
}

@ApiTags('公共 · 首页按钮')
@Controller('public/home-entries')
export class PublicHomeEntriesController {
  constructor(private s: HomeEntriesService) {}
  @Public() @Get() get() { return this.s.getPublicConfig(); }
}

@ApiTags('管理员 · 首页按钮')
@ApiBearerAuth() @AdminOnly()
@Controller('admin/home-entries')
export class AdminHomeEntriesController {
  constructor(private s: HomeEntriesService) {}
  @Get() list() { return this.s.findAll(); }
  @Get(':id') detail(@Param('id', ParseIntPipe) id: number) { return this.s.findOne(id); }
  @Post() create(@Body() dto: Partial<HomeEntry>) { return this.s.create(dto); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<HomeEntry>) { return this.s.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.s.remove(id); }
  @Post('batch-update') batch(@Body() body: any) { return this.s.batchUpdate(body); }
}

@Module({
  imports: [TypeOrmModule.forFeature([HomeEntry])],
  controllers: [PublicHomeEntriesController, AdminHomeEntriesController],
  providers: [HomeEntriesService],
})
export class HomeEntriesModule {}
