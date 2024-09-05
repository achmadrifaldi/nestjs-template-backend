import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistsController } from './controllers/checklists.controller';
import { ChecklistsService } from './providers/checklists.service';
import { ChecklistProfile } from './providers/checklist.profile';
import { Module } from '@nestjs/common';
import { Checklist } from './entities/checklist.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Checklist])],
  controllers: [ChecklistsController],
  providers: [ChecklistsService, ChecklistProfile],
  exports: [ChecklistsService],
})
export class ChecklistsModule {}
