'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Building2, CalendarDays, CheckCircle2, ClipboardList, Loader2, Minus, Plus, UserRound, Video, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ServiceIcon, WhatsAppIcon } from '@/components/Icon';
import { useAuth, useCart } from '@/components/providers';
import { Alert, Spinner } from '@/components/ui/bits';
import { api } from '@/lib/api';
import { PROPERTY_TYPES, URGENCY, waLink } from '@/lib/constants';
import type { Pillar, SiteContent } from '@/lib/types';

const STEPS = [
  { title: 'Servicios', icon: ClipboardList },
  { title: 'Tu espacio', icon: Building2 },
  { title: 'Fecha', icon: CalendarDays },
  { title: 'Contacto', icon: UserRound },
];

const TIMES = ['8:00 a.m. – 10:00 a.m.', '10:00 a.m. – 12:00 p.m.', '2:00 p.m. – 4:00 p.m.', '4:00 p.m. – 6:00 p.m.'];

export function OrderWizard() {
  const cart = useCart();
  const { user, register } = useAuth();
  const [catalog, setCatalog] = useState<Pillar[] | null>(null);
  const [whatsapp, setWhatsapp] = useState('');
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ id: number; code: string } | null>(null);
  const [form, setForm] = useState({
    address: '', city: 'Santo Domingo', propertyType: 'residencial', urgency: 'normal', areaSize: '', notes: '',
    visitType: 'presencial', preferredDate: '', preferredTime: TIMES[0],
    contactName: '', contactEmail: '', contactPhone: '', documentId: '', password: '',
  });

  useEffect(() => {
    api<Pillar[]>('/catalog').then(setCatalog).catch(() => setCatalog([]));
    api<SiteContent>('/content').then((c) => setWhatsapp(c.settings.contact?.whatsapp ?? '')).catch(() => {});
  }, []);
  useEffect(() => {
    if (user) setForm((f) => ({ ...f, contactName: f.contactName || user.name, contactEmail: f.contactEmail || user.email,
      contactPhone: f.contactPhone || user.phone || '', documentId: f.documentId || user.documentId || '', address: f.address || user.address || '' }));
  }, [user]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });
  const minDate = useMemo(() => new Date(Date.now() + 864e5).toISOString().slice(0, 10), []);

  function validate(s: number): string {
    if (s === 0 && cart.items.length === 0) return 'Selecciona al menos un servicio.';
    if (s === 1 && form.address.trim().length < 5) return 'Indica la dirección del espacio.';
    if (s === 3) {
      if (form.contactName.trim().length < 2) return 'Escribe tu nombre.';
      if (!/^\S+@\S+\.\S+$/.test(form.contactEmail)) return 'Escribe un correo válido.';
      if (form.contactPhone.replace(/\D/g, '').length < 7) return 'Escribe un teléfono válido.';
      if (!user && form.password && form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    }
    return '';
  }

  function next() {
    const msg = validate(step);
    setError(msg);
    if (!msg) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function submit() {
    const msg = validate(3) || validate(0) || validate(1);
    if (msg) { setError(msg); return; }
    setSending(true); setError('');
    try {
      // Si el invitado escribió una contraseña se crea su cuenta para acceder al portal
      if (!user && form.password) {
        await register({ name: form.contactName, email: form.contactEmail, password: form.password, phone: form.contactPhone,
          documentId: form.documentId, address: form.address });
      }
      const { password: _p, ...rest } = form;
      const body = {
        ...Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== '')),
        items: cart.items.map((i) => ({ serviceId: i.serviceId, quantity: i.quantity, notes: i.notes || undefined })),
      };
      const res = await api<{ id: number; code: string }>('/orders', { body });
      cart.clear();
      setDone(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="container-x max-w-2xl py-20 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <CheckCircle2 className="mx-auto h-20 w-20 text-emerald-500" />
        </motion.div>
        <h2 className="mt-6 text-3xl font-bold">¡Solicitud recibida!</h2>
        <p className="mt-3 text-ink-900/65">Tu número de orden es</p>
        <p className="mt-2 font-display text-4xl font-bold tracking-wider text-brand">{done.code}</p>
        <p className="mx-auto mt-4 max-w-md text-ink-900/65">Un supervisor te contactará para coordinar el levantamiento. Puedes ver el estado de tu orden en todo momento.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {user ? <Link href={`/mi-cuenta/ordenes/${done.id}`} className="btn-primary">Ver mi orden</Link>
            : <Link href={`/seguimiento?code=${done.code}`} className="btn-primary">Seguir mi orden</Link>}
          {whatsapp && (
            <a href={waLink(whatsapp, `Hola, acabo de crear la orden ${done.code} en la web.`)} target="_blank" rel="noopener noreferrer" className="btn bg-[#25D366] text-white">
              <WhatsAppIcon className="h-4 w-4" /> Avisar por WhatsApp
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container-x grid gap-10 py-14 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ol className="mb-8 grid grid-cols-4 gap-2">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <button type="button" onClick={() => i < step && setStep(i)} disabled={i > step}
                className={`flex w-full flex-col items-center gap-2 rounded-2xl border p-3 text-xs font-semibold transition sm:flex-row sm:text-sm ${
                  i === step ? 'border-brand bg-brand text-white' : i < step ? 'border-brand/30 bg-brand-soft text-brand' : 'border-ink-900/10 text-ink-900/40'}`}>
                <s.icon className="h-4 w-4" /> {s.title}
              </button>
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}
            className="card rounded-3xl p-6 sm:p-8">
            {step === 0 && (
              <div>
                <h2 className="text-xl font-bold">¿Qué servicios necesitas?</h2>
                <p className="mt-1 text-sm text-ink-900/60">Puedes elegir varios: se evalúan en un solo levantamiento.</p>
                {!catalog ? <Spinner /> : catalog.map((p) => (
                  <div key={p.id} className="mt-6">
                    <p className="eyebrow mb-3 text-ink-900/50">Pilar {p.code} · {p.title}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(p.services ?? []).map((s) => {
                        const on = cart.has(s.id);
                        return (
                          <button key={s.id} type="button" onClick={() => (on ? cart.remove(s.id) : cart.add(s))}
                            className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${on ? 'border-brand bg-brand-soft' : 'border-ink-900/10 hover:border-brand/40'}`}>
                            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${on ? 'bg-brand text-white' : 'bg-sand-100 text-ink-900/70'}`}><ServiceIcon name={s.icon} className="h-5 w-5" /></span>
                            <span className="flex-1 text-sm font-semibold">{s.name}</span>
                            <span className={`grid h-5 w-5 place-items-center rounded-full border ${on ? 'border-brand bg-brand text-white' : 'border-ink-900/20'}`}>{on && <CheckCircle2 className="h-4 w-4" />}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {cart.items.length > 0 && (
                  <div className="mt-8 space-y-3 border-t border-ink-900/10 pt-6">
                    <p className="text-sm font-semibold">Detalles por servicio (opcional)</p>
                    {cart.items.map((i) => (
                      <div key={i.serviceId} className="flex flex-col gap-2 rounded-2xl bg-sand-50 p-3 sm:flex-row sm:items-center">
                        <span className="flex-1 text-sm font-medium">{i.name}</span>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => cart.update(i.serviceId, { quantity: Math.max(1, i.quantity - 1) })} className="grid h-8 w-8 place-items-center rounded-full bg-white"><Minus className="h-3 w-3" /></button>
                          <span className="w-8 text-center text-sm font-bold">{i.quantity}</span>
                          <button type="button" onClick={() => cart.update(i.serviceId, { quantity: i.quantity + 1 })} className="grid h-8 w-8 place-items-center rounded-full bg-white"><Plus className="h-3 w-3" /></button>
                        </div>
                        <input value={i.notes} onChange={(e) => cart.update(i.serviceId, { notes: e.target.value })} placeholder="Ej.: 3 habitaciones, techo de 80 m²…" className="input sm:w-72" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <h2 className="text-xl font-bold sm:col-span-2">Detalles del espacio</h2>
                <div className="sm:col-span-2"><label className="label">Dirección *</label><input value={form.address} onChange={set('address')} className="input" placeholder="Calle, número, sector" /></div>
                <div><label className="label">Ciudad</label><input value={form.city} onChange={set('city')} className="input" /></div>
                <div><label className="label">Tamaño aproximado</label><input value={form.areaSize} onChange={set('areaSize')} className="input" placeholder="Ej.: 120 m²" /></div>
                <div className="sm:col-span-2">
                  <label className="label">Tipo de propiedad</label>
                  <div className="flex flex-wrap gap-2">
                    {PROPERTY_TYPES.map((t) => (
                      <button key={t.value} type="button" onClick={() => setForm({ ...form, propertyType: t.value })}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${form.propertyType === t.value ? 'border-brand bg-brand text-white' : 'border-ink-900/15 hover:border-brand/40'}`}>{t.label}</button>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Urgencia</label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {URGENCY.map((u) => (
                      <button key={u.value} type="button" onClick={() => setForm({ ...form, urgency: u.value })}
                        className={`rounded-2xl border p-3 text-left transition ${form.urgency === u.value ? 'border-brand bg-brand-soft' : 'border-ink-900/10'}`}>
                        <span className="block text-sm font-bold">{u.label}</span><span className="text-xs text-ink-900/55">{u.hint}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2"><label className="label">Notas adicionales</label><textarea value={form.notes} onChange={set('notes')} rows={4} className="input" placeholder="Describe lo que necesitas, acceso al lugar, horarios, etc." /></div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <h2 className="text-xl font-bold sm:col-span-2">¿Cuándo hacemos el levantamiento?</h2>
                <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
                  {[{ v: 'presencial', t: 'Visita presencial', d: 'Un supervisor mide y audita en el lugar', i: MapPin },
                    { v: 'virtual', t: 'Evaluación virtual', d: 'Por videollamada, ideal para trabajos pequeños', i: Video }].map((o) => (
                    <button key={o.v} type="button" onClick={() => setForm({ ...form, visitType: o.v })}
                      className={`flex gap-3 rounded-2xl border p-4 text-left transition ${form.visitType === o.v ? 'border-brand bg-brand-soft' : 'border-ink-900/10'}`}>
                      <o.i className="h-6 w-6 shrink-0 text-brand" /><span><span className="block font-bold">{o.t}</span><span className="text-xs text-ink-900/55">{o.d}</span></span>
                    </button>
                  ))}
                </div>
                <div><label className="label">Fecha preferida</label><input type="date" min={minDate} value={form.preferredDate} onChange={set('preferredDate')} className="input" /></div>
                <div>
                  <label className="label">Horario preferido</label>
                  <select value={form.preferredTime} onChange={set('preferredTime')} className="input">{TIMES.map((t) => <option key={t}>{t}</option>)}</select>
                </div>
                <p className="text-xs text-ink-900/55 sm:col-span-2">Confirmaremos la fecha final contigo por WhatsApp o llamada.</p>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <h2 className="text-xl font-bold sm:col-span-2">Datos de contacto</h2>
                <div><label className="label">Nombre completo *</label><input value={form.contactName} onChange={set('contactName')} className="input" /></div>
                <div><label className="label">Teléfono / WhatsApp *</label><input value={form.contactPhone} onChange={set('contactPhone')} className="input" placeholder="809-000-0000" /></div>
                <div><label className="label">Correo *</label><input type="email" value={form.contactEmail} onChange={set('contactEmail')} className="input" disabled={!!user} /></div>
                <div><label className="label">RNC / Cédula</label><input value={form.documentId} onChange={set('documentId')} className="input" placeholder="Para tu factura con comprobante fiscal" /></div>
                {!user && (
                  <div className="rounded-2xl bg-sand-100 p-4 sm:col-span-2">
                    <label className="label">Crea tu cuenta (opcional)</label>
                    <input type="password" value={form.password} onChange={set('password')} className="input" placeholder="Contraseña para acceder a tu portal" />
                    <p className="mt-2 text-xs text-ink-900/55">Con una cuenta verás el avance con fotos, tus cotizaciones y facturas. ¿Ya tienes cuenta? <Link href="/login?next=/solicitar" className="font-semibold text-brand">Inicia sesión</Link></p>
                  </div>
                )}
              </div>
            )}

            {error && <div className="mt-6"><Alert>{error}</Alert></div>}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button type="button" onClick={() => { setError(''); setStep((s) => Math.max(0, s - 1)); }} disabled={step === 0} className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Atrás</button>
              {step < STEPS.length - 1
                ? <button type="button" onClick={next} className="btn-primary">Continuar <ArrowRight className="h-4 w-4" /></button>
                : <button type="button" onClick={submit} disabled={sending} className="btn-primary">{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Enviar solicitud</button>}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <aside>
        <div className="card sticky top-28 rounded-3xl p-6">
          <h3 className="font-bold">Resumen</h3>
          {cart.items.length === 0 ? <p className="mt-3 text-sm text-ink-900/50">Sin servicios seleccionados.</p> : (
            <ul className="mt-4 space-y-2">
              {cart.items.map((i) => (
                <li key={i.serviceId} className="flex items-center gap-2 text-sm">
                  <ServiceIcon name={i.icon} className="h-4 w-4 text-brand" /><span className="flex-1">{i.name}</span><span className="text-ink-900/50">×{i.quantity}</span>
                </li>
              ))}
            </ul>
          )}
          <dl className="mt-5 space-y-2 border-t border-ink-900/10 pt-4 text-sm">
            {form.address && <div className="flex justify-between gap-2"><dt className="text-ink-900/50">Dirección</dt><dd className="text-right">{form.address}</dd></div>}
            <div className="flex justify-between gap-2"><dt className="text-ink-900/50">Propiedad</dt><dd className="capitalize">{form.propertyType}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-ink-900/50">Urgencia</dt><dd className="capitalize">{form.urgency}</dd></div>
            {form.preferredDate && <div className="flex justify-between gap-2"><dt className="text-ink-900/50">Fecha</dt><dd>{form.preferredDate}</dd></div>}
          </dl>
          <p className="mt-5 rounded-2xl bg-brand-soft p-3 text-xs text-ink-900/70">La web no calcula impuestos: tu cotización oficial y la factura con NCF se emiten desde nuestro sistema de facturación.</p>
        </div>
      </aside>
    </div>
  );
}
