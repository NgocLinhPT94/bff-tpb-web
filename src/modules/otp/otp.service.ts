import { Injectable } from '@nestjs/common';
import { SmsGatewayClient } from '../../integrations/sms-gateway/sms-gateway.client';
import type {
  SendOtpDto,
  VerifyOtpDto,
  OtpSendResultDto,
  OtpVerifyResultDto,
} from './otp.dto';

@Injectable()
export class OtpService {
  constructor(private readonly smsGatewayClient: SmsGatewayClient) {}

  async send(_dto: SendOtpDto): Promise<OtpSendResultDto> {
    // TODO: implement using this.smsGatewayClient.sendSms()
    throw new Error('Not implemented');
  }

  async verify(_dto: VerifyOtpDto): Promise<OtpVerifyResultDto> {
    // TODO: implement OTP verification logic
    throw new Error('Not implemented');
  }
}
