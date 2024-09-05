import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UsersService } from './providers/users.service';
import { MailModule } from 'src/mail/mail.module';
import { UserProfile } from './providers/user.profile';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule],
  providers: [UsersService, UserProfile],
  exports: [UsersService, UserProfile],
})
export class UsersModule {}
