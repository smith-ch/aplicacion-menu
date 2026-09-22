import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Settings } from '@/lib/types';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/Icon';
import { waLink } from '@/lib/constants';
import { Logo } from './Logo';

export function Footer({ settings }: { settings: Settings }) {
  const { brand, contact } = settings;
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-white/70">
      <div className="container-x grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo name={brand.name} tagline={brand.tagline} logoUrl={brand.logoUrl} logoLightUrl={brand.logoLightUrl} light />
          <p className="mt-4 max-w-sm text-sm">{brand.tagline}. Adecuación, mantenimiento y tecnología para espacios residenciales y comerciales.</p>
          <div className="mt-6 flex gap-2">
            {contact.whatsapp && <a href={waLink(contact.whatsapp, contact.whatsappMessage)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full bg-white/5 transition hover:bg-[#25D366] hover:text-white"><WhatsAppIcon className="h-5 w-5" /></a>}
            {contact.instagram && <a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-white/5 transition hover:bg-pink-600 hover:text-white"><InstagramIcon className="h-5 w-5" /></a>}
            {contact.facebook && <a href={contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-white/5 transition hover:bg-blue-600 hover:text-white"><FacebookIcon className="h-5 w-5" /></a>}
          </div>
        </div>
        <div>
          <h4 className="eyebrow mb-4 text-white">Navegación</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/servicios" className="hover:text-white">Catálogo de servicios</Link></li>
            <li><Link href="/solicitar" className="hover:text-white">Solicitar servicio</Link></li>
            <li><Link href="/seguimiento" className="hover:text-white">Seguimiento de orden</Link></li>
            <li><Link href="/mi-cuenta" className="hover:text-white">Mi cuenta</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow mb-4 text-white">Contacto</h4>
          <ul className="space-y-2.5 text-sm">
            {contact.phone && <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0 text-accent" />{contact.phone}</li>}
            {contact.email && <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0 text-accent" />{contact.email}</li>}
            {contact.address && <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-accent" />{contact.address}</li>}
            {contact.hours && <li className="flex gap-2"><Clock className="h-4 w-4 shrink-0 text-accent" />{contact.hours}</li>}
          </ul>
        </div>
      </div>
      <div className="container-x relative border-t border-white/10 py-6 text-xs">
        © {new Date().getFullYear()} {brand.name}. Todos los derechos reservados.
      </div>
      <div aria-hidden className="pointer-events-none container-x -mb-[0.2em] font-display text-[18vw] leading-none text-white/[0.03] select-none">
        {brand.name.split(' ')[0]}
      </div>
    </footer>
  );
}
