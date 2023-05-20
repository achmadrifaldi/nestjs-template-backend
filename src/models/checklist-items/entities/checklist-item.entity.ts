import { ApiProperty } from '@nestjs/swagger';
import { Checklist } from 'src/models/checklists/entities/checklist.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class ChecklistItem {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToOne(() => Checklist)
  @JoinColumn()
  checklist: Checklist;

  @ApiProperty()
  @Column({ default: true })
  status: boolean;

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
