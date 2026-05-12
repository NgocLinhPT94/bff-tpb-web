import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * About page DTO for Swagger documentation.
 */
export class AboutDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'about-001',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'Page title',
    example: 'About TPBank',
  })
  title?: string;

  @ApiProperty({
    description: 'Page content blocks',
    example: [{ type: 'section', title: 'Our Story', content: '...' }],
  })
  blocks!: unknown[];
}
