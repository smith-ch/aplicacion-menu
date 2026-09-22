import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { AuthGuard } from './common/auth.guard';
import { ConcrebillModule } from './concrebill/concrebill.module';
import { ContentModule } from './content/content.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { ENTITIES, Faq, IntegrationLog, Lead, Order, Payment, Pillar, Review, ServiceItem, SiteSetting, User } from './entities';
import { OrdersModule } from './orders/orders.module';
import { PaypalController } from './payments/paypal.controller';
import { SeedService } from './seed/seed.service';
import { UPLOAD_DIR } from './uploads/upload.options';
import { UploadsController } from './uploads/uploads.controller';
import { UsersModule } from './users/users.module';

function databaseConfig(config: ConfigService): TypeOrmModuleOptions {
  const synchronize = config.get('DB_SYNCHRONIZE', 'true') === 'true';
  if (config.get('DB_TYPE') === 'postgres') {
    return { type: 'postgres', url: config.get('DATABASE_URL'), entities: ENTITIES, synchronize };
  }
  const database = config.get('DB_SQLITE_PATH', 'data/plataforma.sqlite');
  mkdirSync(dirname(database), { recursive: true });
  return { type: 'better-sqlite3', database, entities: ENTITIES, synchronize };
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ inject: [ConfigService], useFactory: databaseConfig }),
    TypeOrmModule.forFeature([User, Pillar, ServiceItem, SiteSetting, Faq, Order, Payment, Review, Lead, IntegrationLog]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'dev-secret-cambiar'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '7d') },
      }),
    }),
    ServeStaticModule.forRoot({ rootPath: resolve(UPLOAD_DIR), serveRoot: '/uploads', serveStaticOptions: { index: false } }),
    ConcrebillModule,
    AuthModule,
    UsersModule,
    CatalogModule,
    ContentModule,
    OrdersModule,
  ],
  controllers: [UploadsController, PaypalController, DashboardController],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }, SeedService],
})
export class AppModule {}
