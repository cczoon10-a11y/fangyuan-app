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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from './section.entity';
import { SectionsService } from './sections.service';
import { Public, AdminOnly } from '../auth/auth.decorators';

@ApiTags('公共 · 板块')
@Controller('public/sections')
export class PublicSectionsController {
  constructor(private service: SectionsService) {}

  @Public()
  @Get()
  list() {
    return this.service.findAllPublic();
  }
}

@ApiTags('管理员 · 板块')
@ApiBearerAuth()
@AdminOnly()
@Controller('admin/sections')
export class AdminSectionsController {
  constructor(private service: SectionsService) {}

  @Get()
  list() {
    return this.service.findAll();
  }

  @Get(':id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: Partial<Section>) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<Section>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Section])],
  controllers: [PublicSectionsController, AdminSectionsController],
  providers: [SectionsService],
})
export class SectionsModule {}
