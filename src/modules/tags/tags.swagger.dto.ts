import { ApiProperty } from '@nestjs/swagger';

/**
 * Tag DTO for Swagger documentation.
 */
export class TagSwaggerDto {
  @ApiProperty({ description: 'Unique document identifier', example: 'tag-001' })
  documentId!: string;

  @ApiProperty({ description: 'Tag name', example: 'Digital Banking' })
  name!: string;

  @ApiProperty({ description: 'URL slug', example: 'digital-banking' })
  slug!: string;
}
