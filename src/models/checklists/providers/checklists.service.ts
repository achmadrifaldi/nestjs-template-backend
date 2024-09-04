import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Checklist } from '../entities/checklist.entity';
import { AppService } from '../../../common/services/app.service';

@Injectable()
export class ChecklistsService extends AppService<Checklist> {
  constructor(
    @InjectRepository(Checklist)
    private readonly checklistRepository: Repository<Checklist>
  ) {
    super(checklistRepository);
  }
}
