import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ServiceIcon } from '@/components/Icon';
import { Reveal, SpotlightCard } from '@/components/fx/effects';
import { AddToCart } from '@/components/site/AddToCart';
import { PageHero } from '@/components/ui/PageHero';
import { getCatalog } from '@/lib/server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Catálogo de servicios' };

export default async function ServicesPage() {
  const pillars = await getCatalog();
  return (
    <>
      <PageHero eyebrow="Catálogo" title="Servicios para cada etapa de tu espacio"
        subtitle="Agrega uno o varios servicios a tu solicitud. Hacemos un solo levantamiento y te enviamos una cotización unificada." />
      <div className="container-x space-y-20 py-20">
        {pillars.map((p) => (
          <section key={p.id} id={p.slug}>
            <Reveal>
              <div className="mb-8 flex items-end gap-4 border-b border-ink-900/10 pb-5">
                <span className="font-display text-6xl font-bold text-ink-900/10">{p.code}</span>
                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">{p.title}</h2>
                  <p className="text-ink-900/60">{p.description}</p>
                </div>
              </div>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(p.services ?? []).map((s, i) => (
                <Reveal key={s.id} delay={(i % 3) * 0.08}>
                  <SpotlightCard className="card group h-full rounded-3xl">
                    <Link href={`/servicios/${s.slug}`} className="flex h-full flex-col p-6">
                      <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand transition group-hover:scale-110"><ServiceIcon name={s.icon} className="h-6 w-6" /></span>
                      <h3 className="flex justify-between gap-2 text-lg font-bold">{s.name}<ArrowUpRight className="h-5 w-5 shrink-0 text-ink-900/30 group-hover:text-brand" /></h3>
                      <p className="mt-2 flex-1 text-sm text-ink-900/60">{s.shortDescription}</p>
                      <div className="mt-5"><AddToCart service={s} className="btn-sm" label="Agregar a solicitud" /></div>
                    </Link>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
