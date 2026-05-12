import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SuccessEnvelopeDto, ErrorEnvelopeDto } from '../../common/dto';
import { EmptyQueryDto, ListQueryDto } from '../../common/query';
import type { RequestWithId } from '../../common/http/request-with-id';
import { createSuccessEnvelope } from '../shared/response-envelope';
import { ArticlesService } from './articles.service';
import type { ArticleDto } from './articles.mapper';
import { ArticleDto as ArticleSwaggerDto } from './articles.swagger.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all articles with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of articles retrieved successfully',
    type: () => SuccessEnvelopeDto<ArticleSwaggerDto[]>,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
    type: ErrorEnvelopeDto,
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests',
    type: ErrorEnvelopeDto,
  })
  @ApiResponse({
    status: 502,
    description: 'Bad gateway - CMS unavailable',
    type: ErrorEnvelopeDto,
  })
  async findAll(
    @Query() query: ListQueryDto,
    @Req() request: RequestWithId,
  ): Promise<SuccessEnvelopeDto<ArticleDto[]>> {
    const result = await this.articlesService.findAll(query);

    return createSuccessEnvelope(request, result.data, result.pagination);
  }

  @Get(':documentId')
  @ApiOperation({ summary: 'Get a single article by document ID' })
  @ApiParam({
    name: 'documentId',
    description: 'Article document ID',
    example: 'article-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Article retrieved successfully',
    type: () => SuccessEnvelopeDto<ArticleSwaggerDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid document ID',
    type: ErrorEnvelopeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Article not found',
    type: ErrorEnvelopeDto,
  })
  @ApiResponse({
    status: 405,
    description: 'Method not allowed',
    type: ErrorEnvelopeDto,
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests',
    type: ErrorEnvelopeDto,
  })
  @ApiResponse({
    status: 502,
    description: 'Bad gateway - CMS unavailable',
    type: ErrorEnvelopeDto,
  })
  async findOne(
    @Param('documentId') documentId: string,
    @Query() _query: EmptyQueryDto,
    @Req() request: RequestWithId,
  ): Promise<SuccessEnvelopeDto<ArticleDto>> {
    return createSuccessEnvelope(
      request,
      await this.articlesService.findOne(documentId),
    );
  }
}
