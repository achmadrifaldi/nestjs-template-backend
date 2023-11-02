import { Column, Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { Checklist } from './checklist.entity';
import { AuditInfo } from 'src/common/entities/audit-info';

@Entity()
export class ChecklistAud extends Checklist {
  @ApiProperty()
  @Column(() => AuditInfo)
  audit: AuditInfo;
}
