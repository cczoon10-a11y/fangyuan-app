export enum TokenType {
  USER = 'user',
  AGENT = 'agent',
  ADMIN = 'admin',
}

export interface JwtPayload {
  sub: number;
  phone: string;
  type: TokenType;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: number;
  phone: string;
  type: TokenType;
  [key: string]: any;
}
