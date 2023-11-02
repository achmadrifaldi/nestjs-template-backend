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
import { User } from '../entities/user.entity';
import { UserAud } from '../entities/user-aud.entity';
import { AuditLog } from 'src/models/audit-logs/entities/audit-log.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    @InjectDataSource()
    dataSource: DataSource
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  beforeInsert(event: InsertEvent<User>) {
    const {
      entity,
      queryRunner: {
        data: { user },
      },
    } = event;
    entity.createdBy = user ? user.name : 'SYSTEM';
    entity.updatedBy = user ? user.name : 'SYSTEM';
  }

  beforeUpdate(event: UpdateEvent<User>) {
    const {
      entity,
      queryRunner: {
        data: { user },
      },
    } = event;
    entity.updatedBy = user ? user.name : 'SYSTEM';
  }

  beforeSoftRemove(event: SoftRemoveEvent<User>): void | Promise<any> {
    const {
      entity,
      queryRunner: {
        data: { user },
      },
    } = event;
    entity.updatedBy = user ? user.name : 'SYSTEM';
    entity.deletedBy = user ? user.name : 'SYSTEM';
  }

  async beforeRemove(event: RemoveEvent<User>) {
    await this.setAudit(event, 0);
  }

  async afterInsert(event: InsertEvent<User>) {
    await this.setAudit(event);
  }

  async afterUpdate(event: UpdateEvent<User>) {
    await this.setAudit(event);
  }

  async afterSoftRemove(event: SoftRemoveEvent<User>) {
    await this.setAudit(event);
  }

  async setAudit(
    event: InsertEvent<User> | UpdateEvent<User> | SoftRemoveEvent<User> | RemoveEvent<User>,
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
      const entityRepository = manager.getRepository(UserAud);

      // Create audit log entity
      const auditLog = new AuditLog();
      auditLog.userId = user.id;
      auditLog.revType = revType;
      await auditRepository.save(auditLog, { listeners: false });

      // Create audit on entity
      const entityAud = new UserAud();
      entityRepository.merge(entityAud, entity, { audit: auditLog });
      await entityRepository.save(entityAud, { listeners: false });
    }
  }
}
