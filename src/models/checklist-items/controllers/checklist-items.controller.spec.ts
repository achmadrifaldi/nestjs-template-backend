import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ChecklistsService } from '../../checklists/providers/checklists.service';
import { ChecklistItemsController } from './checklist-items.controller';
import { ChecklistItemsService } from '../providers/checklist-items.service';
import { CreateChecklistItemDto } from '../dto/create-checklist-item.dto';
import { ParamChecklistIdDto } from '../dto/param-checklist-id.dto';
import { ChecklistItem } from '../entities/checklist-item.entity';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ParamIdDto } from '../../../common/dto/param-id.dto';
import { UpdateChecklistItemDto } from '../dto/update-checklist-item.dto';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue({
    items: [
      {
        id: '195f5bf5-cf4e-4be9-8d85-0e19ded3fcc9',
        name: 'string',
        createdDt: '2023-05-19T22:05:35.117Z',
        updatedDt: '2023-05-19T22:05:35.117Z',
        deletedDt: null,
        version: 1,
      },
      {
        id: '1d5dc7f0-c6b6-4b27-8736-bc9c9bfd3629',
        name: 'string 2',
        createdDt: '2023-05-19T22:05:35.320Z',
        updatedDt: '2023-05-19T22:05:35.320Z',
        deletedDt: null,
        version: 1,
      },
    ],
    meta: {
      itemCount: 2,
      totalItems: 2,
      totalPages: 1,
      currentPage: 1,
    },
  }),
}));

const oneChecklist = {
  id: '235f5bf5-cf4e-4be9-8d85-0e19ded3fddr',
  name: 'string',
  createdDt: '2023-05-19T22:05:35.117Z',
  updatedDt: '2023-05-19T22:05:35.117Z',
  deletedDt: null,
  version: 1,
};

const oneChecklistItem = {
  id: '195f5bf5-cf4e-4be9-8d85-0e19ded3fcc9',
  name: 'string',
  createdDt: '2023-05-19T22:05:35.117Z',
  updatedDt: '2023-05-19T22:05:35.117Z',
  deletedDt: null,
  version: 1,
};

const createQueryBuilder: any = {
  delete: jest.fn().mockImplementation(() => {
    return createQueryBuilder;
  }),
  softDelete: jest.fn().mockImplementation(() => {
    return createQueryBuilder;
  }),
  returning: jest.fn().mockImplementation(() => {
    return createQueryBuilder;
  }),
  from: jest.fn().mockImplementation(() => {
    return createQueryBuilder;
  }),
  orderBy: jest.fn().mockImplementation(() => {
    return createQueryBuilder;
  }),
  where: jest.fn().mockImplementation(() => {
    return createQueryBuilder;
  }),
  andWhere: jest.fn().mockImplementation(() => {
    return createQueryBuilder;
  }),
  getOne: jest
    .fn()
    .mockImplementationOnce(() => {
      return oneChecklistItem;
    })
    .mockImplementationOnce(() => {
      return null;
    })
    .mockImplementationOnce(() => {
      return oneChecklistItem;
    })
    .mockImplementationOnce(() => {
      return null;
    })
    .mockImplementationOnce(() => {
      return oneChecklistItem;
    })
    .mockImplementationOnce(() => {
      return null;
    }),
  execute: jest
    .fn()
    .mockImplementationOnce(() => {
      return { raw: [], affected: 1 };
    })
    .mockImplementationOnce(() => {
      return null;
    }),
};

