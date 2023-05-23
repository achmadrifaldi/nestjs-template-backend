import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { QuerySortingHelper } from '../../common/helpers/query-sorting.helper';
import { IExtendPaginationOptions } from '../../common/interfaces/extend-pagination-options.interface';
import { SORTING_COLUMNS } from './constants/sorting-columns.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const model = new User();
    this.userRepository.merge(model, createUserDto);

    return await this.userRepository.save(model);
  }

  findAll(options: IExtendPaginationOptions): Promise<Pagination<User>> {
    const { sortBy, search } = options;

    let queryBuilder = this.userRepository.createQueryBuilder('users');

    if (sortBy && sortBy.length) {
      queryBuilder = QuerySortingHelper(
        queryBuilder,
        options.sortBy,
        SORTING_COLUMNS,
      );
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = await this.findOne(id);

    const model = new User();
    this.userRepository.merge(model, { ...user }, updateUserDto);

    return await this.userRepository.save(model);
  }

  async remove(id: string): Promise<User> {
    const user: User = await this.findOne(id);

    const result = await this.userRepository
      .createQueryBuilder('users')
      .softDelete()
      .where('id = :id', { id: user.id })
      .returning('*')
      .execute();

    return result.raw[0];
  }
}
