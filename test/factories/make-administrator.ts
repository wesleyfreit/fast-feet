import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Administrator,
  AdministratorProps,
} from '@/domain/recipient-order-delivery/enterprise/entities/administrator';
import { PrismaDeliveryPersonMapper } from '@/infra/database/prisma/mappers/prisma-delivery-person-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeAdministrator(
  override: Partial<AdministratorProps> = {},
  id?: UniqueEntityID,
) {
  const administrator = Administrator.create(
    {
      name: faker.person.fullName(),
      cpf: faker.string.uuid(),
      password: faker.internet.password(),
      createdAt: new Date(),
      isAdmin: false,
      ...override,
    },
    id,
  );

  return administrator;
}

@Injectable()
export class AdministratorFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdministrator(
    data: Partial<AdministratorProps> = {},
  ): Promise<Administrator> {
    const administrator = makeAdministrator(data);

    await this.prisma.user.create({
      data: PrismaDeliveryPersonMapper.toPrisma(administrator),
    });

    return administrator;
  }
}
