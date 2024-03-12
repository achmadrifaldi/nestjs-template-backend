import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { UserModule } from '@app/features';

@Module({
  imports: [UserModule],
  controllers: [ProfileController],
})
export class ProfileModule {}
