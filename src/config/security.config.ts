import { registerAs } from '@nestjs/config';

export interface SecurityConfig {
  corsOrigins: string[];
  throttleTtlMs: number;
  throttleLimit: number;
}

const parseCorsOrigins = (origins: string | undefined): string[] =>
  (origins ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

export default registerAs(
  'security',
  (): SecurityConfig => ({
    // Empty CORS_ORIGINS intentionally disables browser origins by defaulting to an empty allowlist.
    corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
    throttleTtlMs: Number(process.env.THROTTLE_TTL_MS),
    throttleLimit: Number(process.env.THROTTLE_LIMIT),
  }),
);
