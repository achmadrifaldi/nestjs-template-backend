import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChecklistItem } from '../entities/checklist-item.entity';
import { AppService } from '../../../common/services/app.service';

@Injectable()
export class ChecklistItemsService extends AppService<ChecklistItem> {
  constructor(
    @InjectRepository(ChecklistItem)
    private readonly checklistItemRepository: Repository<ChecklistItem>,
  ) {
    super(checklistItemRepository);
  }
}
