import { faker } from '@faker-js/faker';
import { InMemoryRecipientPeopleRepository } from 'test/repositories/in-memory-recipient-people-repository';
import { RegisterRecipientPersonUseCase } from './register-recipient-person';

let recipientPeopleRepository: InMemoryRecipientPeopleRepository;

let sut: RegisterRecipientPersonUseCase;

describe('Register Recipient Person Use Case', () => {
  beforeEach(() => {
    recipientPeopleRepository = new InMemoryRecipientPeopleRepository();

    sut = new RegisterRecipientPersonUseCase(recipientPeopleRepository);
  });

  it('should be able to register a recipient person of orders', async () => {
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
