import { Module } from '@nestjs/common';
import { ChecklistItemsService } from './providers/checklist-items.service';
import { ChecklistItemsController } from './controllers/checklist-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistItem } from './entities/checklist-item.entity';
import { ChecklistsModule } from '../checklists/checklists.module';
import { ChecklistItemProfile } from './providers/checklist-item.profile';

@Module({
  imports: [TypeOrmModule.forFeature([ChecklistItem]), ChecklistsModule],
  controllers: [ChecklistItemsController],
  providers: [ChecklistItemsService, ChecklistItemProfile],
  exports: [ChecklistItemsService],
})
export class ChecklistItemsModule {}
