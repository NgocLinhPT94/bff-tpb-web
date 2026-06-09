import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { configuration } from './config/configuration';
import { envSchema } from './config/env.schema';

// Common layer
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { NonGetMethodGuard } from './common/guards/non-get-method.guard';
import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { PreviewModeMiddleware } from './common/middleware/preview-mode.middleware';

// Business modules (write operations)
import { LeadModule } from './modules/lead/lead.module';
import { CalculatorModule } from './modules/calculator/calculator.module';
import { RatesModule } from './modules/rates/rates.module';
import { OtpModule } from './modules/otp/otp.module';
import { CaptchaModule } from './modules/captcha/captcha.module';
import { HealthModule } from './modules/health/health.module';

// CMS content modules (read-only)
import { ArticlesModule } from './modules/articles/articles.module';
import { AuthorsModule } from './modules/authors/authors.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { ProductCategoriesModule } from './modules/product-categories/product-categories.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { FaqsModule } from './modules/faqs/faqs.module';
import { PagesModule } from './modules/pages/pages.module';
import { NavigationModule } from './modules/navigation/navigation.module';
import { NavigationItemModule } from './modules/navigation-item/navigation-item.module';
import { GlobalModule } from './modules/global/global.module';
import { AboutModule } from './modules/about/about.module';
import { TagsModule } from './modules/tags/tags.module';

// Integration adapters
import { CoreBankModule } from './integrations/core-bank/core-bank.module';
import { CrmModule } from './integrations/crm/crm.module';
import { SmsGatewayModule } from './integrations/sms-gateway/sms-gateway.module';
import { RecaptchaModule } from './integrations/recaptcha/recaptcha.module';
import { CmsModule } from './integrations/cms/cms.module';

@Module({
  imports: [
    // Configuration — global, loaded first
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envSchema,
    }),

    // Structured logging (pino)
    LoggerModule.forRoot({
      pinoHttp: {
        redact: ['req.headers.authorization', 'req.headers.cookie'],
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
      },
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: (configService.get<number>('rateLimit.ttl') ?? 60) * 1000,
          limit: configService.get<number>('rateLimit.limit') ?? 100,
        },
      ],
    }),

    // Business modules (write operations)
    LeadModule,
    CalculatorModule,
    RatesModule,
    OtpModule,
    CaptchaModule,
    HealthModule,

    // CMS content modules (read-only)
    ArticlesModule,
    AuthorsModule,
    CategoriesModule,
    ProductsModule,
    ProductCategoriesModule,
    PromotionsModule,
    FaqsModule,
    PagesModule,
    NavigationModule,
    NavigationItemModule,
    GlobalModule,
    AboutModule,
    TagsModule,

    // Integration adapters (HTTP clients for external services)
    CoreBankModule,
    CrmModule,
    SmsGatewayModule,
    RecaptchaModule,
    CmsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: NonGetMethodGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware, PreviewModeMiddleware).forRoutes('*');
  }
}
