import { Controller, Get, Patch, Param, ParseIntPipe, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { OrderStatus, PaymentRecordStatus, Role } from '../common/enums';
import { Roles } from '../common/roles.decorator';
import { IntegrationLog, Lead, Order, Payment, Review } from '../entities';

@Controller('admin')
@Roles(Role.ADMIN)
export class DashboardController {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
    @InjectRepository(Lead) private readonly leads: Repository<Lead>,
    @InjectRepository(IntegrationLog) private readonly logs: Repository<IntegrationLog>,
  ) {}

  @Get('dashboard')
  async dashboard() {
    const since = new Date(Date.now() - 7 * 864e5);
    const [byStatusRaw, bySourceRaw, newThisWeek, pendingPayments, avg, reviewCount, openLeads, recent] = await Promise.all([
      this.orders.createQueryBuilder('o').select('o.status', 'status').addSelect('COUNT(*)', 'count').groupBy('o.status').getRawMany(),
      this.orders.createQueryBuilder('o').select('o.source', 'source').addSelect('COUNT(*)', 'count').groupBy('o.source').getRawMany(),
      this.orders.count({ where: { createdAt: MoreThanOrEqual(since) } }),
      this.payments.count({ where: { status: PaymentRecordStatus.PENDING } }),
      this.reviews.createQueryBuilder('r').select('AVG(r.rating)', 'avg').getRawOne(),
      this.reviews.count(),
      this.leads.count({ where: { handled: false } }),
      this.orders.find({ relations: { technician: true, items: true }, order: { createdAt: 'DESC' }, take: 8 }),
    ]);
    const byStatus = Object.fromEntries(Object.values(OrderStatus).map((s) => [s, 0]));
    for (const r of byStatusRaw) byStatus[r.status] = Number(r.count);
    return {
      byStatus,
      bySource: Object.fromEntries(bySourceRaw.map((r) => [r.source, Number(r.count)])),
      newThisWeek,
      pendingPayments,
      avgRating: avg?.avg ? Number(Number(avg.avg).toFixed(2)) : null,
      reviewCount,
      openLeads,
      recent,
    };
  }

  @Get('reviews')
  listReviews() {
    return this.reviews.find({ relations: { order: true }, order: { createdAt: 'DESC' } });
  }

  @Patch('reviews/:id')
  async publishReview(@Param('id', ParseIntPipe) id: number, @Body() body: { published: boolean }) {
    await this.reviews.update(id, { published: !!body.published });
    return this.reviews.findOne({ where: { id }, relations: { order: true } });
  }

  @Get('integration-logs')
  integrationLogs() {
    return this.logs.find({ order: { createdAt: 'DESC' }, take: 100 });
  }
}
