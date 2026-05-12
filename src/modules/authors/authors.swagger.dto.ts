import { ApiPropertyOptional } from '@nestjs/swagger';
import { MediaSummaryDto } from '../../common/swagger/common.swagger.dto';

/**
 * Author DTO for Swagger documentation.
 */
export class AuthorDto {
  @ApiPropertyOptional({
    description: 'Unique document identifier',
    example: 'author-001',
  })
  documentId?: string;

  @ApiPropertyOptional({
    description: 'Author name',
    example: 'John Doe',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Author email',
    example: 'john.doe@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Author avatar image',
    type: MediaSummaryDto,
  })
  avatar?: MediaSummaryDto | null;
}
