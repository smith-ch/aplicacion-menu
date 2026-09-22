import { Sparkle } from 'lucide-react';

export function Marquee({ items }: { items: string[] }) {
  const list = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-brand py-5 text-white">
      <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
        {list.map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-3xl whitespace-nowrap sm:text-4xl">
            {t} <Sparkle className="h-5 w-5 text-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
