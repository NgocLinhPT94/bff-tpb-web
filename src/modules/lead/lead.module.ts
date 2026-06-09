import { Module } from '@nestjs/common';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { CmsModule } from '../../integrations/cms/cms.module';
import { CrmModule } from '../../integrations/crm/crm.module';

/**
 * Lead module — fan-out to both CMS and CRM on lead submission.
 * Flow: POST /lead → LeadService → [CmsClient, CrmClient] in parallel.
 */
@Module({
  imports: [CmsModule, CrmModule],
  controllers: [LeadController],
  providers: [LeadService],
  exports: [LeadService],
})
export class LeadModule {}
