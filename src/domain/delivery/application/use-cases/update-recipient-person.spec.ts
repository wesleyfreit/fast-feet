import { faker } from '@faker-js/faker';
import { makeRecipientPerson } from 'test/factories/make-recipient-person';
import { InMemoryRecipientPeopleRepository } from 'test/repositories/in-memory-recipient-people-repository';
import { UpdateRecipientPersonUseCase } from './update-recipient-person';

let recipientPeopleRepository: InMemoryRecipientPeopleRepository;

let sut: UpdateRecipientPersonUseCase;

describe('Update Recipient Person Use Case', () => {
  beforeEach(() => {
    recipientPeopleRepository = new InMemoryRecipientPeopleRepository();

    sut = new UpdateRecipientPersonUseCase(recipientPeopleRepository);
  });

  it('should be able to update recipient person information', async () => {
    const recipientPerson = makeRecipientPerson();

    await recipientPeopleRepository.create(recipientPerson);

    const newName = faker.person.firstName();
    const newCpf = faker.string.uuid();
    const newEmail = faker.internet.email();

    const result = await sut.execute({
      recipientPersonId: recipientPerson.id.toString(),
      newName,
      newCpf,
      newEmail,
    });

    expect(result.isRight()).toBe(true);
    expect(recipientPeopleRepository.items[0]).toEqual(
      expect.objectContaining({
        id: recipientPerson.id,
        cpf: newCpf,
        name: newName,
        email: newEmail,
      }),
    );
  });
});
