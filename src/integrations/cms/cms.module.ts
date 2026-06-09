import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CmsClient } from './cms.client';

/**
 * CMS integration module — DI configuration for CMS adapter.
 *
 * Exports CmsClient for injection into:
 * - CMS content modules (read: articles, products, pages, etc.)
 * - Lead module (write: lead submissions)
 */
@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const baseUrl = configService.get<string>('cms.baseUrl') ?? 'http://localhost:1337';
        const apiToken = configService.get<string>('cms.apiToken') ?? '';
        const timeout = configService.get<number>('cms.timeout') ?? 5000;

        return {
          baseURL: `${baseUrl}/api`,
          timeout,
          maxRedirects: 0,
          headers: apiToken
            ? { Authorization: `Bearer ${apiToken}` }
            : undefined,
        };
      },
    }),
  ],
  providers: [CmsClient],
  exports: [CmsClient],
})
export class CmsModule {}
