import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistsController } from './controllers/checklists.controller';
import { ChecklistsService } from './providers/checklists.service';
import { Module } from '@nestjs/common';
import { Checklist } from './entities/checklist.entity';
import { ChecklistAud } from './entities/checklist-aud.entity';
import { ChecklistSubscriber } from './subscribers/checklist.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Checklist, ChecklistAud])],
  controllers: [ChecklistsController],
  providers: [ChecklistsService, ChecklistSubscriber],
  exports: [ChecklistsService],
})
export class ChecklistsModule {}
