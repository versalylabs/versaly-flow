/**
 * PulseBrand Agency OS - RBAC & Permissions Management View
 * Phase 05: Role-Based Access Control
 */

import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { Role, Permission } from '../../types';
import {
  ROLE_PERMISSIONS,
  ROLE_CAPABILITIES,
  ROLE_DESCRIPTIONS,
  hasPermission
} from '../../services/rbacService';
import {
  ShieldCheck,
  KeyRound,
  UserCheck,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  DollarSign,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

export const RbacManager: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    can,
    capabilities,
    addToast,
    logAuditEvent,
    clients
  } = useAgency();

  const [activeTab, setActiveTab] = useState<'matrix' | 'simulator' | 'gating'>('matrix');
  const [selectedRoleForDetail, setSelectedRoleForDetail] = useState<Role>(currentUser.role);

  // Grouped permissions for visual matrix inspection
  const permissionGroups: { groupName: string; permissions: { key: Permission; label: string }[] }[] = [
    {
      groupName: 'Workspaces & Regional Tenancy',
      permissions: [
        { key: 'workspace:manage', label: 'Manage Workspace & Hub Settings' },
        { key: 'workspace:view_billing', label: 'Access M-PESA & Retainer Financials' },
        { key: 'workspace:invite_members', label: 'Invite & Provision Team Members' },
        { key: 'workspace:switch', label: 'Switch Active Regional Hub' }
      ]
    },
    {
      groupName: 'Client Brand Management',
      permissions: [
        { key: 'client:create', label: 'Create New Client Accounts' },
        { key: 'client:edit', label: 'Edit Brand Guidelines & Retainers' },
        { key: 'client:delete', label: 'Archive / Offboard Client Brands' },
        { key: 'client:view_all', label: 'View All Agency Client Portfolios' }
      ]
    },
    {
      groupName: 'Content Editorial Pipeline',
      permissions: [
        { key: 'content:create', label: 'Draft New Social Content' },
        { key: 'content:edit_own', label: 'Edit Own Drafts & Captions' },
        { key: 'content:edit_all', label: 'Edit All Team Drafts' },
        { key: 'content:submit_review', label: 'Submit Draft for Internal Review' },
        { key: 'content:internal_approve', label: 'Account Manager Internal Approval' },
        { key: 'content:client_signoff', label: 'External Client Final Sign-off' },
        { key: 'content:schedule_publish', label: 'Direct Publish & Scheduling' },
        { key: 'content:delete', label: 'Delete / Retract Social Posts' }
      ]
    },
    {
      groupName: 'Financials, Auditing & Analytics',
      permissions: [
        { key: 'financials:view_retainers', label: 'View Monthly Retainer Incomes' },
        { key: 'financials:manage_invoicing', label: 'Manage Retainer Invoices' },
        { key: 'analytics:view_client', label: 'View Client Performance Telemetry' },
        { key: 'analytics:view_agency', label: 'View Agency Gross Profit & Retention' },
        { key: 'audit:view_trail', label: 'Access Immutable Audit Trail' }
      ]
    }
  ];

  const allRoles: Role[] = [
    'agency_owner',
    'account_manager',
    'content_creator',
    'client_approver',
    'super_admin',
    'freelance_contributor',
    'guest_viewer'
  ];

  const handleSimulateRole = (role: Role) => {
    switchUserRole(role);
    setSelectedRoleForDetail(role);
    logAuditEvent('auth', 'Simulated Role Context Changed', `Active role switched to ${role} via RBAC console`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>PulseBrand Architecture</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Role-Based Access Control</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">Granular Permission Matrix</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>RBAC & Governance Console</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Strict capability gating for Agency Owners, Account Directors, Creators, and Client Reviewers.
            Guarantees client stakeholders cannot view internal margins and creators cannot publish without approval.
          </p>
        </div>

        {/* Active Role Indicator */}
        <div className="flex items-center gap-2">
          <div className="bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-semibold text-white">Active Identity: {currentUser.name}</div>
              <div className="text-[10px] text-emerald-400/80 font-mono uppercase">
                {currentUser.role.replace('_', ' ')} · {capabilities.isClientRestrictedView ? 'Restricted Client Portal' : 'Agency Internal Staff'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'matrix'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Full Permissions Matrix</span>
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'simulator'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Interactive Role Simulator</span>
        </button>
        <button
          onClick={() => setActiveTab('gating')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'gating'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Live Capability Guardrails</span>
        </button>
      </div>

      {/* Tab 1: Permissions Matrix */}
      {activeTab === 'matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
            <div>
              <span className="font-semibold text-white">Cross-Role Capability Table</span>
              <span className="text-slate-500 ml-2">Audit of operational authority per persona</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400">21 Scoped Permissions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
                  <th className="p-3 font-semibold text-slate-300 min-w-[240px]">Permission</th>
                  <th className="p-3 text-center">Owner</th>
                  <th className="p-3 text-center">Account Dir</th>
                  <th className="p-3 text-center">Creator</th>
                  <th className="p-3 text-center text-purple-400">Client Approver</th>
                  <th className="p-3 text-center">Freelance</th>
                  <th className="p-3 text-center">Guest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {permissionGroups.map(group => (
                  <React.Fragment key={group.groupName}>
                    <tr className="bg-slate-950/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <td colSpan={7} className="px-3 py-2 text-emerald-400/90 font-mono bg-slate-900/50">
                        {group.groupName}
                      </td>
                    </tr>
                    {group.permissions.map(perm => (
                      <tr key={perm.key} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3">
                          <div className="font-medium text-slate-200">{perm.label}</div>
                          <div className="text-[10px] font-mono text-slate-500">{perm.key}</div>
                        </td>
                        <td className="p-3 text-center">
                          {hasPermission('agency_owner', perm.key) ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <span className="text-slate-700">·</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {hasPermission('account_manager', perm.key) ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <span className="text-slate-700">·</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {hasPermission('content_creator', perm.key) ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <span className="text-slate-700">·</span>
                          )}
                        </td>
                        <td className="p-3 text-center bg-purple-950/10">
                          {hasPermission('client_approver', perm.key) ? (
                            <CheckCircle2 className="w-4 h-4 text-purple-400 mx-auto" />
                          ) : (
                            <span className="text-slate-700">·</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {hasPermission('freelance_contributor', perm.key) ? (
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 mx-auto" />
                          ) : (
                            <span className="text-slate-700">·</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {hasPermission('guest_viewer', perm.key) ? (
                            <CheckCircle2 className="w-4 h-4 text-slate-400 mx-auto" />
                          ) : (
                            <span className="text-slate-700">·</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Role Simulator */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-white mb-1">
              Select Role Persona to Simulate Current App Context
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Clicking a persona dynamically switches the current active session identity, mutating the permission checks across navigation,
              client financial visibility, and editorial approval buttons.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allRoles.map(role => {
                const desc = ROLE_DESCRIPTIONS[role];
                const isCurrent = currentUser.role === role;
                const caps = ROLE_CAPABILITIES[role];

                return (
                  <div
                    key={role}
                    onClick={() => handleSimulateRole(role)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-slate-800/90 border-emerald-500 shadow-xl shadow-emerald-950/20'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${desc.badgeColor}`}>
                          {role}
                        </span>
                        {isCurrent && (
                          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-sm text-white">{desc.title}</div>
                      <div className="text-xs text-slate-400 mt-1 leading-snug">{desc.subtitle}</div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Can Publish Directly:</span>
                        <span className={`font-mono ${caps.canPublishDirectly ? 'text-emerald-400' : 'text-slate-600'}`}>
                          {caps.canPublishDirectly ? 'YES' : 'NO'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Client Approver Portal:</span>
                        <span className={`font-mono ${caps.canApproveAsClient ? 'text-purple-400' : 'text-slate-600'}`}>
                          {caps.canApproveAsClient ? 'YES' : 'NO'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Financial Margins:</span>
                        <span className={`font-mono ${caps.canViewFinancials ? 'text-emerald-400' : 'text-red-400'}`}>
                          {caps.canViewFinancials ? 'VISIBLE' : 'HIDDEN'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Live Capability Guardrails */}
      {activeTab === 'gating' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-white mb-1">
              Active Security Guardrails for: {currentUser.name} [{currentUser.role}]
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Verify how the frontend protects sensitive operations based on the active role's capabilities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Financial Guardrail */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Agency Retainer Financials Guardrail</span>
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    capabilities.canViewFinancials
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                      : 'bg-red-950/60 text-red-400 border-red-800/40'
                  }`}>
                    {capabilities.canViewFinancials ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Only Agency Owners and Account Managers can view monthly billing values and retainer margins.
                </p>

                {capabilities.canViewFinancials ? (
                  <div className="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded text-xs space-y-1">
                    <div className="text-slate-300 font-semibold">Active Client Retainers:</div>
                    <div className="font-mono text-emerald-400 text-sm font-bold">
                      KSh {clients.reduce((acc, c) => acc + c.retainerMonthlyValue, 0).toLocaleString()} / month
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-red-950/20 border border-red-800/30 rounded text-xs text-red-300 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Access Denied. Financial figures are masked for {currentUser.role} to protect agency margins.</span>
                  </div>
                )}
              </div>

              {/* Direct Publishing Guardrail */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Direct Social Publishing Guardrail</span>
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    capabilities.canPublishDirectly
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                      : 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                  }`}>
                    {capabilities.canPublishDirectly ? 'AUTHORITY GRANTED' : 'REVIEW REQUIRED'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Creators and freelance contributors can draft content but cannot trigger live social dispatch without sign-off.
                </p>

                {capabilities.canPublishDirectly ? (
                  <div className="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Direct publishing enabled. You have senior editorial dispatch permissions.</span>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded text-xs text-amber-300 flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Stage Gate Active. All drafts must be submitted to Kevin Otieno (Account Director) first.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
