import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  RecipientPerson,
  RecipientPersonProps,
} from '@/domain/recipient-order-delivery/enterprise/entities/recipient-person';

import { faker } from '@faker-js/faker';

export function makeRecipientPerson(
  override: Partial<RecipientPersonProps> = {},
  id?: UniqueEntityID,
) {
  const recipientperson = RecipientPerson.create(
    {
      name: faker.person.fullName(),
      cpf: faker.string.uuid(),
      email: faker.internet.email(),
      createdAt: new Date(),
      ...override,
    },
    id,
  );

  return recipientperson;
}
