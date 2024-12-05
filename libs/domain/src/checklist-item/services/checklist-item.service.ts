import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChecklistItem } from '../../../../database/src/entities/checklist-item.entity';
import { AppService } from '../../../../common/src/services/app.service';

@Injectable()
export class ChecklistItemService extends AppService<ChecklistItem> {
  constructor(
    @InjectRepository(ChecklistItem)
    private readonly checklistItemRepository: Repository<ChecklistItem>
  ) {
    super(checklistItemRepository);
  }
}
