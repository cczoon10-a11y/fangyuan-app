import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AgentsModule } from './agents/agents.module';
import { AdminsModule } from './admins/admins.module';
import { ListingsModule } from './listings/listings.module';
import { SectionsModule } from './sections/sections.module';
import { AreasModule } from './areas/areas.module';
import { HomeEntriesModule } from './home-entries/home-entries.module';
import { KeywordsModule } from './keywords/keywords.module';
import { FilterOptionsModule } from './filter-options/filter-options.module';
import { FavoritesModule } from './favorites/favorites.module';
import { NewsModule } from './news/news.module';
import { PointsModule } from './points/points.module';
import { GiftsModule } from './gifts/gifts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UploadsModule } from './uploads/uploads.module';
import { WebsocketModule } from './websocket/websocket.module';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL', 60) * 1000,
          limit: config.get<number>('THROTTLE_LIMIT', 100),
        },
      ],
    }),
    ScheduleModule.forRoot(),

    // 业务模块
    AuthModule,
    UsersModule,
    AgentsModule,
    AdminsModule,
    ListingsModule,
    SectionsModule,
    AreasModule,
    HomeEntriesModule,
    KeywordsModule,
    FilterOptionsModule,
    FavoritesModule,
    NewsModule,
    PointsModule,
    GiftsModule,
    NotificationsModule,
    UploadsModule,
    WebsocketModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
