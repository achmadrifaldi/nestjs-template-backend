import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { HttpSuccessInterceptor } from '../../../common/interceptors/http-success.interceptor';

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

import { ApiBaseResponse } from '../../../common/decorators/api-base-response.decorator';
import { ApiPaginatedResponse } from '../../../common/decorators/api-paginate-response.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ParamIdDto } from '../../../common/dto/param-id.dto';
import { ChecklistsService } from '../providers/checklists.service';
import { CreateChecklistDto } from '../dto/create-checklist.dto';
import { UpdateChecklistDto } from '../dto/update-checklist.dto';
import { Checklist } from '../entities/checklist.entity';
import { UpdateResult } from 'typeorm';
import { SORTING_COLUMNS } from '../constants/sorting-columns.constant';
import { MapInterceptor } from '@automapper/nestjs';
import { ChecklistDto } from '../dto/checklist.dto';
import { ChecklistProfile } from '../providers/checklist.profile';

@Controller('checklists')
@UseInterceptors(HttpSuccessInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('Checklist')
@ApiBearerAuth()
export class ChecklistsController {
  constructor(
    private readonly checklistsService: ChecklistsService,
    private readonly checklistProfile: ChecklistProfile
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create checklist',
  })
  @ApiBaseResponse(ChecklistDto)
  @UseInterceptors(MapInterceptor(Checklist, ChecklistDto))
  create(@Req() req, @Body() body: CreateChecklistDto) {
    const { user } = req;
    return this.checklistsService.save({ body, user });
  }

  @Get()
  @ApiOperation({
    summary: 'Get list of checklist',
  })
  @ApiPaginatedResponse(ChecklistDto)
  async findAll(@Query() query: PaginationQueryDto): Promise<Pagination<ChecklistDto>> {
    const { page, limit, sortBy, search } = query;

    const filters = [];
    if (search) {
      filters.push({
        column: 'entity.name',
        condition: 'ILIKE',
        parameterName: 'name',
        parameterValue: `%${search}%`
      })
    }

    const data = await this.checklistsService.findWithPagination({
      sortBy, 
      sortPermitColumns: SORTING_COLUMNS,
      filters,
      limit,
      page
    })

    return this.checklistProfile.fromPaginate(data)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one checklist by ID',
  })
  @ApiBaseResponse(ChecklistDto)
  @UseInterceptors(MapInterceptor(Checklist, ChecklistDto))
  async findOne(@Param() param: ParamIdDto): Promise<ChecklistDto> {
    const { id } = param;
    const checklist = await this.checklistsService.findOneById(id);

    if (!checklist) {
      throw new NotFoundException(`Checklist with id ${id} not found.`);
    }

    return checklist;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update checklist by ID',
  })
  @ApiBaseResponse(UpdateResult)
  update(@Req() req, @Param() param: ParamIdDto, @Body() body: UpdateChecklistDto) {
    const { id } = param;
    const { user } = req;
    return this.checklistsService.update({ id, body, user });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft Delete checklist by ID',
  })
  @ApiBaseResponse(UpdateResult)
  remove(@Req() req, @Param() param: ParamIdDto) {
    const { id } = param;
    const { user } = req;
    return this.checklistsService.delete({ id, user });
  }

  @Delete(':id/delete')
  @ApiOperation({
    summary: 'Hard Delete checklist by ID',
  })
  @ApiBaseResponse(UpdateResult)
  delete(@Req() req, @Param() param: ParamIdDto) {
    const { id } = param;
    const { user } = req;
    return this.checklistsService.remove({ id, user });
  }
}
