import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';

import { InjectDataSource } from '@nestjs/typeorm';
import { Checklist } from '../entities/checklist.entity';
import { ChecklistAud } from '../entities/checklist-aud.entity';
import { AuditLog } from 'src/models/audit-logs/entities/audit-log.entity';

@EventSubscriber()
export class ChecklistSubscriber implements EntitySubscriberInterface<Checklist> {
  constructor(
    @InjectDataSource()
    dataSource: DataSource
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Checklist;
  }

  beforeInsert(event: InsertEvent<Checklist>) {
    const {
      entity,
      queryRunner: {
        data: { user },
      },
    } = event;
    entity.createdBy = user ? user.name : 'SYSTEM';
    entity.updatedBy = user ? user.name : 'SYSTEM';
  }

  beforeUpdate(event: UpdateEvent<Checklist>) {
    const {
      entity,
      queryRunner: {
        data: { user },
      },
    } = event;
    entity.updatedBy = user ? user.name : 'SYSTEM';
  }

  beforeSoftRemove(event: SoftRemoveEvent<Checklist>): void | Promise<any> {
    const {
      entity,
      queryRunner: {
        data: { user },
      },
    } = event;
    entity.updatedBy = user ? user.name : 'SYSTEM';
    entity.deletedBy = user ? user.name : 'SYSTEM';
  }

  async afterInsert(event: InsertEvent<Checklist>) {
    await this.setAudit(event);
  }

  async afterUpdate(event: UpdateEvent<Checklist>) {
    await this.setAudit(event);
  }

  async afterSoftRemove(event: SoftRemoveEvent<Checklist>) {
    await this.setAudit(event);
  }

  async setAudit(event): Promise<void> {
    const {
      entity,
      queryRunner: {
        data: { user },
      },
      manager,
    } = event;

    // Set audit only if user exists
    if (user) {
      const auditRepository = manager.getRepository(AuditLog);
      const entityRepository = manager.getRepository(ChecklistAud);

      // Create audit log entity
      const auditLog = new AuditLog();
      auditLog.userId = user.id;
      await auditRepository.save(auditLog);

      // Create audit on entity
      const entityAud = new ChecklistAud();
      entityRepository.merge(entityAud, entity, { audit: auditLog });
      entityRepository.save(entityAud);
    }
  }
}
