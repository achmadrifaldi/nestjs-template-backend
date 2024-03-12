import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DatabasePostgresConfigService } from './config.service';
import configuration from './configuration';

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
  providers: [ConfigService, DatabasePostgresConfigService],
  exports: [ConfigService, DatabasePostgresConfigService],
})
export class DatabasePostgresConfigModule {}
