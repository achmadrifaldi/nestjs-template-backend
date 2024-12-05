import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueueEnum } from '../../job/src/enums/queue.enum';
import { JobEnum } from '../../job/src/enums/job.enum';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(QueueEnum.mailQueue) private readonly mailQueue: Queue,
    private readonly mailerService: MailerService
  ) {}

  async sendEmailDelay({ to, subject, payload }) {
    return this.mailQueue.add(JobEnum.sendDelayMailJob, { to, subject, payload });
  }

  async sendEmail({ to, subject, payload }) {
    this.mailerService
      .sendMail({
        to,
        subject,
        template: './index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          ...payload,
        },
      })
      .then(success => {
        return success;
      })
      .catch(err => {
        throw err;
      });
  }
}
