import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBase } from './app-base';
import { Checklist } from './checklist.entity';

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
