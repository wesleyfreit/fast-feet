import { faker } from '@faker-js/faker';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people-repository';
import { ResetDeliveryPersonPasswordUseCase } from './reset-delivery-person-password';

let deliveryPeopleRepository: InMemoryDeliveryPeopleRepository;
let hasher: FakeHasher;

let sut: ResetDeliveryPersonPasswordUseCase;

describe('Reset Delivery Person Password Use Case', () => {
  beforeEach(() => {
    deliveryPeopleRepository = new InMemoryDeliveryPeopleRepository();

    hasher = new FakeHasher();

    sut = new ResetDeliveryPersonPasswordUseCase(deliveryPeopleRepository, hasher);
  });

  it('should be able to reset delivery person password', async () => {
    const deliveryPerson = makeDeliveryPerson({ cpf: '12345678900' });

    await deliveryPeopleRepository.create(deliveryPerson);

    const newPassword = faker.internet.password();

    const result = await sut.execute({
      deliveryPersonCpf: deliveryPerson.cpf,
      newPassword,
    });

    expect(result.isRight()).toBe(true);
    expect(deliveryPeopleRepository.items[0]).toEqual(
      expect.objectContaining({
        cpf: deliveryPerson.cpf,
        password: await hasher.hash(newPassword),
      }),
    );
  });
});
