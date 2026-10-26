/**
 * PulseBrand Agency OS - Decoupled Typed Event Bus
 * Phase 02: Project Architecture
 */

export type AppEventName =
  | 'system:initialized'
  | 'auth:logged_in'
  | 'auth:logged_out'
  | 'auth:registered'
  | 'auth:session_refreshed'
  | 'auth:password_reset_requested'
  | 'auth:profile_updated'
  | 'auth:identity_switched'
  | 'workspace:created'
  | 'workspace:switched'
  | 'workspace:updated'
  | 'workspace:domain_mapped'
  | 'client:created'
  | 'client:updated'
  | 'client:status_changed'
  | 'content:created'
  | 'content:stage_advanced'
  | 'content:approved'
  | 'content:revision_requested'
  | 'campaign:created'
  | 'task:status_updated'
  | 'audit:logged'
  | 'toast:dispatched';

export interface AppEventPayload<T = unknown> {
  eventId: string;
  eventName: AppEventName;
  timestamp: string;
  actorId?: string;
  actorName?: string;
  data: T;
}

type EventListener<T = unknown> = (payload: AppEventPayload<T>) => void;

class EventBusService {
  private listeners: Map<AppEventName, Set<EventListener<unknown>>> = new Map();
  private eventHistory: AppEventPayload<unknown>[] = [];
  private maxHistorySize = 100;

  /**
   * Subscribe to a typed application event
   */
  public subscribe<T = unknown>(eventName: AppEventName, listener: EventListener<T>): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    const set = this.listeners.get(eventName)!;
    const typedListener = listener as EventListener<unknown>;
    set.add(typedListener);

    // Return unsubscribe callback
    return () => {
      set.delete(typedListener);
    };
  }

  /**
   * Emit a typed application event with metadata payload
   */
  public emit<T = unknown>(
    eventName: AppEventName,
    data: T,
    meta?: { actorId?: string; actorName?: string }
  ): AppEventPayload<T> {
    const payload: AppEventPayload<T> = {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      eventName,
      timestamp: new Date().toISOString(),
      actorId: meta?.actorId,
      actorName: meta?.actorName,
      data
    };

    // Keep ring buffer of recent events for telemetry & architecture inspection
    this.eventHistory.unshift(payload as AppEventPayload<unknown>);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.pop();
    }

    const listenersForEvent = this.listeners.get(eventName);
    if (listenersForEvent) {
      listenersForEvent.forEach(listener => {
        try {
          listener(payload as AppEventPayload<unknown>);
        } catch (err) {
          console.error(`[EventBus] Error in listener for "${eventName}":`, err);
        }
      });
    }

    return payload;
  }

  /**
   * Retrieve event log history
   */
  public getHistory(): AppEventPayload<unknown>[] {
    return [...this.eventHistory];
  }

  /**
   * Clear event history log
   */
  public clearHistory(): void {
    this.eventHistory = [];
  }
}

export const eventBus = new EventBusService();
