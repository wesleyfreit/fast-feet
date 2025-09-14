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
import { RecipientPersonFactory } from 'test/factories/make-recipient-person';

describe('Update Recipient Person (E2E)', () => {
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

  test('[PUT] /recipients/:recipientPersonId', async () => {
    const admin = await administratorFactory.makePrismaAdministrator();

    const authToken = await encrypterFactory.makeEncryption(
      admin.id.toString(),
      Role.ADMIN,
    );

    const recipientPerson = await recipientPersonFactory.makePrismaRecipientPerson();

    const response = await request(app.getHttpServer())
      .put(`/recipients/${recipientPerson.id.toString()}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Updated Name',
        email: 'updated.email@example.com',
        cpf: '12345678901',
      });

    expect(response.statusCode).toBe(204);

    const recipientPersonOnDatabase = await prisma.recipient.findUnique({
      where: {
        id: recipientPerson.id.toString(),
      },
    });

    expect(recipientPersonOnDatabase).toEqual(
      expect.objectContaining({
        name: 'Updated Name',
        email: 'updated.email@example.com',
        cpf: '12345678901',
      }),
    );
  });
});
