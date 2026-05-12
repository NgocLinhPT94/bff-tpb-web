import { Module } from '@nestjs/common';
import { StrapiModule } from '../../infrastructure/strapi/strapi.module';
import { FaqsController } from './faqs.controller';
import { FaqsService } from './faqs.service';

@Module({
  imports: [StrapiModule],
  controllers: [FaqsController],
  providers: [FaqsService],
})
export class FaqsModule {}
