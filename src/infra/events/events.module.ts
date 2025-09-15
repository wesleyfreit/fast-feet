import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

import { OnOrderDelivered } from '@/domain/notification/application/subscribers/on-order-delivered';
import { OnOrderPickedUp } from '@/domain/notification/application/subscribers/on-order-picked-up';
import { OnOrderReturned } from '@/domain/notification/application/subscribers/on-order-returned';
import { OnOrderWaiting } from '@/domain/notification/application/subscribers/on-order-waiting';
import { SendEmailNotificationUseCase } from '@/domain/notification/application/use-cases/send-email-notification';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [DatabaseModule, MailerModule],
  providers: [
    OnOrderDelivered,
    OnOrderPickedUp,
    OnOrderReturned,
    OnOrderWaiting,
    SendEmailNotificationUseCase,
  ],
})
export class EventModule {}
