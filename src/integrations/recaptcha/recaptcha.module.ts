import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { RecaptchaClient } from './recaptcha.client';

/**
 * reCAPTCHA integration module — DI configuration for reCAPTCHA adapter.
 * Exports RecaptchaClient for injection into business modules (e.g., Captcha, Lead).
 */
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  providers: [RecaptchaClient],
  exports: [RecaptchaClient],
})
export class RecaptchaModule {}
