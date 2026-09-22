import { InteractiveBackground } from '@/components/fx/InteractiveBackground';
import { LogoShards } from '@/components/fx/LogoParallax';

/** Cabecera oscura para páginas internas (misma estética que la portada). */
export function PageHero({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <section className="grain relative overflow-hidden bg-ink-950 pt-36 pb-16 text-white">
      <InteractiveBackground dots={false} className="opacity-70" />
      <LogoShards />
      <div className="container-x relative z-10">
        {eyebrow && <p className="eyebrow text-accent">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-white/65">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
