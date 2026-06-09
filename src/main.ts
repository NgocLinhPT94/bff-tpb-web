import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { getCorsConfig } from './common/middleware/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Use pino as the application logger
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);

  // Global API prefix — all routes under /api/v1
  app.setGlobalPrefix('api/v1', {
    exclude: ['health', 'health/ready'],
  });

  // Security headers via helmet
  app.use(helmet());

  // CORS — allowed origins from config
  app.enableCors(getCorsConfig(configService));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger / OpenAPI
  const enableSwagger = configService.get<boolean>('enableSwagger') ?? false;
  if (enableSwagger) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('TPB Web BFF API')
      .setDescription(
        'Backend-For-Frontend service for TPB corporate website (www.tpb.vn). ' +
        'Provides read-only CMS content access and write operations (lead submission, OTP, calculator).',
      )
      .setVersion('1.0.0')
      .addBearerAuth()
      // CMS content tags (read-only)
      .addTag('Articles', 'Blog articles and news content')
      .addTag('Authors', 'Article authors')
      .addTag('Categories', 'Content categories')
      .addTag('Products', 'Banking products')
      .addTag('Product Categories', 'Product category groups')
      .addTag('Promotions', 'Promotional campaigns')
      .addTag('FAQs', 'Frequently asked questions')
      .addTag('Pages', 'CMS pages')
      .addTag('Navigation', 'Site navigation structures')
      .addTag('Global', 'Global site settings')
      .addTag('About', 'About page content')
      .addTag('Tags', 'Content tags for filtering')
      // Write operation tags
      .addTag('Lead', 'Lead submission endpoints')
      .addTag('Calculator', 'Financial calculator endpoints')
      .addTag('Rates', 'Interest rates endpoints')
      .addTag('OTP', 'OTP verification endpoints')
      .addTag('Captcha', 'Captcha verification endpoints')
      .addTag('Health', 'Health check endpoints')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = configService.get<number>('port') ?? 3001;
  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`🚀 BFF running at http://localhost:${port}`);
  logger.log(`📖 Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
