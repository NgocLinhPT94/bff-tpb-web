import { Module } from '@nestjs/common';
import { CoreBankModule } from '../../integrations/core-bank/core-bank.module';
import { RatesController } from './rates.controller';
import { RatesService } from './rates.service';

@Module({
  imports: [CoreBankModule],
  controllers: [RatesController],
  providers: [RatesService],
  exports: [RatesService],
})
export class RatesModule {}
