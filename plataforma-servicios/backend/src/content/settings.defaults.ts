/**
 * Contenido inicial de la landing. Todo es editable desde el panel
 * administrativo (Admin → Contenido del sitio).
 */
export const DEFAULT_SETTINGS: Record<string, Record<string, unknown>> = {
  brand: {
    name: 'F.I.S.C.',
    tagline: 'Soluciones que impulsan',
    /** Logo para fondos claros y para fondos oscuros (vacío = logo F.I.S.C. incluido). */
    logoUrl: '',
    logoLightUrl: '',
    primaryColor: '#3E4A52',
    accentColor: '#9FB4C0',
  },
  hero: {
    eyebrow: 'Adecuación · Mantenimiento · Tecnología',
    title: 'Un solo equipo para todo lo que tu espacio necesita',
    subtitle:
      'Pintura, plomería, impermeabilización, mobiliario a la medida, sistemas POS y más. Un único levantamiento, una cotización transparente y un proyecto ejecutado "fuera de preocupación".',
    ctaPrimary: 'Solicitar servicio',
    ctaSecondary: 'Agendar levantamiento',
    imageUrl: '',
    highlights: ['Cotización unificada', 'Reportes diarios con fotos', 'Pagas cuando estás satisfecho'],
  },
  about: {
    title: '¿Por qué elegirnos?',
    text:
      'Cubrimos el ciclo de vida completo de tu espacio comercial o residencial. Nuestros equipos se coordinan entre sí: tú sólo recibes avances y apruebas resultados.',
    stats: [
      { value: '3', label: 'Pilares de servicio' },
      { value: '10+', label: 'Especialidades' },
      { value: '24h', label: 'Respuesta a solicitudes' },
      { value: '100%', label: 'Garantía de satisfacción' },
    ],
  },
  process: {
    title: 'Así trabajamos',
    subtitle: 'Un flujo simple y transparente, de la solicitud a la factura.',
    phases: [
      {
        title: 'Captación y Levantamiento',
        steps: [
          'Solicitas uno o varios servicios por la web, WhatsApp o Instagram.',
          'Un supervisor visita el lugar (o hace una evaluación virtual) y mide todo lo requerido.',
          'Recibes una cotización unificada con un monto final y un tiempo de entrega único.',
        ],
      },
      {
        title: 'Ejecución "Fuera de Preocupación"',
        steps: [
          'Programamos la fecha y asignamos la cuadrilla. Los equipos se coordinan entre sí, no tú.',
          'Recibes actualizaciones diarias con fotos del avance, sin tener que estar en el lugar.',
        ],
      },
      {
        title: 'Evaluación y Pago',
        steps: [
          'Hacemos un recorrido final (físico o por videollamada) para revisar cada detalle.',
          'Evalúas el servicio con una breve encuesta.',
          'Emitimos la factura final: el ciclo se cierra sólo cuando estás satisfecho.',
        ],
      },
    ],
  },
  contact: {
    whatsapp: '18090000000',
    whatsappMessage: 'Hola, quisiera solicitar información sobre sus servicios.',
    phone: '+1 (809) 000-0000',
    email: 'contacto@fisc.com.do',
    address: 'Santo Domingo, República Dominicana',
    hours: 'Lunes a Sábado · 8:00 a.m. – 6:00 p.m.',
    instagram: 'https://instagram.com/',
    facebook: '',
  },
  payments: {
    currency: 'DOP',
    transferInstructions: 'Realiza la transferencia y sube el comprobante desde tu portal. Validamos en menos de 24 horas.',
    bankAccounts: [
      { bank: 'Banco Popular', type: 'Cuenta corriente', number: '000-000000-0', holder: 'F.I.S.C. SRL', rnc: '000-00000-0' },
    ],
    paypalEnabled: false,
  },
  seo: {
    title: 'F.I.S.C. | Soluciones que impulsan — Adecuación, Mantenimiento y Tecnología',
    description:
      'Pintura, instalación de mobiliario, plomería, impermeabilización, cerrajería, sistemas POS y mantenimiento de equipos en República Dominicana.',
  },
};

export const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS);
