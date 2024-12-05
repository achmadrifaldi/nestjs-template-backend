import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChecklistService } from './services/checklist.service';
import { ChecklistProfile } from './profiles/checklist.profile';
import { Checklist } from '../../../database/src/entities/checklist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Checklist])],
  providers: [ChecklistService, ChecklistProfile],
  exports: [ChecklistService, ChecklistProfile],
})
export class ChecklistModule {}
