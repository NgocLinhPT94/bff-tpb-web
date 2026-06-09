import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckDto {
  @ApiProperty({ example: 'ok', description: 'Service status' })
  status!: string;
}

export class ReadinessCheckDto {
  @ApiProperty({ example: 'ok', description: 'Overall readiness status' })
  status!: string;

  @ApiProperty({
    example: { coreBank: 'ok', crm: 'ok', smsGateway: 'ok' },
    description: 'Downstream service connectivity checks',
  })
  checks!: Record<string, string>;
}
