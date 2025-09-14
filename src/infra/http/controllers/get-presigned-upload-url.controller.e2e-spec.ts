import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';
import { AppModule } from '@/infra/app.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Server } from 'node:net';
import request from 'supertest';
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person';
import { EncrypterFactory } from 'test/factories/make-encrypter';

describe('Get Presigned Upload URL (E2E)', () => {
  let app: INestApplication<Server>;
  let deliveryPersonFactory: DeliveryPersonFactory;
  let encrypterFactory: EncrypterFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [DeliveryPersonFactory, EncrypterFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    deliveryPersonFactory = app.get(DeliveryPersonFactory);
    encrypterFactory = app.get(EncrypterFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /medias/upload-url', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson();

    const authToken = await encrypterFactory.makeEncryption(
      user.id.toString(),
      Role.USER,
    );

    const response = await request(app.getHttpServer())
      .post('/medias/upload-url')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        fileName: 'sample-image.jpg',
        fileType: 'image/jpg',
      });

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        signedUrl: expect.any(String),
        filePath: expect.stringContaining('sample-image.jpg'),
      }),
    );
  });
});
