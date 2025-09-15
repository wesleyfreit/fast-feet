import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';

import { RecipientPeopleRepository } from '@/domain/recipient-order-delivery/application/repositories/recipient-people-repository';
import { OrderReturnedEvent } from '@/domain/recipient-order-delivery/enterprise/events/order-returned-event';
import { SendEmailNotificationUseCase } from '../use-cases/send-email-notification';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnOrderReturned implements EventHandler {
  constructor(
    private sendEmailNotification: SendEmailNotificationUseCase,
    private recipientPeopleRepository: RecipientPeopleRepository,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderReturnedNotification.bind(this),
      OrderReturnedEvent.name,
    );
  }

  private async sendOrderReturnedNotification({ order }: OrderReturnedEvent) {
    const recipientPerson = await this.recipientPeopleRepository.findById(
      order.recipientPersonId.toString(),
    );

    if (recipientPerson) {
      await this.sendEmailNotification.execute({
        emailTo: recipientPerson.email,
        title: `O pedido ${order.id.toString()} foi devolvido`,
        content: `O seu pedido ${order.id.toString()} retornou à filial e foi devolvido pelos entregadores.`,
      });
    }
  }
}
