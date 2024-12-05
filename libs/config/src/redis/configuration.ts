import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => {
  return {
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisUsername: process.env.REDIS_USERNAME,
    redisPassword: process.env.REDIS_PASSWORD,
  };
});
