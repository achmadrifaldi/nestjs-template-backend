import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, type Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { ChecklistItem } from '../../../../database/src/entities/checklist-item.entity';
import { ChecklistItemDto } from '../dto/checklist-item.dto';

@Injectable()
export class ChecklistItemProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  fromPaginate(data) {
    const items = data.items.map((item: ChecklistItem) => this.mapper.map(item, ChecklistItem, ChecklistItemDto));
    return {
      ...data,
      items,
    };
  }

  override get profile() {
    return mapper => {
      createMap(mapper, ChecklistItem, ChecklistItemDto);
    };
  }
}
