import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import type { INestApplication } from '@nestjs/common';
import { ListQueryDto } from './ListQueryDto';

@Controller('query-test')
class QueryTestController {
  @Get()
  findAll(@Query() query: ListQueryDto): ListQueryDto {
    return query;
  }
}

describe('ListQueryDto validation', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [QueryTestController],
    }).compile();

    app = moduleRef.createNestApplication();
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
    await app.close();
  });

  it('rejects unknown query params', async () => {
    await request(app.getHttpServer())
      .get('/query-test?filters[slug]=test')
      .expect(400);
  });

  it('rejects pageSize values above 50', async () => {
    await request(app.getHttpServer())
      .get('/query-test?pageSize=51')
      .expect(400);
  });

  it('accepts valid pagination and sort params', async () => {
    await request(app.getHttpServer())
      .get('/query-test?page=1&pageSize=20&sort=publishedAt:desc')
      .expect(200)
      .expect(({ body }: { body: ListQueryDto }) => {
        expect(body).toEqual({
          page: 1,
          pageSize: 20,
          sort: 'publishedAt:desc',
        });
      });
  });
});
