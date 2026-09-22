import { User } from './user.entity';
import { Pillar } from './pillar.entity';
import { ServiceItem } from './service.entity';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrderUpdate } from './order-update.entity';
import { OrderPhoto } from './order-photo.entity';
import { Review } from './review.entity';
import { BillingDocument } from './document.entity';
import { Payment } from './payment.entity';
import { Faq, IntegrationLog, Lead, Project, SiteSetting, Testimonial } from './content.entity';

export {
  User, Pillar, ServiceItem, Order, OrderItem, OrderUpdate, OrderPhoto, Review, BillingDocument, Payment,
  Faq, IntegrationLog, Lead, Project, SiteSetting, Testimonial,
};

export const ENTITIES = [
  User, Pillar, ServiceItem, Order, OrderItem, OrderUpdate, OrderPhoto, Review, BillingDocument, Payment,
  Faq, IntegrationLog, Lead, Project, SiteSetting, Testimonial,
];
