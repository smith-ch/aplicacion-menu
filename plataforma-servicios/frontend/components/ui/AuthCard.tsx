import { InteractiveBackground } from '@/components/fx/InteractiveBackground';
import { LogoParallax } from '@/components/fx/LogoParallax';

/** Pantalla dividida: formulario + panel oscuro con el símbolo en parallax. */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-[100svh] lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 pt-28 pb-16">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-ink-900/60">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <div className="grain relative hidden items-center justify-center overflow-hidden bg-ink-950 lg:flex">
        <InteractiveBackground />
        <div className="relative w-72"><LogoParallax /></div>
      </div>
    </div>
  );
}
