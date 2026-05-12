import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaSummaryDto } from '../../common/swagger/common.swagger.dto';

/**
 * Navigation item summary DTO for Swagger documentation.
 */
export class NavigationItemSummaryDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'nav-item-001',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'Navigation item name',
    example: 'Products',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Navigation item title',
    example: 'Our Products',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Navigation URL',
    example: '/products',
  })
  url?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 1,
  })
  order?: number;

  @ApiPropertyOptional({
    description: 'Navigation item icon',
    type: MediaSummaryDto,
  })
  icon?: MediaSummaryDto;
}

/**
 * Link DTO for Swagger documentation.
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
    example: 'Contact Us',
  })
  label?: string;

  @ApiPropertyOptional({
    description: 'Button URL',
    example: '/contact',
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
export class NavigationDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'nav-001',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'Navigation name',
    example: 'Main Menu',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Menu type identifier',
    example: 'main',
  })
  type_menu?: string;

  @ApiPropertyOptional({
    description: 'Whether the navigation is enabled',
    example: true,
  })
  on_off?: boolean | null;

  @ApiProperty({
    description: 'Navigation items',
    type: [NavigationItemSummaryDto],
  })
  navigation_items!: NavigationItemSummaryDto[];

  @ApiProperty({
    description: 'Social share icons',
    type: [LinkDto],
  })
  iconshare!: LinkDto[];

  @ApiProperty({
    description: 'Call-to-action buttons',
    type: [ButtonDto],
  })
  ButtonShare!: ButtonDto[];
}
