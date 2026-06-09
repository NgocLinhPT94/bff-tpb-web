import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * About page DTO for Swagger documentation.
 */
export class AboutSwaggerDto {
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

  @ApiPropertyOptional({
    description: 'Dynamic content blocks',
    example: [{ type: 'rich-text', content: 'TPBank was founded in...' }],
  })
  blocks?: unknown[];
}
