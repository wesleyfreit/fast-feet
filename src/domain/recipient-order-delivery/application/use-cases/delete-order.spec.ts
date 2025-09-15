import { makeOrder } from 'test/factories/make-order';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { DeleteOrderUseCase } from './delete-order';

let ordersRepository: InMemoryOrdersRepository;

let sut: DeleteOrderUseCase;

describe('Delete Order Use Case', () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();

    sut = new DeleteOrderUseCase(ordersRepository);
  });

  it('should be able to delete an order', async () => {
    const order = makeOrder();

    await ordersRepository.create(order);

    const result = await sut.execute({ orderId: order.id.toString() });

    expect(result.isRight()).toBe(true);
    expect(ordersRepository.items.length).toBe(0);
  });
});
