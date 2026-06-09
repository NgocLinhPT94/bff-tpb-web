import { Module } from '@nestjs/common';
import { CmsModule } from '../../integrations/cms/cms.module';
import { NavigationItemController } from './navigation-item.controller';
import { NavigationItemService } from './navigation-item.service';

@Module({
  imports: [CmsModule],
  controllers: [NavigationItemController],
  providers: [NavigationItemService],
  exports: [NavigationItemService],
})
export class NavigationItemModule {}
