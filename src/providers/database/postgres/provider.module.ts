import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import { DatabasePostgresConfigModule } from '../../../config/database/postgres/config.module';
import { DatabasePostgresConfigService } from '../../../config/database/postgres/config.services';
import { DatabaseType } from 'typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DatabasePostgresConfigModule],
      useFactory: async (pgConfigService: DatabasePostgresConfigService) => ({
        type: 'postgres' as DatabaseType,
        autoLoadEntities: true,
        host: pgConfigService.dbHost,
        port: pgConfigService.dbPort,
        username: pgConfigService.dbUser,
        password: pgConfigService.dbPassword,
        database: pgConfigService.dbName,
        entities: [],
        migrations: [],
        subscribers: [],
        synchronize: pgConfigService.dbSync === 'true',
        logging: pgConfigService.dbLogging === 'true',
      }),
      inject: [DatabasePostgresConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class PostgresDatabaseProviderModule {}
