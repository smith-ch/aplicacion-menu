'use client';

import { ArrowLeft, CalendarClock, CreditCard, Download, FileText, Landmark, Loader2, Send, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { PageHero } from '@/components/ui/PageHero';
import { Alert, PaymentBadge, Spinner, Stars, StatusBadge, StatusStepper, Timeline } from '@/components/ui/bits';
import { api } from '@/lib/api';
import { DOC_TYPES, date, money } from '@/lib/constants';
import type { Order, SiteContent } from '@/lib/types';

export default function ClientOrderPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(() => api<Order>(`/my/orders/${id}`).then(setOrder).catch((e) => setError(e.message)), [id]);
  useEffect(() => { load(); api<SiteContent>('/content').then(setContent).catch(() => {}); }, [load]);

  if (error) return <div className="container-x pt-36"><Alert>{error}</Alert></div>;
  if (!order) return <div className="pt-36"><Spinner /></div>;

  const photos = order.photos ?? [];
  const byStage = (s: string) => photos.filter((p) => p.stage === s);

  return (
    <>
      <PageHero eyebrow={`Orden ${order.code}`} title={order.items.map((i) => i.serviceName).join(' + ')}>
        <div className="mt-6 flex flex-wrap gap-2"><StatusBadge status={order.status} /><PaymentBadge status={order.paymentStatus} /></div>
      </PageHero>
      <div className="container-x grid gap-8 py-12 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Link href="/mi-cuenta" className="inline-flex items-center gap-1 text-sm text-ink-900/60 hover:text-brand"><ArrowLeft className="h-4 w-4" /> Mis órdenes</Link>
          <section className="card rounded-3xl p-6"><StatusStepper status={order.status} /></section>

          {photos.length > 0 && (
            <section className="card rounded-3xl p-6">
              <h2 className="mb-4 text-lg font-bold">Fotos del trabajo</h2>
              {(['antes', 'durante', 'despues'] as const).map((s) => byStage(s).length > 0 && (
                <div key={s} className="mb-5">
                  <p className="label">{s === 'despues' ? 'Después' : s === 'antes' ? 'Antes' : 'Durante'}</p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {byStage(s).map((p) => (
                      <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.url} alt="" className="aspect-square w-full rounded-xl object-cover transition hover:opacity-80" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          <section className="card rounded-3xl p-6">
            <h2 className="mb-5 text-lg font-bold">Reportes de avance</h2>
            <Timeline updates={order.updates ?? []} />
          </section>

          {order.status === 'completada' && <ReviewBox order={order} onDone={load} />}
        </div>

        <aside className="space-y-6">
          <section className="card space-y-3 rounded-3xl p-6 text-sm">
            <h3 className="font-bold">Detalles</h3>
            {order.scheduledAt && <p className="flex gap-2"><CalendarClock className="h-4 w-4 text-brand" /> Programada: {date(order.scheduledAt, true)}</p>}
            {order.technician && <p className="flex gap-2"><UserRound className="h-4 w-4 text-brand" /> Responsable: {order.technician.name}</p>}
            <p className="text-ink-900/60">{order.address}{order.city ? `, ${order.city}` : ''}</p>
            {order.quotedAmount && <p>Monto cotizado: <b>{money(order.quotedAmount)}</b></p>}
            {order.estimatedDelivery && <p>Entrega estimada: <b>{order.estimatedDelivery}</b></p>}
          </section>

          <section className="card rounded-3xl p-6">
            <h3 className="mb-3 flex items-center gap-2 font-bold"><FileText className="h-4 w-4 text-brand" /> Documentos</h3>
            {!order.documents?.length ? <p className="text-sm text-ink-900/50">Tus cotizaciones y facturas aparecerán aquí.</p> : (
              <ul className="space-y-2">
                {order.documents.map((d) => (
                  <li key={d.id} className="flex items-center gap-3 rounded-2xl bg-sand-50 p-3 text-sm">
                    <div className="flex-1">
                      <p className="font-semibold">{DOC_TYPES[d.type]} {d.number}</p>
                      <p className="text-xs text-ink-900/50">{money(d.amount, d.currency)} · {d.status}</p>
                    </div>
                    {d.fileUrl && <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand hover:bg-brand hover:text-white" aria-label="Descargar"><Download className="h-4 w-4" /></a>}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {order.status !== 'cancelada' && (order.quotedAmount || order.documents?.some((d) => d.type === 'factura')) && order.paymentStatus !== 'pagado' && (
            <PaymentBox order={order} content={content} onDone={load} />
          )}

          {!!order.payments?.length && (
            <section className="card rounded-3xl p-6">
              <h3 className="mb-3 font-bold">Pagos registrados</h3>
              <ul className="space-y-2 text-sm">
                {order.payments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2">
                    <span>{money(p.amount)} <span className="text-xs text-ink-900/50 capitalize">· {p.method}</span></span>
                    <PaymentBadge status={p.status} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </>
  );
}

function PaymentBox({ order, content, onDone }: { order: Order; content: SiteContent | null; onDone: () => void }) {
  const [method, setMethod] = useState<'transferencia' | 'paypal'>('transferencia');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'error' | 'success'; text: string } | null>(null);
  const invoices = order.documents?.filter((d) => d.type === 'factura') ?? [];
  const pay = content?.settings.payments;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true); setMsg(null);
    try {
      await api(`/my/orders/${order.id}/payments`, { body: new FormData(e.currentTarget) });
      setMsg({ tone: 'success', text: 'Comprobante enviado. Lo validaremos en menos de 24 horas.' });
      (e.target as HTMLFormElement).reset();
      onDone();
    } catch (err) { setMsg({ tone: 'error', text: (err as Error).message }); } finally { setSending(false); }
  }

  return (
    <section className="card rounded-3xl p-6">
      <h3 className="mb-4 font-bold">Pagar</h3>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setMethod('transferencia')} className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-sm font-semibold ${method === 'transferencia' ? 'border-brand bg-brand-soft' : 'border-ink-900/10'}`}><Landmark className="h-4 w-4" /> Transferencia</button>
        <button type="button" onClick={() => setMethod('paypal')} className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-sm font-semibold ${method === 'paypal' ? 'border-brand bg-brand-soft' : 'border-ink-900/10'}`}><CreditCard className="h-4 w-4" /> Tarjeta / PayPal</button>
      </div>
      {method === 'paypal' ? (
        <div className="rounded-2xl bg-sand-50 p-5 text-center text-sm text-ink-900/60">
          <CreditCard className="mx-auto mb-2 h-8 w-8 text-ink-900/30" />
          El pago con tarjeta vía PayPal estará disponible muy pronto.
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          {pay?.transferInstructions && <p className="text-xs text-ink-900/60">{pay.transferInstructions}</p>}
          {pay?.bankAccounts?.map((b, i) => (
            <div key={i} className="rounded-2xl bg-sand-50 p-3 text-xs">
              <p className="font-bold">{b.bank} · {b.type}</p><p>No. {b.number}</p><p>{b.holder} · RNC {b.rnc}</p>
            </div>
          ))}
          {invoices.length > 0 && (
            <div><label className="label">Factura</label>
              <select name="documentId" className="input">{invoices.map((d) => <option key={d.id} value={d.id}>{d.number} — {money(d.amount)}</option>)}</select>
            </div>
          )}
          <div><label className="label">Monto transferido (RD$)</label><input name="amount" type="number" step="0.01" min="1" required defaultValue={invoices[0]?.amount ?? order.quotedAmount ?? ''} className="input" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="label">Banco</label><input name="bank" className="input" /></div>
            <div><label className="label">Referencia</label><input name="reference" className="input" /></div>
          </div>
          <div><label className="label">Comprobante (imagen o PDF)</label><input name="receipt" type="file" accept="image/*,application/pdf" required className="input file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-3 file:py-1 file:text-xs file:text-white" /></div>
          {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
          <button className="btn-primary w-full" disabled={sending}>{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Enviar comprobante</button>
        </form>
      )}
    </section>
  );
}

const CRITERIA = [
  { k: 'punctuality', label: 'Puntualidad' },
  { k: 'quality', label: 'Calidad del trabajo' },
  { k: 'cleanliness', label: 'Limpieza' },
  { k: 'communication', label: 'Comunicación' },
] as const;

function ReviewBox({ order, onDone }: { order: Order; onDone: () => void }) {
  const [values, setValues] = useState<Record<string, number>>({ rating: 0 });
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  if (order.review) {
    return (
      <section id="evaluar" className="card rounded-3xl p-6">
        <h2 className="text-lg font-bold">Tu evaluación</h2>
        <div className="mt-3"><Stars value={order.review.rating} /></div>
        {order.review.comment && <p className="mt-3 text-sm text-ink-900/70">“{order.review.comment}”</p>}
        <p className="mt-3 text-xs text-ink-900/50">¡Gracias por ayudarnos a mejorar!</p>
      </section>
    );
  }

  async function submit() {
    if (!values.rating) { setError('Selecciona una calificación general.'); return; }
    setSending(true); setError('');
    try { await api(`/my/orders/${order.id}/review`, { body: { ...values, comment: comment || undefined, wouldRecommend: recommend } }); onDone(); }
    catch (e) { setError((e as Error).message); } finally { setSending(false); }
  }

  return (
    <section id="evaluar" className="card rounded-3xl border-2 border-amber-200 p-6">
      <p className="eyebrow text-amber-600">Tú evalúas</p>
      <h2 className="mt-1 text-xl font-bold">¿Cómo fue tu experiencia?</h2>
      <div className="mt-5"><p className="label">Calificación general</p><Stars value={values.rating} onChange={(v) => setValues({ ...values, rating: v })} size="h-9 w-9" /></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {CRITERIA.map((c) => (
          <div key={c.k}><p className="label">{c.label}</p><Stars value={values[c.k] ?? 0} onChange={(v) => setValues({ ...values, [c.k]: v })} size="h-5 w-5" /></div>
        ))}
      </div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Cuéntanos más (opcional)" className="input mt-5" />
      <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={recommend} onChange={(e) => setRecommend(e.target.checked)} className="accent-[var(--brand)]" /> Recomendaría este servicio</label>
      {error && <div className="mt-3"><Alert>{error}</Alert></div>}
      <button onClick={submit} disabled={sending} className="btn-primary mt-5">{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Enviar evaluación</button>
    </section>
  );
}
