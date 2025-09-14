import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  RecipientPerson,
  RecipientPersonProps,
} from '@/domain/recipient-order-delivery/enterprise/entities/recipient-person';
import { PrismaRecipientPersonMapper } from '@/infra/database/prisma/mappers/prisma-recipient-person-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeRecipientPerson(
  override: Partial<RecipientPersonProps> = {},
  id?: UniqueEntityID,
) {
  const recipientPerson = RecipientPerson.create(
    {
      name: faker.person.fullName(),
      cpf: faker.string.uuid(),
      email: faker.internet.email(),
      createdAt: new Date(),
      ...override,
    },
    id,
  );

  return recipientPerson;
}

@Injectable()
export class RecipientPersonFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipientPerson(
    data: Partial<RecipientPersonProps> = {},
  ): Promise<RecipientPerson> {
    const recipientPerson = makeRecipientPerson(data);

    await this.prisma.recipient.create({
      data: PrismaRecipientPersonMapper.toPrisma(recipientPerson),
    });

    return recipientPerson;
  }
}
