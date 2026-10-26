/**
 * PulseBrand Agency OS - Content Repository
 * Phase 02: Project Architecture
 */

import { BaseRepository } from './baseRepository';
import { ContentItem, ContentStage, ContentApprovalLog } from '../types';
import { INITIAL_CONTENT } from '../data/seedData';
import { eventBus } from '../services/eventBus';

export class ContentRepository extends BaseRepository<ContentItem> {
  constructor() {
    super('content', INITIAL_CONTENT);
  }

  public getByClient(clientId: string): ContentItem[] {
    return this.getAll().filter(item => item.clientId === clientId);
  }

  public getByTenant(tenantId: string): ContentItem[] {
    return this.getAll().filter(item => item.tenantId === tenantId);
  }

  public getByStage(stage: ContentStage, tenantId?: string): ContentItem[] {
    return this.getAll().filter(item => item.stage === stage && (!tenantId || item.tenantId === tenantId));
  }

  public advanceStage(
    contentId: string,
    newStage: ContentStage,
    logEntry?: ContentApprovalLog,
    actor?: { actorId: string; actorName: string }
  ): ContentItem | null {
    const existing = this.getById(contentId);
    if (!existing) return null;

    const updatedHistory = logEntry
      ? [logEntry, ...existing.approvalHistory]
      : existing.approvalHistory;

    const updated = this.update(
      contentId,
      {
        stage: newStage,
        approvalHistory: updatedHistory,
        updatedAt: new Date().toISOString()
      },
      newStage === 'approved' ? 'content:approved' : 'content:stage_advanced',
      actor
    );

    return updated;
  }
}

export const contentRepository = new ContentRepository();
