import { faker } from '@faker-js/faker';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people-repository';
import { UpdateDeliveryPersonUseCase } from './update-delivery-person';

let deliveryPeopleRepository: InMemoryDeliveryPeopleRepository;

let sut: UpdateDeliveryPersonUseCase;

describe('Update Delivery Person Use Case', () => {
  beforeEach(() => {
    deliveryPeopleRepository = new InMemoryDeliveryPeopleRepository();

    sut = new UpdateDeliveryPersonUseCase(deliveryPeopleRepository);
  });

  it('should be able to update delivery person information', async () => {
    const deliveryPerson = makeDeliveryPerson();

    await deliveryPeopleRepository.create(deliveryPerson);

    const newName = faker.person.firstName();
    const newCpf = faker.string.uuid();

    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString(),
      newName,
      newCpf,
    });

    expect(result.isRight()).toBe(true);
    expect(deliveryPeopleRepository.items[0]).toEqual(
      expect.objectContaining({
        id: deliveryPerson.id,
        cpf: newCpf,
        name: newName,
      }),
    );
  });
});
