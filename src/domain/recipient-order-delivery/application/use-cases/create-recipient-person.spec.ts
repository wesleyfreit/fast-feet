import { faker } from '@faker-js/faker';
import { InMemoryRecipientPeopleRepository } from 'test/repositories/in-memory-recipient-people-repository';
import { CreateRecipientPersonUseCase } from './create-recipient-person';

let recipientPeopleRepository: InMemoryRecipientPeopleRepository;

let sut: CreateRecipientPersonUseCase;

describe('Create Recipient Person Use Case', () => {
  beforeEach(() => {
    recipientPeopleRepository = new InMemoryRecipientPeopleRepository();

    sut = new CreateRecipientPersonUseCase(recipientPeopleRepository);
  });

  it('should be able to create a recipient person of orders', async () => {
    const result = await sut.execute({
      name: faker.person.fullName(),
      cpf: faker.string.uuid(),
      email: faker.internet.email(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        recipientPerson: recipientPeopleRepository.items[0],
      }),
    );
  });
});
