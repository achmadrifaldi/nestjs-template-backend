import { Pagination } from 'nestjs-typeorm-paginate';

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiBaseResponse } from '../../common/decorators/api-base-response.decorator';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginate-response.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ParamIdDto } from '../../common/dto/param-id.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { HttpSuccessInterceptor } from '../../common/interceptors/http-success.interceptor';
import { ChecklistItemsService } from './checklist-items.service';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { ParamChecklistIdDto } from './dto/param-checklist-id.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';
import { ChecklistItem } from './entities/checklist-item.entity';
import { UpdateResult } from 'typeorm';

@Controller('checklists')
@UseInterceptors(HttpSuccessInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('Checklist Item')
@ApiBearerAuth()
export class ChecklistItemsController {
  constructor(private readonly checklistItemsService: ChecklistItemsService) {}

  @Post(':checklistId/checklist-items')
  @ApiOperation({
    summary: 'Create checklist item',
  })
  @ApiBaseResponse(ChecklistItem)
  create(@Param() paramChecklist: ParamChecklistIdDto, @Body() createChecklistItemDto: CreateChecklistItemDto) {
    const { checklistId } = paramChecklist;
    return this.checklistItemsService.create(checklistId, createChecklistItemDto);
  }

  @Get(':checklistId/checklist-items')
  @ApiOperation({
    summary: 'Get list checklist item',
  })
  @ApiPaginatedResponse(ChecklistItem)
  findAll(
    @Param() paramChecklist: ParamChecklistIdDto,
    @Query() query: PaginationQueryDto
  ): Promise<Pagination<ChecklistItem>> {
    const { checklistId } = paramChecklist;
    const { page, limit, sortBy, search } = query;

    return this.checklistItemsService.findAll(checklistId, {
      limit,
      page,
      search,
      sortBy: Array.isArray(sortBy) ? sortBy : [sortBy],
    });
  }

  @Get(':checklistId/checklist-items/:id')
  @ApiOperation({
    summary: 'Get one checklist item by ID',
  })
  @ApiBaseResponse(ChecklistItem)
  findOne(@Param() paramChecklist: ParamChecklistIdDto, @Param() param: ParamIdDto) {
    const { checklistId } = paramChecklist;
    const { id } = param;
    return this.checklistItemsService.findOne(checklistId, id);
  }

  @Patch(':checklistId/checklist-items/:id')
  @ApiOperation({
    summary: 'Update checklist item by ID',
  })
  @ApiBaseResponse(ChecklistItem)
  update(
    @Param() paramChecklist: ParamChecklistIdDto,
    @Param() param: ParamIdDto,
    @Body() updateChecklistItemDto: UpdateChecklistItemDto
  ) {
    const { checklistId } = paramChecklist;
    const { id } = param;
    return this.checklistItemsService.update(checklistId, id, updateChecklistItemDto);
  }

  @Delete(':checklistId/checklist-items/:id')
  @ApiOperation({
    summary: 'Delete checklist item by ID',
  })
  @ApiBaseResponse(UpdateResult)
  remove(@Param() paramChecklist: ParamChecklistIdDto, @Param() param: ParamIdDto) {
    const { checklistId } = paramChecklist;
    const { id } = param;
    return this.checklistItemsService.remove(checklistId, id);
  }
}
