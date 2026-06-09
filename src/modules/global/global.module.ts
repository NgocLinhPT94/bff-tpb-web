import { Module } from '@nestjs/common';
import { CmsModule } from '../../integrations/cms/cms.module';
import { GlobalController } from './global.controller';
import { GlobalService } from './global.service';

@Module({
  imports: [CmsModule],
  controllers: [GlobalController],
  providers: [GlobalService],
  exports: [GlobalService],
})
export class GlobalModule {}
