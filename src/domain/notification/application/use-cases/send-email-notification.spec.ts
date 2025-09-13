import { faker } from '@faker-js/faker';
import { FakeSender } from 'test/mailer/fake-sender';
import { Sender } from '../mailer/sender';
import { SendEmailNotificationUseCase } from './send-email-notification';

let sender: Sender;
let sut: SendEmailNotificationUseCase;

describe('Send Email Notification Use Case', () => {
  beforeEach(() => {
    sender = new FakeSender();
    sut = new SendEmailNotificationUseCase(sender);
  });

  it('should be able to send an email notification', async () => {
    const result = await sut.execute({
      emailTo: faker.internet.email(),
      title: 'Any Subject',
      content: 'Any Text',
    });

    expect(result.isRight()).toBe(true);
  });
});
