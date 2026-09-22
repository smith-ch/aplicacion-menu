import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pillar, ServiceItem } from '../entities';
import { CatalogController } from './catalog.controller';

@Module({ imports: [TypeOrmModule.forFeature([Pillar, ServiceItem])], controllers: [CatalogController] })
export class CatalogModule {}
