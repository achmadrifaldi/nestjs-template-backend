import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export abstract class AppBase {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @CreateDateColumn()
  createdDt: Date;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  createdBy: string;

  @ApiProperty()
  @UpdateDateColumn()
  updatedDt: Date;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  updatedBy: string;

  @ApiProperty()
  @DeleteDateColumn()
  deletedDt: Date;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  deletedBy: string;

  @ApiProperty()
  @VersionColumn()
  version: number;
}
