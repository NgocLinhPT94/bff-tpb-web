import { Module } from '@nestjs/common';
import { StrapiModule } from '../../infrastructure/strapi/strapi.module';
import { GlobalController } from './global.controller';
import { GlobalService } from './global.service';

@Module({
  imports: [StrapiModule],
  controllers: [GlobalController],
  providers: [GlobalService],
})
export class GlobalModule {}
