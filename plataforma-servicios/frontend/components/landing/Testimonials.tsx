import { Quote, Star } from 'lucide-react';
import { Reveal } from '@/components/fx/effects';
import type { Testimonial } from '@/lib/types';

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <section className="overflow-hidden bg-sand-100 py-28">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-brand">Tú evalúas</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Lo que dicen nuestros clientes</h2>
        </Reveal>
      </div>
      <div className="mt-12 flex w-max animate-marquee gap-5 px-4 [animation-duration:60s] hover:[animation-play-state:paused]">
        {[...items, ...items].map((t, i) => (
          <figure key={i} className="w-[340px] shrink-0 rounded-3xl border border-ink-900/10 bg-white p-7 sm:w-[400px]">
            <Quote className="h-8 w-8 text-brand/30" />
            <div className="mt-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, s) => <Star key={s} className={`h-4 w-4 ${s < t.rating ? 'fill-accent text-accent' : 'text-ink-900/15'}`} />)}
            </div>
            <blockquote className="mt-4 text-ink-900/80">“{t.text}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              {t.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-sm font-bold text-white">{t.name[0]}</span>}
              <span>
                <span className="block text-sm font-bold">{t.name}</span>
                {t.company && <span className="block text-xs text-ink-900/50">{t.company}</span>}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
