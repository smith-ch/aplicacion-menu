import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BillingDocument, Order, OrderPhoto, OrderUpdate, Payment, Review, ServiceItem, User } from '../entities';
import { OrdersController, StaffOrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderUpdate, OrderPhoto, ServiceItem, Review, BillingDocument, Payment, User]),
    AuthModule,
  ],
  controllers: [OrdersController, StaffOrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
