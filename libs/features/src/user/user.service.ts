import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository, UpdateResult } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { QuerySortingHelper } from '../../../common/src/helpers/query-sorting.helper';
import { IExtendPaginationOptions } from '../../../common/src/interfaces/extend-pagination-options.interface';
import { SORTING_COLUMNS } from './constants/sorting-columns.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../../../database/src/entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const model = new User();
    this.userRepository.merge(model, createUserDto);

    return await this.userRepository.save(model);
  }

  findAll(options: IExtendPaginationOptions): Promise<Pagination<User>> {
    const { sortBy, search } = options;

    let queryBuilder = this.userRepository.createQueryBuilder('users');

    if (sortBy?.length) {
      queryBuilder = QuerySortingHelper(queryBuilder, options.sortBy, SORTING_COLUMNS);
    }

    if (search) {
      queryBuilder.where('(name ilike :search OR email ilike :search)', {
        search: `%${search}%`,
      });
    }

    return paginate<User>(queryBuilder, options);
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async update({ id, payload, req }: { id: string; payload: UpdateUserDto; req: any }): Promise<User> {
    const user: User = await this.findOne(id);

    const model = new User();
    this.userRepository.merge(model, { ...user }, payload);

    return await this.userRepository.save(model, { data: { user: req.user } });
  }

  async remove(id: string): Promise<UpdateResult> {
    const user: User = await this.findOne(id);

    return await this.userRepository
      .createQueryBuilder('users')
      .softDelete()
      .where('id = :id', { id: user.id })
      .returning('*')
      .execute();
  }
}
