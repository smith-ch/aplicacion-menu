import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq, Lead, Project, Review, SiteSetting, Testimonial } from '../entities';
import { ContentController } from './content.controller';
import { createCrudController } from './crud.factory';

const TestimonialsController = createCrudController('testimonials', Testimonial,
  ['name', 'company', 'text', 'rating', 'avatarUrl', 'active', 'sortOrder']);
const FaqsController = createCrudController('faqs', Faq, ['question', 'answer', 'active', 'sortOrder']);
const ProjectsController = createCrudController('projects', Project,
  ['title', 'description', 'category', 'beforeUrl', 'afterUrl', 'active', 'sortOrder']);

@Module({
  imports: [TypeOrmModule.forFeature([SiteSetting, Testimonial, Faq, Project, Lead, Review])],
  controllers: [ContentController, TestimonialsController, FaqsController, ProjectsController],
})
export class ContentModule {}
