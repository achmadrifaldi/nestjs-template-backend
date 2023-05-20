import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/app/config.module';
import { DatabasePostgresConfigModule } from './config/database/postgres/config.module';
import { ChecklistItemsModule } from './models/checklist-items/checklist-items.module';
import { ChecklistsModule } from './models/checklists/checklists.module';
import { PostgresDatabaseProviderModule } from './providers/database/postgres/provider.module';

@Module({
  imports: [
    AppConfigModule,
    DatabasePostgresConfigModule,
    PostgresDatabaseProviderModule,
    ChecklistsModule,
    ChecklistItemsModule,
  ],
})
export class AppModule {}
