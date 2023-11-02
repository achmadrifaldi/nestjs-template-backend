import { Module } from '@nestjs/common';

// Config
import { AppConfigModule } from './config/app/config.module';
import { DatabasePostgresConfigModule } from './config/database/postgres/config.module';

// Providers
import { PostgresDatabaseProviderModule } from './providers/database/postgres/provider.module';

// Authentication
import { AuthenticationModule } from './authentication/authentication.module';

// Models
import { AuditLogsModule } from './models/audit-logs/audit-logs.module';
import { ChecklistsModule } from './models/checklists/checklists.module';
import { ChecklistItemsModule } from './models/checklist-items/checklist-items.module';
import { UsersModule } from './models/users/users.module';

@Module({
  imports: [
    // Config
    AppConfigModule,
    DatabasePostgresConfigModule,
    // Providers
    PostgresDatabaseProviderModule,
    // Authentication
    AuthenticationModule,
    // Models
    AuditLogsModule,
    ChecklistsModule,
    ChecklistItemsModule,
    UsersModule,
  ],
})
export class AppModule {}
