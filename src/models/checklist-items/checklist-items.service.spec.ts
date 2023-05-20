import { Test, TestingModule } from '@nestjs/testing';
import { ChecklistItemsService } from './checklist-items.service';

describe('ChecklistItemsService', () => {
  let service: ChecklistItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChecklistItemsService],
    }).compile();

    service = module.get<ChecklistItemsService>(ChecklistItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
