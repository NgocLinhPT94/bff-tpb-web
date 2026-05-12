import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Media summary DTO for Swagger documentation.
 * Represents a media file (image, document) in the CMS.
 */
export class MediaSummaryDto {
  @ApiPropertyOptional({
    description: 'Public URL to the file',
    example: 'https://cdn.example.com/uploads/banner-image.jpg',
  })
  url?: string;

  @ApiPropertyOptional({
    description: 'Alternative text for accessibility',
    example: 'Hero banner showing banking services',
  })
  alternativeText?: string | null;

  @ApiPropertyOptional({
    description: 'Image width in pixels',
    example: 1920,
  })
  width?: number;

  @ApiPropertyOptional({
    description: 'Image height in pixels',
    example: 1080,
  })
  height?: number;

  @ApiPropertyOptional({
    description: 'Responsive image formats (thumbnail, small, medium, large)',
    example: { thumbnail: { url: '...', width: 156, height: 156 } },
  })
  formats?: unknown;
}

/**
 * Relation summary DTO for Swagger documentation.
 * Represents a simplified reference to another entity.
 */
export class RelationSummaryDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'abc123',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'Entity name',
    example: 'John Doe',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Entity title',
    example: 'Chief Executive Officer',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Label or display text',
    example: 'Contact Us',
  })
  label?: string;

  @ApiPropertyOptional({
    description: 'URL slug',
    example: 'john-doe',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'URL',
    example: '/about/team/john-doe',
  })
  url?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 1,
  })
  order?: number;

  @ApiPropertyOptional({
    description: 'Menu type identifier',
    example: 'main',
  })
  type_menu?: string;
}

/**
 * SEO metadata DTO for Swagger documentation.
 */
export class SeoDto {
  @ApiPropertyOptional({
    description: 'Meta title for SEO',
    example: 'TPBank - Digital Banking Services',
  })
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'Meta description for SEO',
    example: 'Experience modern banking with TPBank digital services.',
  })
  metaDescription?: string;

  @ApiPropertyOptional({
    description: 'Social share image',
    type: MediaSummaryDto,
  })
  shareImage?: MediaSummaryDto;
}

/**
 * Link DTO for Swagger documentation.
 * Used in navigation and footer links.
 */
export class LinkDto {
  @ApiPropertyOptional({
    description: 'Link label',
    example: 'Facebook',
  })
  label?: string;

  @ApiPropertyOptional({
    description: 'Link URL',
    example: 'https://facebook.com/tpbank',
  })
  url?: string;

  @ApiPropertyOptional({
    description: 'Whether the link opens in a new tab',
    example: true,
  })
  external?: boolean | null;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 1,
  })
  order?: number;

  @ApiPropertyOptional({
    description: 'Link icon',
    type: MediaSummaryDto,
  })
  icon?: MediaSummaryDto;
}

/**
 * Button DTO for Swagger documentation.
 */
export class ButtonDto {
  @ApiPropertyOptional({
    description: 'Button label',
    example: 'Learn More',
  })
  label?: string;

  @ApiPropertyOptional({
    description: 'Button URL',
    example: '/products/digital-banking',
  })
  url?: string;

  @ApiPropertyOptional({
    description: 'Button style (primary, secondary, outline)',
    example: 'primary',
  })
  style?: string;
}
