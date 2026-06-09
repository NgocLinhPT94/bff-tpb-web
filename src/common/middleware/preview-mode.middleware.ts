import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response, NextFunction } from 'express';
import type { RequestWithId } from '../http/request-with-id';

/**
 * Middleware that enables preview/draft mode for CMS content.
 *
 * When the frontend sends:
 * - `x-preview-mode: draft` header
 * - `x-internal-token: <shared-secret>` header
 *
 * The request is marked as draft mode (req.isDraft = true),
 * allowing services to fetch unpublished content from CMS.
 */
@Injectable()
export class PreviewModeMiddleware implements NestMiddleware {
  private readonly feInternalSecret: string;

  constructor(configService: ConfigService) {
    this.feInternalSecret = configService.get<string>('feInternalSecret') ?? '';
  }

  use(req: RequestWithId, _res: Response, next: NextFunction): void {
    const previewHeader = req.headers['x-preview-mode'] as string | undefined;

    if (previewHeader === 'draft') {
      const internalToken = req.headers['x-internal-token'] as
        | string
        | undefined;

      if (!this.feInternalSecret || internalToken !== this.feInternalSecret) {
        throw new ForbiddenException('Invalid preview token');
      }

      req.isDraft = true;
    } else {
      req.isDraft = false;
    }

    next();
  }
}
