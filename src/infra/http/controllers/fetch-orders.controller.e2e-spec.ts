import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';
import { OrderStatus } from '@/domain/recipient-order-delivery/enterprise/entities/order';
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
import { OrderFactory } from 'test/factories/make-order';
import { RecipientPersonFactory } from 'test/factories/make-recipient-person';

describe('Fetch Orders (e2e)', () => {
  let app: INestApplication<Server>;
  let administratorFactory: AdministratorFactory;
  let orderFactory: OrderFactory;
  let recipientPersonFactory: RecipientPersonFactory;
  let deliveryPersonFactory: DeliveryPersonFactory;
  let encrypterFactory: EncrypterFactory;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [
        AdministratorFactory,
        OrderFactory,
        RecipientPersonFactory,
        DeliveryPersonFactory,
        EncrypterFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = app.get(PrismaService);
    administratorFactory = app.get(AdministratorFactory);
    orderFactory = app.get(OrderFactory);
    recipientPersonFactory = app.get(RecipientPersonFactory);
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

  test('[GET] /orders?page=1&perPage=10', async () => {
    const admin = await administratorFactory.makePrismaAdministrator();

    const authToken = await encrypterFactory.makeEncryption(
      admin.id.toString(),
      Role.ADMIN,
    );

    const recipientPerson = await recipientPersonFactory.makePrismaRecipientPerson();

    await orderFactory.makePrismaOrder({
      recipientPersonId: recipientPerson.id,
    });
    await orderFactory.makePrismaOrder({
      recipientPersonId: recipientPerson.id,
    });

    const response = await request(app.getHttpServer())
      .get('/orders?page=1&perPage=10')
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
        items: 2,
        orders: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            deliveryPersonId: null,
            recipientPersonId: recipientPerson.id.toString(),
            status: OrderStatus.WAITING_PICK_UP,
            address: {
              street: expect.any(String),
              number: expect.any(String),
              neighborhood: expect.any(String),
              complement: expect.any(String),
              state: expect.any(String),
              city: expect.any(String),
              zipCode: expect.any(String),
            },
            photoProof: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      }),
    );
  });

  test('[GET] /orders?page=1&perPage=10&recipientPersonId=<recipientPersonId>', async () => {
    const admin = await administratorFactory.makePrismaAdministrator();

    const authToken = await encrypterFactory.makeEncryption(
      admin.id.toString(),
      Role.ADMIN,
    );

    const recipientPerson1 = await recipientPersonFactory.makePrismaRecipientPerson();
    const recipientPerson2 = await recipientPersonFactory.makePrismaRecipientPerson();

    await orderFactory.makePrismaOrder({
      recipientPersonId: recipientPerson1.id,
    });
    await orderFactory.makePrismaOrder({
      recipientPersonId: recipientPerson2.id,
    });

    const response = await request(app.getHttpServer())
      .get(
        `/orders?page=1&perPage=10&recipientPersonId=${recipientPerson2.id.toString()}`,
      )
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
        orders: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            deliveryPersonId: null,
            recipientPersonId: recipientPerson2.id.toString(),
            status: OrderStatus.WAITING_PICK_UP,
            address: {
              street: expect.any(String),
              number: expect.any(String),
              neighborhood: expect.any(String),
              complement: expect.any(String),
              state: expect.any(String),
              city: expect.any(String),
              zipCode: expect.any(String),
            },
            photoProof: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      }),
    );
  });

  test('[GET] /orders?page=1&perPage=10&recipientPersonId=<recipientPersonId>&deliveryPersonId=<deliveryPersonId>', async () => {
    const admin = await administratorFactory.makePrismaAdministrator();

    const authToken = await encrypterFactory.makeEncryption(
      admin.id.toString(),
      Role.ADMIN,
    );

    const deliveryPerson = await deliveryPersonFactory.makePrismaDeliveryPerson();

    const recipientPerson = await recipientPersonFactory.makePrismaRecipientPerson();

    await orderFactory.makePrismaOrder({
      recipientPersonId: recipientPerson.id,
      deliveryPersonId: deliveryPerson.id,
    });
    await orderFactory.makePrismaOrder({
      recipientPersonId: recipientPerson.id,
    });

    const response = await request(app.getHttpServer())
      .get(
        `/orders?page=1&perPage=10&recipientPersonId=${recipientPerson.id.toString()}&deliveryPersonId=${deliveryPerson.id.toString()}`,
      )
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
        orders: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            deliveryPersonId: deliveryPerson.id.toString(),
            recipientPersonId: recipientPerson.id.toString(),
            status: OrderStatus.WAITING_PICK_UP,
            address: {
              street: expect.any(String),
              number: expect.any(String),
              neighborhood: expect.any(String),
              complement: expect.any(String),
              state: expect.any(String),
              city: expect.any(String),
              zipCode: expect.any(String),
            },
            photoProof: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      }),
    );
  });
});
