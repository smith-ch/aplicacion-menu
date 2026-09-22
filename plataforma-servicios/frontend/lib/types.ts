export type Role = 'admin' | 'technician' | 'client';
export type OrderStatus = 'recibida' | 'en_levantamiento' | 'cotizada' | 'en_ejecucion' | 'completada' | 'cancelada';

export interface User {
  id: number; name: string; email: string; phone: string | null; documentId: string | null; address: string | null;
  role: Role; specialty: string | null; active: boolean; concrebillClientId: string | null; createdAt: string;
}

export interface Pillar {
  id: number; code: string; title: string; slug: string; description: string | null; icon: string | null; color: string | null;
  sortOrder: number; active: boolean; services?: Service[];
}

export interface Service {
  id: number; pillar: Pillar | null; name: string; slug: string; shortDescription: string; description: string | null;
  features: string[] | null; icon: string | null; imageUrl: string | null; priceFrom: string | null; priceNote: string | null;
  featured: boolean; active: boolean; sortOrder: number;
}

export interface OrderItem { id: number; service: Service | null; serviceName: string; quantity: number; notes: string | null }
export interface OrderPhoto { id: number; url: string; stage: 'antes' | 'durante' | 'despues'; caption: string | null; createdAt: string }
export interface OrderUpdate {
  id: number; status: string | null; message: string; visibleToClient: boolean; author: User | null; photos: OrderPhoto[]; createdAt: string;
}
export interface BillingDocument {
  id: number; type: 'cotizacion' | 'factura' | 'recibo'; number: string; amount: string; currency: string; status: string;
  fileUrl: string | null; concrebillId: string | null; origin: string; issuedAt: string | null; dueDate: string | null; createdAt: string;
}
export interface Payment {
  id: number; method: string; amount: string; reference: string | null; bank: string | null; receiptUrl: string | null;
  status: 'pendiente' | 'validado' | 'rechazado'; notes: string | null; concrebillPaymentId: string | null; createdAt: string;
  document: BillingDocument | null; order?: Order;
}
export interface Review {
  id: number; rating: number; punctuality: number | null; quality: number | null; cleanliness: number | null;
  communication: number | null; comment: string | null; wouldRecommend: boolean; published: boolean; createdAt: string; order?: Order;
}
export interface Order {
  id: number; code: string; client: User | null; contactName: string; contactEmail: string; contactPhone: string;
  documentId: string | null; address: string; city: string | null; propertyType: string; urgency: string; areaSize: string | null;
  preferredDate: string | null; preferredTime: string | null; visitType: string; notes: string | null; source: string;
  status: OrderStatus; technician: User | null; scheduledAt: string | null; quotedAmount: string | null;
  estimatedDelivery: string | null; paymentStatus: 'pendiente' | 'en_revision' | 'pagado'; internalNotes?: string | null;
  items: OrderItem[]; updates?: OrderUpdate[]; photos?: OrderPhoto[]; documents?: BillingDocument[]; payments?: Payment[];
  review?: Review | null; createdAt: string; updatedAt: string;
}

export interface Testimonial { id: number | string; name: string; company: string | null; text: string; rating: number; avatarUrl: string | null; active?: boolean; sortOrder?: number }
export interface Faq { id: number; question: string; answer: string; active?: boolean; sortOrder?: number }
export interface Project { id: number; title: string; description: string | null; category: string | null; beforeUrl: string | null; afterUrl: string | null; active?: boolean; sortOrder?: number }

export interface Settings {
  brand: { name: string; tagline: string; logoUrl: string; logoLightUrl: string; primaryColor: string; accentColor: string };
  hero: { eyebrow: string; title: string; subtitle: string; ctaPrimary: string; ctaSecondary: string; imageUrl: string; highlights: string[] };
  about: { title: string; text: string; stats: { value: string; label: string }[] };
  process: { title: string; subtitle: string; phases: { title: string; steps: string[] }[] };
  contact: { whatsapp: string; whatsappMessage: string; phone: string; email: string; address: string; hours: string; instagram: string; facebook: string };
  payments: { currency: string; transferInstructions: string; bankAccounts: { bank: string; type: string; number: string; holder: string; rnc: string }[]; paypalEnabled: boolean };
  seo: { title: string; description: string };
}

export interface SiteContent { settings: Settings; testimonials: Testimonial[]; faqs: Faq[]; projects: Project[] }
