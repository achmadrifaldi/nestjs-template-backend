import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostgresDatabaseProviderModule } from '../../providers/database/postgres/provider.module';
import { ChecklistItemsController } from './checklist-items.controller';
import { ChecklistItemsService } from './checklist-items.service';
import { ChecklistItem } from './entities/checklist-item.entity';

describe('ChecklistItemsController', () => {
  let controller: ChecklistItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PostgresDatabaseProviderModule,
        TypeOrmModule.forFeature([ChecklistItem]),
      ],
      controllers: [ChecklistItemsController],
      providers: [ChecklistItemsService],
    }).compile();

    controller = module.get<ChecklistItemsController>(ChecklistItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
