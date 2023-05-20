import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChecklistItem } from './entities/checklist-item.entity';
import { Repository } from 'typeorm';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { IExtendPaginationOptions } from 'src/common/interfaces/extend-pagination-options.interface';
import { QuerySortingHelper } from 'src/common/helpers/query-sorting.helper';
import { SORTING_COLUMNS } from './constants/sorting-columns.constant';
import { ChecklistsService } from '../checklists/checklists.service';

@Injectable()
export class ChecklistItemsService {
  constructor(
    @InjectRepository(ChecklistItem)
    private readonly checklistItemRepository: Repository<ChecklistItem>,
    private readonly checklistService: ChecklistsService,
  ) {}

  async create(
    checklistId: string,
    createChecklistItemDto: CreateChecklistItemDto,
  ): Promise<ChecklistItem> {
    const { name } = createChecklistItemDto;
    const checklist = await this.checklistService.findOne(checklistId);

    const model = new ChecklistItem();
    this.checklistItemRepository.merge(model, { name });
    model.checklist = checklist;

    return await this.checklistItemRepository.save(model);
  }

  async findAll(
    checklistId: string,
    options: IExtendPaginationOptions,
  ): Promise<Pagination<ChecklistItem>> {
    const { sortBy, search } = options;

    let queryBuilder =
      this.checklistItemRepository.createQueryBuilder('checklistItems');

    if (sortBy && sortBy.length) {
      queryBuilder = QuerySortingHelper(
        queryBuilder,
        options.sortBy,
        SORTING_COLUMNS,
      );
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
    updateChecklistItemDto: UpdateChecklistItemDto,
  ): Promise<ChecklistItem> {
    const checklistItem: ChecklistItem = await this.findOne(checklistId, id);

    const model = new ChecklistItem();
    this.checklistItemRepository.merge(
      model,
      { ...checklistItem },
      updateChecklistItemDto,
    );

    return await this.checklistItemRepository.save(model);
  }

  async remove(checklistId: string, id: string): Promise<ChecklistItem> {
    const checklistItem: ChecklistItem = await this.findOne(checklistId, id);

    const result = await this.checklistItemRepository
      .createQueryBuilder('checklistItems')
      .softDelete()
      .where('id = :id', { id: checklistItem.id })
      .returning('*')
      .execute();

    return result.raw[0];
  }
}
