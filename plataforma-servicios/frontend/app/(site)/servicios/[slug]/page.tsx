import { ArrowLeft, CalendarCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ServiceIcon, WhatsAppIcon } from '@/components/Icon';
import { Reveal } from '@/components/fx/effects';
import { AddToCart } from '@/components/site/AddToCart';
import { PageHero } from '@/components/ui/PageHero';
import { waLink } from '@/lib/constants';
import { getContent, getService } from '@/lib/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = await getService((await params).slug);
  return { title: s ? s.name : 'Servicio', description: s?.shortDescription };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const [service, { settings }] = await Promise.all([getService((await params).slug), getContent()]);
  if (!service) notFound();
  return (
    <>
      <PageHero eyebrow={service.pillar ? `Pilar ${service.pillar.code} · ${service.pillar.title}` : 'Servicio'} title={service.name} subtitle={service.shortDescription}>
        <div className="mt-8 flex flex-wrap gap-3">
          <AddToCart service={service} className="px-6 py-3.5" label="Agregar a mi solicitud" />
          {settings.contact.whatsapp && (
            <a href={waLink(settings.contact.whatsapp, `Hola, me interesa el servicio: ${service.name}`)} target="_blank" rel="noopener noreferrer"
              className="btn bg-[#25D366] px-6 py-3.5 text-white"><WhatsAppIcon className="h-5 w-5" /> Consultar por WhatsApp</a>
          )}
        </div>
      </PageHero>
      <div className="container-x grid gap-12 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Link href="/servicios" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-900/60 hover:text-brand"><ArrowLeft className="h-4 w-4" /> Volver al catálogo</Link>
          {service.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={service.imageUrl} alt={service.name} className="mb-8 aspect-video w-full rounded-3xl object-cover" />
          )}
          <Reveal><p className="text-lg leading-relaxed text-ink-900/75 whitespace-pre-line">{service.description}</p></Reveal>
          {!!service.features?.length && (
            <Reveal>
              <h2 className="mt-10 mb-4 text-xl font-bold">¿Qué incluye?</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {service.features.map((f) => (
                  <li key={f} className="card flex items-start gap-3 p-4 text-sm"><CheckCircle2 className="h-5 w-5 shrink-0 text-brand" /> {f}</li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
        <aside>
          <div className="card sticky top-28 space-y-4 rounded-3xl p-6">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white"><ServiceIcon name={service.icon} className="h-7 w-7" /></span>
            <p className="text-sm text-ink-900/60">Precio de referencia</p>
            <p className="font-display text-3xl font-bold">{service.priceFrom ? `Desde RD$ ${Number(service.priceFrom).toLocaleString('es-DO')}` : 'A la medida'}</p>
            {service.priceNote && <p className="text-xs text-ink-900/50">{service.priceNote}</p>}
            <p className="text-sm text-ink-900/60">La cotización oficial se emite tras el levantamiento, con un monto final y tiempo de entrega único.</p>
            <Link href="/solicitar" className="btn-dark w-full"><CalendarCheck className="h-4 w-4" /> Agendar levantamiento</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
