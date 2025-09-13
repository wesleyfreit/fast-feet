import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Administrator,
  AdministratorProps,
} from '@/domain/recipient-order-delivery/enterprise/entities/administrator';

import { faker } from '@faker-js/faker';

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
