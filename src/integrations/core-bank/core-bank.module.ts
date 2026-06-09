import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { CoreBankClient } from './core-bank.client';

/**
 * Core Bank integration module — DI configuration for Core Bank adapter.
 * Exports CoreBankClient for injection into business modules.
 */
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  providers: [CoreBankClient],
  exports: [CoreBankClient],
})
export class CoreBankModule {}
