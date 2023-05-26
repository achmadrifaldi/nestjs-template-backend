import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ChecklistsService } from '../checklists/checklists.service';
import { ChecklistItemsService } from './checklist-items.service';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';
import { ChecklistItem } from './entities/checklist-item.entity';

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

describe('ChecklistItemsService', () => {
  let service: ChecklistItemsService;
  let repo: Repository<ChecklistItem>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<ChecklistItemsService>(ChecklistItemsService);
    repo = module.get<Repository<ChecklistItem>>(getRepositoryToken(ChecklistItem));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should be create a user', async () => {
      const payload = new CreateChecklistItemDto();
      payload.name = 'item name';

      await service.create('uuid', payload);

      expect(repo.save).toBeCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should be return list', async () => {
      const result = await service.findAll('uuid', {
        limit: 10,
        page: 1,
        search: null,
        sortBy: null,
      });
      expect(result).toHaveProperty('items');
      expect(result.items.length).toBe(2);
    });

    it('should be return list when filter active', async () => {
      const result = await service.findAll('uuid', {
        limit: 10,
        page: 1,
        search: 'something',
        sortBy: ['name|asc'],
      });
      expect(result).toHaveProperty('items');
      expect(result.items.length).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should be return a checklist item', async () => {
      const result = await service.findOne('checklist uuid', 'uuid');
      expect(result).toHaveProperty('id');
    });

    it('should be return exception when id not found', async () => {
      try {
        await service.findOne('uuid', 'another uuid');
      } catch (error) {
        expect(error.message).toBe('Checklist Item with id another uuid not found.');
      }
    });
  });

  describe('update', () => {
    it('should be update a user', async () => {
      const payload = new UpdateChecklistItemDto();
      payload.name = 'another name';

      await service.update('checklist uuid', 'uuid', payload);

      expect(repo.save).toBeCalledTimes(1);
    });

    it('should be return exception when Checklist Item not found', async () => {
      const payload = new UpdateChecklistItemDto();
      payload.name = 'Checklist Item name';

      try {
        await service.update('checklist uuid', 'another uuid', payload);
      } catch (error) {
        expect(error.message).toBe('Checklist Item with id another uuid not found.');
      }
    });
  });

  describe('remove', () => {
    it('should be update a checklist', async () => {
      expect(await service.remove('checklist uuid', 'uuid')).toBeTruthy();
    });

    it('should be return exception when Checklist Item not found', async () => {
      try {
        await service.remove('checklist uuid', 'another uuid');
      } catch (error) {
        expect(error.message).toBe('Checklist Item with id another uuid not found.');
      }
    });
  });
});
