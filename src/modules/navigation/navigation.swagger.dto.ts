import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaSummarySwaggerDto } from '../../common/swagger/common.swagger.dto.js';

/**
 * Navigation item summary DTO for Swagger documentation.
 */
export class NavigationItemSummarySwaggerDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'nav-item-001',
  })
  documentId!: string;

  @ApiPropertyOptional({ description: 'Navigation item name', example: 'personal-banking' })
  name?: string;

  @ApiPropertyOptional({ description: 'Display title', example: 'Personal Banking' })
  title?: string;

  @ApiPropertyOptional({ description: 'Navigation URL', example: '/personal-banking' })
  url?: string;

  @ApiPropertyOptional({ description: 'Sort order', example: 1 })
  order?: number;

  @ApiPropertyOptional({ description: 'Navigation item icon', type: MediaSummarySwaggerDto })
  icon?: MediaSummarySwaggerDto;

  @ApiPropertyOptional({
    description: 'Child navigation items',
    type: () => [NavigationItemSummarySwaggerDto],
  })
  children?: NavigationItemSummarySwaggerDto[];
}

/**
 * Navigation link DTO for Swagger documentation.
 */
export class NavigationLinkSwaggerDto {
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
    type: MediaSummarySwaggerDto,
  })
  icon?: MediaSummarySwaggerDto;
}

/**
 * Navigation button DTO for Swagger documentation.
 */
export class NavigationButtonSwaggerDto {
  @ApiPropertyOptional({
    description: 'Button label',
    example: 'Open Account',
  })
  label?: string;

  @ApiPropertyOptional({
    description: 'Button URL',
    example: '/open-account',
  })
  url?: string;

  @ApiPropertyOptional({
    description: 'Button style (primary, secondary, outline)',
    example: 'primary',
  })
  style?: string;
}

/**
 * Navigation DTO for Swagger documentation.
 */
export class NavigationSwaggerDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'nav-001',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'Navigation name',
    example: 'main-navigation',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Menu type identifier',
    enum: ['header', 'footer', 'mobile', 'h-khcc', 'f-khcc'],
    example: 'header',
  })
  type_menu?: string;

  @ApiPropertyOptional({
    description: 'Whether the navigation is enabled',
    example: true,
  })
  on_off?: boolean | null;

  @ApiProperty({
    description: 'Navigation items',
    type: [NavigationItemSummarySwaggerDto],
  })
  navigation_items!: NavigationItemSummarySwaggerDto[];

  @ApiProperty({
    description: 'Social/share icon links',
    type: [NavigationLinkSwaggerDto],
  })
  iconshare!: NavigationLinkSwaggerDto[];

  @ApiProperty({
    description: 'Shared buttons',
    type: [NavigationButtonSwaggerDto],
  })
  ButtonShare!: NavigationButtonSwaggerDto[];
}
