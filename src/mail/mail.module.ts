import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { QueueEnum } from '../common/enums/queue.enum';
import { MailConsumer } from '../job/mail.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueEnum.mailQueue,
    }),
    BullBoardModule.forFeature({
      name: QueueEnum.mailQueue,
      adapter: BullAdapter,
    }),
  ],
  providers: [MailService, MailConsumer],
  exports: [MailService],
})
export class MailModule {}
