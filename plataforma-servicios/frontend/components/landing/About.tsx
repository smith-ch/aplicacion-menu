import { CountUp, Reveal } from '@/components/fx/effects';
import type { Settings } from '@/lib/types';

export function About({ about }: { about: Settings['about'] }) {
  return (
    <section className="bg-sand-100 py-28">
      <div className="container-x grid gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow text-brand">Fuera de preocupación</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{about.title}</h2>
          <p className="mt-6 text-lg text-ink-900/65">{about.text}</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-4">
          {about.stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="rounded-3xl border border-ink-900/10 bg-white p-7">
                <p className="font-display text-6xl text-brand"><CountUp value={s.value} /></p>
                <p className="mt-2 text-sm font-medium text-ink-900/60">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
