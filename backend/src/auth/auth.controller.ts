import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, SmsCodeDto, RefreshTokenDto } from './auth.dto';
import { Public } from './auth.decorators';

// ============================================================================
// 用户端认证
// ============================================================================
@ApiTags('用户端 · 认证')
@Controller('user/auth')
export class UserAuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('sms-code')
  @ApiOperation({ summary: '发送短信验证码' })
  sms(@Body() dto: SmsCodeDto) {
    return this.auth.sendSmsCode(dto);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  register(@Body() dto: RegisterDto) {
    return this.auth.userRegister(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  login(@Body() dto: LoginDto) {
    return this.auth.userLogin(dto);
  }

  @Public()
  @Post('refresh-token')
  @ApiOperation({ summary: '刷新token' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.auth.refreshToken(dto.refresh_token);
  }
}

// ============================================================================
// 经纪人端认证
// ============================================================================
@ApiTags('经纪人端 · 认证')
@Controller('agent/auth')
export class AgentAuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('sms-code')
  sms(@Body() dto: SmsCodeDto) {
    return this.auth.sendSmsCode(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: '经纪人登录' })
  login(@Body() dto: LoginDto) {
    return this.auth.agentLogin(dto);
  }

  @Public()
  @Post('refresh-token')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.auth.refreshToken(dto.refresh_token);
  }
}

// ============================================================================
// 管理员端认证
// ============================================================================
@ApiTags('管理员端 · 认证')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: '管理员登录' })
  login(@Body() dto: LoginDto) {
    return this.auth.adminLogin(dto);
  }

  @Public()
  @Post('refresh-token')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.auth.refreshToken(dto.refresh_token);
  }
}
