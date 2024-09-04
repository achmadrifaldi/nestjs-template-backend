import { IPaginationOptions } from 'nestjs-typeorm-paginate';

export interface IExtendPaginationOptions extends IPaginationOptions {
  sortBy: string[];
  sortPermitColumns?: Record<string, string>;
  filters?: Record<string, string>[];
  relations?: string[];
  isPaginate?: boolean;
}
