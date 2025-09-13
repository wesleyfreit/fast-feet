import { PaginationParams } from '@/core/repositories/pagination-params';
import { PaginationResult } from '@/core/repositories/pagination-result';
import { Order } from '../../enterprise/entities/order';

export interface OrderFilterParams {
  recipientPersonId?: string;
  deliveryPersonId?: string;
}

export abstract class OrdersRepository {
  abstract create(order: Order): Promise<void>;
  abstract findMany(
    pagination: PaginationParams,
    filter?: OrderFilterParams,
  ): Promise<PaginationResult<Order, 'orders'>>;
  abstract findManyByDeliveryPersonId(
    deliveryPersonId: string,
    pagination: PaginationParams,
    neighborhood?: string,
  ): Promise<PaginationResult<Order, 'orders'>>;
  abstract findById(id: string): Promise<Order | null>;
  abstract save(order: Order): Promise<void>;
  abstract delete(order: Order): Promise<void>;
}
