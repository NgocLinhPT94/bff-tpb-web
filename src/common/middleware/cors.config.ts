import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

/**
 * CORS configuration factory.
 * Allowed origins are loaded from environment variables.
 * Production: only www.tpb.vn is allowed.
 * Development: localhost origins are permitted.
 *
 * Usage in main.ts:
 *   app.enableCors(getCorsConfig(app.get(ConfigService)));
 */
export function getCorsConfig(configService: ConfigService): CorsOptions {
  const origins = configService.get<string[]>('cors.origins') ?? [];

  return {
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true,
    maxAge: 86400, // 24 hours preflight cache
  };
}
