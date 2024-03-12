import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('app', () => ({
  appName: process.env.APP_NAME,
  appHost: process.env.APP_HOST,
  appEnv: process.env.APP_ENV,
  appPort: process.env.APP_PORT,
}));
