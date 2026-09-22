'use client';

import { Loader2, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { PageHero } from '@/components/ui/PageHero';
import { Alert, StatusBadge, StatusStepper } from '@/components/ui/bits';
import { api } from '@/lib/api';
import { date } from '@/lib/constants';
import type { OrderStatus } from '@/lib/types';

interface Tracked {
  code: string; status: OrderStatus; statusLabel: string; createdAt: string; scheduledAt: string | null;
  items: { serviceName: string; quantity: number }[]; updates: { status: string | null; message: string; createdAt: string }[];
}

function Tracker() {
  const params = useSearchParams();
  const [code, setCode] = useState(params.get('code') ?? '');
  const [email, setEmail] = useState('');
  const [data, setData] = useState<Tracked | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(''); setData(null);
    try { setData(await api<Tracked>(`/orders/track?code=${encodeURIComponent(code)}&email=${encodeURIComponent(email)}`)); }
    catch (err) { setError((err as Error).message); } finally { setLoading(false); }
  }

  return (
    <div className="container-x max-w-3xl py-14">
      <form onSubmit={onSubmit} className="card grid gap-4 rounded-3xl p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div><label className="label">Código de orden</label><input value={code} onChange={(e) => setCode(e.target.value)} required placeholder="ORD-000001" className="input uppercase" /></div>
        <div><label className="label">Correo usado</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" /></div>
        <button className="btn-primary h-[42px]" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Buscar</button>
      </form>
      {error && <div className="mt-6"><Alert>{error}</Alert></div>}
      {data && (
        <div className="card mt-8 space-y-8 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-sm text-ink-900/50">Orden</p><p className="font-display text-2xl font-bold">{data.code}</p></div>
            <StatusBadge status={data.status} />
          </div>
          <StatusStepper status={data.status} />
          <div>
            <p className="label">Servicios</p>
            <p className="text-sm">{data.items.map((i) => `${i.serviceName}${i.quantity > 1 ? ` ×${i.quantity}` : ''}`).join(' · ')}</p>
          </div>
          <div>
            <p className="label">Historial</p>
            <ol className="space-y-3">
              {data.updates.map((u, i) => <li key={i} className="text-sm"><span className="text-ink-900/50">{date(u.createdAt, true)} — </span>{u.message}</li>)}
            </ol>
          </div>
          <p className="text-xs text-ink-900/50">¿Quieres ver fotos del avance y tus documentos? Crea una cuenta con el mismo correo y tu orden aparecerá en “Mi cuenta”.</p>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <>
      <PageHero eyebrow="Seguimiento" title="¿Cómo va mi orden?" subtitle="Consulta el estado con tu código de orden y el correo con que la solicitaste." />
      <Suspense><Tracker /></Suspense>
    </>
  );
}
