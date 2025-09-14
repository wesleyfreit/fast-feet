import { makeRecipientPerson } from 'test/factories/make-recipient-person';
import { InMemoryRecipientPeopleRepository } from 'test/repositories/in-memory-recipient-people-repository';
import { FetchRecipientPeopleUseCase } from './fetch-recipient-people';

let recipientPeopleRepository: InMemoryRecipientPeopleRepository;

let sut: FetchRecipientPeopleUseCase;

describe('Fetch Recipient People Use Case', () => {
  beforeEach(() => {
    recipientPeopleRepository = new InMemoryRecipientPeopleRepository();

    sut = new FetchRecipientPeopleUseCase(recipientPeopleRepository);
  });

  it('should be able to fetch recipient people of orders', async () => {
    await recipientPeopleRepository.create(makeRecipientPerson({ cpf: '12345678900' }));
    await recipientPeopleRepository.create(makeRecipientPerson({ cpf: '98765432100' }));
    await recipientPeopleRepository.create(makeRecipientPerson({ cpf: '11122233344' }));

    const result = await sut.execute({ pagination: { page: 1, perPage: 2 } });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        prev: null,
        current: 1,
        next: 2,
        perPage: 2,
        pages: 2,
        items: 3,
        recipients: expect.arrayContaining([
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
});
