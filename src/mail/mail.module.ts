import { MailConfigModule } from 'src/config/mail/config.module';
import { MailConfigService } from 'src/config/mail/config.services';
import { RedisConfigModule } from 'src/config/redis/config.module';
import { RedisConfigService } from 'src/config/redis/config.services';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { MailProcessor } from '../jobs/consumers/mail.processor';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [MailConfigModule],
      useFactory: async (mailConfigService: MailConfigService) => ({
        transport: {
          host: mailConfigService.mailHost,
          port: mailConfigService.mailPort,
          secure: false,
          auth: {
            user: mailConfigService.mailUsername,
            pass: mailConfigService.mailPassword,
          },
        },
        defaults: {
          from: mailConfigService.mailFrom,
        },
        template: {
          // cwd = current working directory
          dir: process.cwd() + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [MailConfigService],
    }),
    BullModule.registerQueueAsync({
      name: 'mailsend', // mail queue name
      imports: [RedisConfigModule],
      useFactory: async (redisConfigService: RedisConfigService) => ({
        redis: {
          host: redisConfigService.redisHost,
          port: redisConfigService.redisPort,
        },
      }),
      inject: [RedisConfigService],
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
