import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserSubscriber } from './user.subscriber';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../database/src/entity/user.entity';
import { UserAud } from '../../../database/src/entity/user-aud.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAud])],
  providers: [UserService, UserSubscriber],
  exports: [UserService],
})
export class UserModule {}
