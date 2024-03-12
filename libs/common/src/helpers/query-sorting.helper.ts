export const QuerySortingHelper = (queryBuilder: any, sortBy: string[], permitColumns: any) => {
  const builder = queryBuilder;
  sortBy.forEach(value => {
    if (value) {
      const [column, direction] = value?.split('|');

      const sortDirection = ['asc', 'desc'].includes(direction) ? `${direction}`.toUpperCase() : 'ASC';

      if (permitColumns[column]) {
        builder.orderBy(permitColumns[column], sortDirection as 'ASC' | 'DESC');
      }
    }
  });

  return builder;
};
