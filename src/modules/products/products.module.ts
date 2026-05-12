import { Module } from '@nestjs/common';
import { StrapiModule } from '../../infrastructure/strapi/strapi.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [StrapiModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
