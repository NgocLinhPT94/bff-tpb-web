import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  MediaSummaryDto,
  SeoDto,
} from '../../common/swagger/common.swagger.dto';

/**
 * Global site settings DTO for Swagger documentation.
 */
export class GlobalDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'global-001',
  })
  documentId!: string;

  @ApiProperty({
    description: 'Site name',
    example: 'TPBank',
  })
  siteName!: string;

  @ApiProperty({
    description: 'Site description',
    example: 'TPBank Digital Banking Services',
  })
  siteDescription!: string;

  @ApiPropertyOptional({
    description: 'Customer hotline number',
    example: '1800585885',
  })
  hotline?: string;

  @ApiPropertyOptional({
    description: 'Contact email',
    example: 'support@tpbank.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Physical address',
    example: 'Hanoi, Vietnam',
  })
  address?: string;

  @ApiPropertyOptional({
    description: 'Analytics script blocks',
    example: [{ type: 'script', code: '...' }],
  })
  analytics_script?: unknown[];

  @ApiPropertyOptional({
    description: 'Site favicon',
    type: MediaSummaryDto,
  })
  favicon?: MediaSummaryDto;

  @ApiPropertyOptional({
    description: 'Site logo',
    type: MediaSummaryDto,
  })
  logo?: MediaSummaryDto;

  @ApiPropertyOptional({
    description: 'Default SEO settings',
    type: SeoDto,
  })
  defaultSeo?: SeoDto;
}
