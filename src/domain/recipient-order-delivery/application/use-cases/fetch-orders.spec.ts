import { makeOrder } from 'test/factories/make-order';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { FetchOrdersUseCase } from './fetch-orders';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let ordersRepository: InMemoryOrdersRepository;

let sut: FetchOrdersUseCase;

describe('Fetch Orders Use Case', () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();

    sut = new FetchOrdersUseCase(ordersRepository);
  });

  it('should be able to fetch orders', async () => {
    await ordersRepository.create(makeOrder());
    await ordersRepository.create(makeOrder());

    const result = await sut.execute({ pagination: { page: 1, perPage: 2 } });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        prev: null,
        current: 1,
        next: null,
        perPage: 2,
        pages: 1,
        items: 2,
        orders: expect.arrayContaining([
          expect.objectContaining({
            recipientPersonId: expect.any(UniqueEntityID),
          }),
          expect.objectContaining({
            recipientPersonId: expect.any(UniqueEntityID),
          }),
        ]),
      }),
    );
  });
});
