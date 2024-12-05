import { Module } from '@nestjs/common';

// Automapper
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CamelCaseNamingConvention } from '@automapper/core';

import { AppConfigModule } from '@app/config';
import { DatabaseModule } from '@app/database';
import { AuthenticationModule } from '@app/authentication';
import { MailModule } from '@app/mail';
import { BullProviderModule } from '@app/provider';

// APIs
import { AuthModule } from './api/auth/auth.module';
import { ChecklistItemsModule } from './api/checklist-items/checklist-items.module';
import { ChecklistsModule } from './api/checklists/checklists.module';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
      namingConventions: new CamelCaseNamingConvention(),
    }),

    // Config
    AppConfigModule,

    // Providers
    BullProviderModule,

    // DB Connection
    DatabaseModule,

    // Authentication
    AuthenticationModule,

    // Mailer
    MailModule,

    // APIs
    AuthModule,
    ChecklistItemsModule,
    ChecklistsModule,
  ],
})
export class AppModule {}
