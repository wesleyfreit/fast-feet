import {
  Address,
  AddressProps,
} from '@/domain/recipient-order-delivery/enterprise/entities/value-objects/address';

import { faker } from '@faker-js/faker';

export function makeAddress(override: Partial<AddressProps> = {}) {
  const address = Address.create({
    city: faker.location.city(),
    street: faker.location.street(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    number: faker.location.buildingNumber(),
    complement: faker.location.secondaryAddress(),
    ...override,
  });

  return address;
}
