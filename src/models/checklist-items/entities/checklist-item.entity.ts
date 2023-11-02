import { ApiProperty } from '@nestjs/swagger';
import { Checklist } from '../../checklists/entities/checklist.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBase } from 'src/common/entities/app-base';

@Entity()
export class ChecklistItem extends AppBase {
  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToOne(() => Checklist)
  @JoinColumn()
  checklist: Checklist;

  @ApiProperty()
  @Column({ default: true })
  status: boolean;
}
