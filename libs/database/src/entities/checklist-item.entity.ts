import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { AppBase } from './app-base';
import { Checklist } from './checklist.entity';

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
