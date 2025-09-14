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
import { EncrypterFactory } from 'test/factories/make-encrypter';
import { RecipientPersonFactory } from 'test/factories/make-recipient-person';

describe('Create Order (E2E)', () => {
  let app: INestApplication<Server>;
  let prisma: PrismaService;
  let administratorFactory: AdministratorFactory;
  let recipientPersonFactory: RecipientPersonFactory;
  let encrypterFactory: EncrypterFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [AdministratorFactory, RecipientPersonFactory, EncrypterFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = app.get(PrismaService);
    administratorFactory = app.get(AdministratorFactory);
    recipientPersonFactory = app.get(RecipientPersonFactory);
    encrypterFactory = app.get(EncrypterFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /orders', async () => {
    const admin = await administratorFactory.makePrismaAdministrator();

    const authToken = await encrypterFactory.makeEncryption(
      admin.id.toString(),
      Role.ADMIN,
    );

    const recipientPerson = await recipientPersonFactory.makePrismaRecipientPerson();

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        recipientPersonId: recipientPerson.id.toString(),
        city: 'New York',
        street: '5th Avenue',
        number: '711',
        complement: 'Apt 5A',
        neighborhood: 'Manhattan',
        state: 'NY',
        zipCode: '10013501',
      });

    expect(response.statusCode).toBe(201);

    const orderOnDatabase = await prisma.delivery.findFirst({
      where: {
        recipientId: recipientPerson.id.toString(),
      },
    });

    expect(orderOnDatabase).toEqual(
      expect.objectContaining({
        recipientId: recipientPerson.id.toString(),
        status: OrderStatus.WAITING_PICK_UP,
        neighborhood: 'Manhattan',
        city: 'New York',
        state: 'NY',
        street: '5th Avenue',
        number: '711',
        complement: 'Apt 5A',
        zipCode: '10013501',
      }),
    );
  });
});
