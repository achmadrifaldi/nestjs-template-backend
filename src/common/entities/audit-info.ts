import { AuditLog } from 'src/models/audit-logs/entities/audit-log.entity';
import { JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

export class AuditInfo {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id: string;

  @ManyToOne(() => AuditLog, audit => audit.id)
  @JoinColumn({ name: 'id' })
  log: AuditLog;
}
