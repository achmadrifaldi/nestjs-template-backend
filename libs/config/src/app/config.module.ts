import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppConfigService } from './config.services';
import configuration from './configuration';
import { Module } from '@nestjs/common';

/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
