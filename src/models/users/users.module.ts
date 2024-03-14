import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserAud } from './entities/user-aud.entity';
import { UsersService } from './providers/users.service';
import { UserSubscriber } from './subscribers/user.subscriber';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAud]), MailModule],
  providers: [UsersService, UserSubscriber],
  exports: [UsersService],
})
export class UsersModule {}
