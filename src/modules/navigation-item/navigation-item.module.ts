import { Module } from '@nestjs/common';
import { StrapiModule } from '../../infrastructure/strapi/strapi.module';
import { NavigationItemController } from './navigation-item.controller';
import { NavigationItemService } from './navigation-item.service';

@Module({
  imports: [StrapiModule],
  controllers: [NavigationItemController],
  providers: [NavigationItemService],
})
export class NavigationItemModule {}
