import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Module,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from './area.entity';
import { Public, AdminOnly } from '../auth/auth.decorators';

@Injectable()
export class AreasService {
  constructor(@InjectRepository(Area) private repo: Repository<Area>) {}
  findAllPublic() {
    return this.repo.find({ where: { isEnabled: true }, order: { sortOrder: 'ASC' } });
  }
  findAll() { return this.repo.find({ order: { sortOrder: 'ASC' } }); }
  async findOne(id: number) {
    const x = await this.repo.findOne({ where: { id } });
    if (!x) throw new NotFoundException();
    return x;
  }
  create(data: Partial<Area>) { return this.repo.save(this.repo.create(data)); }
  async update(id: number, data: Partial<Area>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }
  async remove(id: number) {
    const r = await this.repo.delete(id);
    if (!r.affected) throw new NotFoundException();
    return { success: true };
  }
}

@ApiTags('公共 · 区域')
@Controller('public/areas')
export class PublicAreasController {
  constructor(private s: AreasService) {}
  @Public() @Get() list() { return this.s.findAllPublic(); }
}

@ApiTags('管理员 · 区域')
@ApiBearerAuth() @AdminOnly()
@Controller('admin/areas')
export class AdminAreasController {
  constructor(private s: AreasService) {}
  @Get() list() { return this.s.findAll(); }
  @Get(':id') detail(@Param('id', ParseIntPipe) id: number) { return this.s.findOne(id); }
  @Post() create(@Body() dto: Partial<Area>) { return this.s.create(dto); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<Area>) { return this.s.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.s.remove(id); }
}

@Module({
  imports: [TypeOrmModule.forFeature([Area])],
  controllers: [PublicAreasController, AdminAreasController],
  providers: [AreasService],
})
export class AreasModule {}
