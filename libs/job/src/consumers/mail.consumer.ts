import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { QueueEnum } from '../enums/queue.enum';
import { JobEnum } from '../enums/job.enum';
import { MailService } from '../../../mail/src/mail.service';

@Processor(QueueEnum.mailQueue)
export class MailConsumer {
  constructor(private readonly mailService: MailService) {}

  @Process(JobEnum.sendDelayMailJob)
  async sendDelayMailJob(job: Job) {
    try {
      return await this.mailService.sendEmail(job.data);
    } catch (err) {
      return err;
    }
  }
}
