import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository, UpdateResult } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { QuerySortingHelper } from '../../common/helpers/query-sorting.helper';
import { IExtendPaginationOptions } from '../../common/interfaces/extend-pagination-options.interface';
import { SORTING_COLUMNS } from './constants/sorting-columns.constant';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { Checklist } from './entities/checklist.entity';

@Injectable()
export class ChecklistsService {
  constructor(
    @InjectRepository(Checklist)
    private readonly checklistRepository: Repository<Checklist>
  ) {}

  async create(createChecklistDto: CreateChecklistDto): Promise<Checklist> {
    const model = new Checklist();
    this.checklistRepository.merge(model, createChecklistDto);

    return await this.checklistRepository.save(model);
  }

  async findAll(options: IExtendPaginationOptions): Promise<Pagination<Checklist>> {
    const { sortBy, search } = options;

    let queryBuilder = this.checklistRepository.createQueryBuilder('checklists');

    if (sortBy && sortBy.length) {
      queryBuilder = QuerySortingHelper(queryBuilder, options.sortBy, SORTING_COLUMNS);
    }

    if (search) {
      queryBuilder.where('(name ilike :name)', { name: `%${search}%` });
    }

    return paginate<Checklist>(queryBuilder, options);
  }

  async findOne(id: string): Promise<Checklist> {
    const checklist = await this.checklistRepository.findOne({
      where: { id },
    });

    if (!checklist) {
      throw new NotFoundException(`Checklist with id ${id} not found.`);
    }

    return checklist;
  }

  async update(id: string, updateChecklistDto: UpdateChecklistDto): Promise<Checklist> {
    const checklist: Checklist = await this.findOne(id);

    const model = new Checklist();
    this.checklistRepository.merge(model, { ...checklist }, updateChecklistDto);

    return await this.checklistRepository.save(model);
  }

  async remove(id: string): Promise<UpdateResult> {
    const checklist: Checklist = await this.findOne(id);

    return await this.checklistRepository
      .createQueryBuilder('checklists')
      .softDelete()
      .where('id = :id', { id: checklist.id })
      .returning('*')
      .execute();
  }
}
