import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './listing.entity';
import { ListingsService } from './listings.service';
import {
  PublicListingsController,
  AdminListingsController,
  AgentListingsController,
} from './listings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Listing])],
  controllers: [PublicListingsController, AdminListingsController, AgentListingsController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
