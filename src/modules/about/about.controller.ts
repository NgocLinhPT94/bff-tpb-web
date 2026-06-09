import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessEnvelopeDto, ErrorEnvelopeDto } from '../../common/dto';
import { EmptyQueryDto } from '../../common/query';
import type { RequestWithId } from '../../common/http/request-with-id';
import { createSuccessEnvelope } from '../../common/utils/response-envelope';
import type { AboutDto } from './about.dto';
import { AboutService } from './about.service';

@ApiTags('About')
@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  @ApiOperation({ summary: 'Get about page content' })
  @ApiResponse({
    status: 200,
    description: 'About page content retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'About page not found',
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
  ): Promise<SuccessEnvelopeDto<AboutDto>> {
    return createSuccessEnvelope(
      request,
      await this.aboutService.findOne(),
    );
  }
}
