import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiBaseResponse } from 'src/common/decorators/api-base-response.decorator';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginate-response.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ParamIdDto } from 'src/common/dto/param-id.dto';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ChecklistsService } from './checklists.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { Checklist } from './entities/checklist.entity';
import { HttpSuccessInterceptor } from 'src/common/interceptors/http-success.interceptor';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('checklists')
@UseInterceptors(HttpSuccessInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('Checklist')
@ApiBearerAuth()
export class ChecklistsController {
  constructor(private readonly checklistsService: ChecklistsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create checklist',
  })
  @ApiBaseResponse(Checklist)
  create(@Body() createChecklistDto: CreateChecklistDto) {
    return this.checklistsService.create(createChecklistDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get list of checklist',
  })
  @ApiPaginatedResponse(Checklist)
  findAll(@Query() query: PaginationQueryDto): Promise<Pagination<Checklist>> {
    const { page, limit, sortBy, search } = query;

    return this.checklistsService.findAll({
      limit,
      page,
      search,
      sortBy: Array.isArray(sortBy) ? sortBy : [sortBy],
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one checklist by ID',
  })
  @ApiBaseResponse(Checklist)
  findOne(@Param() param: ParamIdDto) {
    const { id } = param;
    return this.checklistsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update checklist by ID',
  })
  @ApiBaseResponse(Checklist)
  update(
    @Param() param: ParamIdDto,
    @Body() updateChecklistDto: UpdateChecklistDto,
  ) {
    const { id } = param;
    return this.checklistsService.update(id, updateChecklistDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete checklist by ID',
  })
  @ApiBaseResponse(Checklist)
  remove(@Param() param: ParamIdDto) {
    const { id } = param;
    return this.checklistsService.remove(id);
  }
}
