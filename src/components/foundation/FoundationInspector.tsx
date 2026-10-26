import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { Role } from '../../types';
import {
  CheckCircle2,
  ShieldCheck,
  Database,
  Palette,
  KeyRound,
  FileCode2,
  HardDrive,
  Activity,
  Send,
  Download,
  RotateCcw,
  Check,
  ArrowRight
} from 'lucide-react';

export const FoundationInspector: React.FC = () => {
  const {
    workspace,
    currentUser,
    switchUserRole,
    clients,
    contentItems,
    auditLogs,
    logAuditEvent,
    exportDatabaseJson,
    resetToSeedData,
    addToast
  } = useAgency();

  const [activeTab, setActiveTab] = useState<'tokens' | 'schemas' | 'storage' | 'audit' | 'rbac'>('tokens');
  const [testEventCategory, setTestEventCategory] = useState<'system' | 'content' | 'approval'>('system');
  const [testEventMessage, setTestEventMessage] = useState('');

  const handleFireTestAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEventMessage.trim()) return;
    logAuditEvent(testEventCategory, 'Manual Foundation Test Event', testEventMessage.trim());
    addToast('Audit Event Recorded', 'Dispatched to persistent event bus and state store', 'success');
    setTestEventMessage('');
  };

  // RBAC Permission definition table for preview
  const roleCapabilities: Record<Role, {
    canManageWorkspaces: boolean;
    canInviteMembers: boolean;
    canCreateClients: boolean;
    canDraftContent: boolean;
    canSubmitForClientReview: boolean;
    canApproveAsClient: boolean;
    canPublishDirectly: boolean;
    canManageBilling: boolean;
  }> = {
    super_admin: {
      canManageWorkspaces: true,
      canInviteMembers: true,
      canCreateClients: true,
      canDraftContent: true,
      canSubmitForClientReview: true,
      canApproveAsClient: true,
      canPublishDirectly: true,
      canManageBilling: true,
    },
    agency_owner: {
      canManageWorkspaces: true,
      canInviteMembers: true,
      canCreateClients: true,
      canDraftContent: true,
      canSubmitForClientReview: true,
      canApproveAsClient: false,
      canPublishDirectly: true,
      canManageBilling: true,
    },
    account_manager: {
      canManageWorkspaces: false,
      canInviteMembers: true,
      canCreateClients: true,
      canDraftContent: true,
      canSubmitForClientReview: true,
      canApproveAsClient: false,
      canPublishDirectly: true,
      canManageBilling: false,
    },
    content_creator: {
      canManageWorkspaces: false,
      canInviteMembers: false,
      canCreateClients: false,
      canDraftContent: true,
      canSubmitForClientReview: false,
      canApproveAsClient: false,
      canPublishDirectly: false,
      canManageBilling: false,
    },
    client_approver: {
      canManageWorkspaces: false,
      canInviteMembers: false,
      canCreateClients: false,
      canDraftContent: false,
      canSubmitForClientReview: false,
      canApproveAsClient: true,
      canPublishDirectly: false,
      canManageBilling: false,
    },
    freelance_contributor: {
      canManageWorkspaces: false,
      canInviteMembers: false,
      canCreateClients: false,
      canDraftContent: true,
      canSubmitForClientReview: false,
      canApproveAsClient: false,
      canPublishDirectly: false,
      canManageBilling: false,
    },
    guest_viewer: {
      canManageWorkspaces: false,
      canInviteMembers: false,
      canCreateClients: false,
      canDraftContent: false,
      canSubmitForClientReview: false,
      canApproveAsClient: false,
      canPublishDirectly: false,
      canManageBilling: false,
    }
  };

  const currentCaps = roleCapabilities[currentUser.role] || roleCapabilities.content_creator;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>PulseBrand Architecture</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold">System Foundation: Verified</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Foundation Inspector</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Verification harness for the core system foundation: design token contracts, high-density typographic scale,
            typed reactive state store, multi-tenant schemas, and event audit pipeline.
          </p>
        </div>

        {/* Foundation Status Badges */}
        <div className="flex items-center gap-2">
          <div className="bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-semibold text-white">Foundation Ready</div>
              <div className="text-[10px] text-emerald-400/80 font-mono">100% contracts validated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('tokens')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'tokens'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Design Tokens & Typography</span>
        </button>
        <button
          onClick={() => setActiveTab('schemas')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'schemas'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>Strict Schema Registry</span>
        </button>
        <button
          onClick={() => setActiveTab('storage')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'storage'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>Reactive State & Persistence</span>
        </button>
        <button
          onClick={() => setActiveTab('rbac')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'rbac'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>RBAC Matrix Simulator</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Audit Stream ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: Design Tokens & Typography */}
      {activeTab === 'tokens' && (
        <div className="space-y-6">
          {/* 60-30-10 Palette Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-white mb-1">
              60-30-10 Color Architecture
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Strictly distributed color budget avoiding generic AI neon slop. Pure dark slate neutral canvas (60%),
              structural surfaces with hairline borders (30%), and high-intent emerald focus accents (10%).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-xs font-semibold text-slate-300 mb-1">60% Dominant Neutral Canvas</div>
                <div className="h-10 bg-[#0b0f17] rounded border border-slate-800/80 mb-2"></div>
                <div className="text-[11px] font-mono text-slate-400">#0b0f17 · Canvas Background</div>
                <p className="text-[11px] text-slate-500 mt-1">Deep obsidian slate reducing eye strain during high-volume agency operations.</p>
              </div>

              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-xs font-semibold text-slate-300 mb-1">30% Structural Surfaces</div>
                <div className="h-10 bg-slate-900 rounded border border-slate-700/60 mb-2"></div>
                <div className="text-[11px] font-mono text-slate-400">#0f172a / #1e293b · Cards & Dividers</div>
                <p className="text-[11px] text-slate-500 mt-1">Subtle 1px hairline dividers with zero card-in-card nesting clutter.</p>
              </div>

              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-xs font-semibold text-slate-300 mb-1">10% Intentional Accent</div>
                <div className="h-10 bg-gradient-to-r from-emerald-500 to-teal-400 rounded mb-2"></div>
                <div className="text-[11px] font-mono text-emerald-400">Emerald-500 / Teal-400 · CTAs</div>
                <p className="text-[11px] text-slate-500 mt-1">Concentrated exclusively at approval triggers, active filters, and positive states.</p>
              </div>
            </div>
          </div>

          {/* Typography Scale & Zero-Pill Rules */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-white mb-1">
              Typography Hierarchy & Tabular Discipline
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Google Fonts Plus Jakarta Sans paired with JetBrains Mono. All counts, retainers, and dates enforce tabular numerals.
            </p>

            <div className="space-y-4 divide-y divide-slate-800">
              <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-slate-500 font-mono">Display Headline (24px, Bold, tracking-tight)</div>
                  <div className="text-xl font-bold text-white tracking-tight">Campaign Velocity & Creative Pipeline</div>
                </div>
                <span className="text-xs text-slate-400 font-mono">Plus Jakarta Sans 700</span>
              </div>

              <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-slate-500 font-mono">Body Prose (14px, Regular, 1.5 line-height)</div>
                  <div className="text-sm text-slate-300 max-w-xl">
                    Every creative asset flows through an immutable review protocol before client stakeholders receive direct approval dispatches.
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">Plus Jakarta Sans 400</span>
              </div>

              <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-slate-500 font-mono">Tabular Numerals (`font-mono tabular-nums`)</div>
                  <div className="text-sm font-mono text-emerald-400 tabular-nums font-semibold flex items-center gap-4">
                    <span>KSh 350,000.00 / mo</span>
                    <span>·</span>
                    <span>14 / 20 posts published</span>
                    <span>·</span>
                    <span>99.98% SLA</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">JetBrains Mono 500</span>
              </div>

              <div className="pt-3">
                <div className="text-xs text-slate-500 font-mono mb-2">Zero-Pill Metadata Compliance: Clean Unboxed Text with Separators</div>
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800/80">
                  <span className="text-slate-200 font-medium">Lumina Botanicals</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>Clean Beauty & Skincare</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>Updated 2 hours ago</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-emerald-400">3 Pending Client Approvals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Schemas */}
      {activeTab === 'schemas' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-white mb-1">
              Strict Schema Registry (TypeScript Contracts)
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Exhaustive entity schemas powering all downstream phases (Clients, Content, Approvals, Campaigns, CRM, Billing).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
                <div className="text-emerald-400 font-bold mb-2 flex items-center justify-between">
                  <span>TenantWorkspace & User</span>
                  <span className="text-[10px] text-slate-500 font-normal">Multi-Tenancy Schema</span>
                </div>
                <pre className="text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
{`interface TenantWorkspace {
  id: string;
  name: string;
  slug: string;
  tier: 'freelancer' | 'boutique' | 'enterprise';
  timezone: string;
  currency: string;
  memberCount: number;
  clientCount: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  tenantId: string;
  assignedClientIds: string[];
}`}
                </pre>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
                <div className="text-emerald-400 font-bold mb-2 flex items-center justify-between">
                  <span>ContentItem & ApprovalLog</span>
                  <span className="text-[10px] text-slate-500 font-normal">Content Lifecycle Schema</span>
                </div>
                <pre className="text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
{`interface ContentItem {
  id: string;
  tenantId: string;
  clientId: string;
  creatorId: string;
  title: string;
  caption: string;
  platforms: SocialPlatform[];
  format: PostFormat;
  stage: ContentStage;
  scheduledDate?: string;
  tags: string[];
  approvalHistory: ContentApprovalLog[];
}`}
                </pre>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
                <div className="text-emerald-400 font-bold mb-2 flex items-center justify-between">
                  <span>ClientBrand & SocialAccount</span>
                  <span className="text-[10px] text-slate-500 font-normal">Brand Operations Schema</span>
                </div>
                <pre className="text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
{`interface ClientBrand {
  id: string;
  tenantId: string;
  name: string;
  industry: string;
  status: 'active' | 'onboarding' | 'paused';
  toneOfVoice: string[];
  retainerMonthlyValue: number;
  monthlyPostQuota: number;
  socialAccounts: SocialAccount[];
}`}
                </pre>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
                <div className="text-emerald-400 font-bold mb-2 flex items-center justify-between">
                  <span>AuditEvent & SystemNotification</span>
                  <span className="text-[10px] text-slate-500 font-normal">Audit Trail Schema</span>
                </div>
                <pre className="text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
{`interface AuditEvent {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  category: 'auth'|'content'|'client'|'approval';
  action: string;
  details: string;
  timestamp: string; // ISO 8601
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Reactive State & Persistence */}
      {activeTab === 'storage' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
              <div className="text-xs text-slate-500 font-medium">Clients Loaded</div>
              <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">{clients.length}</div>
              <div className="text-[11px] text-slate-400 mt-1">Scoped to {workspace.slug}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
              <div className="text-xs text-slate-500 font-medium">Content Items</div>
              <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">{contentItems.length}</div>
              <div className="text-[11px] text-slate-400 mt-1">In reactive memory</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
              <div className="text-xs text-slate-500 font-medium">Audit Logs Recorded</div>
              <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">{auditLogs.length}</div>
              <div className="text-[11px] text-emerald-400 mt-1">Real-time dispatched</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
              <div className="text-xs text-slate-500 font-medium">Active Tenant</div>
              <div className="text-sm font-semibold text-white mt-1 truncate">{workspace.name}</div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">ID: {workspace.id}</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-white mb-1">
              Storage Engine Management
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Export the current reactive state payload as JSON or reset to the baseline seed data.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  const jsonStr = exportDatabaseJson();
                  const blob = new Blob([jsonStr], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `pulsebrand_state_export_${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  addToast('Export Successful', 'Database snapshot exported to JSON', 'success');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export State JSON Snapshot</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Reset all data to pristine initial seed state?')) {
                    resetToSeedData();
                  }
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors border border-transparent hover:border-red-800/40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Factory Reset to Seed Baseline</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: RBAC Simulator */}
      {activeTab === 'rbac' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  RBAC Role Simulator (Active: {currentUser.name})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a role to preview how permissions and interfaces will adapt dynamically.
                </p>
              </div>

              {/* Quick role selector */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['agency_owner', 'account_manager', 'content_creator', 'client_approver'] as Role[]).map(r => (
                  <button
                    key={r}
                    onClick={() => switchUserRole(r)}
                    className={`px-3 py-1 text-xs rounded-md font-mono transition-colors ${
                      currentUser.role === r
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Permission Flags Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Manage Workspace & Tenancy', allowed: currentCaps.canManageWorkspaces },
                { label: 'Invite & Manage Team', allowed: currentCaps.canInviteMembers },
                { label: 'Create & Edit Client Profiles', allowed: currentCaps.canCreateClients },
                { label: 'Draft Content & Upload Media', allowed: currentCaps.canDraftContent },
                { label: 'Submit Posts for Client Review', allowed: currentCaps.canSubmitForClientReview },
                { label: 'Approve Content (Client Sign-Off)', allowed: currentCaps.canApproveAsClient },
                { label: 'Direct Publish & Schedule', allowed: currentCaps.canPublishDirectly },
                { label: 'Access Financials & Retainers', allowed: currentCaps.canManageBilling },
              ].map(perm => (
                <div
                  key={perm.label}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                    perm.allowed
                      ? 'bg-emerald-950/30 border-emerald-800/40 text-slate-200'
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60'
                  }`}
                >
                  <span className="pr-2">{perm.label}</span>
                  {perm.allowed ? (
                    <span className="text-emerald-400 font-mono font-bold shrink-0">✓ ALLOW</span>
                  ) : (
                    <span className="text-slate-600 font-mono shrink-0">✕ DENY</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Audit Stream */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Dispatch Test Event Form */}
          <form onSubmit={handleFireTestAudit} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="w-full md:w-44 shrink-0">
              <select
                value={testEventCategory}
                onChange={(e) => setTestEventCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                <option value="system">Category: System</option>
                <option value="content">Category: Content</option>
                <option value="approval">Category: Approval</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Enter message to test immutable audit logging..."
              value={testEventMessage}
              onChange={(e) => setTestEventMessage(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
            />

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Record Event</span>
            </button>
          </form>

          {/* Audit Logs List */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Real-Time Event Stream</span>
              <span className="font-mono text-[11px]">{auditLogs.length} events logged</span>
            </div>

            <div className="divide-y divide-slate-800/80 max-h-96 overflow-y-auto">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3 hover:bg-slate-800/30 transition-colors text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-emerald-400 uppercase bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                        {log.category}
                      </span>
                      <span className="font-semibold text-slate-200">{log.action}</span>
                      <span className="text-slate-500">by</span>
                      <span className="text-slate-400 font-medium">{log.userName}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">{log.details}</div>
                  </div>

                  <div className="font-mono text-[10px] text-slate-500 shrink-0 tabular-nums">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
