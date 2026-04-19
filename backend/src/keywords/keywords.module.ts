import {
  Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe,
  Module, Injectable, NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keyword } from './keyword.entity';
import { Public, AdminOnly } from '../auth/auth.decorators';

@Injectable()
export class KeywordsService {
  constructor(@InjectRepository(Keyword) private repo: Repository<Keyword>) {}
  findAllPublic() {
    return this.repo.find({ where: { isEnabled: true }, order: { sortOrder: 'ASC' } });
  }
  findAll() { return this.repo.find({ order: { sortOrder: 'ASC' } }); }
  async findOne(id: number) {
    const x = await this.repo.findOne({ where: { id } });
    if (!x) throw new NotFoundException();
    return x;
  }
  create(d: Partial<Keyword>) { return this.repo.save(this.repo.create(d)); }
  async update(id: number, d: Partial<Keyword>) {
    await this.findOne(id); await this.repo.update(id, d); return this.findOne(id);
  }
  async remove(id: number) {
    const r = await this.repo.delete(id);
    if (!r.affected) throw new NotFoundException();
    return { success: true };
  }
}

@ApiTags('公共 · 关键字')
@Controller('public/keywords')
export class PublicKeywordsController {
  constructor(private s: KeywordsService) {}
  @Public() @Get() list() { return this.s.findAllPublic(); }
}

@ApiTags('管理员 · 关键字')
@ApiBearerAuth() @AdminOnly()
@Controller('admin/keywords')
export class AdminKeywordsController {
  constructor(private s: KeywordsService) {}
  @Get() list() { return this.s.findAll(); }
  @Post() create(@Body() d: Partial<Keyword>) { return this.s.create(d); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() d: Partial<Keyword>) { return this.s.update(id, d); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.s.remove(id); }
}

@Module({
  imports: [TypeOrmModule.forFeature([Keyword])],
  controllers: [PublicKeywordsController, AdminKeywordsController],
  providers: [KeywordsService],
})
export class KeywordsModule {}
