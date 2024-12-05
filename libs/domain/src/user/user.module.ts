import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './services/user.service';
import { UserProfile } from './profiles/user.profile';
import { MailModule } from '../../../mail/src/mail.module';
import { User } from '../../../database/src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule],
  providers: [UserService, UserProfile],
  exports: [UserService, UserProfile],
})
export class UserModule {}
