import { Module } from '@nestjs/common';
import { ChecklistModule, ChecklistItemModule } from '@app/domain';
import { ChecklistItemsController } from './checklist-items.controller';

@Module({
  imports: [ChecklistModule, ChecklistItemModule],
  controllers: [ChecklistItemsController],
})
export class ChecklistItemsModule {}
