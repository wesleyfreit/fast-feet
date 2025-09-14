import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';
import { AppModule } from '@/infra/app.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Server } from 'node:net';
import request from 'supertest';
import { AdministratorFactory } from 'test/factories/make-administrator';
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person';
import { EncrypterFactory } from 'test/factories/make-encrypter';

describe('Fetch Delivery People (e2e)', () => {
  let app: INestApplication<Server>;
  let administratorFactory: AdministratorFactory;
  let deliveryPersonFactory: DeliveryPersonFactory;
  let encrypterFactory: EncrypterFactory;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [AdministratorFactory, DeliveryPersonFactory, EncrypterFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = app.get(PrismaService);
    administratorFactory = app.get(AdministratorFactory);
    deliveryPersonFactory = app.get(DeliveryPersonFactory);
    encrypterFactory = app.get(EncrypterFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  test('[GET] /users?page=1&perPage=10', async () => {
    const admin = await administratorFactory.makePrismaAdministrator();

    const authToken = await encrypterFactory.makeEncryption(
      admin.id.toString(),
      Role.ADMIN,
    );

    await deliveryPersonFactory.makePrismaDeliveryPerson();
    await deliveryPersonFactory.makePrismaDeliveryPerson();

    const response = await request(app.getHttpServer())
      .get('/users?page=1&perPage=10')
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        prev: null,
        current: 1,
        next: null,
        pages: 1,
        perPage: 10,
        items: 3,
        users: expect.arrayContaining([
          expect.objectContaining({
            id: admin.id.toString(),
            name: admin.name,
            cpf: admin.cpf,
            role: Role.ADMIN,
          }),
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            cpf: expect.any(String),
            role: Role.USER,
          }),
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            cpf: expect.any(String),
            role: Role.USER,
          }),
        ]),
      }),
    );
  });

  test(`[GET] /users?page=1&perPage=10&role=${Role.ADMIN}`, async () => {
    const admin = await administratorFactory.makePrismaAdministrator();

    const authToken = await encrypterFactory.makeEncryption(
      admin.id.toString(),
      Role.ADMIN,
    );

    await deliveryPersonFactory.makePrismaDeliveryPerson();
    await deliveryPersonFactory.makePrismaDeliveryPerson();

    const response = await request(app.getHttpServer())
      .get(`/users?page=1&perPage=10&role=${Role.ADMIN}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        prev: null,
        current: 1,
        next: null,
        pages: 1,
        perPage: 10,
        items: 1,
        users: expect.arrayContaining([
          expect.objectContaining({
            id: admin.id.toString(),
            name: admin.name,
            cpf: admin.cpf,
            role: Role.ADMIN,
          }),
        ]),
      }),
    );
  });
});
