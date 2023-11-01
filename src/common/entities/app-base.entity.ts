import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export class AppBase {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
