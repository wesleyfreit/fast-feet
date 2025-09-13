import { DomainEvent } from '@/core/events/domain-event';
import { Order } from '../entities/order';

export class OrderReturnedEvent implements DomainEvent {
  public readonly ocurredAt: Date;

  constructor(public readonly order: Order) {
    this.ocurredAt = new Date();
  }

  getAggregateId() {
    return this.order.id;
  }
}
