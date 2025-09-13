import { faker } from '@faker-js/faker';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people-repository';
import { AuthenticateUseCase } from './authenticate';

let deliveryPeopleRepository: InMemoryDeliveryPeopleRepository;
let hasher: FakeHasher;
let encrypter: FakeEncrypter;

let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    deliveryPeopleRepository = new InMemoryDeliveryPeopleRepository();

    hasher = new FakeHasher();
    encrypter = new FakeEncrypter();

    sut = new AuthenticateUseCase(deliveryPeopleRepository, hasher, encrypter);
  });

  it('should be able to authenticate a delivery person by cpf and password', async () => {
    const cpf = faker.string.uuid();
    const password = faker.internet.password();
    const hashedPassword = await hasher.hash(password);

    const newAccount = makeDeliveryPerson({
      cpf,
      password: hashedPassword,
    });

    await deliveryPeopleRepository.create(newAccount);

    const result = await sut.execute({
      cpf,
      password,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    );
  });
});
