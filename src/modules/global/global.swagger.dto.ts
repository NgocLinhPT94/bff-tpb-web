import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  MediaSummarySwaggerDto,
  SeoSwaggerDto,
} from '../../common/swagger/common.swagger.dto.js';

/**
 * Global site settings DTO for Swagger documentation.
 */
export class GlobalSwaggerDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'global-001',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'Site name',
    example: 'TPBank',
  })
  siteName?: string;

  @ApiPropertyOptional({
    description: 'Site description',
    example: 'TPBank - Digital Banking Services',
  })
  siteDescription?: string;

  @ApiPropertyOptional({
    description: 'Customer support hotline',
    example: '1900 6060 00',
  })
  hotline?: string;

  @ApiPropertyOptional({
    description: 'Contact email address',
    example: 'support@tpbank.vn',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Office address',
    example: '57 Ly Thuong Kiet, Hoan Kiem, Ha Noi',
  })
  address?: string;

  @ApiPropertyOptional({
    description: 'Analytics tracking scripts',
    example: [{ type: 'script', src: 'https://analytics.example.com/tag.js' }],
  })
  analytics_script?: unknown[];

  @ApiPropertyOptional({
    description: 'Site favicon',
    type: MediaSummarySwaggerDto,
  })
  favicon?: MediaSummarySwaggerDto;

  @ApiPropertyOptional({
    description: 'Site logo',
    type: MediaSummarySwaggerDto,
  })
  logo?: MediaSummarySwaggerDto;

  @ApiPropertyOptional({
    description: 'Default SEO metadata',
    type: SeoSwaggerDto,
  })
  defaultSeo?: SeoSwaggerDto;
}
