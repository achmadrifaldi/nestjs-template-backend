import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistsController } from './checklists.controller';
import { ChecklistsService } from './checklists.service';
import { Module } from '@nestjs/common';
import { Checklist } from './entities/checklist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Checklist])],
  controllers: [ChecklistsController],
  providers: [ChecklistsService],
  exports: [ChecklistsService],
})
export class ChecklistsModule {}
