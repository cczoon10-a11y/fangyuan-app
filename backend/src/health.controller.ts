import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/auth.decorators';

@Controller()
export class HealthController {
  @Public()
  @Get('health')
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
