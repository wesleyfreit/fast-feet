import { Sender, SenderProps } from '@/domain/notification/application/mailer/sender';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';

@Injectable()
export class NodemailerSender implements Sender {
  constructor(
    private mailer: MailerService,
    private env: EnvService,
  ) {}

  async sendNotification(props: SenderProps): Promise<void> {
    await this.mailer.sendMail(props);
  }
}
