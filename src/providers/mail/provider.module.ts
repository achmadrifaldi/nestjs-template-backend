import { Module } from '@nestjs/common';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailConfigModule } from '../../config/mail/config.module';
import { MailConfigService } from 'src/config/mail/config.services';

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
          dir: process.cwd() + '/src/mail/templates',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [MailConfigService],
    }),
  ],
})
export class MailProviderModule {}
