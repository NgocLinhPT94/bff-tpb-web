import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { CrmClient } from './crm.client';

/**
 * CRM integration module — DI configuration for CRM adapter.
 * Exports CrmClient for injection into business modules.
 */
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  providers: [CrmClient],
  exports: [CrmClient],
})
export class CrmModule {}
