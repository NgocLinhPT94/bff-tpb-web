import { Module } from '@nestjs/common';
import { StrapiModule } from '../../infrastructure/strapi/strapi.module';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';

@Module({
  imports: [StrapiModule],
  controllers: [PagesController],
  providers: [PagesService],
})
export class PagesModule {}
