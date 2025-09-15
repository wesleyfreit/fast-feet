import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';

import { RecipientPeopleRepository } from '@/domain/recipient-order-delivery/application/repositories/recipient-people-repository';
import { OrderWaitingEvent } from '@/domain/recipient-order-delivery/enterprise/events/order-waiting-event';
import { SendEmailNotificationUseCase } from '../use-cases/send-email-notification';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnOrderWaiting implements EventHandler {
  constructor(
    private sendEmailNotification: SendEmailNotificationUseCase,
    private recipientPeopleRepository: RecipientPeopleRepository,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderWaitingNotification.bind(this),
      OrderWaitingEvent.name,
    );
  }

  private async sendOrderWaitingNotification({ order }: OrderWaitingEvent) {
    const recipientPerson = await this.recipientPeopleRepository.findById(
      order.recipientPersonId.toString(),
    );

    if (recipientPerson) {
      await this.sendEmailNotification.execute({
        emailTo: recipientPerson.email,
        title: `O pedido ${order.id.toString()} está aguardando a coleta`,
        content: `O seu pedido ${order.id.toString()} está aguardando a coleta pelos entregadores.`,
      });
    }
  }
}
