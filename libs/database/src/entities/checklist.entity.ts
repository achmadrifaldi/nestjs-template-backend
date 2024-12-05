import { Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { AppBase } from './app-base';
import { ChecklistItem } from './checklist-item.entity';

@Entity()
export class Checklist extends AppBase {
  @ApiProperty()
  @AutoMap()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => ChecklistItem, checklistItem => checklistItem.checklist, {
    cascade: true,
  })
  checklistItems: ChecklistItem[];
}
