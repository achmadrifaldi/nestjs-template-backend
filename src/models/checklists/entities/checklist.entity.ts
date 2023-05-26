import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { ChecklistItem } from '../../../models/checklist-items/entities/checklist-item.entity';

@Entity()
export class Checklist {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => ChecklistItem, checklistItem => checklistItem.checklist, {
    cascade: true,
  })
  checklistItems: ChecklistItem[];

  @ApiProperty()
  @CreateDateColumn()
  createdDt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedDt: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedDt: Date;

  @ApiProperty()
  @VersionColumn()
  version: number;
}
