'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { ServiceIcon } from '@/components/Icon';
import { Reveal, SpotlightCard } from '@/components/fx/effects';
import { AddToCart } from '@/components/site/AddToCart';
import type { Pillar } from '@/lib/types';

/**
 * Pilares de servicio: cada pilar ocupa una "escena" con título fijo (sticky)
 * mientras sus servicios se desplazan; el color de fondo se interpola con el scroll.
 */
export function Pillars({ pillars }: { pillars: Pillar[] }) {
  return (
    <section id="servicios" className="relative bg-sand-50">
      <div className="container-x pt-28 pb-10">
        <Reveal>
          <p className="eyebrow text-brand">Nuestros servicios</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Tres pilares, <span className="font-display font-medium text-brand">un solo aliado</span> para tu espacio.
          </h2>
        </Reveal>
      </div>
      {pillars.map((p, i) => <PillarScene key={p.id} pillar={p} index={i} />)}
    </section>
  );
}

function PillarScene({ pillar, index }: { pillar: Pillar; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const letterY = useTransform(scrollYProgress, [0, 1], ['30%', '-30%']);
  const rotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const color = pillar.color || '#3E4A52';

  return (
    <div ref={ref} className="relative border-t border-ink-900/10">
      <div className="container-x grid gap-10 py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <div className="relative h-56 overflow-hidden rounded-3xl p-8 text-white sm:h-72" style={{ background: `linear-gradient(135deg, ${color}, #07100f)` }}>
              <motion.span style={{ y: letterY, rotate }} className="pointer-events-none absolute -top-10 -right-6 font-display text-[16rem] leading-none text-white/10">
                {pillar.code}
              </motion.span>
              <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 20% 110%, ${color}, transparent 60%)` }} />
              <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                <ServiceIcon name={pillar.icon} className="h-7 w-7" />
              </span>
              <p className="relative mt-auto pt-10 eyebrow text-white/70">Pilar {pillar.code} · {String(index + 1).padStart(2, '0')}</p>
            </div>
            <h3 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">{pillar.title}</h3>
            <p className="mt-3 max-w-md text-ink-900/60">{pillar.description}</p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
          {(pillar.services ?? []).map((s, j) => (
            <Reveal key={s.id} delay={(j % 2) * 0.1}>
              <SpotlightCard className="card group h-full overflow-hidden rounded-3xl">
                <Link href={`/servicios/${s.slug}`} className="flex h-full flex-col p-6">
                  {s.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.imageUrl} alt={s.name} className="-mx-6 -mt-6 mb-5 h-40 w-[calc(100%+3rem)] max-w-none object-cover transition duration-700 group-hover:scale-105" />
                  ) : (
                    <span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl transition duration-500 group-hover:scale-110 group-hover:rotate-6"
                      style={{ background: `${color}18`, color }}>
                      <ServiceIcon name={s.icon} className="h-6 w-6" />
                    </span>
                  )}
                  <h4 className="flex items-start justify-between gap-3 text-lg font-bold">
                    {s.name}
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-ink-900/30 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
                  </h4>
                  <p className="mt-2 flex-1 text-sm text-ink-900/60">{s.shortDescription}</p>
                  <div className="mt-5 flex items-center justify-between gap-2">
                    <span className="text-xs text-ink-900/50">{s.priceFrom ? `Desde RD$ ${Number(s.priceFrom).toLocaleString('es-DO')}` : 'Cotización a la medida'}</span>
                    <AddToCart service={s} className="btn-sm" />
                  </div>
                </Link>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
