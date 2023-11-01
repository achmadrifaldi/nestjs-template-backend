import { Column, Entity, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { ChecklistItem } from '../../checklist-items/entities/checklist-item.entity';
import { AppBase } from 'src/common/entities/app-base.entity';

@Entity()
export class Checklist extends AppBase {
  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => ChecklistItem, checklistItem => checklistItem.checklist, {
    cascade: true,
  })
  checklistItems: ChecklistItem[];
}
