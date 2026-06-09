import { Injectable } from '@nestjs/common';
import { CoreBankClient } from '../../integrations/core-bank/core-bank.client';
import type { RatesResponseDto } from './rates.dto';

@Injectable()
export class RatesService {
  constructor(private readonly coreBankClient: CoreBankClient) {}

  async getCurrentRates(): Promise<RatesResponseDto[]> {
    // TODO: implement using this.coreBankClient.getRates()
    throw new Error('Not implemented');
  }
}
