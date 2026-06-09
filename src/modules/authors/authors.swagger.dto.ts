import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaSummarySwaggerDto } from '../../common/swagger/common.swagger.dto.js';

/**
 * Author DTO for Swagger documentation.
 */
export class AuthorSwaggerDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'author-001',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'Author full name',
    example: 'Nguyen Van A',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Author email address',
    example: 'nguyenvana@tpbank.vn',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Author title / position',
    example: 'Senior Financial Editor',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Author biography',
    example: 'Nguyen Van A is a senior financial editor with 10 years of experience.',
  })
  bio?: string;

  @ApiPropertyOptional({
    description: 'Author avatar image',
    type: MediaSummarySwaggerDto,
  })
  avatar?: MediaSummarySwaggerDto | null;
}
