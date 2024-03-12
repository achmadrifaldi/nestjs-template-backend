import { IPaginationOptions } from 'nestjs-typeorm-paginate';

export interface IExtendPaginationOptions extends IPaginationOptions {
  sortBy: string[];
  search?: string;
}
