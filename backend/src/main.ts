import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // 安全中间件
  app.use(helmet());
  app.use(compression());

  // CORS
  const corsOrigins = config.get<string>('CORS_ORIGINS', '').split(',').filter(Boolean);
  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  });

  // 全局 API 前缀
  app.setGlobalPrefix('api/v1');

  // 全局管道:请求体校验
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 全局异常过滤
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局响应转换
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger 文档(开发环境)
  if (config.get('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('方·苑 FANGYUAN API')
      .setDescription('金边房产 App 后端 API 文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
    logger.log('📚 Swagger: http://localhost:' + (config.get('PORT') || 3000) + '/api/docs');
  }

  const port = config.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 FANGYUAN Backend running at http://localhost:${port}/api/v1`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to bootstrap:', err);
  process.exit(1);
});
