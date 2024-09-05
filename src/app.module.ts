import { Module } from '@nestjs/common';

// Config
import { AppConfigModule } from './config/app/config.module';
import { DatabasePostgresConfigModule } from './config/database/postgres/config.module';

// Providers
import { PostgresDatabaseProviderModule } from './providers/database/postgres/provider.module';
import { BullProviderModule } from './providers/bull/provider.module';
import { MailProviderModule } from './providers/mail/provider.module';

// Authentication
import { AuthenticationModule } from './authentication/authentication.module';

// Models
import { ChecklistsModule } from './models/checklists/checklists.module';
import { ChecklistItemsModule } from './models/checklist-items/checklist-items.module';
import { UsersModule } from './models/users/users.module';
import { MailModule } from './mail/mail.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CamelCaseNamingConvention } from '@automapper/core';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
      namingConventions: new CamelCaseNamingConvention(),
    }),
    // Config
    AppConfigModule,
    DatabasePostgresConfigModule,
    // Providers
    PostgresDatabaseProviderModule,
    MailProviderModule,
    BullProviderModule,
    // Authentication
    AuthenticationModule,
    // Models
    ChecklistsModule,
    ChecklistItemsModule,
    UsersModule,
    MailModule,
  ],
})
export class AppModule {}
