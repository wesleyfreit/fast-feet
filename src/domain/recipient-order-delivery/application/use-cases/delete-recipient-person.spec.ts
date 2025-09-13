import { makeRecipientPerson } from 'test/factories/make-recipient-person';
import { InMemoryRecipientPeopleRepository } from 'test/repositories/in-memory-recipient-people-repository';
import { DeleteRecipientPersonUseCase } from './delete-recipient-person';

let recipientPeopleRepository: InMemoryRecipientPeopleRepository;

let sut: DeleteRecipientPersonUseCase;

describe('Delete Recipient Person Use Case', () => {
  beforeEach(() => {
    recipientPeopleRepository = new InMemoryRecipientPeopleRepository();

    sut = new DeleteRecipientPersonUseCase(recipientPeopleRepository);
  });

  it('should be able to delete a recipient person', async () => {
    const recipientPerson = makeRecipientPerson();

    await recipientPeopleRepository.create(recipientPerson);

    const result = await sut.execute({
      recipientPersonId: recipientPerson.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(recipientPeopleRepository.items.length).toBe(0);
  });
});
