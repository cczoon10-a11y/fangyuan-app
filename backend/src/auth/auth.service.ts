import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Agent, AgentStatus } from '../agents/agent.entity';
import { Admin } from '../admins/admin.entity';
import { JwtPayload, TokenType } from './auth.types';
import { LoginDto, RegisterDto, SmsCodeDto } from './auth.dto';

// SMS 验证码存储(生产环境应使用 Redis)
const smsCache = new Map<string, { code: string; expiresAt: number }>();

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Agent) private agentRepo: Repository<Agent>,
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  // ==================== 短信验证码 ====================
  async sendSmsCode(dto: SmsCodeDto) {
    const key = `sms:${dto.phone}:${dto.scene}`;
    const existing = smsCache.get(key);
    if (existing && existing.expiresAt - Date.now() > 240000) {
      throw new BadRequestException('短信发送过于频繁,请稍候再试');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    smsCache.set(key, {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 分钟
    });

    // TODO: 生产环境对接 Twilio
    this.logger.log(`[SMS-DEV] ${dto.phone} (${dto.scene}): ${code}`);

    return {
      success: true,
      // 开发环境返回验证码,生产环境不应返回
      ...(this.config.get('NODE_ENV') !== 'production' ? { code } : {}),
    };
  }

  private verifySmsCode(phone: string, scene: string, code: string): boolean {
    const key = `sms:${phone}:${scene}`;
    const cached = smsCache.get(key);
    if (!cached || cached.expiresAt < Date.now()) return false;
    if (cached.code !== code) return false;
    smsCache.delete(key);
    return true;
  }

  // ==================== 普通用户 ====================
  async userRegister(dto: RegisterDto) {
    if (!this.verifySmsCode(dto.phone, 'register', dto.code)) {
      throw new BadRequestException('验证码错误或已过期');
    }

    const existing = await this.userRepo.findOne({ where: { phone: dto.phone } });
    if (existing) {
      throw new ConflictException('手机号已注册');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.userRepo.save({
      phone: dto.phone,
      passwordHash,
      nickname: dto.nickname || `用户${dto.phone.slice(-4)}`,
    });

    return this.generateTokens(user.id, user.phone, TokenType.USER);
  }

  async userLogin(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { phone: dto.phone } });
    if (!user) throw new UnauthorizedException('账号或密码错误');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('账号或密码错误');

    await this.userRepo.update(user.id, { lastLoginAt: new Date() });
    return this.generateTokens(user.id, user.phone, TokenType.USER);
  }

  // ==================== 经纪人 ====================
  async agentLogin(dto: LoginDto) {
    const agent = await this.agentRepo.findOne({ where: { phone: dto.phone } });
    if (!agent) throw new UnauthorizedException('账号或密码错误');

    const ok = await bcrypt.compare(dto.password, agent.passwordHash);
    if (!ok) throw new UnauthorizedException('账号或密码错误');

    // 状态校验
    if (agent.status === AgentStatus.PENDING) {
      throw new UnauthorizedException('您的申请还在审核中,请耐心等待');
    }
    if (agent.status === AgentStatus.REJECTED) {
      throw new UnauthorizedException(`您的申请被驳回: ${agent.rejectionReason || '请联系管理员'}`);
    }
    if (agent.status === AgentStatus.DISABLED) {
      throw new UnauthorizedException('账号已被禁用,请联系管理员');
    }

    await this.agentRepo.update(agent.id, { lastLoginAt: new Date() });
    return {
      ...this.generateTokens(agent.id, agent.phone, TokenType.AGENT),
      agent: {
        id: agent.id,
        name: agent.name,
        level: agent.level,
        avatarUrl: agent.avatarUrl,
      },
    };
  }

  // ==================== 管理员 ====================
  async adminLogin(dto: LoginDto) {
    const admin = await this.adminRepo.findOne({ where: { phone: dto.phone } });
    if (!admin) throw new UnauthorizedException('账号或密码错误');
    if (!admin.isActive) throw new UnauthorizedException('账号已禁用');

    const ok = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!ok) throw new UnauthorizedException('账号或密码错误');

    await this.adminRepo.update(admin.id, { lastLoginAt: new Date() });
    return {
      ...this.generateTokens(admin.id, admin.phone, TokenType.ADMIN),
      admin: {
        id: admin.id,
        name: admin.name,
        role: admin.role,
        avatarUrl: admin.avatarUrl,
      },
    };
  }

  // ==================== Token 生成 ====================
  private generateTokens(sub: number, phone: string, type: TokenType) {
    const payload: JwtPayload = { sub, phone, type };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.config.get('JWT_EXPIRES_IN', '7d'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '30d'),
    });
    return {
      token,
      refresh_token: refreshToken,
      expires_in: 7 * 24 * 3600,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);
      return this.generateTokens(payload.sub, payload.phone, payload.type);
    } catch (e) {
      throw new UnauthorizedException('refresh_token 无效或已过期');
    }
  }
}
