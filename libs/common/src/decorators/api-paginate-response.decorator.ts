import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(Pagination),
    ApiExtraModels(model),
    ApiOkResponse({
      description: 'Successfully received model list',
      schema: {
        allOf: [
          {
            properties: {
              statusCode: {
                type: 'number',
              },
              message: {
                type: 'string',
              },
              data: {
                type: 'object',
              },
            },
          },
          {
            properties: {
              data: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                  meta: {
                    type: 'object',
                    properties: {
                      totalItems: {
                        type: 'number',
                      },
                      itemCount: {
                        type: 'number',
                      },
                      itemsPerPage: {
                        type: 'number',
                      },
                      totalPages: {
                        type: 'number',
                      },
                      currentPage: {
                        type: 'number',
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    })
  );
};
