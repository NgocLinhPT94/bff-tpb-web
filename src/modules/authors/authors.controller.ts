import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SuccessEnvelopeDto, ErrorEnvelopeDto } from '../../common/dto';
import { EmptyQueryDto, ListQueryDto } from '../../common/query';
import type { RequestWithId } from '../../common/http/request-with-id';
import { createSuccessEnvelope } from '../../common/utils/response-envelope';
import { AuthorsService } from './authors.service';
import type { AuthorDto } from './authors.dto';

@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all authors with pagination' })
  @ApiResponse({ status: 200, description: 'List of authors retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 429, description: 'Too many requests', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 502, description: 'Bad gateway - CMS unavailable', type: ErrorEnvelopeDto })
  async findAll(
    @Query() query: ListQueryDto,
    @Req() request: RequestWithId,
  ): Promise<SuccessEnvelopeDto<AuthorDto[]>> {
    const result = await this.authorsService.findAll(query);
    return createSuccessEnvelope(request, result.data, result.pagination);
  }

  @Get(':documentId')
  @ApiOperation({ summary: 'Get a single author by document ID' })
  @ApiParam({ name: 'documentId', description: 'Author document ID' })
  @ApiResponse({ status: 200, description: 'Author retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid document ID', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 404, description: 'Author not found', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 405, description: 'Method not allowed', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 429, description: 'Too many requests', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 502, description: 'Bad gateway - CMS unavailable', type: ErrorEnvelopeDto })
  async findOne(
    @Param('documentId') documentId: string,
    @Query() _query: EmptyQueryDto,
    @Req() request: RequestWithId,
  ): Promise<SuccessEnvelopeDto<AuthorDto>> {
    return createSuccessEnvelope(
      request,
      await this.authorsService.findOne(documentId),
    );
  }
}
