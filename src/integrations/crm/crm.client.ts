import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

/**
 * CRM HTTP adapter — handles all communication with the CRM system.
 * This is the ONLY place that makes HTTP calls to CRM.
 * Business modules inject this client via DI and never call CRM directly.
 *
 * Responsibilities:
 * - HTTP request/response handling
 * - Error mapping (external errors -> domain exceptions)
 * - Timeout and retry logic
 */
@Injectable()
export class CrmClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeout: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.getOrThrow<string>('crm.baseUrl');
    this.apiKey = this.configService.getOrThrow<string>('crm.apiKey');
    this.timeout = this.configService.get<number>('crm.timeout') ?? 5000;
  }

  // TODO: Implement CRM API methods
  // async createLead(dto: CrmCreateLeadDto): Promise<CrmLeadResponseDto> { ... }
  // async updateLead(id: string, dto: CrmUpdateLeadDto): Promise<CrmLeadResponseDto> { ... }
}
