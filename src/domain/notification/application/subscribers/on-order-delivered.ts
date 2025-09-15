import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';

import { RecipientPeopleRepository } from '@/domain/recipient-order-delivery/application/repositories/recipient-people-repository';
import { OrderDeliveredEvent } from '@/domain/recipient-order-delivery/enterprise/events/order-delivered-event';
import { SendEmailNotificationUseCase } from '../use-cases/send-email-notification';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnOrderDelivered implements EventHandler {
  constructor(
    private sendEmailNotification: SendEmailNotificationUseCase,
    private recipientPeopleRepository: RecipientPeopleRepository,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderDeliveredNotification.bind(this),
      OrderDeliveredEvent.name,
    );
  }

  private async sendOrderDeliveredNotification({ order }: OrderDeliveredEvent) {
    const recipientPerson = await this.recipientPeopleRepository.findById(
      order.recipientPersonId.toString(),
    );

    if (recipientPerson) {
      await this.sendEmailNotification.execute({
        emailTo: recipientPerson.email,
        title: `O pedido ${order.id.toString()} foi entregue`,
        content: `O seu pedido ${order.id.toString()} foi recebido com sucesso.`,
      });
    }
  }
}
