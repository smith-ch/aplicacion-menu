import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Role } from '../common/enums';

export class CreateUserDto {
  @IsString() @MinLength(2) @MaxLength(120)
  name: string;

  @IsEmail()
  email: string;

  @IsString() @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() documentId?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() specialty?: string;
}

export class UpdateUserDto {
  @IsOptional() @IsString() @MinLength(2) name?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MinLength(6) password?: string;
  @IsOptional() @IsEnum(Role) role?: Role;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() documentId?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() specialty?: string;
  @IsOptional() @IsBoolean() active?: boolean;
}
