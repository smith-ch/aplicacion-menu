import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Repository } from 'typeorm';
import { Role } from '../common/enums';
import { Public, Roles } from '../common/roles.decorator';
import { Faq, Lead, Project, Review, SiteSetting, Testimonial } from '../entities';
import { SETTING_KEYS } from './settings.defaults';

class LeadDto {
  @IsString() @MinLength(2) @MaxLength(120) name: string;
  @IsString() @MinLength(7) @MaxLength(30) phone: string;
  @IsOptional() @IsEmail() email?: string;
  @IsString() @MinLength(3) @MaxLength(2000) message: string;
}

@Controller()
export class ContentController {
  constructor(
    @InjectRepository(SiteSetting) private readonly settings: Repository<SiteSetting>,
    @InjectRepository(Testimonial) private readonly testimonials: Repository<Testimonial>,
    @InjectRepository(Faq) private readonly faqs: Repository<Faq>,
    @InjectRepository(Project) private readonly projects: Repository<Project>,
    @InjectRepository(Lead) private readonly leads: Repository<Lead>,
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
  ) {}

  /** Todo el contenido público de la landing en una sola llamada. */
  @Public() @Get('content')
  async content() {
    const [settings, testimonials, faqs, projects, reviews] = await Promise.all([
      this.settingsMap(),
      this.testimonials.find({ where: { active: true }, order: { sortOrder: 'ASC' } }),
      this.faqs.find({ where: { active: true }, order: { sortOrder: 'ASC' } }),
      this.projects.find({ where: { active: true }, order: { sortOrder: 'ASC', id: 'DESC' } }),
      this.reviews.find({ where: { published: true }, relations: { order: true }, order: { createdAt: 'DESC' }, take: 12 }),
    ]);
    // Las evaluaciones publicadas por el admin también se muestran como testimonios
    const fromReviews = reviews.filter((r) => r.comment).map((r) => ({
      id: `r${r.id}`, name: r.order?.contactName ?? 'Cliente', company: null, text: r.comment, rating: r.rating, avatarUrl: null,
    }));
    return { settings, testimonials: [...testimonials, ...fromReviews], faqs, projects };
  }

  @Public() @Post('leads')
  async createLead(@Body() dto: LeadDto) {
    await this.leads.save(this.leads.create(dto));
    return { ok: true };
  }

  // ---------- Administración ----------

  @Roles(Role.ADMIN) @Get('admin/settings')
  settingsAdmin() {
    return this.settingsMap();
  }

  @Roles(Role.ADMIN) @Put('admin/settings/:key')
  async saveSetting(@Param('key') key: string, @Body() value: Record<string, unknown>) {
    if (!SETTING_KEYS.includes(key)) throw new BadRequestException('Sección de configuración desconocida');
    await this.settings.save({ key, value });
    return value;
  }

  @Roles(Role.ADMIN) @Get('admin/leads')
  listLeads() {
    return this.leads.find({ order: { createdAt: 'DESC' } });
  }

  @Roles(Role.ADMIN) @Patch('admin/leads/:id')
  async handleLead(@Param('id', ParseIntPipe) id: number, @Body() body: { handled: boolean }) {
    await this.leads.update(id, { handled: !!body.handled });
    return this.leads.findOneBy({ id });
  }

  private async settingsMap() {
    const rows = await this.settings.find();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }
}
