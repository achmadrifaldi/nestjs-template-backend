import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue({
    items: [
      {
        id: '1',
        name: 'string',
        createdDt: '2023-05-25T06:26:02.604Z',
        updatedDt: '2023-05-25T06:26:02.604Z',
        deletedDt: '2023-05-25T06:26:02.604Z',
        version: 1,
      },
      {
        id: '2',
        name: 'string',
        createdDt: '2023-05-25T06:26:02.604Z',
        updatedDt: '2023-05-25T06:26:02.604Z',
        deletedDt: '2023-05-25T06:26:02.604Z',
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

const oneUser = {
  id: 'string',
  name: 'string',
  createdDt: '2023-05-25T06:26:02.604Z',
  updatedDt: '2023-05-25T06:26:02.604Z',
  deletedDt: '2023-05-25T06:26:02.604Z',
  version: 1,
};

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: '1',
              name: 'string',
              createdDt: '2023-05-25T06:26:02.604Z',
              updatedDt: '2023-05-25T06:26:02.604Z',
              deletedDt: '2023-05-25T06:26:02.604Z',
              version: 1,
            }),
            findOneOrFail: jest.fn().mockResolvedValue({
              id: '1',
              name: 'string',
              createdDt: '2023-05-25T06:26:02.604Z',
              updatedDt: '2023-05-25T06:26:02.604Z',
              deletedDt: '2023-05-25T06:26:02.604Z',
              version: 1,
            }),
            save: jest.fn().mockResolvedValue(oneUser),
            merge: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              delete: jest.fn().mockReturnThis(),
              softDelete: jest.fn().mockReturnThis(),
              returning: jest.fn().mockReturnThis(),
              from: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              execute: jest.fn().mockResolvedValue({ raw: [], affected: 1 }),
            })),
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

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should be create a user', async () => {
      const payload = new CreateUserDto();
      payload.email = 'user@test.com';
      payload.name = 'user name';
      payload.password = 'secret';

      await service.create(payload);

      expect(repo.save).toBeCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should be return list', async () => {
      const result = await service.findAll({
        limit: 10,
        page: 1,
        search: null,
        sortBy: null,
      });
      expect(result).toHaveProperty('items');
      expect(result.items[0].id).toBe('1');
    });

    it('should be return list when filter active', async () => {
      const result = await service.findAll({
        limit: 10,
        page: 1,
        search: 'something',
        sortBy: ['name|asc'],
      });
      expect(result).toHaveProperty('items');
      expect(result.items[0].id).toBe('1');
    });
  });

  describe('findOne', () => {
    it('should be return a user', async () => {
      const result = await service.findOne('uuid');
      expect(result).toHaveProperty('id');
      expect(result.id).toBe('1');
    });

    it('should be return exception when id not found', async () => {
      jest.spyOn(repo, 'findOne').mockImplementation(() => null);

      try {
        await service.findOne('another uuid');
      } catch (error) {
        expect(error.message).toBe('User with id another uuid not found.');
      }
    });
  });

  describe('findOneByEmail', () => {
    it('should be return a user', async () => {
      const result = await service.findOneByEmail('email@test.com');
      expect(result).toHaveProperty('id');
      expect(result.id).toBe('1');
    });

    it('should be return exception when id not found', async () => {
      jest.spyOn(repo, 'findOne').mockImplementation(() => null);

      const result = await service.findOneByEmail('email@test.com');
      expect(result).toBe(null);
    });
  });

  describe('update', () => {
    it('should be update a user', async () => {
      const payload = new UpdateUserDto();
      payload.email = 'user@test.com';
      payload.name = 'user name';
      payload.password = 'secret';

      await service.update('uuid', payload);

      expect(repo.save).toBeCalledTimes(1);
    });

    it('should be return exception when user not found', async () => {
      const payload = new UpdateUserDto();
      payload.email = 'user@test.com';
      payload.name = 'user name';
      payload.password = 'secret';

      jest.spyOn(repo, 'findOne').mockImplementation(() => null);

      try {
        await service.update('another uuid', payload);
      } catch (error) {
        expect(error.message).toBe('User with id another uuid not found.');
      }
    });
  });

  describe('remove', () => {
    it('should be update a user', async () => {
      expect(await service.remove('uuid')).toBeTruthy();
    });

    it('should be return exception when user not found', async () => {
      jest.spyOn(repo, 'findOne').mockImplementation(() => null);

      try {
        await service.remove('another uuid');
      } catch (error) {
        expect(error.message).toBe('User with id another uuid not found.');
      }
    });
  });
});
