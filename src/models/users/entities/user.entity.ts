import { Column, Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AppBase } from 'src/common/entities/app-base';

@Entity()
export class User extends AppBase {
  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100 })
  password: string;
}
