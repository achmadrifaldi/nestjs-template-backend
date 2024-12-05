import { Module } from '@nestjs/common';

// Mailer
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailConfigModule } from '../../config/src/mail/config.module';
import { MailConfigService } from '../../config/src/mail/config.services';
import { MailService } from './mail.service';

// Job
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { QueueEnum } from '../../job/src/enums/queue.enum';
import { MailConsumer } from '../../job/src/consumers/mail.consumer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [MailConfigModule],
      useFactory: async (mailConfigService: MailConfigService) => ({
        transport: {
          host: mailConfigService.mailHost,
          port: mailConfigService.mailPort,
          secure: false, // upgrade later with STARTTLS
          auth: {
            user: mailConfigService.mailUsername,
            pass: mailConfigService.mailPassword,
          },
        },
        defaults: {
          from: mailConfigService.mailFrom,
        },
        template: {
          dir: process.cwd() + '/templates',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [MailConfigService],
    }),
    BullModule.registerQueue({
      name: QueueEnum.mailQueue,
    }),
    BullBoardModule.forFeature({
      name: QueueEnum.mailQueue,
      adapter: BullAdapter,
    }),
  ],
  providers: [MailService, MailConsumer],
  exports: [MailService, MailConsumer],
})
export class MailModule {}
