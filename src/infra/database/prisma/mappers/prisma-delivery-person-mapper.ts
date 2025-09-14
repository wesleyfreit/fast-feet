import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DeliveryPersonFilterParams } from '@/domain/recipient-order-delivery/application/repositories/delivery-people-repository';
import { Administrator } from '@/domain/recipient-order-delivery/enterprise/entities/administrator';
import { DeliveryPerson } from '@/domain/recipient-order-delivery/enterprise/entities/delivery-person';
import { Prisma, User as PrismaUser, Role } from 'generated/prisma/client';

export class PrismaDeliveryPersonMapper {
  static toDomain(raw: PrismaUser): DeliveryPerson | Administrator {
    if (raw.role === Role.ADMIN) {
      return Administrator.create(
        {
          name: raw.name,
          cpf: raw.cpf,
          password: raw.password,
          createdAt: raw.createdAt,
          updatedAt: raw.updatedAt,
        },
        new UniqueEntityID(raw.id),
      );
    }

    return DeliveryPerson.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    deliveryPerson: DeliveryPerson | Administrator,
  ): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryPerson.id.toString(),
      name: deliveryPerson.name,
      cpf: deliveryPerson.cpf,
      password: deliveryPerson.password,
      createdAt: deliveryPerson.createdAt,
      role: deliveryPerson.isAdmin ? Role.ADMIN : Role.USER,
      updatedAt: deliveryPerson.updatedAt,
    };
  }

  static toWhereInput(filter?: DeliveryPersonFilterParams): Prisma.UserWhereInput {
    const whereInput: Prisma.UserWhereInput = {};

    if (filter?.isAdmin === true) {
      whereInput.role = Role.ADMIN;
    } else if (filter?.isAdmin === false) {
      whereInput.role = Role.USER;
    }

    return whereInput;
  }
}
