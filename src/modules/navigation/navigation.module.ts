import { Module } from '@nestjs/common';
import { StrapiModule } from '../../infrastructure/strapi/strapi.module';
import { NavigationController } from './navigation.controller';
import { NavigationService } from './navigation.service';

@Module({
  imports: [StrapiModule],
  controllers: [NavigationController],
  providers: [NavigationService],
})
export class NavigationModule {}
