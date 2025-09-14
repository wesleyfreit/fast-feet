import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { OrderFilterParams } from '@/domain/recipient-order-delivery/application/repositories/orders-repository';
import {
  Order,
  OrderStatus,
} from '@/domain/recipient-order-delivery/enterprise/entities/order';
import { Address } from '@/domain/recipient-order-delivery/enterprise/entities/value-objects/address';

import { Prisma, Delivery as PrismaDelivery } from 'generated/prisma/client';

export class PrismaOrderMapper {
  static toDomain(raw: PrismaDelivery): Order {
    return Order.create(
      {
        recipientPersonId: new UniqueEntityID(raw.recipientId),
        deliveryPersonId: raw.deliveryManId
          ? new UniqueEntityID(raw.deliveryManId)
          : null,
        status: raw.status as OrderStatus,
        photoProof: raw.photoProof || null,
        address: Address.create({
          street: raw.street,
          number: raw.number,
          complement: raw.complement || null,
          state: raw.state,
          city: raw.city,
          zipCode: raw.zipCode,
          neighborhood: raw.neighborhood,
        }),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(order: Order): Prisma.DeliveryUncheckedCreateInput {
    return {
      id: order.id.toString(),
      recipientId: order.recipientPersonId.toString(),
      deliveryManId: order.deliveryPersonId?.toString() || null,
      status: order.status,
      photoProof: order.photoProof || null,
      street: order.address.street,
      number: order.address.number,
      complement: order.address.complement,
      state: order.address.state,
      city: order.address.city,
      zipCode: order.address.zipCode,
      neighborhood: order.address.neighborhood,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  static toWhereInput(filter?: OrderFilterParams): Prisma.DeliveryWhereInput {
    const whereInput: Prisma.DeliveryWhereInput = {};

    if (filter?.deliveryPersonId) {
      whereInput.deliveryManId = filter.deliveryPersonId;
    }

    if (filter?.recipientPersonId) {
      whereInput.recipientId = filter.recipientPersonId;
    }

    return whereInput;
  }

  static toWhereInputByNeighborhood(
    deliveryPersonId: string,
    neighborhood?: string,
  ): Prisma.DeliveryWhereInput {
    const whereInput: Prisma.DeliveryWhereInput = {
      deliveryManId: deliveryPersonId,
    };

    if (neighborhood) {
      whereInput.neighborhood = {
        contains: neighborhood,
        mode: 'insensitive',
      };
    }

    return whereInput;
  }
}
