'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowRight, CalendarCheck, Check } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { InteractiveBackground } from '@/components/fx/InteractiveBackground';
import { LogoParallax, LogoShards } from '@/components/fx/LogoParallax';
import { Magnetic, SplitWords } from '@/components/fx/effects';
import type { Settings } from '@/lib/types';

export function Hero({ hero, brand }: { hero: Settings['hero']; brand: Settings['brand'] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // Al hacer scroll el contenido se aleja (escala + desvanecido) como en las landings de producto
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  // Última palabra del título en cursiva serif, como acento editorial
  const words = hero.title.split(' ');
  const main = words.slice(0, -3).join(' ');
  const accent = words.slice(-3).join(' ');

  return (
    <section ref={ref} className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-ink-950 text-white">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        {hero.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        )}
        <InteractiveBackground colors={[brand.primaryColor, brand.accentColor, '#1f2a30', '#5b6b75']} />
        <LogoShards scrollTarget={ref} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/30 via-transparent to-ink-950" />

      <div className="container-x relative z-10 grid items-center gap-6 pt-28 pb-20 lg:grid-cols-12">
      <motion.div style={{ scale, opacity, y }} className="lg:col-span-7">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="eyebrow mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white/80 backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> {hero.eyebrow}
        </motion.p>
        <h1 className="text-5xl leading-[0.95] font-bold tracking-tight sm:text-6xl xl:text-7xl">
          <SplitWords text={main} />
          <SplitWords text={accent} delay={0.35} className="font-display font-normal text-accent" />
        </h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-8 max-w-2xl text-lg text-white/70 sm:text-xl">
          {hero.subtitle}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.8 }}
          className="mt-10 flex flex-wrap items-center gap-3">
          <Magnetic>
            <Link href="/solicitar" className="btn-accent px-7 py-4 text-base">{hero.ctaPrimary} <ArrowRight className="h-4 w-4" /></Link>
          </Magnetic>
          <Magnetic>
            <Link href="/solicitar?tipo=levantamiento" className="btn border border-white/20 px-7 py-4 text-base text-white backdrop-blur hover:bg-white/10">
              <CalendarCheck className="h-4 w-4" /> {hero.ctaSecondary}
            </Link>
          </Magnetic>
        </motion.div>
        <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.1 }}
          className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70">
          {hero.highlights.map((h) => (
            <li key={h} className="flex items-center gap-2"><Check className="h-4 w-4 text-accent" /> {h}</li>
          ))}
        </motion.ul>
      </motion.div>
      <div className="order-first mx-auto w-44 sm:w-56 lg:order-none lg:col-span-5 lg:w-full lg:max-w-md">
        <LogoParallax scrollTarget={ref} />
      </div>
      </div>

      <motion.a href="#servicios" style={{ opacity }} className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-[0.3em] text-white/50 uppercase">
        Descubre
        <span className="grid h-10 w-6 place-items-start justify-center rounded-full border border-white/25 p-1">
          <ArrowDown className="h-3 w-3 animate-bounce" />
        </span>
      </motion.a>
    </section>
  );
}
