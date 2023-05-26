import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiBaseResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description: 'Successfully received a data',
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
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    })
  );
};
