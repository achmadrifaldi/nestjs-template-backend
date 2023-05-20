export const QuerySortingHelper = (
  queryBuilder: any,
  sortBy: string[],
  permitColumns: any,
) => {
  const builder = queryBuilder;
  sortBy.forEach((value) => {
    if (value) {
      const [column, direction] = value.split('|');

      const sortDirection =
        direction === 'asc' || direction === 'desc'
          ? `${direction}`.toUpperCase()
          : 'ASC';

      if (permitColumns[column])
        builder.orderBy(permitColumns[column], sortDirection as 'ASC' | 'DESC');
    }
  });

  return builder;
};
