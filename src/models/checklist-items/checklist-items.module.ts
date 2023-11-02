import { Module } from '@nestjs/common';
import { ChecklistItemsService } from './providers/checklist-items.service';
import { ChecklistItemsController } from './controllers/checklist-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistItem } from './entities/checklist-item.entity';
import { ChecklistItemAud } from './entities/checklist-item-aud.entity';
import { ChecklistsModule } from '../checklists/checklists.module';
import { ChecklistItemSubscriber } from './subscribers/checklist-item.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([ChecklistItem, ChecklistItemAud]), ChecklistsModule],
  controllers: [ChecklistItemsController],
  providers: [ChecklistItemsService, ChecklistItemSubscriber],
  exports: [ChecklistItemsService],
})
export class ChecklistItemsModule {}
