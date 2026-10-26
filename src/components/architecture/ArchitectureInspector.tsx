/**
 * PulseBrand Agency OS - Architecture Inspector
 * Phase 02: Project Architecture
 */

import React, { useState, useEffect } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { eventBus, AppEventName, AppEventPayload } from '../../services/eventBus';
import { clientRepository } from '../../repositories/clientRepository';
import { contentRepository } from '../../repositories/contentRepository';
import { taskRepository } from '../../repositories/taskRepository';
import { auditRepository } from '../../repositories/auditRepository';
import {
  Layers,
  Cpu,
  Radio,
  Database,
  Terminal,
  Send,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Workflow,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Check
} from 'lucide-react';

export const ArchitectureInspector: React.FC = () => {
  const { workspace, currentUser, addToast } = useAgency();
  const [activeSubTab, setActiveSubTab] = useState<'layers' | 'eventbus' | 'repositories' | 'errorboundary'>('layers');
  const [eventHistory, setEventHistory] = useState<AppEventPayload<unknown>[]>([]);
  const [selectedEventToFire, setSelectedEventToFire] = useState<AppEventName>('content:stage_advanced');
  const [customEventData, setCustomEventData] = useState('{"contentId": "post_01", "newStage": "approved"}');
  const [triggerCrash, setTriggerCrash] = useState(false);

  // Poll / Subscribe to event bus updates
  useEffect(() => {
    setEventHistory(eventBus.getHistory());

    const unsubStage = eventBus.subscribe('content:stage_advanced', () => {
      setEventHistory(eventBus.getHistory());
    });
    const unsubClient = eventBus.subscribe('client:status_changed', () => {
      setEventHistory(eventBus.getHistory());
    });
    const unsubTask = eventBus.subscribe('task:status_updated', () => {
      setEventHistory(eventBus.getHistory());
    });
    const unsubAudit = eventBus.subscribe('audit:logged', () => {
      setEventHistory(eventBus.getHistory());
    });

    return () => {
      unsubStage();
      unsubClient();
      unsubTask();
      unsubAudit();
    };
  }, []);

  const handleFireEvent = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(customEventData);
      eventBus.emit(selectedEventToFire, parsed, {
        actorId: currentUser.id,
        actorName: currentUser.name
      });
      setEventHistory(eventBus.getHistory());
      addToast('Event Dispatched', `Broadcasted "${selectedEventToFire}" via EventBus`, 'success');
    } catch {
      addToast('Invalid JSON Payload', 'Please enter valid JSON in the data payload box', 'error');
    }
  };

  const handleAdvancePostDirectly = () => {
    const updated = contentRepository.advanceStage(
      'post_01',
      'approved',
      {
        id: `appr_${Date.now()}`,
        contentId: 'post_01',
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'approved',
        notes: 'Approved via ContentRepository mutation pipeline',
        timestamp: new Date().toISOString()
      },
      { actorId: currentUser.id, actorName: currentUser.name }
    );

    if (updated) {
      auditRepository.record(
        workspace.id,
        currentUser.id,
        currentUser.name,
        'content',
        'Stage Advanced via Repository',
        `Post ${updated.id} moved to approved state`
      );
      setEventHistory(eventBus.getHistory());
      addToast('Repository Mutation', 'Content stage updated via ContentRepository & broadcast to EventBus', 'success');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>PulseBrand Architecture</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Project Architecture</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>System Architecture & Service Layer</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Multi-tier decoupled software architecture: Typed Event Bus for reactive cross-module sync,
            domain-specific Repository Pattern abstractions, and isolated React Error Boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-semibold text-white">Architecture Implemented</div>
              <div className="text-[10px] text-emerald-400/80 font-mono">EventBus & Repositories Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('layers')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'layers'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>Layered Service Abstraction</span>
        </button>
        <button
          onClick={() => setActiveSubTab('eventbus')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'eventbus'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Live Event Bus ({eventHistory.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('repositories')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'repositories'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Repository Pattern Explorer</span>
        </button>
        <button
          onClick={() => setActiveSubTab('errorboundary')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'errorboundary'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Error Boundary & Fault Tolerance</span>
        </button>
      </div>

      {/* Sub-tab 1: Layered Service Abstraction */}
      {activeSubTab === 'layers' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-white mb-1">
              Decoupled 4-Tier Enterprise Architecture
            </h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Components never perform direct raw local storage reads or tightly coupled writes. State mutates predictably
              through typed domain repositories that broadcast actions across the asynchronous event bus.
            </p>

            <div className="space-y-3">
              {/* Layer 1 */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-xs">
                    L1
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">Presentation Layer (UI Components & Views)</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      RoadmapViewer, FoundationInspector, TopNav, Sidebar, Modals, Calendars, Approvals UI
                    </div>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-slate-500 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                  React 19 + Tailwind v4 + Motion
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-center -my-1 text-slate-600 font-mono text-xs">↓</div>

              {/* Layer 2 */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center font-mono font-bold text-xs">
                    L2
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">Context & Reactive State Management</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      AgencyContext provides workspace tenancy, active client scoping, role simulation, and toast notifications.
                    </div>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-slate-500 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                  useAgency() hook
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-center -my-1 text-slate-600 font-mono text-xs">↓</div>

              {/* Layer 3 */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center font-mono font-bold text-xs">
                    L3
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">Domain Repositories (Repository Pattern)</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      ClientRepository, ContentRepository, CampaignRepository, TaskRepository, AuditRepository
                    </div>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-slate-500 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                  Type-safe Data Access Layer
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-center -my-1 text-slate-600 font-mono text-xs">↓</div>

              {/* Layer 4 */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-xs">
                    L4
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">Infrastructure & Event Bus Subsystem</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      EventBus (Pub/Sub for loose coupling) + StorageService (namespaced persistence engine)
                    </div>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-slate-500 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                  localStorage / Cloud API Ready
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Live Event Bus */}
      {activeSubTab === 'eventbus' && (
        <div className="space-y-4">
          {/* Dispatcher Form */}
          <form onSubmit={handleFireEvent} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Dispatch Synthetic Application Event</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  eventBus.clearHistory();
                  setEventHistory([]);
                  addToast('Event Log Cleared', 'In-memory telemetry buffer reset', 'info');
                }}
                className="text-[11px] text-slate-400 hover:text-slate-200 font-mono"
              >
                Clear History
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Event Name
                </label>
                <select
                  value={selectedEventToFire}
                  onChange={(e) => setSelectedEventToFire(e.target.value as AppEventName)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="content:stage_advanced">content:stage_advanced</option>
                  <option value="content:approved">content:approved</option>
                  <option value="client:status_changed">client:status_changed</option>
                  <option value="client:updated">client:updated</option>
                  <option value="task:status_updated">task:status_updated</option>
                  <option value="audit:logged">audit:logged</option>
                  <option value="auth:identity_switched">auth:identity_switched</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  JSON Data Payload
                </label>
                <input
                  type="text"
                  value={customEventData}
                  onChange={(e) => setCustomEventData(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Emit Across EventBus</span>
              </button>
            </div>
          </form>

          {/* Event Stream */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Real-Time Event Telemetry Buffer</span>
              <span className="font-mono text-[11px]">{eventHistory.length} events emitted</span>
            </div>

            <div className="divide-y divide-slate-800/80 max-h-96 overflow-y-auto">
              {eventHistory.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-mono">
                  No events recorded yet. Emit a synthetic event above or trigger a repository mutation.
                </div>
              ) : (
                eventHistory.map(evt => (
                  <div key={evt.eventId} className="p-3 hover:bg-slate-800/30 transition-colors text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                          {evt.eventName}
                        </span>
                        {evt.actorName && (
                          <span className="text-slate-400 text-[11px]">
                            actor: <span className="text-slate-200 font-medium">{evt.actorName}</span>
                          </span>
                        )}
                      </div>
                      <div className="bg-slate-950 p-2 rounded border border-slate-800/80 font-mono text-[11px] text-slate-300 overflow-x-auto max-w-2xl">
                        {JSON.stringify(evt.data)}
                      </div>
                    </div>

                    <div className="font-mono text-[10px] text-slate-500 shrink-0 tabular-nums">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Repository Pattern Explorer */}
      {activeSubTab === 'repositories' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Domain Repository Live State
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Decoupled data access objects encapsulating query and mutation operations.
                </p>
              </div>

              <button
                onClick={handleAdvancePostDirectly}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test: Advance Post 01 to Approved</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ClientRepository summary */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs text-emerald-400">clientRepository</span>
                  <span className="text-[10px] font-mono text-slate-500">{clientRepository.getAll().length} records</span>
                </div>
                <div className="space-y-1.5">
                  {clientRepository.getAll().slice(0, 3).map(c => (
                    <div key={c.id} className="p-2 bg-slate-900/60 rounded border border-slate-800/80 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-200">{c.name}</div>
                        <div className="text-[11px] text-slate-500">{c.industry}</div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/30">
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ContentRepository summary */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs text-emerald-400">contentRepository</span>
                  <span className="text-[10px] font-mono text-slate-500">{contentRepository.getAll().length} records</span>
                </div>
                <div className="space-y-1.5">
                  {contentRepository.getAll().map(post => (
                    <div key={post.id} className="p-2 bg-slate-900/60 rounded border border-slate-800/80 text-xs flex items-center justify-between">
                      <div className="truncate mr-2">
                        <div className="font-semibold text-slate-200 truncate">{post.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono">Stage: {post.stage}</div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
                        {post.format}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Error Boundary */}
      {activeSubTab === 'errorboundary' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-white mb-1">
              Fault Tolerance & Error Isolation Verification
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Demonstrates that uncaught errors inside isolated module trees are intercepted cleanly by the defensive ErrorBoundary,
              preventing white-screen crashes and presenting instant diagnostics and recovery triggers.
            </p>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Simulate Subtree Exception</div>
                  <div className="text-[11px] text-slate-400">
                    Throw a deliberate error inside this isolated boundary to inspect the fallback UI.
                  </div>
                </div>

                <button
                  onClick={() => setTriggerCrash(!triggerCrash)}
                  className="px-3.5 py-1.5 bg-red-900/80 hover:bg-red-800 text-red-200 font-medium text-xs rounded-lg transition-colors border border-red-700/60"
                >
                  {triggerCrash ? 'Recover Subtree' : 'Trigger Subtree Exception'}
                </button>
              </div>

              {triggerCrash ? (
                <CrashComponent />
              ) : (
                <div className="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Subtree nominal. Click the button above to test error interception.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Test helper that deliberately throws when rendered
const CrashComponent: React.FC = () => {
  throw new Error('Architecture Verification: Simulated unexpected runtime component crash intercepted by ErrorBoundary.');
};
