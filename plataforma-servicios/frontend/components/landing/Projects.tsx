'use client';

import { MoveHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Reveal } from '@/components/fx/effects';
import type { Project } from '@/lib/types';

/** Portafolio con comparador "antes / después" deslizable. */
export function Projects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  return (
    <section id="trabajos" className="bg-sand-50 py-28">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-brand">Trabajos realizados</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Antes <span className="font-display font-medium text-brand">&amp;</span> después</h2>
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 0.1}>
              <article>
                {p.beforeUrl && p.afterUrl ? <Compare before={p.beforeUrl} after={p.afterUrl} /> : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.afterUrl || p.beforeUrl || ''} alt={p.title} className="aspect-[4/3] w-full rounded-3xl object-cover" />
                )}
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">{p.title}</h3>
                    {p.description && <p className="mt-1 text-sm text-ink-900/60">{p.description}</p>}
                  </div>
                  {p.category && <span className="badge shrink-0 bg-brand-soft text-brand">{p.category}</span>}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Compare({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative aspect-[4/3] cursor-ew-resize overflow-hidden rounded-3xl select-none"
      onPointerMove={(e) => {
        if (e.pointerType === 'mouse' || e.buttons) {
          const r = e.currentTarget.getBoundingClientRect();
          setPos(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
        }
      }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt="Después" className="absolute inset-0 h-full w-full object-cover" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={before} alt="Antes" className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
      <div className="absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 left-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink-900 shadow-lg">
          <MoveHorizontal className="h-4 w-4" />
        </span>
      </div>
      <span className="badge absolute top-4 left-4 bg-ink-950/70 text-white">Antes</span>
      <span className="badge absolute top-4 right-4 bg-white/90 text-ink-900">Después</span>
    </div>
  );
}
