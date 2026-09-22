import type { OrderStatus } from './types';

export const STATUS: Record<OrderStatus, { label: string; color: string; step: number }> = {
  recibida: { label: 'Recibida', color: 'bg-sky-100 text-sky-800', step: 0 },
  en_levantamiento: { label: 'En Levantamiento', color: 'bg-amber-100 text-amber-800', step: 1 },
  cotizada: { label: 'Cotizada', color: 'bg-violet-100 text-violet-800', step: 2 },
  en_ejecucion: { label: 'En Ejecución', color: 'bg-orange-100 text-orange-800', step: 3 },
  completada: { label: 'Completada', color: 'bg-emerald-100 text-emerald-800', step: 4 },
  cancelada: { label: 'Cancelada', color: 'bg-rose-100 text-rose-800', step: -1 },
};

export const STATUS_FLOW: OrderStatus[] = ['recibida', 'en_levantamiento', 'cotizada', 'en_ejecucion', 'completada'];

export const PAYMENT_STATUS: Record<string, { label: string; color: string }> = {
  pendiente: { label: 'Pago pendiente', color: 'bg-zinc-100 text-zinc-700' },
  en_revision: { label: 'Pago en revisión', color: 'bg-amber-100 text-amber-800' },
  pagado: { label: 'Pagado', color: 'bg-emerald-100 text-emerald-800' },
  validado: { label: 'Validado', color: 'bg-emerald-100 text-emerald-800' },
  rechazado: { label: 'Rechazado', color: 'bg-rose-100 text-rose-800' },
};

export const SOURCES: Record<string, string> = {
  web: 'Web', whatsapp: 'WhatsApp', instagram: 'Instagram', telefono: 'Teléfono', otro: 'Otro',
};

export const PROPERTY_TYPES = [
  { value: 'residencial', label: 'Residencial' },
  { value: 'comercial', label: 'Local comercial' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'industrial', label: 'Industrial / Almacén' },
  { value: 'otro', label: 'Otro' },
];

export const URGENCY = [
  { value: 'normal', label: 'Normal', hint: 'En los próximos días' },
  { value: 'prioritaria', label: 'Prioritaria', hint: 'Esta semana' },
  { value: 'urgente', label: 'Urgente', hint: 'Lo antes posible' },
];

export const DOC_TYPES: Record<string, string> = { cotizacion: 'Cotización', factura: 'Factura', recibo: 'Recibo' };

export function money(v: string | number | null | undefined, currency = 'DOP') {
  if (v == null || v === '') return '—';
  const n = Number(v);
  return `${currency === 'DOP' ? 'RD$' : currency} ${n.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function date(v: string | null | undefined, withTime = false) {
  if (!v) return '—';
  const d = new Date(v.length === 10 ? `${v}T12:00:00` : v);
  return d.toLocaleString('es-DO', withTime
    ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: 'short', year: 'numeric' });
}

export function waLink(phone: string, text: string) {
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
}
