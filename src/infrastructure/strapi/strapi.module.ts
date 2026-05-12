import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { StrapiConfig } from '../../config/strapi.config';
import { StrapiClient } from './strapi.client';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.getOrThrow<StrapiConfig>('strapi');

        return {
          baseURL: config.baseUrl,
          timeout: config.timeoutMs,
          maxRedirects: 0,
          headers: config.apiToken
            ? { Authorization: `Bearer ${config.apiToken}` }
            : undefined,
        };
      },
    }),
  ],
  providers: [StrapiClient],
  exports: [StrapiClient],
})
export class StrapiModule {}
