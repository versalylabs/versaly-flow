/**
 * PulseBrand Agency OS - Storage Service Abstraction
 * Phase 02: Project Architecture
 */

export interface StorageAdapter {
  getItem<T>(key: string, defaultValue: T): T;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
  clearNamespace(namespace: string): void;
}

class LocalStorageService implements StorageAdapter {
  private prefix = 'pulsebrand_os_v1';
  private memoryStore: Map<string, string> = new Map();

  private get isStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private buildKey(key: string): string {
    return `${this.prefix}_${key}`;
  }

  public getItem<T>(key: string, defaultValue: T): T {
    try {
      const fullKey = this.buildKey(key);
      const raw = this.isStorageAvailable ? localStorage.getItem(fullKey) : this.memoryStore.get(fullKey);
      if (raw === null || raw === undefined) {
        return defaultValue;
      }
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[StorageService] Failed to read key "${key}", falling back to default:`, err);
      return defaultValue;
    }
  }

  public setItem<T>(key: string, value: T): void {
    try {
      const fullKey = this.buildKey(key);
      const serialized = JSON.stringify(value);
      if (this.isStorageAvailable) {
        localStorage.setItem(fullKey, serialized);
      } else {
        this.memoryStore.set(fullKey, serialized);
      }
    } catch (err) {
      console.error(`[StorageService] Failed to write key "${key}":`, err);
    }
  }

  public removeItem(key: string): void {
    try {
      const fullKey = this.buildKey(key);
      if (this.isStorageAvailable) {
        localStorage.removeItem(fullKey);
      } else {
        this.memoryStore.delete(fullKey);
      }
    } catch (err) {
      console.error(`[StorageService] Failed to remove key "${key}":`, err);
    }
  }

  public clearNamespace(namespace?: string): void {
    try {
      const targetPrefix = namespace ? `${this.prefix}_${namespace}` : this.prefix;
      if (this.isStorageAvailable) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(targetPrefix)) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
      } else {
        for (const k of Array.from(this.memoryStore.keys())) {
          if (k.startsWith(targetPrefix)) {
            this.memoryStore.delete(k);
          }
        }
      }
    } catch (err) {
      console.error(`[StorageService] Failed to clear namespace:`, err);
    }
  }
}

export const storageService = new LocalStorageService();
