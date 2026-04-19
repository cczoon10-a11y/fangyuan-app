import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'fangyuan',
  password: process.env.DB_PASSWORD || 'fangyuan_dev_pwd_change_me',
  database: process.env.DB_DATABASE || 'fangyuan',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsTableName: 'typeorm_migrations',
});
