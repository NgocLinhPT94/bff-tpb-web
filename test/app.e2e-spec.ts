import {
  BadGatewayException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Express, NextFunction, Response } from 'express';
import helmet from 'helmet';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

import type { RequestWithId } from '../src/common/http/request-with-id';
import { RequestIdMiddleware } from '../src/common/middleware/request-id.middleware';
import { StrapiClient } from '../src/infrastructure/strapi/strapi.client';
import {
  articleDetailResponse,
  articleListResponse,
  emptyArticleListResponse,
} from './fixtures/strapi/articles';

interface ResponseBody {
  error?: { code: string; message: string; requestId: string };
  data?: unknown;
  meta?: { pagination?: unknown; requestId: string };
}

describe('BFF article routes (e2e)', () => {
  let app: INestApplication<App>;
  let strapiGetMock: jest.Mock;

  beforeAll(() => {
    process.env.STRAPI_BASE_URL = 'http://localhost:1337/api';
    process.env.NODE_ENV = 'test';
  });

  beforeEach(async () => {
    strapiGetMock = jest.fn();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(StrapiClient)
      .useValue({ get: strapiGetMock })
      .compile();

    app = moduleFixture.createNestApplication();
    configureRuntimeBehavior(app);
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
    jest.clearAllMocks();
  });

  it('returns 405 for POST /api/v1/articles', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/articles')
      .expect(405)
      .expect(({ body }: { body: ResponseBody }) => {
        expect(body.error).toMatchObject({
          code: 'METHOD_NOT_ALLOWED',
          message: 'Method not allowed',
        });
      });
  });

  it('returns 400 for unknown filter query params', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/articles?filters[slug]=test')
      .expect(400)
      .expect(({ body }: { body: ResponseBody }) => {
        expect(body.error).toMatchObject({
          code: 'BAD_REQUEST',
          message: 'Bad request',
        });
      });
  });

  it('returns 400 for pageSize values above 50', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/articles?pageSize=51')
      .expect(400)
      .expect(({ body }: { body: ResponseBody }) => {
        expect(body.error).toMatchObject({
          code: 'BAD_REQUEST',
          message: 'Bad request',
        });
      });
  });

  it('returns an empty collection with pagination meta', async () => {
    strapiGetMock.mockResolvedValueOnce(emptyArticleListResponse);

    await request(app.getHttpServer())
      .get('/api/v1/articles')
      .expect(200)
      .expect(({ body }: { body: ResponseBody }) => {
        expect(body.data).toEqual([]);
        expect(body.meta?.pagination).toEqual({
          page: 1,
          pageSize: 20,
          pageCount: 0,
          total: 0,
        });
      });
  });

  it('returns a mapped article list for a successful list route', async () => {
    strapiGetMock.mockResolvedValueOnce(articleListResponse);

    await request(app.getHttpServer())
      .get('/api/v1/articles?page=1&pageSize=20&sort=publishedAt:desc')
      .expect(200)
      .expect(({ body }: { body: ResponseBody }) => {
        expect(body.data).toEqual([
          {
            documentId: 'article-1',
            title: 'Market update',
            description: 'Daily market update',
            content: [{ type: 'paragraph', children: [{ text: 'Read more' }] }],
            slug: 'market-update',
            publish_date: '2026-05-11T00:00:00.000Z',
            cover: {
              url: '/uploads/cover.png',
              alternativeText: 'Cover image',
              width: 1200,
              height: 630,
              formats: { thumbnail: { url: '/uploads/cover-thumb.png' } },
            },
            author: { documentId: 'author-1', name: 'Jane Writer' },
            category: { documentId: 'category-1', name: 'News' },
          },
        ]);
        expect(strapiGetMock).toHaveBeenCalledWith('/articles', {
          params: {
            'pagination[page]': 1,
            'pagination[pageSize]': 20,
            'populate[author][populate]': 'avatar',
            'populate[category]': true,
            'populate[cover]': true,
            sort: 'publishedAt:desc',
          },
        });
      });
  });

  it('returns a mapped article for a successful detail route', async () => {
    strapiGetMock.mockResolvedValueOnce(articleDetailResponse);

    await request(app.getHttpServer())
      .get('/api/v1/articles/article-1')
      .expect(200)
      .expect(({ body }: { body: ResponseBody }) => {
        expect(body.data).toMatchObject({
          documentId: 'article-1',
          title: 'Market update',
          author: { documentId: 'author-1', name: 'Jane Writer' },
        });
        expect(strapiGetMock).toHaveBeenCalledWith(
          '/articles/article-1',
          expect.any(Object),
        );
      });
  });

  it('returns sanitized 502 responses for upstream failures', async () => {
    strapiGetMock.mockRejectedValueOnce(
      new BadGatewayException({ raw: 'raw upstream detail', stack: 'trace' }),
    );

    await request(app.getHttpServer())
      .get('/api/v1/articles')
      .expect(502)
      .expect(({ body }: { body: ResponseBody }) => {
        expect(body).toMatchObject({
          error: {
            code: 'BAD_GATEWAY',
            message: 'Upstream service error',
          },
        });
        expect(body.error?.requestId).toEqual(expect.any(String));
        expect(JSON.stringify(body)).not.toContain('raw upstream detail');
        expect(JSON.stringify(body)).not.toContain('trace');
      });
  });
});

function configureRuntimeBehavior(app: INestApplication<App>): void {
  const requestIdMiddleware = new RequestIdMiddleware();
  const expressApp = app.getHttpAdapter().getInstance() as Express;

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
    origin: 'http://localhost:3000',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
