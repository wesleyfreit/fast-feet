import { Sender } from '@/domain/notification/application/mailer/sender';
import { MailerModule as MailModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { NodemailerSender } from './nodemailer-sender';

@Module({
  imports: [
    EnvModule,
    MailModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory(env: EnvService) {
        return {
          transport: {
            host: env.get('SENDER_HOST'),
            port: env.get('SENDER_PORT'),
            secure: false,
            requireTLS: env.get('NODE_ENV') === 'production',
            auth: {
              user: env.get('SENDER_USER'),
              pass: env.get('SENDER_PASS'),
            },
          },
          defaults: {
            from: env.get('SENDER_FROM'),
          },
        };
      },
    }),
  ],
  providers: [{ provide: Sender, useClass: NodemailerSender }],
  exports: [Sender],
})
export class MailerModule {}
