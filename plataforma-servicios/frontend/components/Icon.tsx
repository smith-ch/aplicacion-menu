import {
  Blinds, Cpu, Droplets, Hammer, KeyRound, MonitorSmartphone, PaintRoller, Sofa, Sparkles, SprayCan, Umbrella, Wrench, Zap,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  'paint-roller': PaintRoller, sofa: Sofa, sparkles: Sparkles, blinds: Blinds, 'spray-can': SprayCan, droplets: Droplets,
  umbrella: Umbrella, 'key-round': KeyRound, 'monitor-smartphone': MonitorSmartphone, cpu: Cpu, wrench: Wrench, hammer: Hammer, zap: Zap,
};

export const ICON_NAMES = Object.keys(ICONS);

export function ServiceIcon({ name, className }: { name?: string | null; className?: string }) {
  const Cmp = (name && ICONS[name]) || Wrench;
  return <Cmp className={className} strokeWidth={1.6} />;
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.42 9.42 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.4 9.4 0 0 1 6.67 2.77 9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.45 9.43M20.08 3.9A11.3 11.3 0 0 0 12.05.57C5.8.57.7 5.66.7 11.93c0 2 .52 3.95 1.52 5.67L.6 23.43l5.97-1.57a11.3 11.3 0 0 0 5.47 1.4h.01c6.26 0 11.35-5.1 11.36-11.36 0-3.03-1.18-5.89-3.33-8.03" />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.55V4.47A20 20 0 0 0 14.3 4.3c-2.2 0-3.72 1.35-3.72 3.82v2.38H8.1v3h2.49V21z" />
    </svg>
  );
}
