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
import { EncrypterFactory } from 'test/factories/make-encrypter';
import { OrderFactory } from 'test/factories/make-order';
import { RecipientPersonFactory } from 'test/factories/make-recipient-person';

describe('Delete Order (E2E)', () => {
  let app: INestApplication<Server>;
  let prisma: PrismaService;
  let administratorFactory: AdministratorFactory;
  let recipientPersonFactory: RecipientPersonFactory;
  let orderFactory: OrderFactory;
  let encrypterFactory: EncrypterFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [
        AdministratorFactory,
        RecipientPersonFactory,
        OrderFactory,
        EncrypterFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = app.get(PrismaService);
    administratorFactory = app.get(AdministratorFactory);
    recipientPersonFactory = app.get(RecipientPersonFactory);
    orderFactory = app.get(OrderFactory);
    encrypterFactory = app.get(EncrypterFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[DELETE] /orders/:orderId', async () => {
    const admin = await administratorFactory.makePrismaAdministrator();

    const authToken = await encrypterFactory.makeEncryption(
      admin.id.toString(),
      Role.ADMIN,
    );

    const recipientPerson = await recipientPersonFactory.makePrismaRecipientPerson();

    const order = await orderFactory.makePrismaOrder({
      recipientPersonId: recipientPerson.id,
    });

    const response = await request(app.getHttpServer())
      .delete(`/orders/${order.id.toString()}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const orderOnDatabase = await prisma.delivery.findUnique({
      where: {
        id: order.id.toString(),
      },
    });

    expect(orderOnDatabase).toBeNull();
  });
});
