import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import { DatabasePostgresConfigModule } from '../../config/src/database/postgres/config.module';
import { DatabasePostgresConfigService } from '../../config/src/database/postgres/config.services';
import { DatabaseType } from 'typeorm';
import { Module } from '@nestjs/common';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// Entities
import { User } from './entities/user.entity';
import { Checklist } from './entities/checklist.entity';
import { ChecklistItem } from './entities/checklist-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DatabasePostgresConfigModule],
      useFactory: async (pgConfigService: DatabasePostgresConfigService) => ({
        type: 'postgres' as DatabaseType,
        autoLoadEntities: false,
        host: pgConfigService.dbHost,
        port: pgConfigService.dbPort,
        username: pgConfigService.dbUser,
        password: pgConfigService.dbPassword,
        database: pgConfigService.dbName,
        entities: [User, Checklist, ChecklistItem],
        migrations: [],
        subscribers: [],
        synchronize: pgConfigService.dbSync === 'true',
        logging: pgConfigService.dbLogging === 'true',
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [DatabasePostgresConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class DatabaseModule {}
