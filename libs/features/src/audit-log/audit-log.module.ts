import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../../../database/src/entity/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditLogService],
})
export class AuditLogModule {}
