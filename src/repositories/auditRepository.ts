/**
 * PulseBrand Agency OS - Audit Repository
 * Phase 02: Project Architecture
 */

import { BaseRepository } from './baseRepository';
import { AuditEvent } from '../types';
import { INITIAL_AUDIT_LOGS } from '../data/seedData';
import { eventBus } from '../services/eventBus';

export class AuditRepository extends BaseRepository<AuditEvent> {
  constructor() {
    super('audit', INITIAL_AUDIT_LOGS);
  }

  public record(
    tenantId: string,
    userId: string,
    userName: string,
    category: AuditEvent['category'],
    action: string,
    details: string,
    targetId?: string
  ): AuditEvent {
    const event: AuditEvent = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId,
      userId,
      userName,
      category,
      action,
      details,
      targetId,
      timestamp: new Date().toISOString()
    };

    return this.create(event, 'audit:logged', { actorId: userId, actorName: userName });
  }

  public getByCategory(category: AuditEvent['category']): AuditEvent[] {
    return this.getAll().filter(item => item.category === category);
  }
}

export const auditRepository = new AuditRepository();
