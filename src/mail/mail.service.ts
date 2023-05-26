import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateMailDto } from './dto/create-mail.dto';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mailsend')
    private mailQueue: Queue,
    private readonly mailerService: MailerService
  ) {}

  async sendWelcomeMail(payload: CreateMailDto): Promise<boolean> {
    try {
      this.mailQueue.add('welcome', { ...payload });

      console.log('Added queueing welcome email to user.');
      return true;
    } catch (err) {
      console.log('Error queueing welcome email to user.');
      return false;
    }
  }

  public sendMail(payload: CreateMailDto) {
    const { to, subject, data } = payload;

    this.mailerService
      .sendMail({
        to,
        subject,
        template: __dirname + '/templates/welcome',
        context: {
          ...data,
        },
      })
      .then(success => {
        console.log(success, 'Mail sent successfully.');
        return success;
      })
      .catch(err => {
        console.log(err);
      });
  }
}
