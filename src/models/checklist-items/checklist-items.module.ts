import { Module } from '@nestjs/common';
import { ChecklistItemsService } from './checklist-items.service';
import { ChecklistItemsController } from './checklist-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistItem } from './entities/checklist-item.entity';
import { ChecklistsModule } from '../checklists/checklists.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChecklistItem]), ChecklistsModule],
  controllers: [ChecklistItemsController],
  providers: [ChecklistItemsService],
})
export class ChecklistItemsModule {}
