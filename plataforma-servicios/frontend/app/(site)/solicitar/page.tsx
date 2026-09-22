import { Suspense } from 'react';
import { PageHero } from '@/components/ui/PageHero';
import { OrderWizard } from './OrderWizard';

export const metadata = { title: 'Solicitar servicio' };

export default function RequestPage() {
  return (
    <>
      <PageHero eyebrow="Creador de órdenes" title="Solicita tu servicio"
        subtitle="Selecciona lo que necesitas, cuéntanos sobre tu espacio y elige la fecha para el levantamiento." />
      <Suspense><OrderWizard /></Suspense>
    </>
  );
}
