import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import { DatabasePostgresConfigModule } from '../../config/src/database/config.module';
import { DatabasePostgresConfigService } from '../../config/src/database/config.service';
import { DatabaseType } from 'typeorm';
import { Module } from '@nestjs/common';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// Entities
import { User } from './entity/user.entity';
import { UserAud } from './entity/user-aud.entity';
import { AuditLog } from './entity/audit-log.entity';
import { Checklist } from './entity/checklist.entity';
import { ChecklistAud } from './entity/checklist-aud.entity';
import { ChecklistItem } from './entity/checklist-item.entity';
import { ChecklistItemAud } from './entity/checklist-item-aud.entity';

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
        entities: [User, UserAud, AuditLog, Checklist, ChecklistAud, ChecklistItem, ChecklistItemAud],
        migrations: [],
        subscribers: [],
        synchronize: pgConfigService.dbSync === 'true',
        logging: pgConfigService.dbLogging === 'true',
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [DatabasePostgresConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
  exports: [],
})
export class DatabaseModule {}
