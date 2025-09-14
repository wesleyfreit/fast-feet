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

describe('Authenticate (E2E)', () => {
  let app: INestApplication<Server>;
  let prisma: PrismaService;
  let administratorFactory: AdministratorFactory;
  let deliveryPersonFactory: DeliveryPersonFactory;
  let encrypterFactory: EncrypterFactory;

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

  test('[DELETE] /users/:deliveryPersonId', async () => {
    const admin = await administratorFactory.makePrismaAdministrator();

    const authToken = await encrypterFactory.makeEncryption(
      admin.id.toString(),
      Role.ADMIN,
    );

    const deliveryPerson = await deliveryPersonFactory.makePrismaDeliveryPerson();

    const response = await request(app.getHttpServer())
      .delete(`/users/${deliveryPerson.id.toString()}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const deliveryPersonOnDatabase = await prisma.user.findUnique({
      where: {
        id: deliveryPerson.id.toString(),
      },
    });

    expect(deliveryPersonOnDatabase).toBeNull();
  });
});