describe('ChecklistItemsController', () => {
  let controller: ChecklistItemsController;
  let checklistService: ChecklistsService;
  let repo: Repository<ChecklistItem>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChecklistItemsController],
      providers: [
        ChecklistItemsService,
        {
          provide: getRepositoryToken(ChecklistItem),
          useValue: {
            findOne: jest.fn().mockResolvedValue(oneChecklistItem),
            findOneOrFail: jest.fn().mockResolvedValue(oneChecklistItem),
            save: jest.fn().mockResolvedValue(oneChecklistItem),
            merge: jest.fn(),
            createQueryBuilder: jest.fn(() => createQueryBuilder),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            update: jest.fn().mockResolvedValue(true),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            delete: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: ChecklistsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(oneChecklist),
          },
        },
      ],
    }).compile();

    controller = module.get<ChecklistItemsController>(ChecklistItemsController);

    checklistService = module.get<ChecklistsService>(ChecklistsService);
    repo = module.get<Repository<ChecklistItem>>(getRepositoryToken(ChecklistItem));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('[POST] /checklists/:checklist-id/checklist-items', () => {
    it('should be create a checklist items', async () => {
      const params = new ParamChecklistIdDto();
      params.checklistId = 'uuid';

      const payload = new CreateChecklistItemDto();
      payload.name = 'item name';

      await controller.create(params, payload);
      expect(checklistService.findOne).toBeCalledTimes(1);
      expect(repo.save).toBeCalledTimes(1);
    });
  });

  describe('[GET] /checklists/:checklist-id/checklist-items', () => {
    it('should be return list', async () => {
      const params = new ParamChecklistIdDto();
      params.checklistId = 'uuid';

      const payload = new PaginationQueryDto();

      const result = await controller.findAll(params, payload);
      expect(repo.createQueryBuilder).toBeCalledTimes(1);
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('meta');
    });

    it('should be return list when filter active', async () => {
      const params = new ParamChecklistIdDto();
      params.checklistId = 'uuid';

      const payload = new PaginationQueryDto();
      payload.limit = 10;
      payload.page = 1;
      payload.search = 'something';
      payload.sortBy = ['name|asc'];

      const result = await controller.findAll(params, payload);
      expect(repo.createQueryBuilder).toBeCalledTimes(1);
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('meta');
    });
  });

  describe('[GET] /checklists/:checklist-id/checklist-items/:id', () => {
    it('should be return a checklist item', async () => {
      const params = new ParamChecklistIdDto();
      params.checklistId = 'uuid';

      const payload = new ParamIdDto();
      payload.id = 'another uuid';

      const result = await controller.findOne(params, payload);
      expect(repo.createQueryBuilder).toBeCalledTimes(1);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
    });

    it('should be return exception when id not found', async () => {
      const params = new ParamChecklistIdDto();
      params.checklistId = 'uuid';

      const payload = new ParamIdDto();
      payload.id = 'another uuid';

      try {
        await controller.findOne(params, payload);
      } catch (error) {
        expect(error.message).toBe('Checklist Item with id another uuid not found.');
      }
    });
  });

  describe('[PATCH] /checklists/:checklist-id/checklist-items/:id', () => {
    it('should be updated', async () => {
      const params = new ParamChecklistIdDto();
      params.checklistId = 'uuid';

      const payload = new ParamIdDto();
      payload.id = 'another uuid';

      const body = new UpdateChecklistItemDto();
      body.name = 'checklist name';

      const result = await controller.update(params, payload, body);
      expect(repo.createQueryBuilder).toBeCalledTimes(1);
      expect(repo.save).toBeCalledTimes(1);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
    });

    it('should be return exception when id not found', async () => {
      const params = new ParamChecklistIdDto();
      params.checklistId = 'uuid';

      const payload = new ParamIdDto();
      payload.id = 'another uuid';

      const body = new UpdateChecklistItemDto();
      body.name = 'checklist name';

      try {
        await controller.update(params, payload, body);
      } catch (error) {
        expect(error.message).toBe('Checklist Item with id another uuid not found.');
      }
    });
  });

  describe('[DELETE] /checklists/:checklist-id/checklist-items/:id', () => {
    it('should be updated', async () => {
      const params = new ParamChecklistIdDto();
      params.checklistId = 'uuid';

      const payload = new ParamIdDto();
      payload.id = 'another uuid';

      const result = await controller.remove(params, payload);
      expect(result).toHaveProperty('raw');
      expect(result).toHaveProperty('affected');
    });

    it('should be return exception when id not found', async () => {
      const params = new ParamChecklistIdDto();
      params.checklistId = 'uuid';

      const payload = new ParamIdDto();
      payload.id = 'another uuid';

      try {
        await controller.remove(params, payload);
      } catch (error) {
        expect(error.message).toBe('Checklist Item with id another uuid not found.');
      }
    });
  });
});
