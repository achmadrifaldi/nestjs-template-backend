import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@app/authentication';
import { AuthController } from './auth.controller';

@Module({
  imports: [AuthenticationModule],
  providers: [],
  controllers: [AuthController],
})
export class AuthModule {}
