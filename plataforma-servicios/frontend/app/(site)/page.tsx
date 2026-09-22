import { About } from '@/components/landing/About';
import { Contact } from '@/components/landing/Contact';
import { FaqSection } from '@/components/landing/FaqSection';
import { Hero } from '@/components/landing/Hero';
import { Marquee } from '@/components/landing/Marquee';
import { Pillars } from '@/components/landing/Pillars';
import { Process } from '@/components/landing/Process';
import { Projects } from '@/components/landing/Projects';
import { Testimonials } from '@/components/landing/Testimonials';
import { getCatalog, getContent } from '@/lib/server';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [{ settings, testimonials, faqs, projects }, pillars] = await Promise.all([getContent(), getCatalog()]);
  const serviceNames = pillars.flatMap((p) => (p.services ?? []).map((s) => s.name));

  return (
    <>
      <Hero hero={settings.hero} brand={settings.brand} />
      {serviceNames.length > 0 && <Marquee items={serviceNames} />}
      <Pillars pillars={pillars} />
      {settings.process.phases.length > 0 && <Process process={settings.process} />}
      {settings.about.stats.length > 0 && <About about={settings.about} />}
      <Projects projects={projects} />
      <Testimonials items={testimonials} />
      <FaqSection faqs={faqs} />
      <Contact contact={settings.contact} brand={settings.brand} />
    </>
  );
}
