import { AutoMap } from '@automapper/classes';
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
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @AutoMap()
  @CreateDateColumn()
  createdDt: Date;

  @ApiProperty()
  @AutoMap()
  @Column({ type: 'varchar', length: 255, nullable: true })
  createdBy: string;

  @ApiProperty()
  @AutoMap()
  @UpdateDateColumn()
  updatedDt: Date;

  @ApiProperty()
  @AutoMap()
  @Column({ type: 'varchar', length: 255, nullable: true })
  updatedBy: string;

  @ApiProperty()
  @AutoMap()
  @DeleteDateColumn()
  deletedDt: Date;

  @ApiProperty()
  @AutoMap()
  @Column({ type: 'varchar', length: 255, nullable: true })
  deletedBy: string;

  @ApiProperty()
  @AutoMap()
  @VersionColumn()
  version: number;
}
