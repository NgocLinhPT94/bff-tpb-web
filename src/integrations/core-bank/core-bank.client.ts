import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

/**
 * Core Bank HTTP adapter — handles all communication with the Core Banking API.
 * This is the ONLY place that makes HTTP calls to Core Bank.
 * Business modules inject this client via DI and never call Core Bank directly.
 *
 * Responsibilities:
 * - HTTP request/response handling
 * - Error mapping (external errors -> domain exceptions)
 * - Timeout and retry logic
 * - Request/response logging
 */
@Injectable()
export class CoreBankClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeout: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.getOrThrow<string>('coreBank.baseUrl');
    this.apiKey = this.configService.getOrThrow<string>('coreBank.apiKey');
    this.timeout = this.configService.get<number>('coreBank.timeout') ?? 5000;
  }

  // TODO: Implement Core Bank API methods
  // async getRates(): Promise<CoreBankRatesDto> { ... }
  // async getAccountInfo(accountId: string): Promise<CoreBankAccountDto> { ... }
  // async submitTransaction(dto: CoreBankTransactionDto): Promise<CoreBankTransactionResultDto> { ... }
}
