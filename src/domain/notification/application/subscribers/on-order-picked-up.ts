import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';

import { RecipientPeopleRepository } from '@/domain/recipient-order-delivery/application/repositories/recipient-people-repository';
import { OrderPickedUpEvent } from '@/domain/recipient-order-delivery/enterprise/events/order-picked-up-event';
import { SendEmailNotificationUseCase } from '../use-cases/send-email-notification';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnOrderPickedUp implements EventHandler {
  constructor(
    private sendEmailNotification: SendEmailNotificationUseCase,
    private recipientPeopleRepository: RecipientPeopleRepository,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderPickedUpNotification.bind(this),
      OrderPickedUpEvent.name,
    );
  }

  private async sendOrderPickedUpNotification({ order }: OrderPickedUpEvent) {
    const recipientPerson = await this.recipientPeopleRepository.findById(
      order.recipientPersonId.toString(),
    );

    if (recipientPerson) {
      await this.sendEmailNotification.execute({
        emailTo: recipientPerson.email,
        title: `O pedido ${order.id.toString()} foi coletado`,
        content: `O seu pedido ${order.id.toString()} foi coletado pelos entregadores e logo chegará ao seu endereço.`,
      });
    }
  }
}
