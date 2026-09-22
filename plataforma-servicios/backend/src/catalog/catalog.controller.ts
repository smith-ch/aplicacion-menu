import {
  Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../common/enums';
import { Public, Roles } from '../common/roles.decorator';
import { slugify } from '../common/utils';
import { Pillar, ServiceItem } from '../entities';
import { PillarDto, ServiceDto } from './catalog.dto';

@Controller()
export class CatalogController {
  constructor(
    @InjectRepository(Pillar) private readonly pillars: Repository<Pillar>,
    @InjectRepository(ServiceItem) private readonly services: Repository<ServiceItem>,
  ) {}

  // ---------- Público ----------

  /** Pilares activos con sus servicios activos (para la landing y el catálogo). */
  @Public() @Get('catalog')
  async catalog() {
    const pillars = await this.pillars.find({ where: { active: true }, relations: { services: true }, order: { sortOrder: 'ASC' } });
    return pillars.map((p) => ({
      ...p,
      services: (p.services ?? []).filter((s) => s.active).sort((a, b) => a.sortOrder - b.sortOrder),
    }));
  }

  @Public() @Get('services')
  listServices(@Query('featured') featured?: string) {
    return this.services.find({
      where: { active: true, ...(featured === 'true' ? { featured: true } : {}) },
      order: { sortOrder: 'ASC' },
    });
  }

  @Public() @Get('services/:slug')
  async getService(@Param('slug') slug: string) {
    const service = await this.services.findOneBy({ slug, active: true });
    if (!service) throw new NotFoundException('Servicio no encontrado');
    return service;
  }

  // ---------- Administración ----------

  @Roles(Role.ADMIN) @Get('admin/pillars')
  adminPillars() {
    return this.pillars.find({ order: { sortOrder: 'ASC' } });
  }

  @Roles(Role.ADMIN) @Post('admin/pillars')
  createPillar(@Body() dto: PillarDto) {
    return this.pillars.save(this.pillars.create({ ...dto, slug: dto.slug || slugify(dto.title) }));
  }

  @Roles(Role.ADMIN) @Patch('admin/pillars/:id')
  async updatePillar(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<PillarDto>) {
    const pillar = await this.pillars.findOneBy({ id });
    if (!pillar) throw new NotFoundException();
    Object.assign(pillar, dto);
    return this.pillars.save(pillar);
  }

  @Roles(Role.ADMIN) @Delete('admin/pillars/:id')
  async deletePillar(@Param('id', ParseIntPipe) id: number) {
    await this.pillars.delete(id);
    return { ok: true };
  }

  @Roles(Role.ADMIN) @Get('admin/services')
  adminServices() {
    return this.services.find({ order: { sortOrder: 'ASC', id: 'ASC' } });
  }

  @Roles(Role.ADMIN) @Post('admin/services')
  async createService(@Body() dto: ServiceDto) {
    const { pillarId, ...rest } = dto;
    const slug = await this.uniqueSlug(dto.slug || dto.name);
    const saved = await this.services.save(this.services.create({
      ...rest,
      slug,
      priceFrom: rest.priceFrom != null ? String(rest.priceFrom) : null,
      pillar: pillarId ? { id: pillarId } : null,
    }));
    return this.services.findOneBy({ id: saved.id });
  }

  @Roles(Role.ADMIN) @Patch('admin/services/:id')
  async updateService(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<ServiceDto>) {
    const service = await this.services.findOneBy({ id });
    if (!service) throw new NotFoundException();
    const { pillarId, priceFrom, slug, ...rest } = dto;
    Object.assign(service, rest);
    if (pillarId !== undefined) service.pillar = pillarId ? ({ id: pillarId } as Pillar) : null;
    if (priceFrom !== undefined) service.priceFrom = priceFrom != null ? String(priceFrom) : null;
    if (slug && slug !== service.slug) service.slug = await this.uniqueSlug(slug);
    await this.services.save(service);
    return this.services.findOneBy({ id });
  }

  @Roles(Role.ADMIN) @Delete('admin/services/:id')
  async deleteService(@Param('id', ParseIntPipe) id: number) {
    await this.services.delete(id);
    return { ok: true };
  }

  private async uniqueSlug(text: string) {
    const base = slugify(text) || 'servicio';
    let slug = base;
    for (let i = 2; await this.services.exist({ where: { slug } }); i++) slug = `${base}-${i}`;
    return slug;
  }
}
