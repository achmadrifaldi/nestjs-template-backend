import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { QueueEnum } from 'src/common/enums/queue.enum';
import { Queue } from 'bull';
import { JobEnum } from 'src/common/enums/job.enum';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(QueueEnum.mailQueue) private mailQueue: Queue,
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
