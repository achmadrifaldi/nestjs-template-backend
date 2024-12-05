import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExp: process.env.JWT_EXPIRES_IN,
  jwtIssuer: process.env.JWT_ISSUER,
}));
