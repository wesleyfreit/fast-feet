import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  DeliveryPerson,
  DeliveryPersonProps,
} from '@/domain/recipient-order-delivery/enterprise/entities/delivery-person';

import { faker } from '@faker-js/faker';

export function makeDeliveryPerson(
  override: Partial<DeliveryPersonProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryperson = DeliveryPerson.create(
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

  return deliveryperson;
}
