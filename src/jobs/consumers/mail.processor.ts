import { Job } from 'bull';

import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';

import { MailService } from '../../mail/mail.service';

@Processor('mailsend')
export class MailProcessor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly mailService: MailService) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `Processor:@OnQueueActive - Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    this.logger.log(`Processor:@OnQueueCompleted - Completed job ${job.id} of type ${job.name}.`);
  }

  @OnQueueFailed()
  onError(job: Job<any>, error) {
    this.logger.log(
      `Processor:@OnQueueFailed - Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack
    );
  }

  @Process('welcome')
  async processWelcomeMail(job: Job): Promise<any> {
    console.log('Processor:@Process - Sending confirmation email.');

    try {
      const result = await this.mailService.sendMail(job.data);
      return result;
    } catch (error) {
      this.logger.error('Failed to send confirmation email.', error.stack);
      throw error;
    }
  }
}
