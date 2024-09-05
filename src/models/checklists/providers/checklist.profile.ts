import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, type Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Checklist } from '../entities/checklist.entity';
import { ChecklistDto } from '../dto/checklist.dto';

@Injectable()
export class ChecklistProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    fromPaginate(data) {
        const items = data.items.map((item: Checklist) => this.mapper.map(item, Checklist, ChecklistDto))
        return {
            ...data,
            items
        }
    }

    override get profile() {
        return (mapper) => {
            createMap(mapper, Checklist, ChecklistDto);
        };
    }
}