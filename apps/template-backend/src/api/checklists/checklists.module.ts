import { Module } from '@nestjs/common';
import { ChecklistModule } from '@app/domain';
import { ChecklistsController } from './checklists.controller';

@Module({
  imports: [ChecklistModule],
  controllers: [ChecklistsController],
})
export class ChecklistsModule {}
