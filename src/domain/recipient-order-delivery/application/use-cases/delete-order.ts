import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Either, left, right } from '@/core/logic/either';
import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../repositories/orders-repository';

interface DeleteOrderUseCaseRequest {
  orderId: string;
}

type DeleteOrderUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class DeleteOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
  }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    await this.ordersRepository.delete(order);

    return right(null);
  }
}
