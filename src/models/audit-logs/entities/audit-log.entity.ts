import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { AppBase } from 'src/common/entities/app-base';
import { User } from 'src/models/users/entities/user.entity';

@Entity()
export class AuditLog extends AppBase {
  @ApiProperty()
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
