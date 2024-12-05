import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  mailFrom: process.env.MAIL_FROM,
  mailHost: process.env.MAIL_HOST,
  mailPort: +process.env.MAIL_PORT,
  mailUsername: process.env.MAIL_USERNAME,
  mailPassword: process.env.MAIL_PASSWORD,
}));
