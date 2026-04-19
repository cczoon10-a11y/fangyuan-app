import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { UserAuthController, AgentAuthController, AdminAuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '../users/user.entity';
import { Agent } from '../agents/agent.entity';
import { Admin } from '../admins/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Agent, Admin]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '7d'),
        },
      }),
    }),
  ],
  controllers: [UserAuthController, AgentAuthController, AdminAuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
