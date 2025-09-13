import { makeAddress } from 'test/factories/make-address';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { makeOrder } from 'test/factories/make-order';
import { makeRecipientPerson } from 'test/factories/make-recipient-person';
import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryRecipientPeopleRepository } from 'test/repositories/in-memory-recipient-people-repository';
import { FetchDeliveryPersonOrdersUseCase } from './fetch-delivery-person-orders';

let recipientPeopleRepository: InMemoryRecipientPeopleRepository;
let deliveryPeopleRepository: InMemoryDeliveryPeopleRepository;
let ordersRepository: InMemoryOrdersRepository;

let sut: FetchDeliveryPersonOrdersUseCase;

describe('Fetch Delivery Person Use Case', () => {
  beforeEach(() => {
    recipientPeopleRepository = new InMemoryRecipientPeopleRepository();
    deliveryPeopleRepository = new InMemoryDeliveryPeopleRepository();
    ordersRepository = new InMemoryOrdersRepository();

    sut = new FetchDeliveryPersonOrdersUseCase(ordersRepository);
  });

  it('should be able to fetch delivery person orders', async () => {
    const recipientPerson = makeRecipientPerson();

    await recipientPeopleRepository.create(recipientPerson);

    const order1 = makeOrder({
      recipientPersonId: recipientPerson.id,
    });

    const order2 = makeOrder({
      recipientPersonId: recipientPerson.id,
    });

    await ordersRepository.create(order1);
    await ordersRepository.create(order2);

    const deliveryPerson = makeDeliveryPerson();

    await deliveryPeopleRepository.create(deliveryPerson);

    order1.pickUp(deliveryPerson.id);
    order2.pickUp(deliveryPerson.id);

    await ordersRepository.save(order1);
    await ordersRepository.save(order2);

    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString(),
      pagination: { page: 1, perPage: 2 },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        prev: null,
        current: 1,
        next: null,
        perPage: 2,
        pages: 1,
        items: 2,
        orders: expect.arrayContaining([
          expect.objectContaining({
            deliveryPersonId: deliveryPerson.id,
            status: order1.status,
          }),
          expect.objectContaining({
            deliveryPersonId: deliveryPerson.id,
            status: order2.status,
          }),
        ]),
      }),
    );
  });

  it('should be able to fetch delivery person orders by neighborhood', async () => {
    const recipientPerson = makeRecipientPerson();

    await recipientPeopleRepository.create(recipientPerson);

    const order1 = makeOrder({
      recipientPersonId: recipientPerson.id,
      address: makeAddress({ neighborhood: 'Neighborhood A' }),
    });

    const order2 = makeOrder({
      recipientPersonId: recipientPerson.id,
      address: makeAddress({ neighborhood: 'Neighborhood B' }),
    });

    await ordersRepository.create(order1);
    await ordersRepository.create(order2);

    const deliveryPerson = makeDeliveryPerson();

    await deliveryPeopleRepository.create(deliveryPerson);

    order1.pickUp(deliveryPerson.id);
    order2.pickUp(deliveryPerson.id);

    await ordersRepository.save(order1);
    await ordersRepository.save(order2);

    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString(),
      pagination: { page: 1, perPage: 2 },
      neighborhood: 'Neighborhood A',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        prev: null,
        current: 1,
        next: null,
        perPage: 2,
        pages: 1,
        items: 1,
        orders: expect.arrayContaining([
          expect.objectContaining({
            deliveryPersonId: deliveryPerson.id,
            status: order1.status,
            address: expect.objectContaining({
              neighborhood: 'Neighborhood A',
            }),
          }),
        ]),
      }),
    );
  });
});
