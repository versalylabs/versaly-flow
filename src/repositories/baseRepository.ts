/**
 * PulseBrand Agency OS - Base Repository Pattern
 * Phase 02: Project Architecture
 */

import { storageService } from '../services/storageService';
import { eventBus, AppEventName } from '../services/eventBus';

export interface Identifiable {
  id: string;
}

export abstract class BaseRepository<T extends Identifiable> {
  protected storageKey: string;
  protected defaultData: T[];

  constructor(storageKey: string, defaultData: T[]) {
    this.storageKey = storageKey;
    this.defaultData = defaultData;
  }

  public getAll(): T[] {
    return storageService.getItem<T[]>(this.storageKey, this.defaultData);
  }

  public getById(id: string): T | undefined {
    const items = this.getAll();
    return items.find(item => item.id === id);
  }

  public create(item: T, eventOnCreate?: AppEventName, actor?: { actorId: string; actorName: string }): T {
    const items = this.getAll();
    const updated = [item, ...items];
    storageService.setItem(this.storageKey, updated);

    if (eventOnCreate) {
      eventBus.emit(eventOnCreate, item, actor);
    }

    return item;
  }

  public update(id: string, updates: Partial<T>, eventOnUpdate?: AppEventName, actor?: { actorId: string; actorName: string }): T | null {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;

    const updatedItem = { ...items[index], ...updates };
    items[index] = updatedItem;
    storageService.setItem(this.storageKey, items);

    if (eventOnUpdate) {
      eventBus.emit(eventOnUpdate, updatedItem, actor);
    }

    return updatedItem;
  }

  public delete(id: string, actor?: { actorId: string; actorName: string }): boolean {
    const items = this.getAll();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;

    storageService.setItem(this.storageKey, filtered);
    return true;
  }

  public resetToDefault(): void {
    storageService.setItem(this.storageKey, this.defaultData);
  }
}
