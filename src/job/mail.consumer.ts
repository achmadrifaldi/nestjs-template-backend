import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { QueueEnum } from '../common/enums/queue.enum';
import { JobEnum } from '../common/enums/job.enum';
import { MailService } from '../mail/mail.service';

@Processor(QueueEnum.mailQueue)
export class MailConsumer {
  constructor(private mailService: MailService) {}

  @Process(JobEnum.sendDelayMailJob)
  async sendDelayMailJob(job: Job) {
    try {
      return await this.mailService.sendEmail(job.data);
    } catch (err) {
      return err;
    }
  }
}
