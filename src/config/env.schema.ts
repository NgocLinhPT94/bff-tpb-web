import * as Joi from 'joi';

/**
 * Joi validation schema for environment variables.
 * Ensures all required env vars are present and valid at startup.
 *
 * Integration credentials (Core Bank, CRM, SMS, reCAPTCHA) default to
 * placeholder values in development so the app boots without real backends.
 *
 * Production values MUST come from ExternalSecret -> ConfigMap/Secret (ESO/Vault).
 */
export const envSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'sit', 'uat', 'pre-prod', 'production')
    .default('development'),
  PORT: Joi.number().default(3001),
  ENABLE_SWAGGER: Joi.boolean().default(false),

  // Core Bank integration
  CORE_BANK_BASE_URL: Joi.string().uri().default('http://localhost:8080/api/core-bank'),
  CORE_BANK_API_KEY: Joi.string().default('dev-placeholder'),
  CORE_BANK_TIMEOUT: Joi.number().default(5000),

  // CRM integration
  CRM_BASE_URL: Joi.string().uri().default('http://localhost:8081/api/crm'),
  CRM_API_KEY: Joi.string().default('dev-placeholder'),
  CRM_TIMEOUT: Joi.number().default(5000),

  // SMS Gateway integration
  SMS_GATEWAY_BASE_URL: Joi.string().uri().default('http://localhost:8082/api/sms'),
  SMS_GATEWAY_API_KEY: Joi.string().default('dev-placeholder'),
  SMS_GATEWAY_SENDER_ID: Joi.string().default('TPBank'),
  SMS_GATEWAY_TIMEOUT: Joi.number().default(5000),

  // CMS integration
  CMS_BASE_URL: Joi.string().uri().default('http://localhost:1337'),
  CMS_API_TOKEN: Joi.string().default('dev-placeholder'),
  CMS_TIMEOUT: Joi.number().default(5000),
  CMS_RETRY_ATTEMPTS: Joi.number().min(0).max(1).default(1),

  // reCAPTCHA
  RECAPTCHA_SECRET_KEY: Joi.string().default('dev-placeholder'),
  RECAPTCHA_VERIFY_URL: Joi.string().uri().optional(),
  RECAPTCHA_SCORE_THRESHOLD: Joi.number().min(0).max(1).default(0.5),

  // OTP
  OTP_EXPIRY_SECONDS: Joi.number().default(300),
  OTP_MAX_ATTEMPTS: Joi.number().default(3),

  // Rate limiting
  RATE_LIMIT_TTL: Joi.number().default(60),
  RATE_LIMIT_MAX: Joi.number().default(100),

  // CORS
  CORS_ORIGINS: Joi.string().default('http://localhost:3000,http://localhost:3001'),

  // Logging
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'log', 'debug', 'verbose')
    .default('debug'),

  // Preview Mode (shared secret between FE and BFF)
  FE_INTERNAL_SECRET: Joi.string().allow('').default(''),
}).options({ allowUnknown: true });
