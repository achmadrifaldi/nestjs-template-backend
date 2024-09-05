import { ApiProperty } from '@nestjs/swagger';
import { Checklist } from '../../checklists/entities/checklist.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBase } from 'src/common/entities/app-base';
import { AutoMap } from '@automapper/classes';

@Entity()
export class ChecklistItem extends AppBase {
  @ApiProperty()
  @AutoMap()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToOne(() => Checklist)
  @JoinColumn()
  @AutoMap(() => Checklist)
  checklist: Checklist;

  @ApiProperty()
  @AutoMap()
  @Column({ default: true })
  status: boolean;
}
