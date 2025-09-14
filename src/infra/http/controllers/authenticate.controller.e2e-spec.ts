import { AppModule } from '@/infra/app.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import { Server } from 'node:net';
import request from 'supertest';
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person';

describe('Authenticate (E2E)', () => {
  let app: INestApplication<Server>;
  let deliveryPersonFactory: DeliveryPersonFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [DeliveryPersonFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    deliveryPersonFactory = app.get(DeliveryPersonFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /sessions', async () => {
    await deliveryPersonFactory.makePrismaDeliveryPerson({
      password: await hash('123456', 6),
      cpf: '12345678900',
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      cpf: '12345678900',
      password: '123456',
    });

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          access_token: expect.any(String),
        }),
      }),
    );
  });
});
