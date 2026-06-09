import {
  BadGatewayException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CmsClient } from '../src/integrations/cms/cms.client';
import {
  articleDetailResponse,
  articleListResponse,
  emptyArticleListResponse,
} from './fixtures/cms/articles';

interface ResponseBody {
  error?: { code: string; message: string; requestId: string };
  data?: unknown;
  meta?: { pagination?: unknown; requestId: string };
}

describe('BFF article routes (e2e)', () => {
  let app: INestApplication<App>;
  let cmsGetMock: jest.Mock;

  beforeEach(async () => {
    cmsGetMock = jest.fn();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CmsClient)
      .useValue({ get: cmsGetMock, post: jest.fn() })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1', { exclude: ['health', 'health/ready'] });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    if (app) await app.close();
    jest.clearAllMocks();
  });

  it('returns 400 for unknown filter query params', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/articles?filters[slug]=test')
      .expect(400);
  });

  it('returns 400 for pageSize values above 50', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/articles?pageSize=51')
      .expect(400);
  });

  it('returns an empty collection with pagination meta', async () => {
    cmsGetMock.mockResolvedValueOnce(emptyArticleListResponse);

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

  it('returns a mapped article list', async () => {
    cmsGetMock.mockResolvedValueOnce(articleListResponse);

    await request(app.getHttpServer())
      .get('/api/v1/articles?page=1&pageSize=20&sort=publishedAt:desc')
      .expect(200)
      .expect(({ body }: { body: ResponseBody }) => {
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.meta?.requestId).toEqual(expect.any(String));
      });
  });

  it('returns a mapped article detail', async () => {
    cmsGetMock.mockResolvedValueOnce(articleDetailResponse);

    await request(app.getHttpServer())
      .get('/api/v1/articles/article-1')
      .expect(200)
      .expect(({ body }: { body: ResponseBody }) => {
        expect((body.data as Record<string, unknown>)?.documentId).toBe('article-1');
      });
  });

  it('returns sanitized 502 for upstream failures', async () => {
    cmsGetMock.mockRejectedValueOnce(new BadGatewayException());

    await request(app.getHttpServer())
      .get('/api/v1/articles')
      .expect(502)
      .expect(({ body }: { body: ResponseBody }) => {
        expect(body.error?.code).toBe('BAD_GATEWAY');
        expect(body.error?.requestId).toEqual(expect.any(String));
      });
  });
});
