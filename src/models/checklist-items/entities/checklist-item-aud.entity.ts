import { Column, Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { ChecklistItem } from './checklist-item.entity';
import { AuditInfo } from 'src/common/entities/audit-info';

@Entity()
export class ChecklistItemAud extends ChecklistItem {
  @ApiProperty()
  @Column(() => AuditInfo)
  audit: AuditInfo;
}
