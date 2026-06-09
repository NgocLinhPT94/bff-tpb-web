import { Module } from '@nestjs/common';
import { SmsGatewayModule } from '../../integrations/sms-gateway/sms-gateway.module';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';

@Module({
  imports: [SmsGatewayModule],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
