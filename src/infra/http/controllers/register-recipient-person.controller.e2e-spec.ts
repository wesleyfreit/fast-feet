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

describe('Register Recipient Person (E2E)', () => {
  let app: INestApplication<Server>;
  let prisma: PrismaService;
  let administratorFactory: AdministratorFactory;
  let encrypterFactory: EncrypterFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [AdministratorFactory, EncrypterFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = app.get(PrismaService);
    administratorFactory = app.get(AdministratorFactory);
    encrypterFactory = app.get(EncrypterFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /recipients', async () => {
    const admin = await administratorFactory.makePrismaAdministrator();

    const authToken = await encrypterFactory.makeEncryption(
      admin.id.toString(),
      Role.ADMIN,
    );

    const response = await request(app.getHttpServer())
      .post('/recipients')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'John Doe',
        cpf: '12345678900',
        email: 'johndoe@example.com',
      });

    expect(response.statusCode).toBe(201);

    const deliveryPersonOnDatabase = await prisma.recipient.findFirst({
      where: {
        cpf: '12345678900',
        email: 'johndoe@example.com',
      },
    });

    expect(deliveryPersonOnDatabase).toEqual(
      expect.objectContaining({
        cpf: '12345678900',
        name: 'John Doe',
      }),
    );
  });
});
