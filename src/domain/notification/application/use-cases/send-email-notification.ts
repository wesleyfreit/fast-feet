import { Either, right } from '@/core/logic/either';
import { Injectable } from '@nestjs/common';
import { Sender } from '../mailer/sender';

export interface SendEmailNotificationUseCaseRequest {
  emailTo: string;
  title: string;
  content: string;
}

export type SendEmailNotificationUseCaseResponse = Either<null, null>;

@Injectable()
export class SendEmailNotificationUseCase {
  constructor(private sender: Sender) {}

  async execute({
    emailTo,
    title,
    content,
  }: SendEmailNotificationUseCaseRequest): Promise<SendEmailNotificationUseCaseResponse> {
    await this.sender.sendNotification({
      to: emailTo,
      subject: title,
      text: content,
    });

    return right(null);
  }
}
