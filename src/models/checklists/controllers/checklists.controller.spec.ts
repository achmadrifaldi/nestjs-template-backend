import { Test, TestingModule } from '@nestjs/testing';

import { ChecklistsController } from './checklists.controller';
import { ChecklistsService } from '../providers/checklists.service';
import { CreateChecklistDto } from '../dto/create-checklist.dto';
import { UpdateChecklistDto } from '../dto/update-checklist.dto';

describe('ChecklistsController', () => {
  let controller: ChecklistsController;
  let service: ChecklistsService;

  const mockChecklistService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChecklistsController],
      providers: [
        {
          provide: ChecklistsService,
          useValue: mockChecklistService,
        },
      ],
    }).compile();

    controller = module.get<ChecklistsController>(ChecklistsController);
    service = module.get<ChecklistsService>(ChecklistsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of checklists', async () => {
      const result = [{ id: 1, name: 'Test Checklist' }];
      service.findAll.mockResolvedValue(result);

      expect(await controller.findAll({})).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single checklist', async () => {
      const result = { id: 1, name: 'Test Checklist' };
      service.findOne.mockResolvedValue(result);

      expect(await controller.findOne({ id: '1' })).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new checklist', async () => {
      const createDto: CreateChecklistDto = { name: 'New Checklist' };
      const result = { id: 1, ...createDto };
      service.create.mockResolvedValue(result);

      expect(await controller.create(createDto)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update an existing checklist', async () => {
      const updateDto: UpdateChecklistDto = { name: 'Updated Checklist' };
      const result = { id: 1, ...updateDto };
      service.update.mockResolvedValue(result);

      expect(await controller.update({ id: '1' }, updateDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove a checklist', async () => {
      const result = { deleted: true };
      service.remove.mockResolvedValue(result);

      expect(await controller.remove({ id: '1' })).toBe(result);
    });
  });
});
