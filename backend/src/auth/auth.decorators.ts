import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenType, AuthUser } from './auth.types';
import { IS_PUBLIC_KEY, ALLOWED_TYPES_KEY } from './jwt-auth.guard';

/** 标记接口为公开访问,跳过鉴权 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/** 指定允许的用户类型 */
export const AllowTypes = (...types: TokenType[]) => SetMetadata(ALLOWED_TYPES_KEY, types);

/** 仅允许管理员 */
export const AdminOnly = () => AllowTypes(TokenType.ADMIN);

/** 仅允许经纪人 */
export const AgentOnly = () => AllowTypes(TokenType.AGENT);

/** 仅允许普通用户 */
export const UserOnly = () => AllowTypes(TokenType.USER);

/** 注入当前登录用户 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
