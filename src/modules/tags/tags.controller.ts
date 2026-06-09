import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SuccessEnvelopeDto, ErrorEnvelopeDto } from '../../common/dto';
import { EmptyQueryDto, ListQueryDto } from '../../common/query';
import type { RequestWithId } from '../../common/http/request-with-id';
import { createSuccessEnvelope } from '../../common/utils/response-envelope';
import type { TagDto } from './tags.dto';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tags with pagination' })
  @ApiResponse({ status: 200, description: 'List of tags retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 429, description: 'Too many requests', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 502, description: 'Bad gateway - CMS unavailable', type: ErrorEnvelopeDto })
  async findAll(
    @Query() query: ListQueryDto,
    @Req() request: RequestWithId,
  ): Promise<SuccessEnvelopeDto<TagDto[]>> {
    const result = await this.tagsService.findAll(query);
    return createSuccessEnvelope(request, result.data, result.pagination);
  }

  @Get(':documentId')
  @ApiOperation({ summary: 'Get a single tag by document ID' })
  @ApiParam({ name: 'documentId', description: 'Tag document ID' })
  @ApiResponse({ status: 200, description: 'Tag retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tag not found', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 405, description: 'Method not allowed', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 429, description: 'Too many requests', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 502, description: 'Bad gateway - CMS unavailable', type: ErrorEnvelopeDto })
  async findOne(
    @Param('documentId') documentId: string,
    @Query() _query: EmptyQueryDto,
    @Req() request: RequestWithId,
  ): Promise<SuccessEnvelopeDto<TagDto>> {
    return createSuccessEnvelope(
      request,
      await this.tagsService.findOne(documentId),
    );
  }
}
