import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/models/users/entities/user.entity';

@Entity()
export class AuditLog {
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
  @VersionColumn()
  version: number;

  @ApiProperty()
  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty()
  @Column({ type: 'int', default: 1 })
  revType: number; // 0: entity removed, 1: entity exists

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
