import { Column, Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { User } from './user.entity';
import { AuditInfo } from 'src/common/entities/audit-info';

@Entity()
export class UserAud extends User {
  @ApiProperty()
  @Column(() => AuditInfo)
  audit: AuditInfo;
}
