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

describe('Pick Up Order (e2e)', () => {
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

  test('[PATCH] /orders/:orderId/pick-up', async () => {
    const deliveryPerson = await deliveryPersonFactory.makePrismaDeliveryPerson();

    const authToken = await encrypterFactory.makeEncryption(
      deliveryPerson.id.toString(),
      Role.USER,
    );

    const recipientPerson = await recipientPersonFactory.makePrismaRecipientPerson();

    const order = await orderFactory.makePrismaOrder({
      recipientPersonId: recipientPerson.id,
    });

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/pick-up`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        deliveryPersonId: deliveryPerson.id.toString(),
      });

    expect(response.statusCode).toBe(204);

    const orderOnDatabase = await prisma.delivery.findUnique({
      where: {
        id: order.id.toString(),
      },
    });

    expect(orderOnDatabase).toBeDefined();

    expect(orderOnDatabase).toEqual(
      expect.objectContaining({
        id: order.id.toString(),
        deliveryManId: deliveryPerson.id.toString(),
        recipientId: recipientPerson.id.toString(),
        status: OrderStatus.PICKED_UP,
      }),
    );
  });
});
