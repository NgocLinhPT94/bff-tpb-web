import { Injectable } from '@nestjs/common';
import type {
  CalculateLoanDto,
  CalculateInterestDto,
  LoanResultDto,
  InterestResultDto,
} from './calculator.dto';

@Injectable()
export class CalculatorService {
  // TODO: Implement loan calculation logic

  async calculateLoan(_dto: CalculateLoanDto): Promise<LoanResultDto> {
    throw new Error('Not implemented');
  }

  async calculateInterest(_dto: CalculateInterestDto): Promise<InterestResultDto> {
    throw new Error('Not implemented');
  }
}
