import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Checklist } from '../../../../database/src/entities/checklist.entity';
import { AppService } from '../../../../common/src/services/app.service';

@Injectable()
export class ChecklistService extends AppService<Checklist> {
  constructor(
    @InjectRepository(Checklist)
    private readonly checklistRepository: Repository<Checklist>
  ) {
    super(checklistRepository);
  }
}
