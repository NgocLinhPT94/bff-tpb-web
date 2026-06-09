import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SuccessEnvelopeDto, ErrorEnvelopeDto } from '../../common/dto';
import { EmptyQueryDto, ListQueryDto } from '../../common/query';
import type { RequestWithId } from '../../common/http/request-with-id';
import { createSuccessEnvelope } from '../../common/utils/response-envelope';
import type { ProductDto } from './products.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully',
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
  ): Promise<SuccessEnvelopeDto<ProductDto[]>> {
    const response = await this.productsService.findAll(query);

    return createSuccessEnvelope(
      request,
      response.data,
      response.pagination,
    );
  }

  @Get(':documentId')
  @ApiOperation({ summary: 'Get a single product by document ID' })
  @ApiParam({
    name: 'documentId',
    description: 'Product document ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid document ID',
    type: ErrorEnvelopeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
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
  ): Promise<SuccessEnvelopeDto<ProductDto>> {
    const product = await this.productsService.findOne(documentId);

    return createSuccessEnvelope(request, product);
  }
}
