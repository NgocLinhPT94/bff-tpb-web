import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import appConfig from './config/app.config';
import securityConfig, { type SecurityConfig } from './config/security.config';
import strapiConfig from './config/strapi.config';
import { validate } from './config/validation';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { NonGetMethodGuard } from './common/guards/non-get-method.guard';
import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor';
import { StrapiModule } from './infrastructure/strapi/strapi.module';
import { AboutModule } from './modules/about/about.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { AuthorsModule } from './modules/authors/authors.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { FaqsModule } from './modules/faqs/faqs.module';
import { GlobalModule } from './modules/global/global.module';
import { NavigationItemModule } from './modules/navigation-item/navigation-item.module';
import { NavigationModule } from './modules/navigation/navigation.module';
import { PagesModule } from './modules/pages/pages.module';
import { ProductsModule } from './modules/products/products.module';
import { PromotionsModule } from './modules/promotions/promotions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, securityConfig, strapiConfig],
      validate,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        redact: ['req.headers.authorization', 'req.headers.cookie'],
        customProps: (request) => ({
          requestId:
            'requestId' in request ? (request.requestId as string) : undefined,
        }),
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.getOrThrow<SecurityConfig>('security');

        return [
          {
            ttl: config.throttleTtlMs,
            limit: config.throttleLimit,
          },
        ];
      },
    }),
    StrapiModule,
    GlobalModule,
    AboutModule,
    ArticlesModule,
    AuthorsModule,
    CategoriesModule,
    FaqsModule,
    NavigationModule,
    NavigationItemModule,
    PagesModule,
    ProductsModule,
    PromotionsModule,
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
export class AppModule {}
