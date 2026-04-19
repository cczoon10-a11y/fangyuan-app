import { IsString, IsNotEmpty, Matches, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '+85512345678' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{10,15}$/, { message: '手机号格式错误' })
  phone: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  password: string;
}

export class RegisterDto extends LoginDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: '验证码为6位数字' })
  code: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string;
}

export class SmsCodeDto {
  @ApiProperty({ example: '+85512345678' })
  @IsString()
  @Matches(/^\+\d{10,15}$/)
  phone: string;

  @ApiProperty({ enum: ['register', 'reset_password', 'login', 'bind'] })
  @IsString()
  scene: 'register' | 'reset_password' | 'login' | 'bind';
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
