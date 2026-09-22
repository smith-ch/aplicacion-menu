import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { IsNull, Repository } from 'typeorm';
import { Role } from '../common/enums';
import { ConcrebillService } from '../concrebill/concrebill.service';
import { Order, User } from '../entities';
import { LoginDto, RegisterDto, UpdateProfileDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    private readonly jwt: JwtService,
    private readonly concrebill: ConcrebillService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    if (await this.users.exist({ where: { email } })) throw new ConflictException('Ya existe una cuenta con ese correo');
    const user = await this.users.save(this.users.create({
      name: dto.name.trim(),
      email,
      passwordHash: await bcrypt.hash(dto.password, 10),
      phone: dto.phone ?? null,
      documentId: dto.documentId ?? null,
      address: dto.address ?? null,
      role: Role.CLIENT,
    }));
    // Vincula órdenes hechas como invitado con el mismo correo
    await this.orders.update({ contactEmail: email, client: IsNull() }, { client: { id: user.id } });
    await this.syncClient(user);
    return this.session(user);
  }

  async login(dto: LoginDto) {
    const user = await this.users.createQueryBuilder('u').addSelect('u.passwordHash')
      .where('u.email = :email', { email: dto.email.toLowerCase().trim() }).getOne();
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }
    if (!user.active) throw new UnauthorizedException('Tu cuenta está desactivada');
    return this.session(user);
  }

  async me(id: number) {
    const user = await this.users.findOneBy({ id });
    if (!user) throw new UnauthorizedException();
    return user;
  }

  async updateProfile(id: number, dto: UpdateProfileDto) {
    const user = await this.users.createQueryBuilder('u').addSelect('u.passwordHash').where('u.id = :id', { id }).getOne();
    if (!user) throw new UnauthorizedException();
    if (dto.newPassword) {
      if (!dto.currentPassword || !(await bcrypt.compare(dto.currentPassword, user.passwordHash))) {
        throw new BadRequestException('La contraseña actual no es correcta');
      }
      user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    }
    for (const k of ['name', 'phone', 'documentId', 'address'] as const) {
      if (dto[k] !== undefined) user[k] = dto[k] as string;
    }
    await this.users.save(user);
    if (user.role === Role.CLIENT) await this.syncClient(user);
    return this.me(id);
  }

  /** Sincroniza el perfil del cliente con Concrebill (crea o actualiza). */
  async syncClient(user: User) {
    const id = await this.concrebill.upsertClient({
      name: user.name, email: user.email, phone: user.phone, documentId: user.documentId, address: user.address,
      externalId: `web-${user.id}`,
    }, user.concrebillClientId);
    if (id && id !== user.concrebillClientId) await this.users.update(user.id, { concrebillClientId: id });
  }

  private session(user: User) {
    const token = this.jwt.sign({ sub: user.id, email: user.email, role: user.role, name: user.name });
    const { passwordHash: _omit, ...safe } = user;
    return { token, user: safe };
  }
}
