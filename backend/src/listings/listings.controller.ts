import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import {
  CreateListingDto,
  UpdateListingDto,
  ListingQueryDto,
  RejectListingDto,
} from './listing.dto';
import { Public, AdminOnly, AgentOnly, CurrentUser } from '../auth/auth.decorators';
import { AuthUser } from '../auth/auth.types';

// ============================================================================
// 公共 API
// ============================================================================
@ApiTags('公共 · 房源')
@Controller('listings')
export class PublicListingsController {
  constructor(private service: ListingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '房源列表(公共)' })
  list(@Query() query: ListingQueryDto) {
    return this.service.publicList(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: '房源详情' })
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}

// ============================================================================
// 管理员 API
// ============================================================================
@ApiTags('管理员 · 房源')
@ApiBearerAuth()
@AdminOnly()
@Controller('admin/listings')
export class AdminListingsController {
  constructor(private service: ListingsService) {}

  @Get()
  list(@Query() query: ListingQueryDto) {
    return this.service.adminList(query);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateListingDto) {
    return this.service.adminCreate(user, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateListingDto,
  ) {
    return this.service.ownerUpdate(user, id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.adminDelete(id);
  }

  @Post(':id/approve')
  approve(@CurrentUser() user: AuthUser, @Param('id', ParseIntPipe) id: number) {
    return this.service.approve(user, id);
  }

  @Post(':id/reject')
  reject(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectListingDto,
  ) {
    return this.service.reject(user, id, dto.reason);
  }
}

// ============================================================================
// 经纪人 API
// ============================================================================
@ApiTags('经纪人 · 房源')
@ApiBearerAuth()
@AgentOnly()
@Controller('agent/listings')
export class AgentListingsController {
  constructor(private service: ListingsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query() query: ListingQueryDto) {
    return this.service.agentList(user, query);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateListingDto) {
    return this.service.agentCreate(user, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateListingDto,
  ) {
    return this.service.ownerUpdate(user, id, dto);
  }
}
