import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { SmsGatewayClient } from './sms-gateway.client';

/**
 * SMS Gateway integration module — DI configuration for SMS adapter.
 * Exports SmsGatewayClient for injection into business modules (e.g., OTP).
 */
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  providers: [SmsGatewayClient],
  exports: [SmsGatewayClient],
})
export class SmsGatewayModule {}
