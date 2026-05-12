import { Module } from '@nestjs/common';
import { StrapiModule } from '../../infrastructure/strapi/strapi.module';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';

@Module({
  imports: [StrapiModule],
  controllers: [AboutController],
  providers: [AboutService],
})
export class AboutModule {}
