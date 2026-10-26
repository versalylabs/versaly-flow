/**
 * PulseBrand Agency OS - Task Repository
 * Phase 02: Project Architecture
 */

import { BaseRepository } from './baseRepository';
import { AgencyTask } from '../types';
import { INITIAL_TASKS } from '../data/seedData';

export class TaskRepository extends BaseRepository<AgencyTask> {
  constructor() {
    super('tasks', INITIAL_TASKS);
  }

  public getByAssignee(userId: string): AgencyTask[] {
    return this.getAll().filter(t => t.assignedToUserId === userId);
  }

  public getByClient(clientId: string): AgencyTask[] {
    return this.getAll().filter(t => t.clientId === clientId);
  }

  public updateStatus(taskId: string, status: AgencyTask['status'], actor?: { actorId: string; actorName: string }): AgencyTask | null {
    return this.update(taskId, { status }, 'task:status_updated', actor);
  }
}

export const taskRepository = new TaskRepository();
