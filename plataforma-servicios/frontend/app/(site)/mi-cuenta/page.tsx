'use client';

import { ArrowRight, LogOut, Plus, Save, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers';
import { PageHero } from '@/components/ui/PageHero';
import { Alert, Empty, PaymentBadge, Spinner, StatusBadge } from '@/components/ui/bits';
import { api } from '@/lib/api';
import { date, money } from '@/lib/constants';
import type { Order } from '@/lib/types';

export default function AccountPage() {
  const { user, logout, refresh } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [tab, setTab] = useState<'ordenes' | 'perfil'>('ordenes');
  const [msg, setMsg] = useState<{ tone: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => { api<Order[]>('/my/orders').then(setOrders).catch(() => setOrders([])); }, []);

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (!data.newPassword) { delete data.newPassword; delete data.currentPassword; }
    try { await api('/auth/me', { method: 'PATCH', body: data }); await refresh(); setMsg({ tone: 'success', text: 'Perfil actualizado.' }); }
    catch (err) { setMsg({ tone: 'error', text: (err as Error).message }); }
  }

  const pendingReview = orders?.filter((o) => o.status === 'completada' && !o.review) ?? [];

  return (
    <>
      <PageHero eyebrow="Mi cuenta" title={`Hola, ${user!.name.split(' ')[0]}`} subtitle="Aquí ves el estado de tus órdenes, tus documentos y puedes evaluar nuestro trabajo.">
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/solicitar" className="btn-accent"><Plus className="h-4 w-4" /> Nueva solicitud</Link>
          <button onClick={() => { logout(); router.push('/'); }} className="btn border border-white/20 text-white hover:bg-white/10"><LogOut className="h-4 w-4" /> Cerrar sesión</button>
        </div>
      </PageHero>
      <div className="container-x py-12">
        {pendingReview.length > 0 && (
          <Link href={`/mi-cuenta/ordenes/${pendingReview[0].id}#evaluar`} className="mb-8 flex items-center gap-4 rounded-3xl bg-amber-50 p-5 text-amber-900 transition hover:bg-amber-100">
            <Star className="h-8 w-8 fill-amber-400 text-amber-400" />
            <span className="flex-1"><b>Tú evalúas:</b> la orden {pendingReview[0].code} fue completada. ¿Nos cuentas cómo te fue?</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        )}
        <div className="mb-6 flex gap-2">
          {(['ordenes', 'perfil'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-5 py-2 text-sm font-semibold ${tab === t ? 'bg-ink-900 text-white' : 'bg-white text-ink-900/60'}`}>
              {t === 'ordenes' ? 'Mis órdenes' : 'Mi perfil'}
            </button>
          ))}
        </div>

        {tab === 'ordenes' && (!orders ? <Spinner /> : orders.length === 0 ? (
          <Empty>Aún no tienes órdenes. <Link href="/solicitar" className="font-semibold text-brand">Solicita tu primer servicio</Link>.</Empty>
        ) : (
          <div className="grid gap-4">
            {orders.map((o) => (
              <Link key={o.id} href={`/mi-cuenta/ordenes/${o.id}`} className="card group flex flex-col gap-4 rounded-3xl p-5 transition hover:border-brand/40 hover:shadow-lg sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg font-bold">{o.code}</span>
                    <StatusBadge status={o.status} />
                    <PaymentBadge status={o.paymentStatus} />
                  </div>
                  <p className="mt-1 text-sm text-ink-900/60">{o.items.map((i) => i.serviceName).join(' · ')}</p>
                  <p className="mt-1 text-xs text-ink-900/45">Creada el {date(o.createdAt)} · {o.address}</p>
                </div>
                <div className="text-right">
                  {o.quotedAmount && <p className="font-bold">{money(o.quotedAmount)}</p>}
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand">Ver detalle <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                </div>
              </Link>
            ))}
          </div>
        ))}

        {tab === 'perfil' && (
          <form onSubmit={saveProfile} className="card grid max-w-2xl gap-4 rounded-3xl p-6 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className="label">Nombre</label><input name="name" defaultValue={user!.name} className="input" /></div>
            <div><label className="label">Teléfono</label><input name="phone" defaultValue={user!.phone ?? ''} className="input" /></div>
            <div><label className="label">RNC / Cédula</label><input name="documentId" defaultValue={user!.documentId ?? ''} className="input" /></div>
            <div className="sm:col-span-2"><label className="label">Dirección</label><input name="address" defaultValue={user!.address ?? ''} className="input" /></div>
            <div><label className="label">Contraseña actual</label><input name="currentPassword" type="password" className="input" /></div>
            <div><label className="label">Nueva contraseña</label><input name="newPassword" type="password" minLength={6} className="input" /></div>
            {msg && <div className="sm:col-span-2"><Alert tone={msg.tone}>{msg.text}</Alert></div>}
            <button className="btn-primary sm:col-span-2"><Save className="h-4 w-4" /> Guardar cambios</button>
          </form>
        )}
      </div>
    </>
  );
}
