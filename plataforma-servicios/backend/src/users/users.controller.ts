import {
  BadRequestException, Body, ConflictException, Controller, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { AuthUser, CurrentUser } from '../common/current-user.decorator';
import { Role } from '../common/enums';
import { Roles } from '../common/roles.decorator';
import { User } from '../entities';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Controller('admin/users')
@Roles(Role.ADMIN)
export class UsersController {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  @Get()
  list(@Query('role') role?: Role, @Query('q') q?: string) {
    const qb = this.users.createQueryBuilder('u').orderBy('u.createdAt', 'DESC');
    if (role) qb.andWhere('u.role = :role', { role });
    if (q) qb.andWhere('(LOWER(u.name) LIKE :q OR LOWER(u.email) LIKE :q OR u.phone LIKE :q)', { q: `%${q.toLowerCase()}%` });
    return qb.getMany();
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const email = dto.email.toLowerCase().trim();
    if (await this.users.exist({ where: { email } })) throw new ConflictException('Ese correo ya está registrado');
    const { password, ...rest } = dto;
    const saved = await this.users.save(this.users.create({ ...rest, email, passwordHash: await bcrypt.hash(password, 10) }));
    return this.users.findOneBy({ id: saved.id });
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto, @CurrentUser() me: AuthUser) {
    const user = await this.users.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (id === me.id && (dto.active === false || (dto.role && dto.role !== Role.ADMIN))) {
      throw new BadRequestException('No puedes desactivarte ni quitarte el rol de administrador');
    }
    const { password, ...rest } = dto;
    if (rest.email) rest.email = rest.email.toLowerCase().trim();
    Object.assign(user, rest);
    const patch: Partial<User> = { ...user };
    if (password) patch.passwordHash = await bcrypt.hash(password, 10);
    await this.users.save(patch);
    return this.users.findOneBy({ id });
  }
}
