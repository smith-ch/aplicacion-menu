import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Role } from '../common/enums';
import { slugify } from '../common/utils';
import { DEFAULT_SETTINGS } from '../content/settings.defaults';
import { Faq, Pillar, ServiceItem, SiteSetting, User } from '../entities';
import { SEED_CATALOG, SEED_FAQS } from './seed.data';

/** Carga inicial: administrador, catálogo de los 3 pilares, contenido de la landing y FAQ. */
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Pillar) private readonly pillars: Repository<Pillar>,
    @InjectRepository(ServiceItem) private readonly services: Repository<ServiceItem>,
    @InjectRepository(SiteSetting) private readonly settings: Repository<SiteSetting>,
    @InjectRepository(Faq) private readonly faqs: Repository<Faq>,
  ) {}

  async onApplicationBootstrap() {
    if (!(await this.users.exist({ where: { role: Role.ADMIN } }))) {
      const email = this.config.get('ADMIN_EMAIL', 'admin@fisc.com.do').toLowerCase();
      await this.users.save(this.users.create({
        name: this.config.get('ADMIN_NAME', 'Administrador'), email, role: Role.ADMIN,
        passwordHash: await bcrypt.hash(this.config.get('ADMIN_PASSWORD', 'Admin123!'), 10),
      }));
      this.logger.log(`Administrador inicial creado: ${email}`);
    }

    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      if (!(await this.settings.exist({ where: { key } }))) await this.settings.save({ key, value });
    }

    if ((await this.pillars.count()) === 0) {
      for (const [pi, p] of SEED_CATALOG.entries()) {
        const pillar = await this.pillars.save(this.pillars.create({
          code: p.code, title: p.title, slug: slugify(p.title), description: p.description, icon: p.icon, color: p.color, sortOrder: pi,
        }));
        for (const [si, s] of p.services.entries()) {
          await this.services.save(this.services.create({ ...s, slug: slugify(s.name), pillar, sortOrder: si, featured: !!s.featured }));
        }
      }
      this.logger.log('Catálogo inicial cargado');
    }

    if ((await this.faqs.count()) === 0) {
      await this.faqs.save(SEED_FAQS.map((f, i) => this.faqs.create({ ...f, sortOrder: i })));
    }
  }
}
