import { Either, right } from '@/core/logic/either';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { PaginationResult } from '@/core/repositories/pagination-result';
import { Injectable } from '@nestjs/common';
import { Order } from '../../enterprise/entities/order';

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { OrdersRepository } from '../repositories/orders-repository';

interface FetchDeliveryPersonOrdersUseCaseRequest {
  deliveryPersonId: string;
  pagination: PaginationParams;
  neighborhood?: string;
}

type FetchDeliveryPersonOrdersUseCaseResponse = Either<
  ResourceNotFoundError,
  PaginationResult<Order, 'orders'>
>;

@Injectable()
export class FetchDeliveryPersonOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    pagination,
    deliveryPersonId,
    neighborhood,
  }: FetchDeliveryPersonOrdersUseCaseRequest): Promise<FetchDeliveryPersonOrdersUseCaseResponse> {
    const deliveryPersonOrders = await this.ordersRepository.findManyByDeliveryPersonId(
      deliveryPersonId,
      pagination,
      neighborhood,
    );

    return right(deliveryPersonOrders);
  }
}
