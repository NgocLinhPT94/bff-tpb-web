import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class CalculateLoanDto {
  @ApiProperty({ example: 500000000, description: 'Loan amount (VND)' })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty({ example: 7.5, description: 'Annual interest rate (%)' })
  @IsNumber()
  @IsPositive()
  @Max(100)
  annualRate!: number;

  @ApiProperty({ example: 12, description: 'Loan term in months' })
  @IsNumber()
  @Min(1)
  termMonths!: number;
}

export class CalculateInterestDto {
  @ApiProperty({ example: 100000000, description: 'Deposit amount (VND)' })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty({ example: 4.8, description: 'Annual interest rate (%)' })
  @IsNumber()
  @IsPositive()
  @Max(100)
  annualRate!: number;

  @ApiProperty({ example: 6, description: 'Term in months' })
  @IsNumber()
  @Min(1)
  termMonths!: number;

  @ApiPropertyOptional({ example: 'end', description: 'Interest payment method (end, monthly)' })
  @IsOptional()
  paymentMethod?: string;
}

export class LoanScheduleItemDto {
  @ApiProperty({ example: 1, description: 'Period number' })
  period!: number;

  @ApiProperty({ example: 42500000, description: 'Monthly payment (VND)' })
  payment!: number;

  @ApiProperty({ example: 3125000, description: 'Interest portion (VND)' })
  interest!: number;

  @ApiProperty({ example: 39375000, description: 'Principal portion (VND)' })
  principal!: number;

  @ApiProperty({ example: 460625000, description: 'Remaining balance (VND)' })
  remainingBalance!: number;
}

export class LoanResultDto {
  @ApiProperty({ example: 510000000, description: 'Total payment amount (VND)' })
  totalPayment!: number;

  @ApiProperty({ example: 10000000, description: 'Total interest (VND)' })
  totalInterest!: number;

  @ApiProperty({ example: 42500000, description: 'Monthly payment (VND)' })
  monthlyPayment!: number;

  @ApiProperty({ type: [LoanScheduleItemDto], description: 'Repayment schedule' })
  schedule!: LoanScheduleItemDto[];
}

export class InterestResultDto {
  @ApiProperty({ example: 2400000, description: 'Total interest earned (VND)' })
  totalInterest!: number;

  @ApiProperty({ example: 102400000, description: 'Total amount at maturity (VND)' })
  totalAmount!: number;
}
