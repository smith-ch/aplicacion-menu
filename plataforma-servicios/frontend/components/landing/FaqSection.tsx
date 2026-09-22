'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Reveal } from '@/components/fx/effects';
import type { Faq } from '@/lib/types';

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  if (!faqs.length) return null;
  return (
    <section id="faq" className="bg-sand-50 py-28">
      <div className="container-x grid gap-12 lg:grid-cols-3">
        <Reveal>
          <p className="eyebrow text-brand">Preguntas frecuentes</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight">¿Tienes dudas?</h2>
          <p className="mt-4 text-ink-900/60">Si no encuentras tu respuesta, escríbenos por WhatsApp.</p>
        </Reveal>
        <div className="divide-y divide-ink-900/10 border-y border-ink-900/10 lg:col-span-2">
          {faqs.map((f) => (
            <div key={f.id}>
              <button onClick={() => setOpen(open === f.id ? null : f.id)} className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-semibold">
                {f.question}
                <Plus className={`h-5 w-5 shrink-0 text-brand transition-transform duration-300 ${open === f.id ? 'rotate-45' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {open === f.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="pb-6 text-ink-900/65">{f.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
