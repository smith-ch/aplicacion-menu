'use client';

import { CheckCircle2, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { InteractiveBackground } from '@/components/fx/InteractiveBackground';
import { Reveal } from '@/components/fx/effects';
import { InstagramIcon, WhatsAppIcon } from '@/components/Icon';
import { api } from '@/lib/api';
import { waLink } from '@/lib/constants';
import type { Settings } from '@/lib/types';

export function Contact({ contact, brand }: { contact: Settings['contact']; brand: Settings['brand'] }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(''); setState('sending');
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (!data.email) delete data.email;
    try { await api('/leads', { body: data }); setState('sent'); }
    catch (err) { setError((err as Error).message); setState('idle'); }
  }

  return (
    <section id="contacto" className="grain relative overflow-hidden bg-ink-950 py-28 text-white">
      <InteractiveBackground colors={[brand.accentColor, brand.primaryColor, '#1e3a8a']} />
      <div className="container-x relative z-10 grid gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow text-accent">Hablemos</p>
          <h2 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
            Cuéntanos qué necesita <span className="font-display font-medium text-accent">tu espacio.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-white/65">Escríbenos por WhatsApp, Instagram o deja tus datos y te contactamos en menos de 24 horas.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            {contact.whatsapp && (
              <a href={waLink(contact.whatsapp, contact.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="btn bg-[#25D366] px-6 py-3.5 text-white hover:brightness-110">
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp Business
              </a>
            )}
            {contact.instagram && (
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="btn border border-white/20 px-6 py-3.5 hover:bg-white/10">
                <InstagramIcon className="h-5 w-5" /> Instagram
              </a>
            )}
          </div>
          <ul className="mt-10 space-y-3 text-white/70">
            {contact.phone && <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-accent" /> {contact.phone}</li>}
            {contact.email && <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-accent" /> {contact.email}</li>}
            {contact.address && <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-accent" /> {contact.address}</li>}
          </ul>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-xl sm:p-9">
            {state === 'sent' ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-accent" />
                <h3 className="mt-4 text-2xl font-bold">¡Mensaje recibido!</h3>
                <p className="mt-2 text-white/60">Te contactaremos muy pronto.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
                <h3 className="text-xl font-bold sm:col-span-2">Contacto rápido</h3>
                <input name="name" required minLength={2} placeholder="Nombre" className="input border-white/15 bg-white/10 text-white placeholder:text-white/40" />
                <input name="phone" required minLength={7} placeholder="Teléfono / WhatsApp" className="input border-white/15 bg-white/10 text-white placeholder:text-white/40" />
                <input name="email" type="email" placeholder="Correo (opcional)" className="input border-white/15 bg-white/10 text-white placeholder:text-white/40 sm:col-span-2" />
                <textarea name="message" required minLength={3} rows={4} placeholder="¿Qué necesitas?" className="input border-white/15 bg-white/10 text-white placeholder:text-white/40 sm:col-span-2" />
                {error && <p className="text-sm text-rose-300 sm:col-span-2">{error}</p>}
                <button disabled={state === 'sending'} className="btn-accent py-3.5 sm:col-span-2">
                  {state === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Enviar mensaje
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
