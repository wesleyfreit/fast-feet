import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Administrator } from '@/domain/recipient-order-delivery/enterprise/entities/administrator';
import { DeliveryPerson } from '@/domain/recipient-order-delivery/enterprise/entities/delivery-person';
import { PrismaDeliveryPersonMapper } from '@/infra/database/prisma/mappers/prisma-delivery-person-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export function promoteToAdministrator(
  deliveryPerson: DeliveryPerson,
  id: UniqueEntityID,
) {
  const administrator = Administrator.create(
    {
      name: deliveryPerson.name,
      cpf: deliveryPerson.cpf,
      password: deliveryPerson.password,
      createdAt: deliveryPerson.createdAt,
      updatedAt: new Date(),
    },
    id,
  );

  return administrator;
}

@Injectable()
export class PromoteAdministratorFactory {
  constructor(private prisma: PrismaService) {}

  async promoteToAdministrator(deliveryPerson: DeliveryPerson): Promise<Administrator> {
    const administrator = promoteToAdministrator(deliveryPerson, deliveryPerson.id);

    await this.prisma.user.update({
      where: { id: deliveryPerson.id.toString() },
      data: PrismaDeliveryPersonMapper.toPrisma(administrator),
    });

    return administrator;
  }
}
