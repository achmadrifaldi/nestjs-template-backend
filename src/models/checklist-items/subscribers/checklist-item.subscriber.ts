import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';

import { InjectDataSource } from '@nestjs/typeorm';
import { ChecklistItem } from '../entities/checklist-item.entity';
import { ChecklistItemAud } from '../entities/checklist-item-aud.entity';
import { AuditLog } from 'src/models/audit-logs/entities/audit-log.entity';

@EventSubscriber()
export class ChecklistItemSubscriber implements EntitySubscriberInterface<ChecklistItem> {
  constructor(
    @InjectDataSource()
    dataSource: DataSource
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return ChecklistItem;
  }

  beforeInsert(event: InsertEvent<ChecklistItem>) {
    const {
      entity,
      queryRunner: {
        data: { user },
      },
    } = event;
    entity.createdBy = user ? user.name : 'SYSTEM';
    entity.updatedBy = user ? user.name : 'SYSTEM';
  }

  beforeUpdate(event: UpdateEvent<ChecklistItem>) {
    const {
      entity,
      queryRunner: {
        data: { user },
      },
    } = event;
    entity.updatedBy = user ? user.name : 'SYSTEM';
  }

  beforeSoftRemove(event: SoftRemoveEvent<ChecklistItem>): void | Promise<any> {
    const {
      entity,
      queryRunner: {
        data: { user },
      },
    } = event;
    entity.updatedBy = user ? user.name : 'SYSTEM';
    entity.deletedBy = user ? user.name : 'SYSTEM';
  }

  async beforeRemove(event: RemoveEvent<ChecklistItem>) {
    await this.setAudit(event, 0);
  }

  async afterInsert(event: InsertEvent<ChecklistItem>) {
    await this.setAudit(event);
  }

  async afterUpdate(event: UpdateEvent<ChecklistItem>) {
    await this.setAudit(event);
  }

  async afterSoftRemove(event: SoftRemoveEvent<ChecklistItem>) {
    await this.setAudit(event);
  }

  async setAudit(
    event:
      | InsertEvent<ChecklistItem>
      | UpdateEvent<ChecklistItem>
      | SoftRemoveEvent<ChecklistItem>
      | RemoveEvent<ChecklistItem>,
    revType = 1
  ): Promise<void> {
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
      const entityRepository = manager.getRepository(ChecklistItemAud);

      // Create audit log entity
      const auditLog = new AuditLog();
      auditLog.userId = user.id;
      auditLog.revType = revType;
      await auditRepository.save(auditLog, { listeners: false });

      // Create audit on entity
      const entityAud = new ChecklistItemAud();
      entityRepository.merge(entityAud, entity, { audit: auditLog });
      await entityRepository.save(entityAud, { listeners: false });
    }
  }
}
