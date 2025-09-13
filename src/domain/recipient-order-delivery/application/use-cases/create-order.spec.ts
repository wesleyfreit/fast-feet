import { faker } from '@faker-js/faker';
import { makeRecipientPerson } from 'test/factories/make-recipient-person';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryRecipientPeopleRepository } from 'test/repositories/in-memory-recipient-people-repository';
import { OrderStatus } from '../../enterprise/entities/order';
import { CreateOrderUseCase } from './create-order';

let recipientPeopleRepository: InMemoryRecipientPeopleRepository;
let ordersRepository: InMemoryOrdersRepository;

let sut: CreateOrderUseCase;

describe('Create Order Use Case', () => {
  beforeEach(() => {
    recipientPeopleRepository = new InMemoryRecipientPeopleRepository();
    ordersRepository = new InMemoryOrdersRepository();

    sut = new CreateOrderUseCase(recipientPeopleRepository, ordersRepository);
  });

  it('should be able to create a new order', async () => {
    const recipientPerson = makeRecipientPerson();

    await recipientPeopleRepository.create(recipientPerson);

    const result = await sut.execute({
      city: faker.location.city(),
      street: faker.location.street(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      number: faker.location.buildingNumber(),
      complement: faker.location.secondaryAddress(),
      recipientPersonId: recipientPerson.id.toString(),
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
          status: OrderStatus.PENDING,
        }),
      }),
    );
  });
});
