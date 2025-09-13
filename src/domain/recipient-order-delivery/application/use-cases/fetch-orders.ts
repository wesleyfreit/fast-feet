import { Either, right } from '@/core/logic/either';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { PaginationResult } from '@/core/repositories/pagination-result';
import { Injectable } from '@nestjs/common';
import { Order } from '../../enterprise/entities/order';

import { OrderFilterParams, OrdersRepository } from '../repositories/orders-repository';

interface FetchOrdersUseCaseRequest {
  pagination: PaginationParams;
  filter?: OrderFilterParams;
}

type FetchOrdersUseCaseResponse = Either<null, PaginationResult<Order, 'orders'>>;

@Injectable()
export class FetchOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    pagination,
    filter,
  }: FetchOrdersUseCaseRequest): Promise<FetchOrdersUseCaseResponse> {
    const deliveryPersonOrders = await this.ordersRepository.findMany(pagination, filter);

    return right(deliveryPersonOrders);
  }
}
