import { UpdateResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';

import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiBaseResponse } from '../../../common/decorators/api-base-response.decorator';
import { ApiPaginatedResponse } from '../../../common/decorators/api-paginate-response.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ParamIdDto } from '../../../common/dto/param-id.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { HttpSuccessInterceptor } from '../../../common/interceptors/http-success.interceptor';
import { ChecklistsService } from '../../checklists/providers/checklists.service';
import { ChecklistItemsService } from '../providers/checklist-items.service';
import { CreateChecklistItemDto } from '../dto/create-checklist-item.dto';
import { ParamChecklistIdDto } from '../dto/param-checklist-id.dto';
import { UpdateChecklistItemDto } from '../dto/update-checklist-item.dto';
import { ChecklistItem } from '../entities/checklist-item.entity';
import { SORTING_COLUMNS } from '../constants/sorting-columns.constant';

@Controller('checklists')
@UseInterceptors(HttpSuccessInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('Checklist Item')
@ApiBearerAuth()
export class ChecklistItemsController {
  constructor(
    private readonly checklistService: ChecklistsService,
    private readonly checklistItemsService: ChecklistItemsService
  ) {}

  @Post(':checklistId/checklist-items')
  @ApiOperation({
    summary: 'Create checklist item',
  })
  @ApiBaseResponse(ChecklistItem)
  async create(@Param() paramChecklist: ParamChecklistIdDto, @Req() req, @Body() body: CreateChecklistItemDto) {
    const { checklistId } = paramChecklist;
    const checklist = await this.validateChecklist(checklistId);

    const { user } = req;
    const payload = {
      ...body,
      checklist
    }
    return this.checklistItemsService.save({ body: payload, user });
  }

  @Get(':checklistId/checklist-items')
  @ApiOperation({
    summary: 'Get list checklist item',
  })
  @ApiPaginatedResponse(ChecklistItem)
  async findAll(
    @Param() paramChecklist: ParamChecklistIdDto,
    @Query() query: PaginationQueryDto
  ): Promise<Pagination<ChecklistItem>> {
    const { checklistId } = paramChecklist;
    await this.validateChecklist(checklistId);

    const { page, limit, sortBy, search } = query;

    const filters = [{
      column: 'entity.checklist_id',
      condition: '=',
      parameterName: 'checklistId',
      parameterValue: checklistId
    }];

    if (search) {
      filters.push({
        column: 'entity.name',
        condition: 'ILIKE',
        parameterName: 'name',
        parameterValue: `%${search}%`
      })
    }

    return this.checklistItemsService.findWithPagination({
      sortBy, 
      sortPermitColumns: SORTING_COLUMNS,
      filters,
      limit,
      page
    })
  }

  @Get(':checklistId/checklist-items/:id')
  @ApiOperation({
    summary: 'Get one checklist item by ID',
  })
  @ApiBaseResponse(ChecklistItem)
  async findOne(@Param() paramChecklist: ParamChecklistIdDto, @Param() param: ParamIdDto) {
    const { checklistId } = paramChecklist;
    const { id } = param;

    return this.setChecklistItem(checklistId, id);
  }

  @Patch(':checklistId/checklist-items/:id')
  @ApiOperation({
    summary: 'Update checklist item by ID',
  })
  @ApiBaseResponse(ChecklistItem)
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
    return this.checklistItemsService.update({ id, body, user });
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

    return this.checklistItemsService.delete({ id, user });
  }

  private async validateChecklist(checklistId) {
    const checklist = await this.checklistService.findOneById(checklistId);
    if (!checklist) {
      throw new NotFoundException(`Checklist with id ${checklistId} not found.`);
    }

    return checklist;
  }

  private async setChecklistItem(checklistId, checklistItemId) {
    const checklistItem = await this.checklistItemsService.findOne({
      where: {
        id: checklistItemId,
        checklist: {
          id: checklistId
        }
      }
    });

    if (!checklistItem) {
      throw new NotFoundException(`Checklist Item with id ${checklistItemId} not found.`);
    }

    return checklistItem;
  }
}
