export enum Role {
  ADMIN = 'admin',
  TECHNICIAN = 'technician',
  CLIENT = 'client',
}

/** Ciclo de vida de una orden (Fase 1 → Fase 3 del MVP). */
export enum OrderStatus {
  RECEIVED = 'recibida',
  SURVEY = 'en_levantamiento',
  QUOTED = 'cotizada',
  IN_PROGRESS = 'en_ejecucion',
  COMPLETED = 'completada',
  CANCELLED = 'cancelada',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.RECEIVED]: 'Recibida',
  [OrderStatus.SURVEY]: 'En Levantamiento',
  [OrderStatus.QUOTED]: 'Cotizada',
  [OrderStatus.IN_PROGRESS]: 'En Ejecución',
  [OrderStatus.COMPLETED]: 'Completada',
  [OrderStatus.CANCELLED]: 'Cancelada',
};

export enum OrderSource {
  WEB = 'web',
  WHATSAPP = 'whatsapp',
  INSTAGRAM = 'instagram',
  PHONE = 'telefono',
  OTHER = 'otro',
}

export enum PaymentStatus {
  PENDING = 'pendiente',
  REVIEW = 'en_revision',
  PAID = 'pagado',
}

export enum PaymentMethod {
  TRANSFER = 'transferencia',
  PAYPAL = 'paypal',
  CARD = 'tarjeta',
  CASH = 'efectivo',
}

export enum PaymentRecordStatus {
  PENDING = 'pendiente',
  APPROVED = 'validado',
  REJECTED = 'rechazado',
}

export enum DocumentType {
  QUOTE = 'cotizacion',
  INVOICE = 'factura',
  RECEIPT = 'recibo',
}

export enum PhotoStage {
  BEFORE = 'antes',
  DURING = 'durante',
  AFTER = 'despues',
}
