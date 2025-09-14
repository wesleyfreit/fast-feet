import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { OrderDeliveredEvent } from '../events/order-delivered-event';
import { OrderPickedUpEvent } from '../events/order-picked-up-event';
import { OrderReturnedEvent } from '../events/order-returned-event';
import { OrderWaitingEvent } from '../events/order-waiting-event';
import { Address } from './value-objects/address';

export enum OrderStatus {
  WAITING_PICK_UP = 'WAITING_PICK_UP',
  PICKED_UP = 'PICKED_UP',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
}

export interface OrderProps {
  recipientPersonId: UniqueEntityID;
  deliveryPersonId?: UniqueEntityID | null;
  address: Address;
  status: OrderStatus;
  photoProof?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Order extends AggregateRoot<OrderProps> {
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

    this.touch();

    this.addDomainEvent(new OrderPickedUpEvent(this));
  }

  deliver(photoUrl: string) {
    if (this.props.status !== OrderStatus.PICKED_UP) {
      throw new Error('Order must be picked up before it can be delivered');
    }

    this.props.photoProof = photoUrl;
    this.props.status = OrderStatus.DELIVERED;

    this.touch();

    this.addDomainEvent(new OrderDeliveredEvent(this));
  }

  returnToSender() {
    if (this.props.status !== OrderStatus.PICKED_UP) {
      throw new Error('Only orders picked up can be returned');
    }

    this.props.status = OrderStatus.RETURNED;

    this.touch();

    this.addDomainEvent(new OrderReturnedEvent(this));
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<OrderProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const orderOrder = new Order(
      {
        ...props,
        status: props.status ?? OrderStatus.WAITING_PICK_UP,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    orderOrder.addDomainEvent(new OrderWaitingEvent(orderOrder));

    return orderOrder;
  }
}
