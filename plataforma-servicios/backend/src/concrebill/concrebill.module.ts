import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationLog } from '../entities';
import { ConcrebillService } from './concrebill.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([IntegrationLog])],
  providers: [ConcrebillService],
  exports: [ConcrebillService],
})
export class ConcrebillModule {}
