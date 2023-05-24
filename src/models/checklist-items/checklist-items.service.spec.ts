import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostgresDatabaseProviderModule } from '../../providers/database/postgres/provider.module';
import { ChecklistItemsService } from './checklist-items.service';
import { ChecklistItem } from './entities/checklist-item.entity';
import { ChecklistsModule } from '../checklists/checklists.module';

describe('ChecklistItemsService', () => {
  let service: ChecklistItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PostgresDatabaseProviderModule,
        TypeOrmModule.forFeature([ChecklistItem]),
        ChecklistsModule,
      ],
      providers: [ChecklistItemsService],
    }).compile();

    service = module.get<ChecklistItemsService>(ChecklistItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
