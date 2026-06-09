import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CalculatorService } from './calculator.service';
import {
  CalculateLoanDto,
  CalculateInterestDto,
  LoanResultDto,
  InterestResultDto,
} from './calculator.dto';

@ApiTags('Calculator')
@Controller('calculator')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Post('loan')
  @ApiOperation({ summary: 'Calculate loan repayment schedule' })
  @ApiResponse({ status: 200, description: 'Loan calculation result', type: LoanResultDto })
  @ApiResponse({ status: 400, description: 'Invalid input parameters' })
  async calculateLoan(@Body() dto: CalculateLoanDto): Promise<LoanResultDto> {
    return this.calculatorService.calculateLoan(dto);
  }

  @Post('interest')
  @ApiOperation({ summary: 'Calculate deposit interest' })
  @ApiResponse({ status: 200, description: 'Interest calculation result', type: InterestResultDto })
  @ApiResponse({ status: 400, description: 'Invalid input parameters' })
  async calculateInterest(@Body() dto: CalculateInterestDto): Promise<InterestResultDto> {
    return this.calculatorService.calculateInterest(dto);
  }
}
