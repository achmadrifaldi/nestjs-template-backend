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
import { UpdateResult } from 'typeorm';
import { MapInterceptor } from '@automapper/nestjs';
import {
  HttpSuccessInterceptor,
  ParamIdDto,
  PaginationQueryDto,
  ApiPaginatedResponse,
  ApiBaseResponse,
} from '@app/common';
import { JwtAuthGuard } from '@app/authentication';
import { Checklist } from '@app/database';
import {
  ChecklistDto,
  CreateChecklistDto,
  UpdateChecklistDto,
  CHECKLIST_SORTING_COLUMNS,
  ChecklistProfile,
  ChecklistService,
} from '@app/domain';

@Controller('checklists')
@UseInterceptors(HttpSuccessInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('Checklist')
@ApiBearerAuth()
export class ChecklistsController {
  constructor(
    private readonly checklistService: ChecklistService,
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
    return this.checklistService.save({ body, user });
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
        parameterValue: `%${search}%`,
      });
    }

    const data = await this.checklistService.findWithPagination({
      sortBy,
      sortPermitColumns: CHECKLIST_SORTING_COLUMNS,
      filters,
      limit,
      page,
    });

    return this.checklistProfile.fromPaginate(data);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one checklist by ID',
  })
  @ApiBaseResponse(ChecklistDto)
  @UseInterceptors(MapInterceptor(Checklist, ChecklistDto))
  async findOne(@Param() param: ParamIdDto): Promise<ChecklistDto> {
    const { id } = param;
    const checklist = await this.checklistService.findOneById(id);

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
    return this.checklistService.update({ id, body, user });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft Delete checklist by ID',
  })
  @ApiBaseResponse(UpdateResult)
  remove(@Req() req, @Param() param: ParamIdDto) {
    const { id } = param;
    const { user } = req;
    return this.checklistService.delete({ id, user });
  }

  @Delete(':id/delete')
  @ApiOperation({
    summary: 'Hard Delete checklist by ID',
  })
  @ApiBaseResponse(UpdateResult)
  delete(@Req() req, @Param() param: ParamIdDto) {
    const { id } = param;
    const { user } = req;
    return this.checklistService.remove({ id, user });
  }
}