import { NotFoundException } from '@nestjs/common';
import {
  Repository,
  FindOptionsWhere,
  FindOneOptions,
  FindManyOptions,
  DeepPartial,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreationDto } from '../dto/creation.dto';
import { DeletionDto } from '../dto/deletion.dto';
import { UpdationDto } from '../dto/updation.dto';
import { IExtendPaginationOptions } from '../interfaces/extend-pagination-options.interface';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';

export class AppService<T> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async findOneById(id: string): Promise<T> {
    const data = await this.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    });

    return data;
  }

  async findOne(findOption: FindOneOptions<T>) {
    const data = await this.repository.findOne(findOption);

    return data;
  }

  async findAll(findOption?: FindManyOptions<T>): Promise<T[]> {
    const data = await this.repository.find(findOption);

    return data;
  }

  async findWithPagination(options: IExtendPaginationOptions): Promise<Pagination<T>> {
    const queryBuilder = this.repository.createQueryBuilder('entity');

    // Apply Relations
    this.applyRelations(queryBuilder, options.relations)

    // Apply Filters
    options?.filters?.forEach(({ column, condition, parameterName, parameterValue }) => {
      this.applyDynamicCondition(queryBuilder, column, condition, parameterName, parameterValue);
    });

    // Apply Sort
    this.applySorting(queryBuilder, options.sortBy, options.sortPermitColumns);

    // Paginate the query
    if (options.isPaginate) {
      return paginate(queryBuilder, options);
    } else {
      const items = await queryBuilder.getMany();
      const totalItems = items.length;
      const paginationMeta = { totalItems, itemCount: totalItems, itemsPerPage: totalItems, currentPage: 1 };
      return new Pagination(items, paginationMeta);
    }
  }

  async save(payload: CreationDto<DeepPartial<T>>): Promise<T> {
    const { body, user } = payload;

    const createdData = this.repository.create({
      ...body,
    });

    const auditColumn = user
      ? {
          createdBy: user.name,
          updatedBy: user.name,
        }
      : {};

      console.log(createdData)

    const savedData = await this.repository.save({
      ...createdData,
      ...auditColumn,
    });

    return savedData;
  }

  async upsert(
    payload: CreationDto<DeepPartial<T>>,
    conflictPathOrOptions: string[],
  ) {
    const { body, user } = payload;

    const auditColumn = user
      ? {
          createdBy: user.name,
          updatedBy: user.name,
        }
      : {};

    const createdData = this.repository.create({
      ...body,
      ...auditColumn,
    });

    const savedData = await this.repository.upsert(
      createdData as unknown as QueryDeepPartialEntity<T>,
      conflictPathOrOptions,
    );

    return savedData;
  }

  async update(payload: UpdationDto<DeepPartial<T>>) {
    const { body, user, id } = payload;

    const data = await this.findOneById(id);

    const userId = user ? user.name : null;

    if (!data) throw new NotFoundException();

    const updatedData = await this.repository.update(
      { id } as unknown as FindOptionsWhere<T>,
      {
        ...body,
        updatedBy: userId,
      } as unknown as QueryDeepPartialEntity<T>,
    );

    return updatedData;
  }

  async delete(payload: DeletionDto) {
    const { id, user } = payload;
    const data = await this.findOneById(id);

    if (!data) throw new NotFoundException();

    if (user) {
      await this.repository.update(
        { id } as unknown as FindOptionsWhere<T>,
        {
          deletedBy: user.name,
        } as unknown as QueryDeepPartialEntity<T>,
      );
    }

    const deletedData = await this.repository.softDelete({
      id,
    } as unknown as FindOptionsWhere<T>);

    return deletedData;
  }

  async remove(payload: DeletionDto) {
    const { id } = payload;
    const data = await this.findOneById(id);

    if (!data) throw new NotFoundException();

    const deletedData = await this.repository.delete({
      id,
    } as unknown as FindOptionsWhere<T>);

    return deletedData;
  }

  /**
   * Applies relations left join and select to the query builder.
   * @param queryBuilder - The TypeORM query builder.
   * @param relations - The table name to be used in the condition (e.g., entity.table2).
   */
  private applyRelations(queryBuilder: SelectQueryBuilder<T>, relations: string[]) {
    relations?.forEach(relation => {
      const alias = relation.split('.');
      queryBuilder.leftJoinAndSelect(relation, alias[1] ?? alias[0]);
    });
  }

  /**
   * Applies sorting to the query builder.
   * @param queryBuilder - The TypeORM query builder.
   * @param sortBy - The column name with ordering to be used in the condition (e.g., column1|asc, column2|desc).
   * @param permitColumns - The key for alias column and value for column name. use this to permit column to order (e.g., { alias: 'entity.alias' }).
   */
  private applySorting(queryBuilder: SelectQueryBuilder<T>, sortBy: string[], permitColumns: Record<string, string>) {
    const builder = queryBuilder;
    sortBy?.forEach(value => {
      if (value) {
        const [column, direction] = value?.split('|');
  
        const sortDirection = ['asc', 'desc'].includes(direction) ? `${direction}`.toUpperCase() : 'ASC';
  
        if (permitColumns[column]) {
          builder.orderBy(permitColumns[column], sortDirection as 'ASC' | 'DESC');
        }
      }
    });
  }

  /**
   * Applies dynamic conditions to the query builder.
   * @param queryBuilder - The TypeORM query builder.
   * @param column - The column name to be used in the condition.
   * @param condition - The SQL condition to apply (e.g., '=', 'LIKE', '>', etc.).
   * @param parameterName - The parameter key to use in the condition.
   * @param parameterValue - The value for the parameter.
   */
   private applyDynamicCondition(
    queryBuilder: SelectQueryBuilder<T>,
    column: string,
    condition: string,
    parameterName: string,
    parameterValue: any
  ) {
    // Dynamically construct the condition string
    const conditionString = `${column} ${condition} :${parameterName}`;
    
    // Apply the condition with the parameters
    queryBuilder.andWhere(conditionString, { [parameterName]: parameterValue });
  }
  
}
