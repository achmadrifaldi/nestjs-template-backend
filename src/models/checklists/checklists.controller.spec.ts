import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ParamIdDto } from '../../common/dto/param-id.dto';
import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ChecklistsController } from './checklists.controller';
import { ChecklistsService } from './checklists.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { Checklist } from './entities/checklist.entity';

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
      return oneChecklist;
    })
    .mockImplementationOnce(() => {
      return null;
    })
    .mockImplementationOnce(() => {
      return oneChecklist;
    })
    .mockImplementationOnce(() => {
      return null;
    })
    .mockImplementationOnce(() => {
      return oneChecklist;
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

describe('ChecklistsController', () => {
  let controller: ChecklistsController;
  let repo: Repository<Checklist>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChecklistsController],
      providers: [
        ChecklistsService,
        {
          provide: getRepositoryToken(Checklist),
          useValue: {
            findOne: jest.fn().mockResolvedValue(oneChecklist),
            findOneOrFail: jest.fn().mockResolvedValue(oneChecklist),
            save: jest.fn().mockResolvedValue(oneChecklist),
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
      ],
    }).compile();

    controller = module.get<ChecklistsController>(ChecklistsController);
    repo = module.get<Repository<Checklist>>(getRepositoryToken(Checklist));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('[POST] /checklists', () => {
    it('should be create a checklist items', async () => {
      const payload = new CreateChecklistDto();
      payload.name = 'item name';

      await controller.create(payload);
      expect(repo.save).toBeCalledTimes(1);
    });
  });

  describe('[GET] /checklists', () => {
    it('should be return list', async () => {
      const payload = new PaginationQueryDto();

      const result = await controller.findAll(payload);
      expect(repo.createQueryBuilder).toBeCalledTimes(1);
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('meta');
    });

    it('should be return list when filter active', async () => {
      const payload = new PaginationQueryDto();
      payload.limit = 10;
      payload.page = 1;
      payload.search = 'something';
      payload.sortBy = ['name|asc'];

      const result = await controller.findAll(payload);
      expect(repo.createQueryBuilder).toBeCalledTimes(1);
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('meta');
    });
  });

  describe('[GET] /checklists/:id', () => {
    it('should be return a checklist item', async () => {
      const payload = new ParamIdDto();
      payload.id = 'another uuid';

      const result = await controller.findOne(payload);
      expect(repo.findOne).toBeCalledTimes(1);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
    });

    it('should be return exception when id not found', async () => {
      const payload = new ParamIdDto();
      payload.id = 'another uuid';

      try {
        await controller.findOne(payload);
      } catch (error) {
        expect(error.message).toBe('Checklist with id another uuid not found.');
      }
    });
  });

  describe('[PATCH] /checklists/:id', () => {
    it('should be updated', async () => {
      const payload = new ParamIdDto();
      payload.id = 'another uuid';

      const body = new UpdateChecklistDto();
      body.name = 'checklist name';

      const result = await controller.update(payload, body);
      expect(repo.findOne).toBeCalledTimes(1);
      expect(repo.save).toBeCalledTimes(1);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
    });

    it('should be return exception when id not found', async () => {
      const payload = new ParamIdDto();
      payload.id = 'another uuid';

      const body = new UpdateChecklistDto();
      body.name = 'checklist name';

      try {
        await controller.update(payload, body);
      } catch (error) {
        expect(error.message).toBe('Checklist with id another uuid not found.');
      }
    });
  });

  describe('[DELETE] /checklists/:id', () => {
    it('should be updated', async () => {
      const payload = new ParamIdDto();
      payload.id = 'another uuid';

      const result = await controller.remove(payload);
      expect(result).toHaveProperty('raw');
      expect(result).toHaveProperty('affected');
    });

    it('should be return exception when id not found', async () => {
      const payload = new ParamIdDto();
      payload.id = 'another uuid';

      try {
        await controller.remove(payload);
      } catch (error) {
        expect(error.message).toBe('Checklist with id another uuid not found.');
      }
    });
  });
});
