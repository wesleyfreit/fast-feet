import { makeAddress } from 'test/factories/make-address';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { makeOrder } from 'test/factories/make-order';
import { makeRecipientPerson } from 'test/factories/make-recipient-person';
import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryRecipientPeopleRepository } from 'test/repositories/in-memory-recipient-people-repository';
import { OrderStatus } from '../../enterprise/entities/order';
import { DeliverOrderUseCase } from './deliver-order';

let recipientPeopleRepository: InMemoryRecipientPeopleRepository;
let deliveryPeopleRepository: InMemoryDeliveryPeopleRepository;
let ordersRepository: InMemoryOrdersRepository;

let sut: DeliverOrderUseCase;

describe('Deliver Order Use Case', () => {
  beforeEach(() => {
    recipientPeopleRepository = new InMemoryRecipientPeopleRepository();
    deliveryPeopleRepository = new InMemoryDeliveryPeopleRepository();
    ordersRepository = new InMemoryOrdersRepository();

    sut = new DeliverOrderUseCase(deliveryPeopleRepository, ordersRepository);
  });

  it('should be able to deliver an order', async () => {
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

    await ordersRepository.save(order);

    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString(),
      orderId: order.id.toString(),
      photoUrl: 'http://example.com/photo.jpg',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        order: expect.objectContaining({
          address: expect.objectContaining({
            city: expect.any(String),
            street: expect.any(String),
            state: expect.any(String),
            zipCode: expect.any(String),
            number: expect.any(String),
            complement: expect.any(String),
          }),
          recipientPersonId: recipientPerson.id,
          deliveryPersonId: deliveryPerson.id,
          status: OrderStatus.DELIVERED,
        }),
      }),
    );
  });
});
