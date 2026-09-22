interface SeedService {
  name: string;
  shortDescription: string;
  description: string;
  features: string[];
  icon: string;
  featured?: boolean;
}

export const SEED_CATALOG: { code: string; title: string; description: string; icon: string; color: string; services: SeedService[] }[] = [
  {
    code: 'A',
    title: 'Adecuación y Estética de Espacios',
    description: 'Transformamos la apariencia y funcionalidad de tu residencia o comercio.',
    icon: 'paint-roller',
    color: '#3E4A52',
    services: [
      {
        name: 'Pintura interior y exterior',
        shortDescription: 'Preparación de superficies, masillado y aplicación de pintura para residencias y comercios.',
        description: 'Renovamos tus espacios con acabados profesionales. Incluye evaluación de superficies, reparación de grietas, masillado, sellado y aplicación de pintura de calidad, dejando el área limpia al finalizar.',
        features: ['Preparación y lijado de superficies', 'Masillado y reparación de grietas', 'Pintura interior y exterior', 'Protección de muebles y pisos', 'Limpieza final del área'],
        icon: 'paint-roller',
        featured: true,
      },
      {
        name: 'Instalación y amueblamiento',
        shortDescription: 'Ensamblaje e instalación de mobiliario, incluyendo trabajos a la medida en melamina.',
        description: 'Armamos e instalamos mobiliario residencial y comercial. Diseñamos y fabricamos piezas a la medida en melamina: escritorios, exhibidores, closets, módulos de recepción y más.',
        features: ['Ensamblaje de muebles', 'Escritorios y exhibidores en melamina', 'Diseño a la medida', 'Nivelación y anclaje seguro'],
        icon: 'sofa',
        featured: true,
      },
      {
        name: 'Decoración y acabados',
        shortDescription: 'Terminaciones estéticas, revestimientos y adecuación visual del entorno.',
        description: 'Damos el toque final a tu espacio con revestimientos, molduras, paneles decorativos y asesoría de adecuación visual para que tu ambiente comunique lo que buscas.',
        features: ['Revestimientos y paneles', 'Molduras y detalles', 'Asesoría de ambientación', 'Acabados finos'],
        icon: 'sparkles',
      },
      {
        name: 'Instalación de cortinas y accesorios',
        shortDescription: 'Montaje de persianas, cortinas, soportes de TV y elementos decorativos de pared.',
        description: 'Instalación limpia y precisa de persianas, cortinas tradicionales, rieles, soportes de TV, repisas, cuadros y elementos decorativos.',
        features: ['Persianas y cortinas', 'Soportes de TV', 'Repisas y cuadros', 'Anclajes según tipo de pared'],
        icon: 'blinds',
      },
    ],
  },
  {
    code: 'B',
    title: 'Mantenimiento Estructural y Operativo',
    description: 'Mantenemos tus propiedades en estado óptimo y resolvemos imprevistos.',
    icon: 'wrench',
    color: '#2E4A5E',
    services: [
      {
        name: 'Mantenimiento y limpieza general',
        shortDescription: 'Limpieza profunda post-obra, limpieza general y programas de mantenimiento preventivo.',
        description: 'Planes de limpieza profunda post-obra y limpieza general de viviendas y locales, además de programas de mantenimiento preventivo para mantener tu propiedad en estado óptimo.',
        features: ['Limpieza post-obra', 'Limpieza general de viviendas', 'Planes de mantenimiento preventivo', 'Inspecciones periódicas'],
        icon: 'spray-can',
        featured: true,
      },
      {
        name: 'Plomería',
        shortDescription: 'Detección de filtraciones, instalación de griferías, sanitarios y mantenimiento de tuberías.',
        description: 'Diagnosticamos y reparamos filtraciones, instalamos griferías y sanitarios, y damos mantenimiento a tuberías y desagües.',
        features: ['Detección de filtraciones', 'Instalación de griferías', 'Instalación de sanitarios', 'Mantenimiento de tuberías'],
        icon: 'droplets',
      },
      {
        name: 'Impermeabilización',
        shortDescription: 'Tratamiento de techos y paredes para prevención y corrección de filtraciones.',
        description: 'Protegemos techos y paredes con sistemas de impermeabilización adecuados a cada superficie, previniendo y corrigiendo filtraciones.',
        features: ['Evaluación por metro cuadrado', 'Limpieza y preparación', 'Aplicación de membrana/impermeabilizante', 'Garantía del trabajo'],
        icon: 'umbrella',
        featured: true,
      },
      {
        name: 'Cerrajería',
        shortDescription: 'Instalación, cambio y reparación de cerraduras y sistemas de seguridad básicos.',
        description: 'Instalamos, cambiamos y reparamos cerraduras tradicionales, cerrojos y sistemas de seguridad básicos para hogares y comercios.',
        features: ['Cambio de cerraduras', 'Instalación de cerrojos', 'Reparaciones', 'Seguridad básica'],
        icon: 'key-round',
      },
    ],
  },
  {
    code: 'C',
    title: 'Tecnología y Sistemas Comerciales',
    description: 'Digitalizamos y mantenemos operativo tu negocio.',
    icon: 'cpu',
    color: '#4A4F5C',
    services: [
      {
        name: 'Venta e implementación de Sistemas POS',
        shortDescription: 'Software de facturación, contabilidad y gestión de recursos configurado a la medida.',
        description: 'Instalamos y configuramos sistemas de punto de venta con facturación (NCF), contabilidad, inventario y gestión de recursos, adaptados al flujo de tu comercio. Incluye capacitación.',
        features: ['Facturación con comprobantes fiscales', 'Inventario y contabilidad', 'Configuración a la medida', 'Capacitación del personal'],
        icon: 'monitor-smartphone',
        featured: true,
      },
      {
        name: 'Mantenimiento de equipos electrónicos',
        shortDescription: 'Diagnóstico, limpieza preventiva y reparación de hardware comercial y residencial.',
        description: 'Diagnóstico, limpieza preventiva y reparación correctiva de computadoras, redes, terminales POS e impresoras, en tu local o en nuestro taller.',
        features: ['Diagnóstico de hardware', 'Limpieza preventiva', 'Reparación correctiva', 'Redes y terminales'],
        icon: 'cpu',
      },
    ],
  },
];

export const SEED_FAQS = [
  { question: '¿Puedo solicitar varios servicios en una sola orden?', answer: 'Sí. Selecciona todos los servicios que necesitas y haremos un único levantamiento con una cotización unificada, un monto final y un tiempo de entrega único.' },
  { question: '¿El levantamiento tiene costo?', answer: 'Coordinamos contigo la visita presencial o una evaluación virtual. Te informaremos cualquier condición antes de agendar.' },
  { question: '¿Cómo sé cómo va mi proyecto?', answer: 'Desde tu portal "Mi cuenta" ves el estado de tu orden y recibes reportes diarios con fotos del avance, sin tener que estar en el lugar.' },
  { question: '¿Cómo puedo pagar?', answer: 'Por transferencia bancaria (subes el comprobante en tu portal) y muy pronto con tarjeta vía PayPal. La factura con comprobante fiscal se emite al finalizar.' },
  { question: '¿En qué zonas trabajan?', answer: 'Operamos en Santo Domingo y zonas cercanas. Escríbenos por WhatsApp para confirmar cobertura en tu área.' },
];
