'use client';

import { Check, Loader2, Star } from 'lucide-react';
import { PAYMENT_STATUS, STATUS, STATUS_FLOW, date } from '@/lib/constants';
import type { OrderStatus, OrderUpdate } from '@/lib/types';

export function StatusBadge({ status }: { status: OrderStatus }) {
  const s = STATUS[status];
  return <span className={`badge ${s?.color ?? 'bg-zinc-100'}`}>{s?.label ?? status}</span>;
}

export function PaymentBadge({ status }: { status: string }) {
  const s = PAYMENT_STATUS[status];
  return <span className={`badge ${s?.color ?? 'bg-zinc-100'}`}>{s?.label ?? status}</span>;
}

/** Barra de progreso: Recibida → Levantamiento → Cotizada → Ejecución → Completada. */
export function StatusStepper({ status }: { status: OrderStatus }) {
  if (status === 'cancelada') return <div className="rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">Esta orden fue cancelada.</div>;
  const current = STATUS[status].step;
  return (
    <ol className="grid grid-cols-5 gap-2">
      {STATUS_FLOW.map((s, i) => (
        <li key={s} className="flex flex-col items-center text-center">
          <div className="relative flex w-full items-center">
            <div className={`h-0.5 flex-1 ${i === 0 ? 'opacity-0' : i <= current ? 'bg-brand' : 'bg-ink-900/10'}`} />
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold transition ${
              i < current ? 'bg-brand text-white' : i === current ? 'bg-brand text-white ring-4 ring-brand/20' : 'bg-ink-900/10 text-ink-900/40'}`}>
              {i < current ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <div className={`h-0.5 flex-1 ${i === STATUS_FLOW.length - 1 ? 'opacity-0' : i < current ? 'bg-brand' : 'bg-ink-900/10'}`} />
          </div>
          <span className={`mt-2 text-[11px] font-semibold sm:text-xs ${i <= current ? 'text-ink-900' : 'text-ink-900/40'}`}>{STATUS[s].label}</span>
        </li>
      ))}
    </ol>
  );
}

export function Timeline({ updates, staff = false }: { updates: OrderUpdate[]; staff?: boolean }) {
  if (!updates.length) return <p className="text-sm text-ink-900/50">Sin actualizaciones todavía.</p>;
  return (
    <ol className="relative space-y-6 border-l border-ink-900/10 pl-6">
      {updates.map((u) => (
        <li key={u.id} className="relative">
          <span className="absolute top-1 -left-[31px] h-3 w-3 rounded-full border-2 border-white bg-brand ring-1 ring-brand/30" />
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-900/50">
            <span>{date(u.createdAt, true)}</span>
            {u.status && <StatusBadge status={u.status as OrderStatus} />}
            {staff && u.author && <span>· {u.author.name}</span>}
            {staff && !u.visibleToClient && <span className="badge bg-zinc-200 text-zinc-700">Interno</span>}
          </div>
          <p className="mt-1 text-sm">{u.message}</p>
          {u.photos?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {u.photos.map((p) => (
                <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="group relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.caption ?? ''} className="h-24 w-24 rounded-xl object-cover transition group-hover:opacity-80" />
                  <span className="badge absolute bottom-1 left-1 bg-ink-950/70 text-[10px] text-white capitalize">{p.stage}</span>
                </a>
              ))}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

export function Stars({ value, onChange, size = 'h-6 w-6' }: { value: number; onChange?: (v: number) => void; size?: string }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={!onChange} onClick={() => onChange?.(n)} aria-label={`${n} estrellas`}
          className={onChange ? 'transition hover:scale-110' : 'cursor-default'}>
          <Star className={`${size} ${n <= value ? 'fill-amber-400 text-amber-400' : 'text-ink-900/20'}`} />
        </button>
      ))}
    </div>
  );
}

export function Spinner({ className = '' }: { className?: string }) {
  return <div className={`flex justify-center py-16 ${className}`}><Loader2 className="h-7 w-7 animate-spin text-brand" /></div>;
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-ink-900/15 p-10 text-center text-sm text-ink-900/50">{children}</div>;
}

export function Alert({ children, tone = 'error' }: { children: React.ReactNode; tone?: 'error' | 'success' | 'info' }) {
  const c = tone === 'error' ? 'bg-rose-50 text-rose-700' : tone === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-800';
  return <div className={`rounded-xl px-4 py-3 text-sm ${c}`}>{children}</div>;
}
