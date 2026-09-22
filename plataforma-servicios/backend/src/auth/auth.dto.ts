import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @MinLength(2) @MaxLength(120)
  name: string;

  @IsEmail()
  email: string;

  @IsString() @MinLength(6) @MaxLength(100)
  password: string;

  @IsOptional() @IsString() @MaxLength(30)
  phone?: string;

  @IsOptional() @IsString() @MaxLength(30)
  documentId?: string;

  @IsOptional() @IsString() @MaxLength(255)
  address?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UpdateProfileDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120)
  name?: string;

  @IsOptional() @IsString() @MaxLength(30)
  phone?: string;

  @IsOptional() @IsString() @MaxLength(30)
  documentId?: string;

  @IsOptional() @IsString() @MaxLength(255)
  address?: string;

  @IsOptional() @IsString()
  currentPassword?: string;

  @IsOptional() @IsString() @MinLength(6) @MaxLength(100)
  newPassword?: string;
}
