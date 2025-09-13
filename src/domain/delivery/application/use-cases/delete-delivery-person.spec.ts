import { makeDeliveryPerson } from 'test/factories/make-delivery-people';
import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people-repository';
import { DeleteDeliveryPersonUseCase } from './delete-delivery-person';

let deliveryPeopleRepository: InMemoryDeliveryPeopleRepository;

let sut: DeleteDeliveryPersonUseCase;

describe('Delete Delivery Person Use Case', () => {
  beforeEach(() => {
    deliveryPeopleRepository = new InMemoryDeliveryPeopleRepository();

    sut = new DeleteDeliveryPersonUseCase(deliveryPeopleRepository);
  });

  it('should be able to delete a delivery person', async () => {
    const deliveryPerson = makeDeliveryPerson();

    await deliveryPeopleRepository.create(deliveryPerson);

    const result = await sut.execute({ deliveryPersonId: deliveryPerson.id.toString() });

    expect(result.isRight()).toBe(true);
    expect(deliveryPeopleRepository.items.length).toBe(0);
  });
});
