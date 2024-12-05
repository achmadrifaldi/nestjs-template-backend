import { UpdateResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MapInterceptor } from '@automapper/nestjs';

import {
  HttpSuccessInterceptor,
  ParamIdDto,
  PaginationQueryDto,
  ApiPaginatedResponse,
  ApiBaseResponse,
} from '@app/common';

import { JwtAuthGuard } from '@app/authentication';

import { ChecklistItem } from '@app/database';

import {
  ChecklistItemDto,
  CreateChecklistItemDto,
  ParamChecklistIdDto,
  UpdateChecklistItemDto,
  ChecklistItemProfile,
  ChecklistItemService,
  CHECKLIST_ITEM_SORTING_COLUMNS,

  // Checklist
  ChecklistService,
} from '@app/domain';

@Controller('checklists')
@UseInterceptors(HttpSuccessInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('Checklist Item')
@ApiBearerAuth()
export class ChecklistItemsController {
  constructor(
    private readonly checklistService: ChecklistService,
    private readonly checklistItemService: ChecklistItemService,
    private readonly checklistItemProfile: ChecklistItemProfile
  ) {}

  @Post(':checklistId/checklist-items')
  @ApiOperation({
    summary: 'Create checklist item',
  })
  @ApiBaseResponse(ChecklistItemDto)
  @UseInterceptors(MapInterceptor(ChecklistItem, ChecklistItemDto))
  async create(@Param() paramChecklist: ParamChecklistIdDto, @Req() req, @Body() body: CreateChecklistItemDto) {
    const { checklistId } = paramChecklist;
    const checklist = await this.validateChecklist(checklistId);

    const { user } = req;
    const payload = {
      ...body,
      checklist,
    };

    return this.checklistItemService.save({ body: payload, user });
  }

  @Get(':checklistId/checklist-items')
  @ApiOperation({
    summary: 'Get list checklist item',
  })
  @ApiPaginatedResponse(ChecklistItemDto)
  async findAll(
    @Param() paramChecklist: ParamChecklistIdDto,
    @Query() query: PaginationQueryDto
  ): Promise<Pagination<ChecklistItemDto>> {
    const { checklistId } = paramChecklist;
    await this.validateChecklist(checklistId);

    const { page, limit, sortBy, search } = query;

    const filters = [
      {
        column: 'entity.checklist_id',
        condition: '=',
        parameterName: 'checklistId',
        parameterValue: checklistId,
      },
    ];

    if (search) {
      filters.push({
        column: 'entity.name',
        condition: 'ILIKE',
        parameterName: 'name',
        parameterValue: `%${search}%`,
      });
    }

    const data = await this.checklistItemService.findWithPagination({
      sortBy,
      sortPermitColumns: CHECKLIST_ITEM_SORTING_COLUMNS,
      relations: ['entity.checklist'],
      filters,
      limit,
      page,
    });

    return this.checklistItemProfile.fromPaginate(data);
  }

  @Get(':checklistId/checklist-items/:id')
  @ApiOperation({
    summary: 'Get one checklist item by ID',
  })
  @ApiBaseResponse(ChecklistItemDto)
  @UseInterceptors(MapInterceptor(ChecklistItem, ChecklistItemDto))
  async findOne(@Param() paramChecklist: ParamChecklistIdDto, @Param() param: ParamIdDto) {
    const { checklistId } = paramChecklist;
    const { id } = param;

    return this.setChecklistItem(checklistId, id);
  }

  @Patch(':checklistId/checklist-items/:id')
  @ApiOperation({
    summary: 'Update checklist item by ID',
  })
  @ApiBaseResponse(UpdateResult)
  async update(
    @Param() paramChecklist: ParamChecklistIdDto,
    @Param() param: ParamIdDto,
    @Req() req,
    @Body() body: UpdateChecklistItemDto
  ) {
    const { checklistId } = paramChecklist;
    await this.validateChecklist(checklistId);

    const { user } = req;
    const { id } = param;
    return this.checklistItemService.update({ id, body, user });
  }

  @Delete(':checklistId/checklist-items/:id')
  @ApiOperation({
    summary: 'Delete checklist item by ID',
  })
  @ApiBaseResponse(UpdateResult)
  async remove(@Param() paramChecklist: ParamChecklistIdDto, @Req() req, @Param() param: ParamIdDto) {
    const { checklistId } = paramChecklist;
    const { user } = req;
    const { id } = param;

    // Validate if checklist item with checklist id is exists
    await this.setChecklistItem(checklistId, id);

    return this.checklistItemService.delete({ id, user });
  }

  private async validateChecklist(checklistId) {
    const checklist = await this.checklistService.findOneById(checklistId);
    if (!checklist) {
      throw new NotFoundException(`Checklist with id ${checklistId} not found.`);
    }

    return checklist;
  }

  private async setChecklistItem(checklistId, checklistItemId) {
    const checklistItem = await this.checklistItemService.findOne({
      where: {
        id: checklistItemId,
        checklist: {
          id: checklistId,
        },
      },
    });

    if (!checklistItem) {
      throw new NotFoundException(`Checklist Item with id ${checklistItemId} not found.`);
    }

    return checklistItem;
  }
}
