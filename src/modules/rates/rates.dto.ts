import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RateItemDto {
  @ApiProperty({ example: '1 tháng', description: 'Tenor / term label' })
  tenor!: string;

  @ApiProperty({ example: 4.8, description: 'Interest rate (% per year)' })
  rate!: number;

  @ApiPropertyOptional({ example: 'online', description: 'Channel (online, counter, etc.)' })
  channel?: string;
}

export class RatesResponseDto {
  @ApiProperty({ example: 'deposit', description: 'Rate category (deposit, loan, etc.)' })
  category!: string;

  @ApiProperty({ example: '2026-06-02T00:00:00.000Z', description: 'Effective date (ISO 8601)' })
  effectiveDate!: string;

  @ApiProperty({ type: [RateItemDto], description: 'List of rate items' })
  items!: RateItemDto[];
}
