import { registerAs } from '@nestjs/config';
import type { NodeEnv } from './validation';

export interface AppConfig {
  port: number;
  nodeEnv: NodeEnv;
  isProduction: boolean;
  enableSwagger: boolean;
}

export default registerAs(
  'app',
  (): AppConfig => ({
    // Defaults are supplied by src/config/validation.ts before this factory runs.
    port: Number(process.env.PORT),
    nodeEnv: process.env.NODE_ENV as NodeEnv,
    isProduction: process.env.NODE_ENV === 'production',
    enableSwagger: process.env.ENABLE_SWAGGER === 'true',
  }),
);
