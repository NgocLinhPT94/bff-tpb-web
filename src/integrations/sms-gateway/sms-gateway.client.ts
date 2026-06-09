import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

/**
 * SMS Gateway HTTP adapter — handles all communication with the SMS Gateway.
 * This is the ONLY place that makes HTTP calls to SMS Gateway.
 * Business modules inject this client via DI and never call SMS Gateway directly.
 *
 * Responsibilities:
 * - HTTP request/response handling
 * - Error mapping (external errors -> domain exceptions)
 * - Timeout and retry logic
 */
@Injectable()
export class SmsGatewayClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeout: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.getOrThrow<string>('smsGateway.baseUrl');
    this.apiKey = this.configService.getOrThrow<string>('smsGateway.apiKey');
    this.timeout = this.configService.get<number>('smsGateway.timeout') ?? 5000;
  }

  // TODO: Implement SMS Gateway API methods
  // async sendSms(dto: SendSmsDto): Promise<SmsResponseDto> { ... }
  // async checkDeliveryStatus(messageId: string): Promise<SmsStatusDto> { ... }
}
