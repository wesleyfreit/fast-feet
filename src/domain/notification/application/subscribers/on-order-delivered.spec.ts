import { OrderStatus } from '@/domain/recipient-order-delivery/enterprise/entities/order';
import { makeAddress } from 'test/factories/make-address';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { makeOrder } from 'test/factories/make-order';
import { makeRecipientPerson } from 'test/factories/make-recipient-person';
import { FakeSender } from 'test/mailer/fake-sender';
import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryRecipientPeopleRepository } from 'test/repositories/in-memory-recipient-people-repository';
import { waitFor } from 'test/utils/wait-on';
import { MockInstance } from 'vitest';
import { Sender } from '../mailer/sender';
import { SendEmailNotificationUseCase } from '../use-cases/send-email-notification';
import { OnOrderWaiting } from './on-order-waiting';

let recipientPeopleRepository: InMemoryRecipientPeopleRepository;
let deliveryPeopleRepository: InMemoryDeliveryPeopleRepository;
let ordersRepository: InMemoryOrdersRepository;

let sender: Sender;

let sut: SendEmailNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance;

describe('On Order Delivered', () => {
  beforeEach(() => {
    recipientPeopleRepository = new InMemoryRecipientPeopleRepository();
    deliveryPeopleRepository = new InMemoryDeliveryPeopleRepository();
    ordersRepository = new InMemoryOrdersRepository();

    sender = new FakeSender();
    sut = new SendEmailNotificationUseCase(sender);

    sendNotificationExecuteSpy = vi.spyOn(sender, 'sendNotification');

    new OnOrderWaiting(sut, recipientPeopleRepository);
  });

  it('should send an email notification from the recipient person when an order is marked as delivered', async () => {
    const recipientPerson = makeRecipientPerson();

    await recipientPeopleRepository.create(recipientPerson);

    const order = makeOrder({
      address: makeAddress(),
      recipientPersonId: recipientPerson.id,
    });

    await ordersRepository.create(order);

    const deliveryPerson = makeDeliveryPerson();

    await deliveryPeopleRepository.create(deliveryPerson);

    order.pickUp(deliveryPerson.id);

    order.deliver('http://example.com/photo.jpg');

    await ordersRepository.save(order);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });

    expect(ordersRepository.items[0]).toEqual(
      expect.objectContaining({
        recipientPersonId: recipientPerson.id,
        status: OrderStatus.DELIVERED,
      }),
    );
  });
});
