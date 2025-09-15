import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { PaginationResult } from '@/core/repositories/pagination-result';
import {
  OrderFilterParams,
  OrdersRepository,
} from '@/domain/recipient-order-delivery/application/repositories/orders-repository';
import { Order } from '@/domain/recipient-order-delivery/enterprise/entities/order';
import { Injectable } from '@nestjs/common';
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);
    await this.prisma.delivery.create({ data });

    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async findMany(
    pagination: PaginationParams,
    filter?: OrderFilterParams,
  ): Promise<PaginationResult<Order, 'orders'>> {
    const whereInput = PrismaOrderMapper.toWhereInput(filter);

    const totalItems = await this.prisma.delivery.count({
      where: whereInput,
    });

    const { page, perPage } = pagination;

    const totalPages = Math.ceil(totalItems / perPage);
    const currentPage = page > totalPages ? totalPages : page;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    const order = await this.prisma.delivery.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      prev: prevPage,
      current: currentPage,
      next: nextPage,
      pages: totalPages,
      perPage: perPage,
      items: totalItems,
      orders: order.map((order) => PrismaOrderMapper.toDomain(order)),
    };
  }

  async findManyByDeliveryPersonId(
    deliveryPersonId: string,
    pagination: PaginationParams,
    neighborhood?: string,
  ): Promise<PaginationResult<Order, 'orders'>> {
    const whereInput = PrismaOrderMapper.toWhereInputByNeighborhood(
      deliveryPersonId,
      neighborhood,
    );

    const totalItems = await this.prisma.delivery.count({
      where: whereInput,
    });

    const { page, perPage } = pagination;

    const totalPages = Math.ceil(totalItems / perPage);

    const currentPage = page > totalPages ? totalPages : page;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    const orders = await this.prisma.delivery.findMany({
      where: whereInput,
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      prev: prevPage,
      current: currentPage,
      next: nextPage,
      pages: totalPages,
      perPage: perPage,
      items: totalItems,
      orders: orders.map((order) => PrismaOrderMapper.toDomain(order)),
    };
  }

  async findById(id: string): Promise<Order | null> {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id },
    });

    if (!delivery) {
      return null;
    }

    return PrismaOrderMapper.toDomain(delivery);
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.delivery.update({
      where: { id: order.id.toString() },
      data,
    });

    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async delete(order: Order): Promise<void> {
    await this.prisma.delivery.delete({
      where: {
        id: order.id.toString(),
      },
    });
  }
}
