import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { MetaController } from './meta.controller';

describe('Meta Controller', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetaController],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('GET /local_health', async () => {
    const result = await request(app.getHttpServer()).get('/local_health');
    expect(result.status).toEqual(200);
    expect(result.text).toEqual('OK');
  });
});
