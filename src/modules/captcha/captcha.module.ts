import { Module } from '@nestjs/common';
import { RecaptchaModule } from '../../integrations/recaptcha/recaptcha.module';
import { CaptchaController } from './captcha.controller';
import { CaptchaService } from './captcha.service';

@Module({
  imports: [RecaptchaModule],
  controllers: [CaptchaController],
  providers: [CaptchaService],
  exports: [CaptchaService],
})
export class CaptchaModule {}
