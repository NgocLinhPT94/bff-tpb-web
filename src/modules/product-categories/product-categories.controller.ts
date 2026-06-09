import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SuccessEnvelopeDto, ErrorEnvelopeDto } from '../../common/dto';
import type { RequestWithId } from '../../common/http/request-with-id';
import { EmptyQueryDto, ListQueryDto } from '../../common/query';
import { createSuccessEnvelope } from '../../common/utils/response-envelope';
import { ProductCategoriesService } from './product-categories.service';
import type { ProductCategoryDto } from './product-categories.dto';

@ApiTags('Product Categories')
@Controller('product-categories')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all product categories with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of product categories retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 429, description: 'Too many requests', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 502, description: 'Bad gateway - CMS unavailable', type: ErrorEnvelopeDto })
  async findAll(
    @Query() query: ListQueryDto,
    @Req() request: RequestWithId,
  ): Promise<SuccessEnvelopeDto<ProductCategoryDto[]>> {
    const result = await this.productCategoriesService.findAll(query);
    return createSuccessEnvelope(request, result.data, result.pagination);
  }

  @Get(':documentId')
  @ApiOperation({ summary: 'Get a single product category by document ID' })
  @ApiParam({ name: 'documentId', description: 'Product category document ID' })
  @ApiResponse({ status: 200, description: 'Product category retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid document ID', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 404, description: 'Product category not found', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 405, description: 'Method not allowed', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 429, description: 'Too many requests', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 502, description: 'Bad gateway - CMS unavailable', type: ErrorEnvelopeDto })
  async findOne(
    @Param('documentId') documentId: string,
    @Query() _query: EmptyQueryDto,
    @Req() request: RequestWithId,
  ): Promise<SuccessEnvelopeDto<ProductCategoryDto>> {
    return createSuccessEnvelope(
      request,
      await this.productCategoriesService.findOne(documentId),
    );
  }
}
