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
import { makeAddress } from 'test/factories/make-address';
import { AdministratorFactory } from 'test/factories/make-administrator';
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person';
import { EncrypterFactory } from 'test/factories/make-encrypter';
import { OrderFactory } from 'test/factories/make-order';
import { RecipientPersonFactory } from 'test/factories/make-recipient-person';

describe('Fetch Orders (e2e)', () => {
  let app: INestApplication<Server>;
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

  test('[GET] /users/me/orders?page=1&perPage=10', async () => {
    const deliveryPerson = await deliveryPersonFactory.makePrismaDeliveryPerson();

    const authToken = await encrypterFactory.makeEncryption(
      deliveryPerson.id.toString(),
      Role.USER,
    );

    const recipientPerson = await recipientPersonFactory.makePrismaRecipientPerson();

    await orderFactory.makePrismaOrder({
      recipientPersonId: recipientPerson.id,
      deliveryPersonId: deliveryPerson.id,
      status: OrderStatus.PICKED_UP,
    });
    await orderFactory.makePrismaOrder({
      recipientPersonId: recipientPerson.id,
      deliveryPersonId: deliveryPerson.id,
      status: OrderStatus.DELIVERED,
    });
    await orderFactory.makePrismaOrder({
      recipientPersonId: recipientPerson.id,
    });

    const response = await request(app.getHttpServer())
      .get(`/users/me/orders?page=1&perPage=10`)
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
            deliveryPersonId: deliveryPerson.id.toString(),
            recipientPersonId: recipientPerson.id.toString(),
            status: OrderStatus.PICKED_UP,
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
          expect.objectContaining({
            id: expect.any(String),
            deliveryPersonId: deliveryPerson.id.toString(),
            recipientPersonId: recipientPerson.id.toString(),
            status: OrderStatus.DELIVERED,
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

  test('[GET] /users/me/orders?page=1&perPage=10&neighborhood=Old Town', async () => {
    const deliveryPerson = await deliveryPersonFactory.makePrismaDeliveryPerson();

    const authToken = await encrypterFactory.makeEncryption(
      deliveryPerson.id.toString(),
      Role.USER,
    );

    const recipientPerson = await recipientPersonFactory.makePrismaRecipientPerson();

    await orderFactory.makePrismaOrder({
      recipientPersonId: recipientPerson.id,
      deliveryPersonId: deliveryPerson.id,
      address: makeAddress({
        neighborhood: 'Old Town',
      }),
      status: OrderStatus.PICKED_UP,
    });
    await orderFactory.makePrismaOrder({
      recipientPersonId: recipientPerson.id,
      deliveryPersonId: deliveryPerson.id,
      address: makeAddress({
        neighborhood: 'Old Town',
      }),
      status: OrderStatus.DELIVERED,
    });
    await orderFactory.makePrismaOrder({
      recipientPersonId: recipientPerson.id,
      deliveryPersonId: deliveryPerson.id,
      address: makeAddress({
        neighborhood: 'Downtown',
      }),
      status: OrderStatus.RETURNED,
    });

    const response = await request(app.getHttpServer())
      .get(`/users/me/orders?page=1&perPage=10&neighborhood=Old Town`)
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
            deliveryPersonId: deliveryPerson.id.toString(),
            recipientPersonId: recipientPerson.id.toString(),
            status: OrderStatus.PICKED_UP,
            address: {
              street: expect.any(String),
              number: expect.any(String),
              neighborhood: 'Old Town',
              complement: expect.any(String),
              state: expect.any(String),
              city: expect.any(String),
              zipCode: expect.any(String),
            },
            photoProof: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
          expect.objectContaining({
            id: expect.any(String),
            deliveryPersonId: deliveryPerson.id.toString(),
            recipientPersonId: recipientPerson.id.toString(),
            status: OrderStatus.DELIVERED,
            address: {
              street: expect.any(String),
              number: expect.any(String),
              neighborhood: 'Old Town',
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
