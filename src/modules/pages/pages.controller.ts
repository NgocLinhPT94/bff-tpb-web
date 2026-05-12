import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SuccessEnvelopeDto, ErrorEnvelopeDto } from '../../common/dto';
import type { RequestWithId } from '../../common/http/request-with-id';
import { EmptyQueryDto, ListQueryDto } from '../../common/query';
import { buildListMeta, buildRequestMeta } from '../shared/response-envelope';
import type { PageDto } from './pages.mapper';
import { PagesService } from './pages.service';
import { PageDto as PageSwaggerDto } from './pages.swagger.dto';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all pages with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of pages retrieved successfully',
    type: () => SuccessEnvelopeDto<PageSwaggerDto[]>,
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
  ): Promise<SuccessEnvelopeDto<PageDto[]>> {
    const response = await this.pagesService.findAll(query);
    return new SuccessEnvelopeDto(
      response.data,
      buildListMeta(request, response),
    );
  }

  @Get(':documentId')
  @ApiOperation({ summary: 'Get a single page by document ID' })
  @ApiParam({
    name: 'documentId',
    description: 'Page document ID',
    example: 'page-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Page retrieved successfully',
    type: () => SuccessEnvelopeDto<PageSwaggerDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid document ID',
    type: ErrorEnvelopeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Page not found',
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
  ): Promise<SuccessEnvelopeDto<PageDto>> {
    const data = await this.pagesService.findOne(documentId);
    return new SuccessEnvelopeDto(data, buildRequestMeta(request));
  }
}
