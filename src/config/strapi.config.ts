import { registerAs } from '@nestjs/config';

export interface StrapiConfig {
  baseUrl: string;
  apiToken?: string;
  timeoutMs: number;
  retryAttempts: number;
}

export default registerAs(
  'strapi',
  (): StrapiConfig => ({
    // Defaults are validated in src/config/validation.ts; outbound URLs never come from users.
    baseUrl: process.env.STRAPI_BASE_URL ?? 'http://localhost:1337/api',
    apiToken: process.env.STRAPI_API_TOKEN || undefined,
    timeoutMs: Number(process.env.STRAPI_TIMEOUT_MS),
    retryAttempts: Number(process.env.STRAPI_RETRY_ATTEMPTS),
  }),
);
