import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { RecipientPerson } from '@/domain/recipient-order-delivery/enterprise/entities/recipient-person';
import { Prisma, Recipient as PrismaRecipient } from 'generated/prisma/client';

export class PrismaRecipientPersonMapper {
  static toDomain(raw: PrismaRecipient): RecipientPerson {
    return RecipientPerson.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        email: raw.email,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    recipientPerson: RecipientPerson,
  ): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipientPerson.id.toString(),
      name: recipientPerson.name,
      cpf: recipientPerson.cpf,
      email: recipientPerson.email,
      createdAt: recipientPerson.createdAt,
      updatedAt: recipientPerson.updatedAt,
    };
  }
}
