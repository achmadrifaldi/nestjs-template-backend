import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { AppConfigModule } from '@app/config';

@Module({
  imports: [AppConfigModule, DatabaseModule, AuthModule, ProfileModule],
  controllers: [],
  providers: [],
})
export class WebAppModule {}
