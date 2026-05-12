import { Module } from '@nestjs/common';
import { StrapiModule } from '../../infrastructure/strapi/strapi.module';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

@Module({
  imports: [StrapiModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
