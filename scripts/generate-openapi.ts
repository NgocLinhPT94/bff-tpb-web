/**
 * Build-time OpenAPI spec export script.
 * Bootstraps NestJS (without listening) → generates openapi/openapi.yaml + openapi.json.
 *
 * Usage:
 *   pnpm generate:openapi
 *
 * Output consumed by tpb-web-shared-types to generate TypeScript client types.
 */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import * as yaml from 'js-yaml';
import { AppModule } from '../src/app.module';

async function generateOpenApi(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('TPB Web BFF API')
    .setDescription(
      'Backend-For-Frontend service for TPB corporate website (www.tpb.vn). ' +
        'Handles lead submission, calculator, rates, OTP, captcha verification and core bank integration.',
    )
    .setVersion('1.0.0')
    .addServer('https://api.tpb.vn', 'Production')
    .addServer('http://localhost:3001', 'Local Development')
    .addBearerAuth()
    .addTag('About', 'About page endpoints')
    .addTag('Articles', 'Articles endpoints')
    .addTag('Authors', 'Authors endpoints')
    .addTag('Calculator', 'Financial calculator endpoints')
    .addTag('Captcha', 'Captcha verification endpoints')
    .addTag('Categories', 'Categories endpoints')
    .addTag('FAQs', 'FAQs endpoints')
    .addTag('Global', 'Global settings endpoints')
    .addTag('Health', 'Health check endpoints')
    .addTag('Lead', 'Lead submission endpoints')
    .addTag('Navigation', 'Navigation endpoints')
    .addTag('OTP', 'OTP verification endpoints')
    .addTag('Pages', 'Pages endpoints')
    .addTag('Product Categories', 'Product categories endpoints')
    .addTag('Products', 'Products endpoints')
    .addTag('Promotions', 'Promotions endpoints')
    .addTag('Rates', 'Interest rates endpoints')
    .addTag('Tags', 'Tags endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const outputDir = resolve(__dirname, '..', 'openapi');
  mkdirSync(outputDir, { recursive: true });

  const yamlPath = resolve(outputDir, 'openapi.yaml');
  writeFileSync(yamlPath, yaml.dump(document, { indent: 2, lineWidth: 120, noRefs: true }), 'utf-8');

  const jsonPath = resolve(outputDir, 'openapi.json');
  writeFileSync(jsonPath, JSON.stringify(document, null, 2), 'utf-8');

  console.log(`✓ OpenAPI spec generated:`);
  console.log(`  YAML: ${yamlPath}`);
  console.log(`  JSON: ${jsonPath}`);

  await app.close();
}

generateOpenApi().catch((error: unknown) => {
  console.error('Failed to generate OpenAPI spec:', error);
  process.exit(1);
});
