import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository, UpdateResult } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { QuerySortingHelper } from '../../common/helpers/query-sorting.helper';
import { IExtendPaginationOptions } from '../../common/interfaces/extend-pagination-options.interface';
import { ChecklistsService } from '../checklists/checklists.service';
import { SORTING_COLUMNS } from './constants/sorting-columns.constant';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';
import { ChecklistItem } from './entities/checklist-item.entity';

@Injectable()
export class ChecklistItemsService {
  constructor(
    @InjectRepository(ChecklistItem)
    private readonly checklistItemRepository: Repository<ChecklistItem>,
    private readonly checklistService: ChecklistsService
  ) {}

  async create(checklistId: string, createChecklistItemDto: CreateChecklistItemDto): Promise<ChecklistItem> {
    const { name } = createChecklistItemDto;
    const checklist = await this.checklistService.findOne(checklistId);

    const model = new ChecklistItem();
    this.checklistItemRepository.merge(model, { name });
    model.checklist = checklist;

    return await this.checklistItemRepository.save(model);
  }

  async findAll(checklistId: string, options: IExtendPaginationOptions): Promise<Pagination<ChecklistItem>> {
    const { sortBy, search } = options;

    let queryBuilder = this.checklistItemRepository.createQueryBuilder('checklistItems');

    if (sortBy?.length) {
      queryBuilder = QuerySortingHelper(queryBuilder, options.sortBy, SORTING_COLUMNS);
    }

    if (search) {
      queryBuilder.where('(name ilike :name)', { name: `%${search}%` });
    }

    queryBuilder.where(`"checklistId" = :checklistId`, { checklistId });

    return paginate<ChecklistItem>(queryBuilder, options);
  }

  async findOne(checklistId: string, id: string): Promise<ChecklistItem> {
    const checklistItem = await this.checklistItemRepository
      .createQueryBuilder('checklistItems')
      .where(`id = :id`, { id })
      .andWhere(`"checklistId" = :checklistId`, { checklistId })
      .getOne();

    if (!checklistItem) {
      throw new NotFoundException(`Checklist Item with id ${id} not found.`);
    }

    return checklistItem;
  }

  async update(
    checklistId: string,
    id: string,
    updateChecklistItemDto: UpdateChecklistItemDto
  ): Promise<ChecklistItem> {
    const checklistItem: ChecklistItem = await this.findOne(checklistId, id);

    const model = new ChecklistItem();
    this.checklistItemRepository.merge(model, { ...checklistItem }, updateChecklistItemDto);

    return await this.checklistItemRepository.save(model);
  }

  async remove(checklistId: string, id: string): Promise<UpdateResult> {
    const checklistItem: ChecklistItem = await this.findOne(checklistId, id);

    return await this.checklistItemRepository
      .createQueryBuilder('checklistItems')
      .softDelete()
      .where('id = :id', { id: checklistItem.id })
      .returning('*')
      .execute();
  }
}
