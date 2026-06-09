import { Injectable } from '@nestjs/common';
import type { HealthCheckDto, ReadinessCheckDto } from './health.dto';

@Injectable()
export class HealthService {
  check(): HealthCheckDto {
    return { status: 'ok' };
  }

  checkReadiness(): ReadinessCheckDto {
    // TODO: Implement downstream connectivity checks
    return {
      status: 'ok',
      checks: {
        coreBank: 'ok',
        crm: 'ok',
        smsGateway: 'ok',
      },
    };
  }
}
