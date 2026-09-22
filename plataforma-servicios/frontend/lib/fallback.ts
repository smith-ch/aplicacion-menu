import type { SiteContent } from './types';

/** Valores por defecto (se usan sólo si el API no está disponible). */
export const FALLBACK_CONTENT: SiteContent = {
  settings: {
    brand: { name: 'F.I.S.C.', tagline: 'Soluciones que impulsan', logoUrl: '', logoLightUrl: '', primaryColor: '#3E4A52', accentColor: '#9FB4C0' },
    hero: {
      eyebrow: 'Adecuación · Mantenimiento · Tecnología',
      title: 'Un solo equipo para todo lo que tu espacio necesita',
      subtitle: 'Un único levantamiento, una cotización transparente y un proyecto ejecutado "fuera de preocupación".',
      ctaPrimary: 'Solicitar servicio', ctaSecondary: 'Agendar levantamiento', imageUrl: '',
      highlights: ['Cotización unificada', 'Reportes diarios con fotos', 'Pagas cuando estás satisfecho'],
    },
    about: { title: '¿Por qué elegirnos?', text: '', stats: [] },
    process: { title: 'Así trabajamos', subtitle: '', phases: [] },
    contact: { whatsapp: '', whatsappMessage: 'Hola, quisiera información.', phone: '', email: '', address: '', hours: '', instagram: '', facebook: '' },
    payments: { currency: 'DOP', transferInstructions: '', bankAccounts: [], paypalEnabled: false },
    seo: { title: 'F.I.S.C. | Soluciones que impulsan', description: 'Adecuación, mantenimiento y tecnología para tu espacio.' },
  },
  testimonials: [],
  faqs: [],
  projects: [],
};
