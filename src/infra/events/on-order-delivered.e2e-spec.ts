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
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person';
import { EncrypterFactory } from 'test/factories/make-encrypter';
import { OrderFactory } from 'test/factories/make-order';
import { RecipientPersonFactory } from 'test/factories/make-recipient-person';
import { waitFor } from 'test/utils/wait-on';
import { MockInstance } from 'vitest';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { PrismaService } from '../database/prisma/prisma.service';
import { EnvModule } from '../env/env.module';
import { MailerModule } from '../mailer/mailer.module';
import { NodemailerSender } from '../mailer/nodemailer-sender';

describe('On Order Delivered (E2E)', () => {
  let app: INestApplication<Server>;
  let orderFactory: OrderFactory;
  let recipientPersonFactory: RecipientPersonFactory;
  let deliveryPersonFactory: DeliveryPersonFactory;
  let encrypterFactory: EncrypterFactory;
  let nodemailerSender: NodemailerSender;
  let sendEmailExecuteSpy: MockInstance;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, EnvModule, CryptographyModule, MailerModule],
      providers: [
        RecipientPersonFactory,
        DeliveryPersonFactory,
        OrderFactory,
        EncrypterFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = app.get(PrismaService);
    recipientPersonFactory = app.get(RecipientPersonFactory);
    deliveryPersonFactory = app.get(DeliveryPersonFactory);
    encrypterFactory = app.get(EncrypterFactory);
    orderFactory = app.get(OrderFactory);

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

  it('should send a notification for the recipient when his order is delivered', async () => {
    const deliveryPerson = await deliveryPersonFactory.makePrismaDeliveryPerson();

    const authToken = await encrypterFactory.makeEncryption(
      deliveryPerson.id.toString(),
      Role.USER,
    );

    const recipientPerson = await recipientPersonFactory.makePrismaRecipientPerson();

    const order = await orderFactory.makePrismaOrder({
      recipientPersonId: recipientPerson.id,
      deliveryPersonId: deliveryPerson.id,
      status: OrderStatus.PICKED_UP,
    });

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/deliver`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        deliveryPersonId: deliveryPerson.id.toString(),
        photoUrl: 'http://example.com/photo.jpg',
      });

    expect(response.statusCode).toBe(204);

    await waitFor(async () => {
      expect(sendEmailExecuteSpy).toHaveBeenCalledTimes(1);
    });

    const [data] = sendEmailExecuteSpy.mock.calls[0];

    expect(data).toEqual(
      expect.objectContaining({
        to: recipientPerson.email,
      }),
    );

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
        status: OrderStatus.DELIVERED,
      }),
    );
  });
});
