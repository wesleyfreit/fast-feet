import { DomainEvents } from '@/core/events/domain-events';
import { Sender } from '@/domain/notification/application/mailer/sender';
import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';
import { OrderStatus } from '@/domain/recipient-order-delivery/enterprise/entities/order';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Server } from 'node:net';
import request from 'supertest';
import { AdministratorFactory } from 'test/factories/make-administrator';
import { EncrypterFactory } from 'test/factories/make-encrypter';
import { RecipientPersonFactory } from 'test/factories/make-recipient-person';
import { waitFor } from 'test/utils/wait-on';
import { MockInstance } from 'vitest';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { PrismaService } from '../database/prisma/prisma.service';
import { EnvModule } from '../env/env.module';
import { MailerModule } from '../mailer/mailer.module';
import { NodemailerSender } from '../mailer/nodemailer-sender';

describe('On Order Waiting (E2E)', () => {
  let app: INestApplication<Server>;
  let recipientPersonFactory: RecipientPersonFactory;
  let administratorFactory: AdministratorFactory;
  let encrypterFactory: EncrypterFactory;
  let nodemailerSender: NodemailerSender;
  let sendEmailExecuteSpy: MockInstance;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, EnvModule, CryptographyModule, MailerModule],
      providers: [RecipientPersonFactory, AdministratorFactory, EncrypterFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = app.get(PrismaService);
    recipientPersonFactory = app.get(RecipientPersonFactory);
    administratorFactory = app.get(AdministratorFactory);
    encrypterFactory = app.get(EncrypterFactory);

    nodemailerSender = app.get(Sender);
    sendEmailExecuteSpy = vi.spyOn(nodemailerSender, 'sendNotification');

    DomainEvents.shouldRun = true;

    await app.init();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should send a notification for the recipient when an order is created for him', async () => {
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

    await waitFor(async () => {
      expect(sendEmailExecuteSpy).toHaveBeenCalledTimes(1);
    });

    const [data] = sendEmailExecuteSpy.mock.calls[0];

    expect(data).toEqual(
      expect.objectContaining({
        to: recipientPerson.email,
      }),
    );

    const orderOnDatabase = await prisma.delivery.findFirst({
      where: {
        recipientId: recipientPerson.id.toString(),
      },
    });

    expect(orderOnDatabase).toBeDefined();

    expect(orderOnDatabase).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        status: OrderStatus.WAITING_PICK_UP,
      }),
    );
  });
});
