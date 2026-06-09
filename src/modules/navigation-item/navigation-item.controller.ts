import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SuccessEnvelopeDto, ErrorEnvelopeDto } from '../../common/dto';
import type { RequestWithId } from '../../common/http/request-with-id';
import { EmptyQueryDto, ListQueryDto } from '../../common/query';
import { createSuccessEnvelope } from '../../common/utils/response-envelope';
import type { NavigationItemDto } from './navigation-item.dto';
import { NavigationItemService } from './navigation-item.service';

@ApiTags('Navigation')
@Controller('navigation-items')
export class NavigationItemController {
  constructor(private readonly navigationItemService: NavigationItemService) {}

  @Get()
  @ApiOperation({ summary: 'Get all navigation items with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of navigation items retrieved successfully',
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
  ): Promise<SuccessEnvelopeDto<NavigationItemDto[]>> {
    const response = await this.navigationItemService.findAll(query);
    return createSuccessEnvelope(request, response.data, response.pagination);
  }

  @Get(':documentId')
  @ApiOperation({ summary: 'Get a single navigation item by document ID' })
  @ApiParam({
    name: 'documentId',
    description: 'Navigation item document ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Navigation item retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid document ID',
    type: ErrorEnvelopeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Navigation item not found',
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
  ): Promise<SuccessEnvelopeDto<NavigationItemDto>> {
    return createSuccessEnvelope(
      request,
      await this.navigationItemService.findOne(documentId),
    );
  }
}
