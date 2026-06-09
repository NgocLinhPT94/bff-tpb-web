import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessEnvelopeDto, ErrorEnvelopeDto } from '../../common/dto';
import { EmptyQueryDto } from '../../common/query';
import type { RequestWithId } from '../../common/http/request-with-id';
import { createSuccessEnvelope } from '../../common/utils/response-envelope';
import type { GlobalDto } from './global.dto';
import { GlobalService } from './global.service';

@ApiTags('Global')
@Controller('global')
export class GlobalController {
  constructor(private readonly globalService: GlobalService) {}

  @Get()
  @ApiOperation({ summary: 'Get global site settings' })
  @ApiResponse({
    status: 200,
    description: 'Global settings retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Global settings not found',
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
    @Query() _query: EmptyQueryDto,
    @Req() request: RequestWithId,
  ): Promise<SuccessEnvelopeDto<GlobalDto>> {
    return createSuccessEnvelope(
      request,
      await this.globalService.findOne(),
    );
  }
}
