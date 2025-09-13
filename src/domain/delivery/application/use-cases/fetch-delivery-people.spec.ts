import { makeDeliveryPerson } from 'test/factories/make-delivery-people';
import { promoteToAdministrator } from 'test/factories/promote-to-administrator';
import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people-repository';
import { FetchDeliveryPeopleUseCase } from './fetch-delivery-people';

let deliveryPeopleRepository: InMemoryDeliveryPeopleRepository;

let sut: FetchDeliveryPeopleUseCase;

describe('Fetch Delivery People Use Case', () => {
  beforeEach(() => {
    deliveryPeopleRepository = new InMemoryDeliveryPeopleRepository();

    sut = new FetchDeliveryPeopleUseCase(deliveryPeopleRepository);
  });

  it('should be able to fetch delivery people accounts', async () => {
    await deliveryPeopleRepository.create(makeDeliveryPerson({ cpf: '12345678900' }));
    await deliveryPeopleRepository.create(makeDeliveryPerson({ cpf: '98765432100' }));
    await deliveryPeopleRepository.create(makeDeliveryPerson({ cpf: '11122233344' }));

    const result = await sut.execute({ pagination: { page: 1, perPage: 2 } });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        deliveryPeople: expect.arrayContaining([
          expect.objectContaining({
            cpf: '12345678900',
          }),
          expect.objectContaining({
            cpf: '98765432100',
          }),
        ]),
      }),
    );
  });
  it('should be able to fetch delivery people accounts', async () => {
    const deliveryPerson = makeDeliveryPerson({ cpf: '12345678900' });

    await deliveryPeopleRepository.create(deliveryPerson);
    await deliveryPeopleRepository.create(makeDeliveryPerson({ cpf: '98765432100' }));
    await deliveryPeopleRepository.create(makeDeliveryPerson({ cpf: '11122233344' }));

    await deliveryPeopleRepository.save(
      promoteToAdministrator(deliveryPerson, deliveryPerson.id),
    );

    const result = await sut.execute({
      pagination: { page: 1, perPage: 2 },
      filter: { isAdmin: true },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        deliveryPeople: expect.arrayContaining([
          expect.objectContaining({
            cpf: '12345678900',
          }),
        ]),
      }),
    );
  });
});
