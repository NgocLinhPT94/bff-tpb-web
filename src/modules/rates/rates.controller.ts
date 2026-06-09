import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RatesService } from './rates.service';
import { RatesResponseDto } from './rates.dto';

@ApiTags('Rates')
@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get()
  @ApiOperation({ summary: 'Get current interest rates' })
  @ApiResponse({ status: 200, description: 'Current rates retrieved', type: [RatesResponseDto] })
  @ApiResponse({ status: 502, description: 'Upstream service unavailable' })
  async getRates(): Promise<RatesResponseDto[]> {
    return this.ratesService.getCurrentRates();
  }
}
