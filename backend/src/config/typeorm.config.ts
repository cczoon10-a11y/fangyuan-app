import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get<string>('DB_HOST'),
  port: config.get<number>('DB_PORT', 5432),
  username: config.get<string>('DB_USERNAME'),
  password: config.get<string>('DB_PASSWORD'),
  database: config.get<string>('DB_DATABASE'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: config.get<boolean>('DB_SYNCHRONIZE', false),
  logging: config.get<boolean>('DB_LOGGING', false),
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  migrationsRun: false,
  timezone: 'Asia/Phnom_Penh',
  extra: {
    max: 20,
    connectionTimeoutMillis: 10000,
  },
});
