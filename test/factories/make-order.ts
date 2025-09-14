import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Order,
  OrderProps,
} from '@/domain/recipient-order-delivery/enterprise/entities/order';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { makeAddress } from './make-address';
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/prisma-order-mapper';

export function makeOrder(override: Partial<OrderProps> = {}, id?: UniqueEntityID) {
  const order = Order.create(
    {
      address: makeAddress(),
      recipientPersonId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return order;
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
    const order = makeOrder(data);

    await this.prisma.delivery.create({
      data: PrismaOrderMapper.toPrisma(order),
    });

    return order;
  }
}
