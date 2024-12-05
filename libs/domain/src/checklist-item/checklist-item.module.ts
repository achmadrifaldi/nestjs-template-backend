import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChecklistModule } from '../checklist/checklist.module';
import { ChecklistItemService } from './services/checklist-item.service';
import { ChecklistItemProfile } from './profiles/checklist-item.profile';
import { ChecklistItem } from '../../../database/src/entities/checklist-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChecklistItem]), ChecklistModule],
  providers: [ChecklistItemService, ChecklistItemProfile],
  exports: [ChecklistItemService, ChecklistItemProfile],
})
export class ChecklistItemModule {}
