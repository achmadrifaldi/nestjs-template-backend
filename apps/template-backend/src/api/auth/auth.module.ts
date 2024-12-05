import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@app/authentication';
import { UserModule } from '@app/domain';
import { AuthController } from './auth.controller';

@Module({
  imports: [AuthenticationModule, UserModule],
  controllers: [AuthController],
})
export class AuthModule {}
