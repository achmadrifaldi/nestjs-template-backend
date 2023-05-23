import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostgresDatabaseProviderModule } from '../../providers/database/postgres/provider.module';
import { ChecklistsController } from './checklists.controller';
import { ChecklistsService } from './checklists.service';
import { Checklist } from './entities/checklist.entity';
import { ChecklistItem } from '../checklist-items/entities/checklist-item.entity';

describe('ChecklistsController', () => {
  let controller: ChecklistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PostgresDatabaseProviderModule,
        TypeOrmModule.forFeature([Checklist, ChecklistItem]),
      ],
      controllers: [ChecklistsController],
      providers: [ChecklistsService],
    }).compile();

    controller = module.get<ChecklistsController>(ChecklistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
