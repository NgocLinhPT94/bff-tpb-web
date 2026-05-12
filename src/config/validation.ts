import Joi from 'joi';

export type NodeEnv = 'development' | 'production' | 'test';

export interface EnvConfig {
  PORT: number;
  NODE_ENV: NodeEnv;
  STRAPI_BASE_URL: string;
  STRAPI_API_TOKEN: string;
  CORS_ORIGINS: string;
  THROTTLE_TTL_MS: number;
  THROTTLE_LIMIT: number;
  STRAPI_TIMEOUT_MS: number;
  STRAPI_RETRY_ATTEMPTS: number;
  ENABLE_SWAGGER: boolean;
}

const httpUrlValidator = (value: string, helpers: Joi.CustomHelpers) => {
  try {
    const url = new URL(value);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return helpers.error('string.uriCustomScheme');
    }

    return value;
  } catch {
    return helpers.error('string.uri');
  }
};

export const validationSchema = Joi.object<EnvConfig>({
  PORT: Joi.number().port().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  STRAPI_BASE_URL: Joi.string()
    .trim()
    .required()
    .default('http://localhost:1337/api')
    .custom(httpUrlValidator, 'HTTP(S) URL validation'),
  STRAPI_API_TOKEN: Joi.string().allow('').default(''),
  CORS_ORIGINS: Joi.string()
    .allow('')
    .default('http://localhost:3000,http://localhost:5173'),
  THROTTLE_TTL_MS: Joi.number().integer().positive().default(60000),
  THROTTLE_LIMIT: Joi.number().integer().positive().default(120),
  STRAPI_TIMEOUT_MS: Joi.number().integer().positive().default(5000),
  STRAPI_RETRY_ATTEMPTS: Joi.number().integer().min(0).max(1).default(1),
  ENABLE_SWAGGER: Joi.boolean().default(false),
});

export const validate = (config: Record<string, unknown>): EnvConfig => {
  const validationResult = validationSchema.validate(config, {
    abortEarly: false,
    allowUnknown: true,
    convert: true,
  });
  const error = validationResult.error;

  if (error) {
    throw new Error(`Environment validation failed: ${error.message}`);
  }

  return validationResult.value;
};
