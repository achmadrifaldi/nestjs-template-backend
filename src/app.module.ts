import { Module } from '@nestjs/common';

import { AuthenticationModule } from './authentication/authentication.module';
import { AppConfigModule } from './config/app/config.module';
import { DatabasePostgresConfigModule } from './config/database/postgres/config.module';
import { ChecklistItemsModule } from './modules/checklist-items/checklist-items.module';
import { ChecklistsModule } from './modules/checklists/checklists.module';
import { UsersModule } from './modules/users/users.module';
import { PostgresDatabaseProviderModule } from './providers/database/postgres/provider.module';

@Module({
  imports: [
    AppConfigModule,
    DatabasePostgresConfigModule,
    PostgresDatabaseProviderModule,
    AuthenticationModule,
    UsersModule,
    ChecklistsModule,
    ChecklistItemsModule,
  ],
})
export class AppModule {}
