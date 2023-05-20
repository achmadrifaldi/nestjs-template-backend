import { Test, TestingModule } from '@nestjs/testing';
import { ChecklistItemsController } from './checklist-items.controller';
import { ChecklistItemsService } from './checklist-items.service';

describe('ChecklistItemsController', () => {
  let controller: ChecklistItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChecklistItemsController],
      providers: [ChecklistItemsService],
    }).compile();

    controller = module.get<ChecklistItemsController>(ChecklistItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
