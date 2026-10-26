/**
 * PulseBrand Agency OS - RBAC Permission Matrix & Guard Service
 * Phase 05: Role-Based Access Control
 */

import { Role, Permission, RoleCapabilities } from '../types';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    'workspace:manage',
    'workspace:view_billing',
    'workspace:invite_members',
    'workspace:switch',
    'client:create',
    'client:edit',
    'client:delete',
    'client:view_all',
    'content:create',
    'content:edit_own',
    'content:edit_all',
    'content:submit_review',
    'content:internal_approve',
    'content:client_signoff',
    'content:schedule_publish',
    'content:delete',
    'financials:view_retainers',
    'financials:manage_invoicing',
    'analytics:view_client',
    'analytics:view_agency',
    'audit:view_trail'
  ],
  agency_owner: [
    'workspace:manage',
    'workspace:view_billing',
    'workspace:invite_members',
    'workspace:switch',
    'client:create',
    'client:edit',
    'client:delete',
    'client:view_all',
    'content:create',
    'content:edit_own',
    'content:edit_all',
    'content:submit_review',
    'content:internal_approve',
    'content:schedule_publish',
    'content:delete',
    'financials:view_retainers',
    'financials:manage_invoicing',
    'analytics:view_client',
    'analytics:view_agency',
    'audit:view_trail'
  ],
  account_manager: [
    'workspace:switch',
    'workspace:invite_members',
    'client:create',
    'client:edit',
    'client:view_all',
    'content:create',
    'content:edit_own',
    'content:edit_all',
    'content:submit_review',
    'content:internal_approve',
    'content:schedule_publish',
    'financials:view_retainers',
    'analytics:view_client',
    'analytics:view_agency',
    'audit:view_trail'
  ],
  content_creator: [
    'content:create',
    'content:edit_own',
    'content:submit_review',
    'analytics:view_client'
  ],
  client_approver: [
    'content:client_signoff',
    'analytics:view_client'
  ],
  freelance_contributor: [
    'content:create',
    'content:edit_own',
    'content:submit_review'
  ],
  guest_viewer: [
    'analytics:view_client'
  ]
};

export const ROLE_CAPABILITIES: Record<Role, RoleCapabilities> = {
  super_admin: {
    canManageWorkspaces: true,
    canManageBilling: true,
    canInviteMembers: true,
    canCreateClients: true,
    canEditClientProfiles: true,
    canDraftContent: true,
    canSubmitInternalReview: true,
    canSubmitForClientReview: true,
    canApproveAsClient: true,
    canPublishDirectly: true,
    canViewFinancials: true,
    canAccessAuditLogs: true,
    isClientRestrictedView: false
  },
  agency_owner: {
    canManageWorkspaces: true,
    canManageBilling: true,
    canInviteMembers: true,
    canCreateClients: true,
    canEditClientProfiles: true,
    canDraftContent: true,
    canSubmitInternalReview: true,
    canSubmitForClientReview: true,
    canApproveAsClient: false, // Owner cannot approve on behalf of client without delegation
    canPublishDirectly: true,
    canViewFinancials: true,
    canAccessAuditLogs: true,
    isClientRestrictedView: false
  },
  account_manager: {
    canManageWorkspaces: false,
    canManageBilling: false,
    canInviteMembers: true,
    canCreateClients: true,
    canEditClientProfiles: true,
    canDraftContent: true,
    canSubmitInternalReview: true,
    canSubmitForClientReview: true,
    canApproveAsClient: false,
    canPublishDirectly: true,
    canViewFinancials: true,
    canAccessAuditLogs: true,
    isClientRestrictedView: false
  },
  content_creator: {
    canManageWorkspaces: false,
    canManageBilling: false,
    canInviteMembers: false,
    canCreateClients: false,
    canEditClientProfiles: false,
    canDraftContent: true,
    canSubmitInternalReview: true,
    canSubmitForClientReview: false,
    canApproveAsClient: false,
    canPublishDirectly: false,
    canViewFinancials: false,
    canAccessAuditLogs: false,
    isClientRestrictedView: false
  },
  client_approver: {
    canManageWorkspaces: false,
    canManageBilling: false,
    canInviteMembers: false,
    canCreateClients: false,
    canEditClientProfiles: false,
    canDraftContent: false,
    canSubmitInternalReview: false,
    canSubmitForClientReview: false,
    canApproveAsClient: true,
    canPublishDirectly: false,
    canViewFinancials: false, // Hidden agency internal margins
    canAccessAuditLogs: false,
    isClientRestrictedView: true
  },
  freelance_contributor: {
    canManageWorkspaces: false,
    canManageBilling: false,
    canInviteMembers: false,
    canCreateClients: false,
    canEditClientProfiles: false,
    canDraftContent: true,
    canSubmitInternalReview: true,
    canSubmitForClientReview: false,
    canApproveAsClient: false,
    canPublishDirectly: false,
    canViewFinancials: false,
    canAccessAuditLogs: false,
    isClientRestrictedView: false
  },
  guest_viewer: {
    canManageWorkspaces: false,
    canManageBilling: false,
    canInviteMembers: false,
    canCreateClients: false,
    canEditClientProfiles: false,
    canDraftContent: false,
    canSubmitInternalReview: false,
    canSubmitForClientReview: false,
    canApproveAsClient: false,
    canPublishDirectly: false,
    canViewFinancials: false,
    canAccessAuditLogs: false,
    isClientRestrictedView: true
  }
};

/**
 * Checks whether a given role holds a specific granular permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(permission);
}

/**
 * Returns role capability flags for UI gating
 */
export function getRoleCapabilities(role: Role): RoleCapabilities {
  return ROLE_CAPABILITIES[role] || ROLE_CAPABILITIES.content_creator;
}

export const ROLE_DESCRIPTIONS: Record<Role, { title: string; subtitle: string; badgeColor: string }> = {
  super_admin: {
    title: 'Super Admin',
    subtitle: 'Global platform authority across all regional agency clusters',
    badgeColor: 'border-red-500/40 text-red-400 bg-red-950/40'
  },
  agency_owner: {
    title: 'Agency Owner (MD / Founder)',
    subtitle: 'Full agency workspace authority, financials, and publishing rights',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40'
  },
  account_manager: {
    title: 'Account Director / Manager',
    subtitle: 'Client relations, editorial pipeline oversight, and review dispatch',
    badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-950/40'
  },
  content_creator: {
    title: 'Content Creator / Copywriter',
    subtitle: 'Drafts social copy, visual carousels, and submits for internal review',
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-950/40'
  },
  client_approver: {
    title: 'Client Brand Approver',
    subtitle: 'External stakeholder with restricted read & one-click sign-off access',
    badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-950/40'
  },
  freelance_contributor: {
    title: 'Freelance Contributor',
    subtitle: 'Scoped contractor drafting designated campaign assets',
    badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40'
  },
  guest_viewer: {
    title: 'Guest / Auditor',
    subtitle: 'Strict read-only access with zero edit or approval rights',
    badgeColor: 'border-slate-600 text-slate-400 bg-slate-900'
  }
};
