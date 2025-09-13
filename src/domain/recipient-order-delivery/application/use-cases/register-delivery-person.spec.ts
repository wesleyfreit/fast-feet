import { faker } from '@faker-js/faker';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people-repository';
import { RegisterDeliveryPersonUseCase } from './register-delivery-person';

let deliveryPeopleRepository: InMemoryDeliveryPeopleRepository;
let hasher: FakeHasher;

let sut: RegisterDeliveryPersonUseCase;

describe('Register Delivery Person Use Case', () => {
  beforeEach(() => {
    deliveryPeopleRepository = new InMemoryDeliveryPeopleRepository();

    hasher = new FakeHasher();

    sut = new RegisterDeliveryPersonUseCase(deliveryPeopleRepository, hasher);
  });

  it('should be able to register a delivery person account', async () => {
    const result = await sut.execute({
      name: faker.person.fullName(),
      cpf: faker.string.uuid(),
      password: faker.internet.password(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        deliveryPerson: deliveryPeopleRepository.items[0],
      }),
    );
  });
});
