import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from './agent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agent])],
  exports: [TypeOrmModule],
})
export class AgentsModule {}
