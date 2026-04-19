import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { TokenType } from './auth.types';

export const IS_PUBLIC_KEY = 'isPublic';
export const ALLOWED_TYPES_KEY = 'allowedTypes';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('未登录或token已过期');
    }

    // 校验用户类型限制(如某接口只允许 admin)
    const allowedTypes = this.reflector.getAllAndOverride<TokenType[]>(ALLOWED_TYPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (allowedTypes && allowedTypes.length > 0 && !allowedTypes.includes(user.type)) {
      throw new UnauthorizedException('权限不足');
    }

    return user;
  }
}
