import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities';
import { UsersController } from './users.controller';

@Module({ imports: [TypeOrmModule.forFeature([User])], controllers: [UsersController] })
export class UsersModule {}
