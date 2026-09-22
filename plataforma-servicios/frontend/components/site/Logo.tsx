import Link from 'next/link';

/** Logotipo F.I.S.C.: símbolo + nombre. `light` = versión blanca para fondos oscuros. */
export function Logo({ name, tagline, logoUrl, logoLightUrl, light = false }: {
  name: string; tagline?: string; logoUrl?: string; logoLightUrl?: string; light?: boolean;
}) {
  const src = light ? logoLightUrl || '/brand/symbol-white.png' : logoUrl || '/brand/symbol-black.png';
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} className="h-9 w-auto transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" />
      <span className={`leading-none ${light ? 'text-white' : 'text-ink-900'}`}>
        <span className="block font-display text-lg font-bold tracking-[0.14em]">{name}</span>
        {tagline && <span className={`mt-0.5 block text-[9px] font-semibold tracking-[0.28em] uppercase ${light ? 'text-white/60' : 'text-ink-900/50'}`}>{tagline}</span>}
      </span>
    </Link>
  );
}
