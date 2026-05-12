import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Express, NextFunction, Response } from 'express';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

import type { RequestWithId } from './common/http/request-with-id';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import type { AppConfig } from './config/app.config';
import type { SecurityConfig } from './config/security.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const appConfig = configService.getOrThrow<AppConfig>('app');
  const securityConfig = configService.getOrThrow<SecurityConfig>('security');
  const requestIdMiddleware = new RequestIdMiddleware();
  const expressApp = app.getHttpAdapter().getInstance() as Express;

  app.useLogger(app.get(Logger));
  expressApp.use(
    (request: RequestWithId, response: Response, next: NextFunction) => {
      requestIdMiddleware.use(request, response, next);
    },
  );
  expressApp.use(
    (request: RequestWithId, response: Response, next: NextFunction) => {
      if (
        !request.originalUrl.startsWith('/api/v1') ||
        request.method === 'GET' ||
        request.method === 'OPTIONS'
      ) {
        next();
        return;
      }

      response.status(405).json({
        error: {
          code: 'METHOD_NOT_ALLOWED',
          message: 'Method not allowed',
          requestId: request.requestId ?? '',
        },
      });
    },
  );
  app.setGlobalPrefix('api/v1');
  expressApp.use(helmet());
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || securityConfig.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin not allowed by CORS'));
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: appConfig.isProduction,
    }),
  );

  // Swagger/OpenAPI documentation - only in non-production or when explicitly enabled
  if (!appConfig.isProduction || appConfig.enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('BFF TPBank Web API')
      .setDescription(
        'Backend for Frontend API for TPBank website. Provides read-only access to CMS content with envelope-based responses.',
      )
      .setVersion('1.0.0')
      .addServer('/api/v1', 'API v1')
      .addTag('Articles', 'Blog articles and news content')
      .addTag('Authors', 'Article authors')
      .addTag('Categories', 'Content categories')
      .addTag('Products', 'Banking products')
      .addTag('Promotions', 'Promotional campaigns')
      .addTag('FAQs', 'Frequently asked questions')
      .addTag('Pages', 'CMS pages')
      .addTag('Navigation', 'Site navigation structures')
      .addTag('Global', 'Global site settings')
      .addTag('About', 'About page content')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // Swagger UI at /api/docs (note: not /api/docs-json)
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: 'BFF TPBank Web API Docs',
    });

    // Raw JSON spec at /api/docs-json
    expressApp.get('/api/docs-json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(document);
    });
  }

  await app.listen(appConfig.port);
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
