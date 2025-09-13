import { PaginationParams } from '@/core/repositories/pagination-params';
import { PaginationResult } from '@/core/repositories/pagination-result';
import {
  OrderFilterParams,
  OrdersRepository,
} from '@/domain/recipient-order-delivery/application/repositories/orders-repository';
import { Order } from '@/domain/recipient-order-delivery/enterprise/entities/order';

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = [];

  async create(order: Order): Promise<void> {
    this.items.push(order);
  }

  async findMany(
    pagination: PaginationParams,
    filter?: OrderFilterParams,
  ): Promise<PaginationResult<Order, 'orders'>> {
    const { page, perPage } = pagination;

    const filteredOrders = this.items.filter((order) =>
      filter?.recipientPersonId
        ? order.recipientPersonId.toString() === filter.recipientPersonId
        : filter?.deliveryPersonId
          ? order.deliveryPersonId?.toString() === filter.deliveryPersonId
          : true,
    );

    const orders = filteredOrders.slice((page - 1) * perPage, page * perPage);

    const totalItems = filteredOrders.length;

    const totalPages = Math.ceil(totalItems / perPage);
    const currentPage = page > totalPages ? totalPages : page;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return {
      prev: prevPage,
      current: currentPage,
      next: nextPage,
      pages: totalPages,
      perPage: perPage,
      items: totalItems,
      orders: orders,
    };
  }

  async findById(orderId: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === orderId);

    if (!order) {
      return null;
    }

    return order;
  }

  async save(order: Order): Promise<void> {
    const orderIndex = this.items.findIndex((item) => item.id === order.id);

    this.items[orderIndex] = order;
  }

  async delete(order: Order): Promise<void> {
    const index = this.items.findIndex((item) => item.id === order.id);

    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}
