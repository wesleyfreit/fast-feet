import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Order,
  OrderProps,
} from '@/domain/recipient-order-delivery/enterprise/entities/order';

import { makeAddress } from './make-address';

export function makeOrder(override: Partial<OrderProps> = {}, id?: UniqueEntityID) {
  const order = Order.create(
    {
      address: makeAddress(),
      recipientPersonId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return order;
}
