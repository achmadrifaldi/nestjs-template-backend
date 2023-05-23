import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostgresDatabaseProviderModule } from '../../providers/database/postgres/provider.module';
import { ChecklistsService } from './checklists.service';
import { Checklist } from './entities/checklist.entity';
import { ChecklistItem } from '../checklist-items/entities/checklist-item.entity';

describe('ChecklistsService', () => {
  let service: ChecklistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PostgresDatabaseProviderModule,
        TypeOrmModule.forFeature([Checklist, ChecklistItem]),
      ],
      providers: [ChecklistsService],
    }).compile();

    service = module.get<ChecklistsService>(ChecklistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
