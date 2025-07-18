import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ShopApiModule } from '../src/shop-api.module';
import { Shop } from '../src/entities/shop.entity';

describe('ShopApiController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ShopApiModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /shops → should return an array of shops', async () => {
    const response = await request(app.getHttpServer()).get('/shops');

    expect(response.status).toBe(200);

    // 👇 Explicitly cast the response body to Shop[]
    const shops = response.body as unknown as Shop[];
    expect(Array.isArray(shops)).toBe(true);

    for (const shop of shops) {
      expect(shop).toHaveProperty('id');
      expect(shop).toHaveProperty('name');
    }
  });
});
