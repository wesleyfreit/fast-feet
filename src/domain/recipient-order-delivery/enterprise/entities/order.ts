import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { Address } from './value-objects/address';

export enum OrderStatus {
  WAITING_PICK_UP = 'waiting_pick_up',
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

  get address() {
    return this.props.address;
  }

  get status() {
    return this.props.status;
  }

  get photoProof() {
    return this.props.photoProof;
  }

  pickUp(deliveryPersonId: UniqueEntityID) {
    if (this.props.status !== OrderStatus.WAITING_PICK_UP) {
      throw new Error('Order cannot be picked up unless it is waiting for pick up');
    }

    this.props.deliveryPersonId = deliveryPersonId;
    this.props.status = OrderStatus.PICKED_UP;
  }

  deliver(photoUrl: string) {
    if (this.props.status !== OrderStatus.PICKED_UP) {
      throw new Error('Order must be picked up before it can be delivered');
    }

    this.props.photoProof = photoUrl;
    this.props.status = OrderStatus.DELIVERED;
  }

  returnToSender() {
    if (this.props.status !== OrderStatus.PICKED_UP) {
      throw new Error('Only orders picked up can be returned');
    }

    this.props.status = OrderStatus.RETURNED;
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
        status: OrderStatus.WAITING_PICK_UP,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return orderOrder;
  }
}
