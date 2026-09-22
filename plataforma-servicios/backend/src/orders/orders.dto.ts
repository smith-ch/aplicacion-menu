import { Type } from 'class-transformer';
import {
  ArrayMinSize, IsArray, IsBoolean, IsEmail, IsEnum, IsIn, IsInt, IsNumber, IsOptional, IsString, Matches, Max, MaxLength,
  Min, MinLength, ValidateNested,
} from 'class-validator';
import { DocumentType, OrderSource, OrderStatus, PaymentMethod, PaymentRecordStatus, PhotoStage } from '../common/enums';

export class OrderItemDto {
  @IsInt() serviceId: number;
  @IsOptional() @IsInt() @Min(1) @Max(999) quantity?: number;
  @IsOptional() @IsString() @MaxLength(1000) notes?: string;
}

export class CreateOrderDto {
  @IsArray() @ArrayMinSize(1, { message: 'Selecciona al menos un servicio' })
  @ValidateNested({ each: true }) @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString() @MinLength(2) @MaxLength(120) contactName: string;
  @IsEmail({}, { message: 'Correo inválido' }) contactEmail: string;
  @IsString() @MinLength(7) @MaxLength(30) contactPhone: string;
  @IsOptional() @IsString() @MaxLength(30) documentId?: string;

  @IsString() @MinLength(5) @MaxLength(255) address: string;
  @IsOptional() @IsString() @MaxLength(80) city?: string;
  @IsIn(['residencial', 'comercial', 'oficina', 'industrial', 'otro']) propertyType: string;
  @IsIn(['normal', 'prioritaria', 'urgente']) urgency: string;
  @IsOptional() @IsString() @MaxLength(40) areaSize?: string;
  @IsOptional() @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Fecha inválida' }) preferredDate?: string;
  @IsOptional() @IsString() @MaxLength(20) preferredTime?: string;
  @IsIn(['presencial', 'virtual']) visitType: string;
  @IsOptional() @IsString() @MaxLength(3000) notes?: string;

  /** Sólo el staff puede fijar el origen (WhatsApp, Instagram...). */
  @IsOptional() @IsEnum(OrderSource) source?: OrderSource;
}

export class UpdateOrderDto {
  @IsOptional() @IsInt() technicianId?: number | null;
  @IsOptional() @IsString() scheduledAt?: string | null;
  @IsOptional() @IsNumber() @Min(0) quotedAmount?: number | null;
  @IsOptional() @IsString() @MaxLength(60) estimatedDelivery?: string | null;
  @IsOptional() @IsString() internalNotes?: string | null;
  @IsOptional() @IsString() contactName?: string;
  @IsOptional() @IsString() contactPhone?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() documentId?: string;
  @IsOptional() @IsEnum(OrderSource) source?: OrderSource;
}

export class ChangeStatusDto {
  @IsEnum(OrderStatus) status: OrderStatus;
  @IsOptional() @IsString() @MaxLength(2000) message?: string;
}

export class ProgressUpdateDto {
  @IsString() @MinLength(2) @MaxLength(3000) message: string;
  @IsOptional() @IsEnum(PhotoStage) stage?: PhotoStage;
  /** Llega como string en multipart. */
  @IsOptional() @IsString() visibleToClient?: string;
}

export class ReviewDto {
  @IsInt() @Min(1) @Max(5) rating: number;
  @IsOptional() @IsInt() @Min(1) @Max(5) punctuality?: number;
  @IsOptional() @IsInt() @Min(1) @Max(5) quality?: number;
  @IsOptional() @IsInt() @Min(1) @Max(5) cleanliness?: number;
  @IsOptional() @IsInt() @Min(1) @Max(5) communication?: number;
  @IsOptional() @IsString() @MaxLength(2000) comment?: string;
  @IsOptional() @IsBoolean() wouldRecommend?: boolean;
}

/** Pago por transferencia desde el portal (multipart con comprobante). */
export class ClientPaymentDto {
  @Type(() => Number) @IsNumber() @Min(1) amount: number;
  @IsOptional() @IsString() @MaxLength(120) reference?: string;
  @IsOptional() @IsString() @MaxLength(80) bank?: string;
  @IsOptional() @Type(() => Number) @IsInt() documentId?: number;
}

export class AdminPaymentDto {
  @IsEnum(PaymentMethod) method: PaymentMethod;
  @IsNumber() @Min(1) amount: number;
  @IsOptional() @IsString() reference?: string;
  @IsOptional() @IsString() bank?: string;
  @IsOptional() @IsInt() documentId?: number;
  @IsOptional() @IsString() notes?: string;
}

export class ReviewPaymentDto {
  @IsIn([PaymentRecordStatus.APPROVED, PaymentRecordStatus.REJECTED]) status: PaymentRecordStatus;
  @IsOptional() @IsString() @MaxLength(1000) notes?: string;
}

export class DocumentDto {
  @IsEnum(DocumentType) type: DocumentType;
  @IsString() @MinLength(1) @MaxLength(60) number: string;
  @Type(() => Number) @IsNumber() @Min(0) amount: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() concrebillId?: string;
  @IsOptional() @IsString() issuedAt?: string;
  @IsOptional() @IsString() dueDate?: string;
  @IsOptional() @IsString() fileUrl?: string;
}
