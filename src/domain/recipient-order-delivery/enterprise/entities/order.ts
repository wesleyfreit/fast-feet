import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { Address } from './value-objects/address';

export enum OrderStatus {
  PENDING = 'pending',
  PICKED_UP = 'picked_up',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
}

export interface OrderProps {
  recipientPersonId: UniqueEntityID;
  deliveryPersonId?: UniqueEntityID | null;
  address: Address;
  status: OrderStatus;
  photoProof?: string | null;
  createdAt: Date;
}

export class Order extends Entity<OrderProps> {
  get recipientPersonId() {
    return this.props.recipientPersonId;
  }

  get deliveryPersonId() {
    return this.props.deliveryPersonId;
  }

  set deliveryPersonId(deliveryPersonId: UniqueEntityID | null | undefined) {
    this.props.deliveryPersonId = deliveryPersonId;
  }

  get address() {
    return this.props.address;
  }

  get status() {
    return this.props.status;
  }

  set status(status: OrderStatus) {
    this.props.status = status;
  }

  get photoProof() {
    return this.props.photoProof;
  }

  set photoProof(photoProof: string | null | undefined) {
    this.props.photoProof = photoProof;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<OrderProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const orderOrder = new Order(
      {
        ...props,
        status: OrderStatus.PENDING,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return orderOrder;
  }
}
