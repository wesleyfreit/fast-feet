import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people-repository';
import { GrantAdministratorAccessUseCase } from './grant-administrator-access';

let deliveryPeopleRepository: InMemoryDeliveryPeopleRepository;

let sut: GrantAdministratorAccessUseCase;

describe('Grant Administrator Access Use Case', () => {
  beforeEach(() => {
    deliveryPeopleRepository = new InMemoryDeliveryPeopleRepository();

    sut = new GrantAdministratorAccessUseCase(deliveryPeopleRepository);
  });

  it('should be able to grant administrator access to delivery person', async () => {
    const deliveryPerson = makeDeliveryPerson({ cpf: '12345678900' });

    await deliveryPeopleRepository.create(deliveryPerson);

    const result = await sut.execute({
      deliveryPersonCpf: deliveryPerson.cpf,
    });

    expect(result.isRight()).toBe(true);
    expect(deliveryPeopleRepository.items[0]).toEqual(
      expect.objectContaining({
        cpf: deliveryPerson.cpf,
        isAdmin: true,
      }),
    );
  });
});
