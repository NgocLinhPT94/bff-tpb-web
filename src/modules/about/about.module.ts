import { Module } from '@nestjs/common';
import { CmsModule } from '../../integrations/cms/cms.module';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';

@Module({
  imports: [CmsModule],
  controllers: [AboutController],
  providers: [AboutService],
  exports: [AboutService],
})
export class AboutModule {}
