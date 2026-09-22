import { IsArray, IsBoolean, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class PillarDto {
  @IsString() @MaxLength(10) code: string;
  @IsString() @MinLength(2) @MaxLength(140) title: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsBoolean() active?: boolean;
}

export class ServiceDto {
  @IsOptional() @IsInt() pillarId?: number | null;
  @IsString() @MinLength(2) @MaxLength(140) name: string;
  @IsOptional() @IsString() slug?: string;
  @IsString() @MaxLength(300) shortDescription: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) features?: string[];
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsNumber() @Min(0) priceFrom?: number | null;
  @IsOptional() @IsString() priceNote?: string;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsBoolean() active?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
}
