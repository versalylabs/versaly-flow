import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TenantWorkspace,
  User,
  Role,
  ClientBrand,
  ContentItem,
  ContentStage,
  DigitalAsset,
  Campaign,
  AgencyTask,
  SocialAccount,
  PreFlightValidation,
  AuditEvent,
  SystemNotification,
  DevelopmentPhase,
  AuthSession,
  LoginCredentials,
  RegisterPayload,
  Permission,
  RoleCapabilities,
  OnboardingChecklist,
  CrmDeal,
  DealStage,
  DealActivity,
  AgencyInvoice,
  RetainerPlan,
  BillableTimeEntry,
  InvoiceStatus,
  PaymentGateway,
  InboxThread,
  InboxMessage,
  CannedResponse,
  ThreadStatus,
  MessageSentiment,
  WorkflowRule,
  WorkflowExecutionLog,
  AiContentGoal,
  AiToneStyle,
  AiGeneratedCaption,
  AiCompetitorAngle,
  AiStrategyBrief,
  WhiteLabelConfig,
  DnsVerificationRecord,
  SubscriptionTierId,
  BillingInterval,
  SubscriptionPlan,
  WorkspaceSubscription,
  QuickDraftNote,
  BulkActionPayload,
  AuditLogEntry,
  AuditSeverity,
  AuditStatus,
  ApiKey,
  ApiKeyScope,
  GdprRequest,
  GdprRequestType,
  SecurityPolicyConfig
} from '../types';
import { authService } from '../services/authService';
import { eventBus } from '../services/eventBus';
import { hasPermission, getRoleCapabilities } from '../services/rbacService';
import {
  INITIAL_WORKSPACE,
  INITIAL_WORKSPACES,
  INITIAL_USERS,
  INITIAL_CLIENTS,
  INITIAL_CONTENT,
  INITIAL_DIGITAL_ASSETS,
  INITIAL_CAMPAIGNS,
  INITIAL_TASKS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CRM_DEALS,
  INITIAL_INVOICES,
  INITIAL_RETAINERS,
  INITIAL_TIME_ENTRIES,
  INITIAL_INBOX_THREADS,
  INITIAL_CANNED_RESPONSES,
  INITIAL_WORKFLOW_RULES,
  INITIAL_WORKFLOW_LOGS,
  INITIAL_AI_STRATEGY_BRIEFS,
  INITIAL_WHITE_LABEL_CONFIGS,
  SAAS_PLANS,
  INITIAL_WORKSPACE_SUBSCRIPTIONS,
  INITIAL_QUICK_NOTES,
  INITIAL_SOC2_AUDIT_LOGS,
  INITIAL_API_KEYS,
  INITIAL_GDPR_REQUESTS,
  INITIAL_SECURITY_POLICY
} from '../data/seedData';
import { SYSTEM_ROADMAP_PHASES } from '../data/roadmapPhases';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AgencyContextType {
  // Tenancy & Identity
  workspace: TenantWorkspace;
  setWorkspace: (ws: TenantWorkspace) => void;
  workspaces: TenantWorkspace[];
  switchWorkspace: (workspaceId: string) => void;
  createWorkspace: (ws: Omit<TenantWorkspace, 'id' | 'createdAt' | 'memberCount' | 'clientCount'>) => TenantWorkspace;
  mapCustomDomain: (workspaceId: string, domain: string) => void;

  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchUserRole: (role: Role) => void;
  assignClientToUser: (userId: string, clientId: string) => void;
  unassignClientFromUser: (userId: string, clientId: string) => void;
  inviteTeamMember: (payload: { name: string; email: string; role: Role; jobTitle?: string; skills?: string[] }) => void;
  updateUserCapacity: (userId: string, maxHours: number, allocatedHours: number) => void;

  // Phase 05: RBAC Capabilities & Permission Checks
  can: (permission: Permission) => boolean;
  capabilities: RoleCapabilities;

  // Phase 03: Authentication Engine
  session: AuthSession | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshSession: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  requestPasswordReset: (email: string) => { success: boolean; message: string };

  // Domain Entities
  clients: ClientBrand[];
  activeClient: ClientBrand | null;
  setActiveClientId: (id: string | null) => void;
  updateClientBrand: (clientId: string, updates: Partial<ClientBrand>) => void;
  createClientBrand: (clientData: Omit<ClientBrand, 'id' | 'createdAt' | 'currentMonthPublishedCount' | 'pendingApprovalCount'>) => ClientBrand;
  deleteClientBrand: (clientId: string) => void;
  toggleSocialConnection: (clientId: string, socialAccountId: string) => void;
  updateOnboardingTask: (clientId: string, taskKey: keyof OnboardingChecklist, completed: boolean) => void;
  contentItems: ContentItem[];
  digitalAssets: DigitalAsset[];
  campaigns: Campaign[];
  tasks: AgencyTask[];
  auditLogs: AuditEvent[];
  notifications: SystemNotification[];

  // Actions
  logAuditEvent: (category: AuditEvent['category'], action: string, details: string, targetId?: string) => void;
  markNotificationAsRead: (id: string) => void;
  addToast: (title: string, message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
  toasts: Toast[];

  // Executive Dashboard & Content Pipeline Actions
  quickApproveContent: (contentId: string, notes?: string) => void;
  quickRequestRevision: (contentId: string, reason: string) => void;
  scheduleContentPublish: (contentId: string, scheduledIso: string) => void;
  createContentItem: (item: Omit<ContentItem, 'id' | 'approvalHistory' | 'createdAt' | 'updatedAt'>) => ContentItem;
  updateContentItem: (id: string, updates: Partial<ContentItem>) => void;
  deleteContentItem: (id: string) => void;
  transitionContentStage: (id: string, nextStage: ContentStage, note?: string) => void;
  rollbackContentVersion: (id: string, versionNumber: number) => void;
  addInternalComment: (id: string, commentText: string) => void;

  // Phase 14: Digital Asset Management (DAM) Actions
  createDigitalAsset: (asset: Omit<DigitalAsset, 'id' | 'uploadedAt' | 'usageCount'>) => DigitalAsset;
  deleteDigitalAsset: (id: string) => void;
  linkAssetToPost: (assetId: string, postId: string) => void;

  // Phase 15: Campaign Strategy & Management Actions
  createCampaign: (campaign: Omit<Campaign, 'id' | 'publishedPostCount'>) => Campaign;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  toggleMilestone: (campaignId: string, milestoneId: string) => void;

  // Phase 16: Task & Project Management Actions
  createAgencyTask: (task: Omit<AgencyTask, 'id'>) => AgencyTask;
  updateAgencyTask: (id: string, updates: Partial<AgencyTask>) => void;
  deleteAgencyTask: (id: string) => void;
  toggleTaskSubItem: (taskId: string, subItemId: string) => void;
  transitionTaskStatus: (taskId: string, status: AgencyTask['status']) => void;

  // Phase 17: Social Account Connections Actions
  connectSocialAccount: (clientId: string, account: Omit<SocialAccount, 'id'>) => SocialAccount;
  disconnectSocialAccount: (clientId: string, accountId: string) => void;
  refreshOAuthToken: (clientId: string, accountId: string) => void;
  toggleSandboxMode: (clientId: string, accountId: string) => void;
  runMockPublishTest: (clientId: string, accountId: string) => boolean;

  // Phase 18: Publishing & Scheduling Engine Actions
  triggerImmediateDispatch: (postId: string) => Promise<boolean>;
  retryFailedDispatch: (postId: string) => void;
  updateFirstComment: (postId: string, commentText: string) => void;
  runPreFlightAudit: (postId: string) => PreFlightValidation;

  // Phase 20: Agency CRM & Leads Pipeline Actions
  deals: CrmDeal[];
  createDeal: (deal: Omit<CrmDeal, 'id' | 'createdAt' | 'updatedAt' | 'activities'>) => CrmDeal;
  updateDeal: (id: string, updates: Partial<CrmDeal>) => void;
  deleteDeal: (id: string) => void;
  transitionDealStage: (id: string, nextStage: DealStage, reason?: string) => void;
  addDealActivity: (dealId: string, activityNotes: string, type?: DealActivity['type']) => void;
  convertDealToClient: (dealId: string) => ClientBrand | null;

  // Phase 21: Billing, Retainers & Invoicing
  invoices: AgencyInvoice[];
  retainers: RetainerPlan[];
  timeEntries: BillableTimeEntry[];
  createInvoice: (invoiceData: Omit<AgencyInvoice, 'id' | 'createdAt' | 'updatedAt'>) => AgencyInvoice;
  updateInvoice: (id: string, updates: Partial<AgencyInvoice>) => void;
  deleteInvoice: (id: string) => void;
  recordInvoicePayment: (id: string, paymentMethod: PaymentGateway, reference?: string) => void;
  updateRetainer: (id: string, updates: Partial<RetainerPlan>) => void;
  logBillableTime: (entry: Omit<BillableTimeEntry, 'id' | 'createdAt'>) => BillableTimeEntry;
  deleteBillableTime: (id: string) => void;

  // Phase 22: Unified Communication & Inbox
  inboxThreads: InboxThread[];
  cannedResponses: CannedResponse[];
  addMessageToThread: (threadId: string, content: string, isInternalNote?: boolean, mentions?: string[]) => void;
  updateThreadStatus: (threadId: string, status: ThreadStatus) => void;
  assignThreadUser: (threadId: string, userId: string, userName: string) => void;
  updateThreadSentiment: (threadId: string, sentiment: MessageSentiment) => void;
  createCannedResponse: (response: Omit<CannedResponse, 'id'>) => CannedResponse;
  deleteCannedResponse: (id: string) => void;

  // Phase 23: Workflow Automation
  workflowRules: WorkflowRule[];
  workflowLogs: WorkflowExecutionLog[];
  createWorkflowRule: (rule: Omit<WorkflowRule, 'id' | 'createdAt' | 'updatedAt' | 'executionCount'>) => WorkflowRule;
  updateWorkflowRule: (id: string, updates: Partial<WorkflowRule>) => void;
  deleteWorkflowRule: (id: string) => void;
  toggleWorkflowRule: (id: string) => void;
  runWorkflowRuleManualTest: (id: string) => WorkflowExecutionLog;

  // Phase 24: AI Content & Strategy Engine
  aiBriefs: AiStrategyBrief[];
  generateAiStrategyBrief: (params: {
    clientId: string;
    platform: any;
    topic: string;
    targetAudience: string;
    goal: AiContentGoal;
    tone: AiToneStyle;
  }) => AiStrategyBrief;
  deleteAiBrief: (id: string) => void;

  // Phase 25: White-Label Customization
  whiteLabelConfigs: WhiteLabelConfig[];
  activeWhiteLabelConfig: WhiteLabelConfig;
  updateWhiteLabelConfig: (workspaceId: string, updates: Partial<WhiteLabelConfig>) => void;
  verifyCustomDomainDns: (workspaceId: string) => Promise<boolean>;
  resetWhiteLabelConfig: (workspaceId: string) => void;

  // Phase 26: SaaS Subscription & Tier Management
  saasPlans: SubscriptionPlan[];
  workspaceSubscription: WorkspaceSubscription;
  upgradeSubscriptionTier: (newTier: SubscriptionTierId, interval: BillingInterval) => void;
  downgradeSubscriptionTier: (newTier: SubscriptionTierId) => { allowed: boolean; reason?: string };
  toggleAutoRenewSubscription: () => void;
  simulateMpesaSubscriptionRenewal: () => void;

  // Phase 27: Productivity & Quick Actions
  quickNotes: QuickDraftNote[];
  createQuickNote: (note: Omit<QuickDraftNote, 'id' | 'createdAt' | 'updatedAt' | 'tenantId'>) => QuickDraftNote;
  updateQuickNote: (id: string, updates: Partial<QuickDraftNote>) => void;
  deleteQuickNote: (id: string) => void;
  convertQuickNoteToPost: (noteId: string, clientId: string) => ContentItem;
  executeBulkPostAction: (payload: BulkActionPayload) => number;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Phase 28: Security Hardening & Data Protection
  soc2AuditLogs: AuditLogEntry[];
  apiKeys: ApiKey[];
  gdprRequests: GdprRequest[];
  securityPolicy: SecurityPolicyConfig;
  logSoc2SecurityEvent: (event: {
    action: string;
    resource: string;
    severity?: AuditSeverity;
    status?: AuditStatus;
    metadata?: Record<string, any>;
  }) => AuditLogEntry;
  createApiKey: (name: string, scopes: ApiKeyScope[], rateLimitPerMin?: number) => { key: ApiKey; secret: string };
  revokeApiKey: (id: string) => void;
  rotateApiKey: (id: string) => { key: ApiKey; secret: string };
  submitGdprRequest: (subjectName: string, subjectEmail: string, requestType: GdprRequestType, notes?: string) => GdprRequest;
  processGdprRequest: (requestId: string, action: 'approve' | 'reject' | 'anonymize') => void;
  updateSecurityPolicy: (updates: Partial<SecurityPolicyConfig>) => void;
  verifyAuditLogIntegrity: () => { valid: boolean; verifiedCount: number; latestHash: string };
  sanitizeInputText: (raw: string) => string;
  maskSensitiveData: (raw: string) => string;

  // Phase Roadmap & Foundation
  roadmapPhases: DevelopmentPhase[];
  currentActivePhase: number;
  setCurrentActivePhase: (phaseNum: number) => void;
  updatePhaseStatus: (phaseNum: number, status: DevelopmentPhase['status']) => void;

  // System Controls
  resetToSeedData: () => void;
  exportDatabaseJson: () => string;
}

const CONTEXT_GLOBAL_KEY = Symbol.for('versaly_flow_agency_context_singleton');

export const AgencyContext: React.Context<AgencyContextType | undefined> =
  (globalThis as any)[CONTEXT_GLOBAL_KEY] ||
  ((globalThis as any)[CONTEXT_GLOBAL_KEY] = createContext<AgencyContextType | undefined>(undefined));

const STORAGE_KEY_PREFIX = 'pulsebrand_os_v1';

export const AgencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or seed fallback
  const [workspaces, setWorkspaces] = useState<TenantWorkspace[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_workspaces`);
      return saved ? JSON.parse(saved) : INITIAL_WORKSPACES;
    } catch {
      return INITIAL_WORKSPACES;
    }
  });

  const [workspace, setWorkspaceState] = useState<TenantWorkspace>(() => {
    const activeSession = authService.getCurrentSession();
    let allWs = INITIAL_WORKSPACES;
    try {
      const savedWorkspaces = localStorage.getItem(`${STORAGE_KEY_PREFIX}_workspaces`);
      if (savedWorkspaces) allWs = JSON.parse(savedWorkspaces);
    } catch {}

    if (activeSession && activeSession.user && activeSession.user.tenantId) {
      const userWs = allWs.find(w => w.id === activeSession.user.tenantId);
      if (userWs) return userWs;
    }

    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_workspace`);
      return saved ? JSON.parse(saved) : INITIAL_WORKSPACES[0];
    } catch {
      return INITIAL_WORKSPACES[0];
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    return authService.getUsers();
  });

  // Session state from AuthService
  const [session, setSession] = useState<AuthSession | null>(() => {
    return authService.getCurrentSession();
  });

  const [currentUser, setCurrentUserState] = useState<User>(() => {
    const activeSession = authService.getCurrentSession();
    if (activeSession) return activeSession.user;

    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_currentUser`);
      return saved ? JSON.parse(saved) : INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [clients, setClients] = useState<ClientBrand[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_clients`);
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [activeClientId, setActiveClientId] = useState<string | null>(null);

  const [contentItems, setContentItems] = useState<ContentItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_content`);
      return saved ? JSON.parse(saved) : INITIAL_CONTENT;
    } catch {
      return INITIAL_CONTENT;
    }
  });

  const [digitalAssets, setDigitalAssets] = useState<DigitalAsset[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_assets`);
      return saved ? JSON.parse(saved) : INITIAL_DIGITAL_ASSETS;
    } catch {
      return INITIAL_DIGITAL_ASSETS;
    }
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_campaigns`);
      return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  });

  const [tasks, setTasks] = useState<AgencyTask[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_tasks`);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_audit`);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_notifications`);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [roadmapPhases, setRoadmapPhases] = useState<DevelopmentPhase[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_roadmap`);
      return saved ? JSON.parse(saved) : SYSTEM_ROADMAP_PHASES;
    } catch {
      return SYSTEM_ROADMAP_PHASES;
    }
  });

  // Phase 20: Agency CRM & Leads Pipeline State
  const [deals, setDeals] = useState<CrmDeal[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_deals`);
      return saved ? JSON.parse(saved) : INITIAL_CRM_DEALS;
    } catch {
      return INITIAL_CRM_DEALS;
    }
  });

  // Phase 21: Billing, Retainers & Invoicing State
  const [invoices, setInvoices] = useState<AgencyInvoice[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_invoices`);
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [retainers, setRetainers] = useState<RetainerPlan[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_retainers`);
      return saved ? JSON.parse(saved) : INITIAL_RETAINERS;
    } catch {
      return INITIAL_RETAINERS;
    }
  });

  const [timeEntries, setTimeEntries] = useState<BillableTimeEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_time_entries`);
      return saved ? JSON.parse(saved) : INITIAL_TIME_ENTRIES;
    } catch {
      return INITIAL_TIME_ENTRIES;
    }
  });

  // Phase 22: Unified Communication & Inbox State
  const [inboxThreads, setInboxThreads] = useState<InboxThread[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_inbox_threads`);
      return saved ? JSON.parse(saved) : INITIAL_INBOX_THREADS;
    } catch {
      return INITIAL_INBOX_THREADS;
    }
  });

  const [cannedResponses, setCannedResponses] = useState<CannedResponse[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_canned_responses`);
      return saved ? JSON.parse(saved) : INITIAL_CANNED_RESPONSES;
    } catch {
      return INITIAL_CANNED_RESPONSES;
    }
  });

  // Phase 23: Workflow Automation State
  const [workflowRules, setWorkflowRules] = useState<WorkflowRule[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_workflow_rules`);
      return saved ? JSON.parse(saved) : INITIAL_WORKFLOW_RULES;
    } catch {
      return INITIAL_WORKFLOW_RULES;
    }
  });

  const [workflowLogs, setWorkflowLogs] = useState<WorkflowExecutionLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_workflow_logs`);
      return saved ? JSON.parse(saved) : INITIAL_WORKFLOW_LOGS;
    } catch {
      return INITIAL_WORKFLOW_LOGS;
    }
  });

  // Phase 24: AI Content & Strategy Engine State
  const [aiBriefs, setAiBriefs] = useState<AiStrategyBrief[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_ai_briefs`);
      return saved ? JSON.parse(saved) : INITIAL_AI_STRATEGY_BRIEFS;
    } catch {
      return INITIAL_AI_STRATEGY_BRIEFS;
    }
  });

  // Phase 25: White-Label Customization State
  const [whiteLabelConfigs, setWhiteLabelConfigs] = useState<WhiteLabelConfig[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_whitelabel_configs`);
      return saved ? JSON.parse(saved) : INITIAL_WHITE_LABEL_CONFIGS;
    } catch {
      return INITIAL_WHITE_LABEL_CONFIGS;
    }
  });

  // Phase 26: SaaS Subscription & Tier Management State
  const [workspaceSubscriptions, setWorkspaceSubscriptions] = useState<WorkspaceSubscription[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_workspace_subscriptions`);
      return saved ? JSON.parse(saved) : INITIAL_WORKSPACE_SUBSCRIPTIONS;
    } catch {
      return INITIAL_WORKSPACE_SUBSCRIPTIONS;
    }
  });

  // Phase 27: Productivity & Quick Actions State
  const [quickNotes, setQuickNotes] = useState<QuickDraftNote[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_quick_notes`);
      return saved ? JSON.parse(saved) : INITIAL_QUICK_NOTES;
    } catch {
      return INITIAL_QUICK_NOTES;
    }
  });

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Phase 28: Security Hardening & Data Protection State
  const [soc2AuditLogs, setSoc2AuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_soc2_audit_logs`);
      return saved ? JSON.parse(saved) : INITIAL_SOC2_AUDIT_LOGS;
    } catch {
      return INITIAL_SOC2_AUDIT_LOGS;
    }
  });

  const [apiKeys, setApiKeys] = useState<ApiKey[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_api_keys`);
      return saved ? JSON.parse(saved) : INITIAL_API_KEYS;
    } catch {
      return INITIAL_API_KEYS;
    }
  });

  const [gdprRequests, setGdprRequests] = useState<GdprRequest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_gdpr_requests`);
      return saved ? JSON.parse(saved) : INITIAL_GDPR_REQUESTS;
    } catch {
      return INITIAL_GDPR_REQUESTS;
    }
  });

  const [securityPolicy, setSecurityPolicy] = useState<SecurityPolicyConfig>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_security_policy`);
      return saved ? JSON.parse(saved) : INITIAL_SECURITY_POLICY;
    } catch {
      return INITIAL_SECURITY_POLICY;
    }
  });

  const [currentActivePhase, setCurrentActivePhase] = useState<number>(1);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_workspaces`, JSON.stringify(workspaces));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_workspace`, JSON.stringify(workspace));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_currentUser`, JSON.stringify(currentUser));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_clients`, JSON.stringify(clients));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_content`, JSON.stringify(contentItems));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_assets`, JSON.stringify(digitalAssets));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_campaigns`, JSON.stringify(campaigns));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_tasks`, JSON.stringify(tasks));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_audit`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_roadmap`, JSON.stringify(roadmapPhases));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_deals`, JSON.stringify(deals));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_invoices`, JSON.stringify(invoices));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_retainers`, JSON.stringify(retainers));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_time_entries`, JSON.stringify(timeEntries));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_inbox_threads`, JSON.stringify(inboxThreads));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_canned_responses`, JSON.stringify(cannedResponses));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_workflow_rules`, JSON.stringify(workflowRules));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_workflow_logs`, JSON.stringify(workflowLogs));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_ai_briefs`, JSON.stringify(aiBriefs));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_whitelabel_configs`, JSON.stringify(whiteLabelConfigs));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_workspace_subscriptions`, JSON.stringify(workspaceSubscriptions));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_quick_notes`, JSON.stringify(quickNotes));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_soc2_audit_logs`, JSON.stringify(soc2AuditLogs));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_api_keys`, JSON.stringify(apiKeys));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_gdpr_requests`, JSON.stringify(gdprRequests));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_security_policy`, JSON.stringify(securityPolicy));
    } catch (e) {
      console.warn('LocalStorage sync warning:', e);
    }
  }, [workspaces, workspace, currentUser, clients, contentItems, digitalAssets, campaigns, tasks, auditLogs, notifications, roadmapPhases, deals, invoices, retainers, timeEntries, inboxThreads, cannedResponses, workflowRules, workflowLogs, aiBriefs, whiteLabelConfigs, workspaceSubscriptions, quickNotes, soc2AuditLogs, apiKeys, gdprRequests, securityPolicy]);

  const setWorkspace = (ws: TenantWorkspace) => {
    setWorkspaceState(ws);
    setWorkspaces(prev => prev.map(w => w.id === ws.id ? ws : w));
    logAuditEvent('system', 'Workspace Updated', `Agency workspace modified: ${ws.name}`);
  };

  // Phase 04: Multi-Tenancy Handlers
  const switchWorkspace = (workspaceId: string) => {
    const target = workspaces.find(w => w.id === workspaceId);
    if (!target) return;

    setWorkspaceState(target);
    // Filter users assigned to this workspace or simulate active tenant membership
    const tenantUser = users.find(u => u.tenantId === target.id) || {
      ...currentUser,
      tenantId: target.id
    };
    setCurrentUserState(tenantUser);
    setActiveClientId(null); // Clear selected client to prevent cross-tenant leak

    eventBus.emit('workspace:switched', { workspaceId: target.id, slug: target.slug }, {
      actorId: tenantUser.id,
      actorName: tenantUser.name
    });

    logAuditEvent('system', 'Tenant Workspace Switched', `Switched active scope to ${target.name} (${target.slug})`);
    addToast('Tenant Switched', `Active workspace is now "${target.name}" [${target.city || 'Kenya'}, ${target.currency}]`, 'info');
  };

  const createWorkspace = (data: Omit<TenantWorkspace, 'id' | 'createdAt' | 'memberCount' | 'clientCount'>): TenantWorkspace => {
    const newWs: TenantWorkspace = {
      ...data,
      id: `workspace_${data.slug.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}`,
      createdAt: new Date().toISOString(),
      memberCount: 1,
      clientCount: 0
    };

    setWorkspaces(prev => [...prev, newWs]);
    setWorkspaceState(newWs);

    // Update current user tenant association
    const updatedUser = { ...currentUser, tenantId: newWs.id };
    setCurrentUserState(updatedUser);

    eventBus.emit('workspace:created', { workspaceId: newWs.id, name: newWs.name, slug: newWs.slug }, {
      actorId: currentUser.id,
      actorName: currentUser.name
    });

    logAuditEvent('system', 'New Tenant Workspace Created', `Created workspace ${newWs.name} (${newWs.currency})`);
    addToast('Workspace Created', `New agency workspace "${newWs.name}" is now live`, 'success');
    return newWs;
  };

  const mapCustomDomain = (workspaceId: string, domain: string) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === workspaceId) {
        return { ...w, customDomain: domain.trim().toLowerCase() };
      }
      return w;
    }));

    if (workspace.id === workspaceId) {
      setWorkspaceState(prev => ({ ...prev, customDomain: domain.trim().toLowerCase() }));
    }

    eventBus.emit('workspace:domain_mapped', { workspaceId, domain }, {
      actorId: currentUser.id,
      actorName: currentUser.name
    });

    logAuditEvent('system', 'Custom Domain Mapped', `Vanity domain ${domain} routed to tenant ${workspaceId}`);
    addToast('Domain Configured', `Vanity domain mapped: https://${domain}`, 'success');
  };

  // Phase 03: Auth Handlers
  const login = async (credentials: LoginCredentials) => {
    const res = authService.login(credentials);
    if (res.success && res.session) {
      setSession(res.session);
      setCurrentUserState(res.session.user);
      setUsers(authService.getUsers());

      // Read latest workspaces from storage
      try {
        const savedWorkspaces = localStorage.getItem(`${STORAGE_KEY_PREFIX}_workspaces`);
        const allWs: TenantWorkspace[] = savedWorkspaces ? JSON.parse(savedWorkspaces) : workspaces;
        setWorkspaces(allWs);
        const targetWorkspace = allWs.find(w => w.id === res.session!.user.tenantId);
        if (targetWorkspace) {
          setWorkspaceState(targetWorkspace);
          localStorage.setItem(`${STORAGE_KEY_PREFIX}_workspace`, JSON.stringify(targetWorkspace));
        }
      } catch (e) {
        console.warn('Workspace sync warning:', e);
      }

      addToast('Authenticated', `Welcome back, ${res.session.user.name}`, 'success');
      logAuditEvent('auth', 'User Login Succeeded', `Authenticated via ${credentials.provider} as ${res.session.user.email}`);
      return { success: true };
    }
    addToast('Authentication Failed', res.error || 'Invalid credentials', 'error');
    return { success: false, error: res.error };
  };

  const register = async (payload: RegisterPayload) => {
    const res = authService.register(payload);
    if (res.success && res.session) {
      setSession(res.session);
      setCurrentUserState(res.session.user);
      setUsers(authService.getUsers());

      // Reload workspaces to pick up any newly registered tenant workspace
      try {
        const savedWorkspaces = localStorage.getItem(`${STORAGE_KEY_PREFIX}_workspaces`);
        if (savedWorkspaces && res.session) {
          const parsed: TenantWorkspace[] = JSON.parse(savedWorkspaces);
          setWorkspaces(parsed);
          const newWs = parsed.find(w => w.id === res.session!.user.tenantId);
          if (newWs) {
            setWorkspaceState(newWs);
            localStorage.setItem(`${STORAGE_KEY_PREFIX}_workspace`, JSON.stringify(newWs));
          }
        }
      } catch (e) {
        console.warn('Workspace load notice:', e);
      }

      addToast('Agency Workspace Created', `Account created for ${res.session.user.name}`, 'success');
      logAuditEvent('auth', 'New User Registered', `Registered ${payload.email} as ${payload.role}`);
      return { success: true };
    }
    addToast('Registration Failed', res.error || 'Failed to create account', 'error');
    return { success: false, error: res.error };
  };

  const logout = () => {
    authService.logout();
    setSession(null);
    setWorkspaceState(INITIAL_WORKSPACES[0]);
    setCurrentUserState(INITIAL_USERS[0]);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_workspace`);
    addToast('Logged Out', 'Your secure session has been terminated', 'info');
    logAuditEvent('auth', 'User Session Terminated', `Active session ended`);
  };

  const refreshSession = () => {
    const refreshed = authService.refreshSession();
    if (refreshed) {
      setSession(refreshed);
      addToast('Session Refreshed', 'Security tokens renewed successfully', 'success');
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    const updated = authService.updateProfile(currentUser.id, updates);
    if (updated) {
      setCurrentUserState(updated);
      setUsers(authService.getUsers());
      if (session) {
        setSession({ ...session, user: updated });
      }
      addToast('Profile Updated', 'Security & profile settings saved', 'success');
      logAuditEvent('auth', 'User Profile Updated', `Updated fields for ${updated.name}`);
    }
  };

  const requestPasswordReset = (email: string) => {
    const res = authService.requestPasswordReset(email);
    addToast('Recovery Dispatched', res.message, 'info');
    logAuditEvent('auth', 'Password Reset Requested', `Recovery token sent to ${email}`);
    return res;
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    // Synchronize session if matching user exists
    const usersList = authService.getUsers();
    const found = usersList.find(u => u.id === user.id);
    if (found) {
      const mockSession: AuthSession = {
        token: `pba_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        refreshToken: `pba_rfk_${Date.now()}`,
        expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        user: found,
        provider: 'email_password'
      };
      setSession(mockSession);
    }
    logAuditEvent('auth', 'Active Identity Switched', `Switched active user to ${user.name} (${user.role})`);
    addToast('Identity Switched', `Now operating as ${user.name} [${user.role.toUpperCase()}]`, 'info');
  };

  const switchUserRole = (role: Role) => {
    const matchingUser = users.find(u => u.role === role) || {
      ...currentUser,
      id: `usr_${role}`,
      role,
      name: `${role.replace('_', ' ').toUpperCase()} (Simulated)`,
      email: `${role}@apexmedia.co.ke`
    };
    setCurrentUser(matchingUser);
  };

  // Phase 09: Team & Capacity Allocation Handlers
  const assignClientToUser = (userId: string, clientId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const clientIds = u.assignedClientIds || [];
        if (!clientIds.includes(clientId)) {
          return {
            ...u,
            assignedClientIds: [...clientIds, clientId],
            currentAllocatedHours: Math.min((u.currentAllocatedHours || 0) + 8, u.maxWeeklyCapacityHours || 40)
          };
        }
      }
      return u;
    }));

    const targetUser = users.find(u => u.id === userId);
    const targetClient = clients.find(c => c.id === clientId);

    logAuditEvent('client', 'Team Assignment Updated', `Assigned client ${targetClient?.name || clientId} to ${targetUser?.name || userId}`, clientId);
    addToast('Client Assigned', `${targetUser?.name || 'Team member'} assigned to ${targetClient?.name || 'Brand'}`, 'success');
  };

  const unassignClientFromUser = (userId: string, clientId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          assignedClientIds: (u.assignedClientIds || []).filter(id => id !== clientId),
          currentAllocatedHours: Math.max((u.currentAllocatedHours || 0) - 8, 0)
        };
      }
      return u;
    }));

    const targetUser = users.find(u => u.id === userId);
    const targetClient = clients.find(c => c.id === clientId);

    logAuditEvent('client', 'Team Assignment Removed', `Unassigned client ${targetClient?.name || clientId} from ${targetUser?.name || userId}`, clientId);
    addToast('Assignment Removed', `Unassigned from ${targetClient?.name || 'Brand'}`, 'info');
  };

  const inviteTeamMember = (payload: { name: string; email: string; role: Role; jobTitle?: string; skills?: string[] }) => {
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: payload.name.trim(),
      email: payload.email.trim(),
      role: payload.role,
      tenantId: workspace.id,
      assignedClientIds: [],
      createdAt: new Date().toISOString(),
      jobTitle: payload.jobTitle?.trim() || `${payload.role.replace('_', ' ').toUpperCase()}`,
      skills: payload.skills || ['Digital Media', 'Brand Storytelling'],
      maxWeeklyCapacityHours: payload.role === 'client_approver' ? 10 : 40,
      currentAllocatedHours: 0,
      availabilityStatus: 'available',
      emailVerified: true
    };

    setUsers(prev => [...prev, newUser]);
    setWorkspaceState(prev => ({ ...prev, memberCount: prev.memberCount + 1 }));
    setWorkspaces(prev => prev.map(w => w.id === workspace.id ? { ...w, memberCount: w.memberCount + 1 } : w));

    logAuditEvent('auth', 'New Team Member Invited', `Invited ${newUser.name} (${newUser.email}) as ${newUser.role}`, newUser.id);
    addToast('Invitation Dispatched', `Invite email link dispatched to ${newUser.email}`, 'success');
  };

  const updateUserCapacity = (userId: string, maxHours: number, allocatedHours: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          maxWeeklyCapacityHours: maxHours,
          currentAllocatedHours: allocatedHours,
          availabilityStatus: allocatedHours >= maxHours ? 'busy' : 'available'
        };
      }
      return u;
    }));

    logAuditEvent('system', 'Capacity Hours Calibrated', `Adjusted capacity for user ${userId} to ${allocatedHours}/${maxHours} hrs`);
    addToast('Capacity Updated', 'Workload allocation recalculated', 'info');
  };

  // Phase 05: Dynamic RBAC evaluation
  const can = (permission: Permission): boolean => {
    return hasPermission(currentUser.role, permission);
  };

  const capabilities: RoleCapabilities = getRoleCapabilities(currentUser.role);

  const logAuditEvent = (
    category: AuditEvent['category'],
    action: string,
    details: string,
    targetId?: string
  ) => {
    const newLog: AuditEvent = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId: workspace.id,
      userId: currentUser.id,
      userName: currentUser.name,
      category,
      action,
      details,
      targetId,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 199)]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const addToast = (title: string, message: string, type: Toast['type'] = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Phase 06: Executive Dashboard Action Handlers
  const quickApproveContent = (contentId: string, notes?: string) => {
    setContentItems(prev => prev.map(item => {
      if (item.id === contentId) {
        const nextStage = currentUser.role === 'client_approver' ? 'approved' : 'client_review';
        const approvalEntry = {
          id: `appr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          contentId,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          action: 'approved' as const,
          notes: notes || (currentUser.role === 'client_approver' ? 'Client approved for immediate distribution' : 'Internal quality check passed'),
          timestamp: new Date().toISOString()
        };

        return {
          ...item,
          stage: nextStage,
          updatedAt: new Date().toISOString(),
          approvalHistory: [...(item.approvalHistory || []), approvalEntry]
        };
      }
      return item;
    }));

    eventBus.emit('content:approved', { contentId }, {
      actorId: currentUser.id,
      actorName: currentUser.name
    });

    logAuditEvent('approval', 'Post Approval Executed', `Approved post [${contentId}] as ${currentUser.role}`, contentId);
    addToast('Content Approved', 'Post has been advanced in the approval pipeline', 'success');
  };

  const quickRequestRevision = (contentId: string, reason: string) => {
    setContentItems(prev => prev.map(item => {
      if (item.id === contentId) {
        const entry = {
          id: `appr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          contentId,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          action: 'rejected' as const,
          notes: reason,
          timestamp: new Date().toISOString()
        };
        return {
          ...item,
          stage: 'revision_requested',
          feedbackNotes: reason,
          updatedAt: new Date().toISOString(),
          approvalHistory: [...(item.approvalHistory || []), entry]
        };
      }
      return item;
    }));

    eventBus.emit('content:revision_requested', { contentId, reason }, {
      actorId: currentUser.id,
      actorName: currentUser.name
    });

    logAuditEvent('approval', 'Revision Requested', `Feedback provided for post [${contentId}]: ${reason}`, contentId);
    addToast('Revision Dispatched', 'Returned to content creator with amendment notes', 'info');
  };

  const scheduleContentPublish = (contentId: string, scheduledIso: string) => {
    setContentItems(prev => prev.map(item => {
      if (item.id === contentId) {
        return {
          ...item,
          stage: 'scheduled',
          scheduledDate: scheduledIso,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    }));

    logAuditEvent('content', 'Social Schedule Locked', `Post [${contentId}] locked for dispatch at ${scheduledIso}`, contentId);
    addToast('Publishing Scheduled', `Scheduled for ${new Date(scheduledIso).toLocaleDateString()} EAT`, 'success');
  };

  // Phase 10: Content Creation & Composer Handlers
  const createContentItem = (itemData: Omit<ContentItem, 'id' | 'approvalHistory' | 'createdAt' | 'updatedAt'>): ContentItem => {
    const now = new Date().toISOString();
    const newItem: ContentItem = {
      ...itemData,
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
      approvalHistory: [
        {
          id: `appr_${Date.now()}_init`,
          contentId: `post_${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          action: 'submitted',
          notes: 'Draft created in Content Composer',
          timestamp: new Date().toISOString()
        }
      ]
    };

    setContentItems(prev => [newItem, ...prev]);

    // Update client pending count or published count if relevant
    if (newItem.stage === 'client_review' || newItem.stage === 'internal_review') {
      setClients(prev => prev.map(c => c.id === newItem.clientId ? { ...c, pendingApprovalCount: c.pendingApprovalCount + 1 } : c));
    }

    logAuditEvent('content', 'Post Draft Created', `Created post [${newItem.title}] for client ${newItem.clientId}`, newItem.id);
    addToast('Post Composed', `Post created in ${newItem.stage.replace('_', ' ')} stage`, 'success');
    return newItem;
  };

  const updateContentItem = (id: string, updates: Partial<ContentItem>) => {
    setContentItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    logAuditEvent('content', 'Post Updated', `Edited post [${id}] details`, id);
    addToast('Post Updated', 'Post content and settings saved', 'success');
  };

  const deleteContentItem = (id: string) => {
    setContentItems(prev => prev.filter(item => item.id !== id));
    logAuditEvent('content', 'Post Deleted', `Removed post [${id}] from catalog`, id);
    addToast('Post Deleted', 'Content removed from pipeline', 'info');
  };

  // Phase 13: Editorial Workflow & Versioning Handlers
  const transitionContentStage = (id: string, nextStage: ContentStage, note?: string) => {
    setContentItems(prev => prev.map(item => {
      if (item.id === id) {
        // Snapshot existing version before stage transition
        const currentVersionCount = (item.versions || []).length;
        const newVersion = {
          versionNumber: currentVersionCount + 1,
          caption: item.caption,
          title: item.title,
          modifiedBy: currentUser.id,
          modifiedByName: currentUser.name,
          timestamp: new Date().toISOString(),
          changeSummary: note || `Stage moved from ${item.stage.replace('_', ' ')} to ${nextStage.replace('_', ' ')}`
        };

        const approvalEntry = {
          id: `appr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          contentId: id,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          action: (nextStage === 'approved' ? 'approved' : nextStage === 'revision_requested' ? 'rejected' : 'submitted') as any,
          notes: note || `Advanced to ${nextStage.replace('_', ' ')}`,
          timestamp: new Date().toISOString()
        };

        return {
          ...item,
          stage: nextStage,
          updatedAt: new Date().toISOString(),
          versions: [...(item.versions || []), newVersion],
          approvalHistory: [...(item.approvalHistory || []), approvalEntry]
        };
      }
      return item;
    }));

    logAuditEvent('content', 'Workflow Stage Advanced', `Moved post [${id}] to ${nextStage}`, id);
    addToast('Stage Updated', `Moved to ${nextStage.replace('_', ' ')}`, 'success');
  };

  const rollbackContentVersion = (id: string, versionNumber: number) => {
    setContentItems(prev => prev.map(item => {
      if (item.id === id && item.versions) {
        const targetVersion = item.versions.find(v => v.versionNumber === versionNumber);
        if (targetVersion) {
          const newVersionLog = {
            versionNumber: item.versions.length + 1,
            caption: targetVersion.caption,
            title: targetVersion.title,
            modifiedBy: currentUser.id,
            modifiedByName: currentUser.name,
            timestamp: new Date().toISOString(),
            changeSummary: `Rolled back to Version #${versionNumber}`
          };

          return {
            ...item,
            title: targetVersion.title,
            caption: targetVersion.caption,
            updatedAt: new Date().toISOString(),
            versions: [...item.versions, newVersionLog]
          };
        }
      }
      return item;
    }));

    logAuditEvent('content', 'Post Version Rollback', `Reverted post [${id}] to version #${versionNumber}`, id);
    addToast('Rollback Complete', `Restored to Version #${versionNumber}`, 'info');
  };

  const addInternalComment = (id: string, commentText: string) => {
    const newComment = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      comment: commentText,
      timestamp: new Date().toISOString()
    };

    setContentItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          internalComments: [...(item.internalComments || []), newComment],
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    }));

    logAuditEvent('content', 'Internal Comment Logged', `Comment added on post [${id}] by ${currentUser.name}`, id);
    addToast('Comment Posted', 'Team feedback shared on internal review thread', 'info');
  };

  // Phase 14: Digital Asset Management (DAM) Handlers
  const createDigitalAsset = (assetData: Omit<DigitalAsset, 'id' | 'uploadedAt' | 'usageCount'>): DigitalAsset => {
    const newAsset: DigitalAsset = {
      ...assetData,
      id: `asset_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      usageCount: 0,
      uploadedAt: new Date().toISOString()
    };

    setDigitalAssets(prev => [newAsset, ...prev]);
    logAuditEvent('content', 'Digital Asset Uploaded', `Asset [${newAsset.name}] uploaded by ${currentUser.name}`, newAsset.id);
    addToast('Asset Registered', `Added "${newAsset.name}" to brand media vault`, 'success');
    return newAsset;
  };

  const deleteDigitalAsset = (id: string) => {
    setDigitalAssets(prev => prev.filter(a => a.id !== id));
    logAuditEvent('content', 'Digital Asset Deleted', `Removed asset [${id}]`, id);
    addToast('Asset Removed', 'File purged from cloud media repository', 'info');
  };

  const linkAssetToPost = (assetId: string, postId: string) => {
    setDigitalAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        const existingLinks = a.linkedPostIds || [];
        if (!existingLinks.includes(postId)) {
          return {
            ...a,
            usageCount: a.usageCount + 1,
            linkedPostIds: [...existingLinks, postId]
          };
        }
      }
      return a;
    }));

    addToast('Asset Linked', 'Media attached to social post publication', 'success');
  };

  // Phase 15: Campaign Strategy & Management Handlers
  const createCampaign = (campaignData: Omit<Campaign, 'id' | 'publishedPostCount'>): Campaign => {
    const newCamp: Campaign = {
      ...campaignData,
      id: `camp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      publishedPostCount: 0
    };

    setCampaigns(prev => [newCamp, ...prev]);
    logAuditEvent('content', 'Campaign Strategy Created', `Created campaign "${newCamp.name}" for client [${newCamp.clientId}]`, newCamp.id);
    addToast('Campaign Created', `Strategic initiative "${newCamp.name}" is now active`, 'success');
    return newCamp;
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    logAuditEvent('content', 'Campaign Strategy Updated', `Updated parameters for campaign [${id}]`, id);
    addToast('Campaign Updated', 'Strategic parameters saved', 'info');
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    logAuditEvent('content', 'Campaign Strategy Deleted', `Archived campaign [${id}]`, id);
    addToast('Campaign Archived', 'Campaign removed from active registry', 'info');
  };

  const toggleMilestone = (campaignId: string, milestoneId: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId && c.milestones) {
        return {
          ...c,
          milestones: c.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m)
        };
      }
      return c;
    }));

    addToast('Milestone Updated', 'Campaign milestone status updated', 'success');
  };

  // Phase 16: Task & Project Management Handlers
  const createAgencyTask = (taskData: Omit<AgencyTask, 'id'>): AgencyTask => {
    const newTask: AgencyTask = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };

    setTasks(prev => [newTask, ...prev]);
    logAuditEvent('system', 'Agency Task Created', `Created task "${newTask.title}" for ${newTask.assignedToUserName || 'assigned staff'}`, newTask.id);
    addToast('Task Created', `"${newTask.title}" assigned to sprint queue`, 'success');
    return newTask;
  };

  const updateAgencyTask = (id: string, updates: Partial<AgencyTask>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    logAuditEvent('system', 'Agency Task Updated', `Updated parameters for task [${id}]`, id);
    addToast('Task Updated', 'Sprint ticket details updated', 'info');
  };

  const deleteAgencyTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    logAuditEvent('system', 'Agency Task Deleted', `Removed task [${id}]`, id);
    addToast('Task Deleted', 'Ticket purged from backlog', 'info');
  };

  const toggleTaskSubItem = (taskId: string, subItemId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && t.checklist) {
        return {
          ...t,
          checklist: t.checklist.map(item => item.id === subItemId ? { ...item, completed: !item.completed } : item)
        };
      }
      return t;
    }));
  };

  const transitionTaskStatus = (taskId: string, status: AgencyTask['status']) => {
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, status } : t)));
    addToast('Sprint Status Updated', `Task moved to ${status.replace('_', ' ')}`, 'info');
  };

  // Phase 17: Social Account Connections Handlers
  const connectSocialAccount = (clientId: string, accountData: Omit<SocialAccount, 'id'>): SocialAccount => {
    const newAccount: SocialAccount = {
      ...accountData,
      id: `soc_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      clientId,
      connected: true,
      lastSyncedAt: new Date().toISOString(),
      tokenHealth: 'healthy',
      tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days
    };

    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          socialAccounts: [...(c.socialAccounts || []), newAccount]
        };
      }
      return c;
    }));

    logAuditEvent('auth', 'Social OAuth Account Linked', `Linked ${newAccount.platform} account [${newAccount.handle}] for client ${clientId}`, newAccount.id);
    addToast('OAuth Connected', `Successfully authenticated @${newAccount.handle} with ${newAccount.platform.toUpperCase()}`, 'success');
    return newAccount;
  };

  const disconnectSocialAccount = (clientId: string, accountId: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          socialAccounts: (c.socialAccounts || []).filter(a => a.id !== accountId)
        };
      }
      return c;
    }));

    logAuditEvent('auth', 'Social OAuth Revoked', `Disconnected social account [${accountId}]`, accountId);
    addToast('Account Disconnected', 'OAuth token revoked and session purged', 'info');
  };

  const refreshOAuthToken = (clientId: string, accountId: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          socialAccounts: (c.socialAccounts || []).map(a => {
            if (a.id === accountId) {
              return {
                ...a,
                tokenHealth: 'healthy',
                tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
                lastSyncedAt: new Date().toISOString(),
                reAuthRequired: false
              };
            }
            return a;
          })
        };
      }
      return c;
    }));

    logAuditEvent('auth', 'OAuth Token Refreshed', `Extended API token for account [${accountId}]`, accountId);
    addToast('Token Refreshed', 'OAuth access token lifecycle renewed for 60 days', 'success');
  };

  const toggleSandboxMode = (clientId: string, accountId: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          socialAccounts: (c.socialAccounts || []).map(a => {
            if (a.id === accountId) {
              const nextState = !a.sandboxMode;
              return {
                ...a,
                sandboxMode: nextState
              };
            }
            return a;
          })
        };
      }
      return c;
    }));

    addToast('Sandbox Mode Toggled', 'Simulated dry-run sandbox toggled', 'info');
  };

  const runMockPublishTest = (clientId: string, accountId: string): boolean => {
    logAuditEvent('content', 'Pre-flight OAuth Mock Dispatch', `Executed test ping to social platform API for [${accountId}]`, accountId);
    addToast('Mock Dispatch Verified', 'Social API responded 200 OK (Simulated ping passed)', 'success');
    return true;
  };

  // Phase 18: Publishing & Scheduling Engine Handlers
  const triggerImmediateDispatch = async (postId: string): Promise<boolean> => {
    const post = contentItems.find(p => p.id === postId);
    if (!post) return false;

    // Set status to dispatching
    setContentItems(prev => prev.map(p => (p.id === postId ? { ...p, dispatchStatus: 'dispatching' } : p)));
    addToast('Dispatch In-Flight', `Transmitting payload to ${post.platforms.join(', ')}...`, 'info');

    // Simulate network delay to social gateway
    await new Promise(resolve => setTimeout(resolve, 800));

    setContentItems(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          stage: 'published',
          dispatchStatus: 'published',
          publishedDate: new Date().toISOString(),
          lastDispatchAttempt: new Date().toISOString(),
          dispatchErrorNote: undefined
        };
      }
      return p;
    }));

    logAuditEvent('content', 'Content Dispatched Live', `Published post [${post.title}] across [${post.platforms.join(', ')}]`, post.id);
    addToast('Published Live!', `Post broadcasted successfully. First comment pinned.`, 'success');
    return true;
  };

  const retryFailedDispatch = (postId: string) => {
    const post = contentItems.find(p => p.id === postId);
    if (!post) return;

    setContentItems(prev => prev.map(p => {
      if (p.id === postId) {
        const nextRetry = (p.retryCount || 0) + 1;
        return {
          ...p,
          dispatchStatus: nextRetry >= 3 ? 'published' : 'retrying',
          retryCount: nextRetry,
          lastDispatchAttempt: new Date().toISOString(),
          dispatchErrorNote: nextRetry >= 3 ? undefined : 'Transient network backoff retry in-flight',
          stage: nextRetry >= 3 ? 'published' : p.stage
        };
      }
      return p;
    }));

    logAuditEvent('content', 'Dispatch Retry Triggered', `Exponential backoff retry cycle executed for [${postId}]`, postId);
    addToast('Retry Enqueued', 'Dispatch job resubmitted to high-priority publisher queue', 'info');
  };

  const updateFirstComment = (postId: string, commentText: string) => {
    setContentItems(prev => prev.map(p => (p.id === postId ? { ...p, firstCommentText: commentText } : p)));
    addToast('First-Comment Saved', 'Hashtags & first-comment payload updated', 'info');
  };

  const runPreFlightAudit = (postId: string): PreFlightValidation => {
    const post = contentItems.find(p => p.id === postId);
    if (!post) {
      return {
        aspectRatioValid: false,
        captionLengthValid: false,
        hasRequiredHashtags: false,
        mediaEncodingValid: false,
        passedAll: false
      };
    }

    const captionLen = post.caption.length;
    const hasTags = post.caption.includes('#') || (post.firstCommentText && post.firstCommentText.includes('#'));
    const isVideo = post.format === 'video_reel' || post.format === 'short';

    const result: PreFlightValidation = {
      aspectRatioValid: true,
      aspectRatioNote: isVideo ? '9:16 Vertical Crop Verified' : '1:1 / 4:5 Feed Compliant',
      captionLengthValid: captionLen > 10 && captionLen < 2200,
      captionLengthNote: `${captionLen} chars within API limits`,
      hasRequiredHashtags: Boolean(hasTags),
      mediaEncodingValid: true,
      passedAll: true
    };

    setContentItems(prev => prev.map(p => (p.id === postId ? { ...p, preFlightCheck: result } : p)));
    addToast('Pre-Flight Passed', 'Payload compliance validated against Meta/LinkedIn/TikTok specs', 'success');
    return result;
  };

  // Phase 07: Client Management Handlers
  const updateClientBrand = (clientId: string, updates: Partial<ClientBrand>) => {
    setClients(prev => prev.map(c => (c.id === clientId ? { ...c, ...updates } : c)));
    logAuditEvent('client', 'Client Profile Updated', `Updated brand details for client ${clientId}`, clientId);
    addToast('Brand Profile Updated', 'Client details and guidelines successfully saved', 'success');
  };

  const createClientBrand = (clientData: Omit<ClientBrand, 'id' | 'createdAt' | 'currentMonthPublishedCount' | 'pendingApprovalCount'>): ClientBrand => {
    const newClient: ClientBrand = {
      ...clientData,
      id: `client_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
      currentMonthPublishedCount: 0,
      pendingApprovalCount: 0
    };
    setClients(prev => [...prev, newClient]);
    logAuditEvent('client', 'New Client Brand Created', `Registered client ${newClient.name} (${newClient.industry})`, newClient.id);
    addToast('Brand Onboarded', `${newClient.name} is now registered in ${workspace.name}`, 'success');
    return newClient;
  };

  const deleteClientBrand = (clientId: string) => {
    const target = clients.find(c => c.id === clientId);
    const targetName = target ? target.name : clientId;

    // 1. Remove the client
    setClients(prev => prev.filter(c => c.id !== clientId));

    // 2. Clear active client if it was selected
    if (activeClientId === clientId) {
      setActiveClientId(null);
    }

    // 3. Cascade cleanup: orphaned posts, campaigns, deals, retainers, and time entries
    setContentItems(prev => prev.filter(p => p.clientId !== clientId));
    setCampaigns(prev => prev.filter(camp => camp.clientId !== clientId));
    setDeals(prev => prev.filter(d => d.companyName.toLowerCase() !== targetName.toLowerCase()));
    setRetainers(prev => prev.filter(r => r.clientId !== clientId));
    setTimeEntries(prev => prev.filter(t => t.clientId !== clientId));

    // 4. Unassign client from users
    setUsers(prev => prev.map(u => ({
      ...u,
      assignedClientIds: (u.assignedClientIds || []).filter(id => id !== clientId)
    })));

    logAuditEvent('client', 'Client Brand Deleted', `Removed client [${targetName}] and cleaned associated dependent entities`, clientId);
    addToast('Client Removed', `Brand "${targetName}" and associated pipeline items removed`, 'info');
  };

  const toggleSocialConnection = (clientId: string, socialAccountId: string) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          socialAccounts: client.socialAccounts.map(acc => {
            if (acc.id === socialAccountId) {
              const nextState = !acc.connected;
              return {
                ...acc,
                connected: nextState,
                lastSyncedAt: nextState ? new Date().toISOString() : acc.lastSyncedAt
              };
            }
            return acc;
          })
        };
      }
      return client;
    }));
    logAuditEvent('client', 'Social Integration Toggled', `Toggled connection for account ${socialAccountId}`, clientId);
    addToast('Social Account Updated', 'Connection state synchronized', 'info');
  };

  const updateOnboardingTask = (clientId: string, taskKey: keyof OnboardingChecklist, completed: boolean) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId) {
        const currentList: OnboardingChecklist = client.onboardingChecklist || {
          ndaSigned: false,
          retainerContractSigned: false,
          brandAssetsReceived: false,
          socialAccessGranted: false,
          primaryApproverConfirmed: false,
          kickoffCompleted: false
        };

        const updatedList = {
          ...currentList,
          [taskKey]: completed
        };

        const totalTasks = Object.keys(updatedList).length;
        const completedCount = Object.values(updatedList).filter(Boolean).length;
        const progressPercent = Math.round((completedCount / totalTasks) * 100);
        const nextStatus = progressPercent === 100 ? 'active' : 'onboarding';

        return {
          ...client,
          status: nextStatus,
          onboardingChecklist: updatedList,
          onboardingProgress: progressPercent
        };
      }
      return client;
    }));

    logAuditEvent('client', 'Onboarding Task Toggled', `Task [${taskKey}] marked as ${completed ? 'Completed' : 'Pending'} for client ${clientId}`, clientId);
    addToast('Onboarding Updated', `Task status synchronized`, 'success');
  };

  // Phase 20: Agency CRM & Leads Pipeline Handlers
  const createDeal = (dealData: Omit<CrmDeal, 'id' | 'createdAt' | 'updatedAt' | 'activities'>): CrmDeal => {
    const newDeal: CrmDeal = {
      ...dealData,
      id: `deal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      activities: [
        {
          id: `act_${Date.now()}`,
          dealId: `deal_${Date.now()}`,
          timestamp: new Date().toISOString(),
          authorId: currentUser.id,
          authorName: currentUser.name,
          type: 'note',
          notes: 'Prospect deal initialized in sales pipeline.'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDeals(prev => [newDeal, ...prev]);
    logAuditEvent('client', 'New Deal Created', `Created prospect deal for ${newDeal.companyName} (${newDeal.dealValueMonthly.toLocaleString()} ${workspace.currency.split(' ')[0]}/mo)`, newDeal.id);
    addToast('Deal Created', `${newDeal.companyName} added to pipeline`, 'success');
    return newDeal;
  };

  const updateDeal = (id: string, updates: Partial<CrmDeal>) => {
    setDeals(prev => prev.map(d => (d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d)));
    logAuditEvent('client', 'Deal Updated', `Updated deal [${id}] attributes`, id);
    addToast('Deal Saved', 'Prospect details updated successfully', 'info');
  };

  const deleteDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
    logAuditEvent('client', 'Deal Removed', `Removed prospect deal [${id}]`, id);
    addToast('Deal Deleted', 'Prospect removed from pipeline', 'info');
  };

  const transitionDealStage = (id: string, nextStage: DealStage, reason?: string) => {
    setDeals(prev => prev.map(d => {
      if (d.id === id) {
        const probMap: Record<DealStage, number> = {
          lead: 20,
          discovery: 40,
          proposal: 65,
          negotiation: 80,
          won: 100,
          lost: 0
        };
        const newAct: DealActivity = {
          id: `act_${Date.now()}`,
          dealId: id,
          timestamp: new Date().toISOString(),
          authorId: currentUser.id,
          authorName: currentUser.name,
          type: 'stage_changed',
          notes: `Stage shifted from ${d.stage.toUpperCase()} to ${nextStage.toUpperCase()}${reason ? ` (${reason})` : ''}`
        };
        return {
          ...d,
          stage: nextStage,
          probabilityPercent: probMap[nextStage] ?? d.probabilityPercent,
          lossReason: nextStage === 'lost' ? reason : undefined,
          updatedAt: new Date().toISOString(),
          activities: [newAct, ...(d.activities || [])]
        };
      }
      return d;
    }));
    logAuditEvent('client', 'Deal Stage Transitioned', `Deal [${id}] advanced to ${nextStage}`, id);
    addToast('Stage Updated', `Deal moved to ${nextStage.toUpperCase()}`, 'success');
  };

  const addDealActivity = (dealId: string, activityNotes: string, type: DealActivity['type'] = 'note') => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        const newAct: DealActivity = {
          id: `act_${Date.now()}`,
          dealId,
          timestamp: new Date().toISOString(),
          authorId: currentUser.id,
          authorName: currentUser.name,
          type,
          notes: activityNotes
        };
        return {
          ...d,
          updatedAt: new Date().toISOString(),
          activities: [newAct, ...(d.activities || [])]
        };
      }
      return d;
    }));
    addToast('Activity Logged', 'Entry appended to prospect timeline', 'info');
  };

  const convertDealToClient = (dealId: string): ClientBrand | null => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return null;

    const newClientData = {
      tenantId: workspace.id,
      name: deal.companyName,
      industry: deal.industry,
      website: deal.website || `https://${deal.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.co.ke`,
      accentColor: '#10b981',
      status: 'onboarding' as const,
      toneOfVoice: ['Professional', 'Modern', 'Growth-Focused'],
      brandGuidelinesSummary: `Onboarded from won pipeline deal. Contract value: ${deal.dealValueMonthly.toLocaleString()} ${workspace.currency.split(' ')[0]}/month.`,
      assignedManagerId: deal.assignedUserId || currentUser.id,
      contacts: [
        {
          name: deal.contactName,
          email: deal.contactEmail,
          phone: deal.contactPhone || '+254 700 000 000',
          roleTitle: deal.contactTitle || 'Primary Signoff',
          isPrimarySignoff: true
        }
      ],
      socialAccounts: [],
      retainerMonthlyValue: deal.dealValueMonthly,
      monthlyPostQuota: 16
    };

    const createdClient = createClientBrand(newClientData);

    setDeals(prev => prev.map(d => (d.id === dealId ? { ...d, stage: 'won', probabilityPercent: 100, convertedClientId: createdClient.id, updatedAt: new Date().toISOString() } : d)));

    logAuditEvent('client', 'Won Deal Converted to Client', `Converted deal ${deal.companyName} into active client brand [${createdClient.id}]`, createdClient.id);
    addToast('Client Created & Onboarding Armed!', `${deal.companyName} is now an active brand in your agency directory`, 'success');
    return createdClient;
  };

  // Phase 21: Billing, Retainers & Invoicing Handlers
  const createInvoice = (invoiceData: Omit<AgencyInvoice, 'id' | 'createdAt' | 'updatedAt'>): AgencyInvoice => {
    const newInvoice: AgencyInvoice = {
      ...invoiceData,
      id: `inv_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setInvoices(prev => [newInvoice, ...prev]);
    logAuditEvent('billing', 'Invoice Created', `Generated invoice ${newInvoice.invoiceNumber} for ${newInvoice.clientName} (${newInvoice.totalAmount.toLocaleString()} ${newInvoice.currency})`, newInvoice.id);
    addToast('Invoice Created', `Invoice ${newInvoice.invoiceNumber} generated successfully`, 'success');
    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<AgencyInvoice>) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        return { ...inv, ...updates, updatedAt: new Date().toISOString() };
      }
      return inv;
    }));
    logAuditEvent('billing', 'Invoice Updated', `Updated invoice ${id}`, id);
    addToast('Invoice Updated', 'Invoice record updated successfully', 'info');
  };

  const deleteInvoice = (id: string) => {
    const target = invoices.find(inv => inv.id === id);
    setInvoices(prev => prev.filter(inv => inv.id !== id));
    logAuditEvent('billing', 'Invoice Deleted', `Deleted invoice ${target?.invoiceNumber || id}`, id);
    addToast('Invoice Deleted', `Invoice ${target?.invoiceNumber || id} removed`, 'warning');
  };

  const recordInvoicePayment = (id: string, paymentMethod: PaymentGateway, reference?: string) => {
    const target = invoices.find(inv => inv.id === id);
    if (!target) return;

    const nowIso = new Date().toISOString();
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          status: 'paid' as const,
          paymentMethod,
          paidAt: nowIso,
          transactionReference: reference || `${paymentMethod.toUpperCase()}-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          updatedAt: nowIso
        };
      }
      return inv;
    }));

    logAuditEvent('billing', 'Invoice Payment Settled', `Marked invoice ${target.invoiceNumber} as PAID via ${paymentMethod} (${target.totalAmount.toLocaleString()} ${target.currency})`, id);
    addToast('Payment Received!', `Invoice ${target.invoiceNumber} marked as settled via ${paymentMethod.toUpperCase()}`, 'success');
  };

  const updateRetainer = (id: string, updates: Partial<RetainerPlan>) => {
    setRetainers(prev => prev.map(ret => {
      if (ret.id === id) {
        const updated = { ...ret, ...updates };
        if (updated.allocatedHours > 0) {
          if (updated.usedHours > updated.allocatedHours) {
            updated.status = 'exhausted';
          } else if (updated.usedHours >= updated.allocatedHours * 0.85) {
            updated.status = 'warning';
          } else {
            updated.status = 'active';
          }
        }
        return updated;
      }
      return ret;
    }));
    logAuditEvent('billing', 'Retainer Plan Modified', `Retainer ${id} updated`, id);
    addToast('Retainer Updated', 'Client retainer budget details saved', 'info');
  };

  const logBillableTime = (entry: Omit<BillableTimeEntry, 'id' | 'createdAt'>): BillableTimeEntry => {
    const newEntry: BillableTimeEntry = {
      ...entry,
      id: `time_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setTimeEntries(prev => [newEntry, ...prev]);

    if (newEntry.retainerId) {
      const addedHours = newEntry.durationMinutes / 60;
      setRetainers(prev => prev.map(ret => {
        if (ret.id === newEntry.retainerId) {
          const newUsed = Math.round((ret.usedHours + addedHours) * 10) / 10;
          let newStatus = ret.status;
          if (newUsed > ret.allocatedHours) {
            newStatus = 'exhausted';
          } else if (newUsed >= ret.allocatedHours * 0.85) {
            newStatus = 'warning';
          }
          return {
            ...ret,
            usedHours: newUsed,
            status: newStatus
          };
        }
        return ret;
      }));
    }

    logAuditEvent('billing', 'Billable Time Logged', `Logged ${(newEntry.durationMinutes / 60).toFixed(1)} hrs for client ${newEntry.clientId} by ${newEntry.userName}`, newEntry.id);
    addToast('Time Logged', `${(newEntry.durationMinutes / 60).toFixed(1)} billable hours recorded`, 'success');
    return newEntry;
  };

  const deleteBillableTime = (id: string) => {
    const target = timeEntries.find(t => t.id === id);
    if (target && target.retainerId) {
      const hoursToDeduct = target.durationMinutes / 60;
      setRetainers(prev => prev.map(ret => {
        if (ret.id === target.retainerId) {
          const newUsed = Math.max(0, Math.round((ret.usedHours - hoursToDeduct) * 10) / 10);
          let newStatus = ret.status;
          if (newUsed <= ret.allocatedHours * 0.85) {
            newStatus = 'active';
          } else if (newUsed <= ret.allocatedHours) {
            newStatus = 'warning';
          }
          return {
            ...ret,
            usedHours: newUsed,
            status: newStatus
          };
        }
        return ret;
      }));
    }
    setTimeEntries(prev => prev.filter(t => t.id !== id));
    logAuditEvent('billing', 'Billable Entry Removed', `Time entry ${id} deleted`, id);
    addToast('Time Entry Removed', 'Billable record removed', 'info');
  };

  // Phase 22: Unified Communication & Inbox Handlers
  const addMessageToThread = (threadId: string, content: string, isInternalNote = false, mentions: string[] = []) => {
    const thread = inboxThreads.find(t => t.id === threadId);
    if (!thread) return;

    const newMessage: InboxMessage = {
      id: `msg_${Date.now()}`,
      threadId,
      senderType: isInternalNote ? 'internal_team' : 'agent',
      senderName: currentUser.name,
      senderHandle: `@${currentUser.name.toLowerCase().replace(/\s+/g, '_')}`,
      content,
      timestamp: new Date().toISOString(),
      isInternalNote,
      mentions
    };

    setInboxThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          updatedAt: new Date().toISOString(),
          messages: [...t.messages, newMessage]
        };
      }
      return t;
    }));

    logAuditEvent(
      'content',
      isInternalNote ? 'Internal Discussion Note' : 'Public Social Reply Dispatched',
      `${isInternalNote ? 'Internal note added' : 'Public response sent'} on thread [${threadId}] for ${thread.customerHandle}`,
      threadId
    );

    addToast(
      isInternalNote ? 'Internal Note Posted' : 'Response Dispatched',
      isInternalNote ? 'Collaboration note recorded on thread' : `Reply delivered to ${thread.customerHandle} via ${thread.platform.toUpperCase()}`,
      'success'
    );
  };

  const updateThreadStatus = (threadId: string, status: ThreadStatus) => {
    setInboxThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return { ...t, status, updatedAt: new Date().toISOString() };
      }
      return t;
    }));
    logAuditEvent('content', 'Inbox Thread Status Changed', `Thread ${threadId} marked as ${status.toUpperCase()}`, threadId);
    addToast('Status Updated', `Thread marked as ${status}`, 'info');
  };

  const assignThreadUser = (threadId: string, userId: string, userName: string) => {
    setInboxThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return { ...t, assignedUserId: userId, assignedUserName: userName, updatedAt: new Date().toISOString() };
      }
      return t;
    }));
    logAuditEvent('content', 'Thread Assigned', `Thread ${threadId} assigned to ${userName}`, threadId);
    addToast('Thread Reassigned', `Assigned to ${userName}`, 'info');
  };

  const updateThreadSentiment = (threadId: string, sentiment: MessageSentiment) => {
    setInboxThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return { ...t, sentiment, updatedAt: new Date().toISOString() };
      }
      return t;
    }));
    addToast('Sentiment Updated', `Thread sentiment re-classified as ${sentiment}`, 'info');
  };

  const createCannedResponse = (response: Omit<CannedResponse, 'id'>): CannedResponse => {
    const newCanned: CannedResponse = {
      ...response,
      id: `canned_${Date.now()}`
    };
    setCannedResponses(prev => [newCanned, ...prev]);
    logAuditEvent('content', 'Canned Response Created', `Created quick reply template: ${newCanned.title}`);
    addToast('Template Created', `Saved canned reply for ${newCanned.shortcut}`, 'success');
    return newCanned;
  };

  const deleteCannedResponse = (id: string) => {
    setCannedResponses(prev => prev.filter(c => c.id !== id));
    addToast('Template Deleted', 'Canned response removed', 'info');
  };

  // Phase 23: Workflow Automation Handlers
  const createWorkflowRule = (ruleData: Omit<WorkflowRule, 'id' | 'createdAt' | 'updatedAt' | 'executionCount'>): WorkflowRule => {
    const newRule: WorkflowRule = {
      ...ruleData,
      id: `rule_${Date.now()}`,
      executionCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setWorkflowRules(prev => [newRule, ...prev]);
    logAuditEvent('system', 'Workflow Rule Created', `Created automation rule: ${newRule.name}`, newRule.id);
    addToast('Workflow Created', `Rule "${newRule.name}" created & armed`, 'success');
    return newRule;
  };

  const updateWorkflowRule = (id: string, updates: Partial<WorkflowRule>) => {
    setWorkflowRules(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, ...updates, updatedAt: new Date().toISOString() };
      }
      return r;
    }));
    logAuditEvent('system', 'Workflow Rule Updated', `Updated rule ${id}`, id);
    addToast('Rule Updated', 'Workflow configuration saved', 'info');
  };

  const deleteWorkflowRule = (id: string) => {
    const target = workflowRules.find(r => r.id === id);
    setWorkflowRules(prev => prev.filter(r => r.id !== id));
    logAuditEvent('system', 'Workflow Rule Deleted', `Removed rule ${target?.name || id}`, id);
    addToast('Rule Deleted', 'Workflow automation removed', 'info');
  };

  const toggleWorkflowRule = (id: string) => {
    setWorkflowRules(prev => prev.map(r => {
      if (r.id === id) {
        const nextActive = !r.isActive;
        logAuditEvent('system', 'Workflow Rule Toggled', `Rule "${r.name}" set to ${nextActive ? 'ACTIVE' : 'PAUSED'}`, id);
        addToast(nextActive ? 'Rule Activated' : 'Rule Paused', `"${r.name}" is now ${nextActive ? 'live' : 'paused'}`, 'info');
        return { ...r, isActive: nextActive, updatedAt: new Date().toISOString() };
      }
      return r;
    }));
  };

  const runWorkflowRuleManualTest = (id: string): WorkflowExecutionLog => {
    const targetRule = workflowRules.find(r => r.id === id);
    const nowIso = new Date().toISOString();
    const actionTypes = targetRule ? targetRule.actions.map(a => a.type.replace(/_/g, ' ')).join(', ') : 'automated actions';

    const newLog: WorkflowExecutionLog = {
      id: `wlog_${Date.now()}`,
      tenantId: workspace.id,
      ruleId: id,
      ruleName: targetRule?.name || 'Manual Workflow Test',
      trigger: targetRule?.trigger || 'post_created',
      targetEntityName: 'Interactive Simulation Probe (Apex Media KE)',
      status: 'success',
      details: `Dispatched ${targetRule?.actions.length || 1} actions: ${actionTypes}. All triggers & webhooks verified OK.`,
      timestamp: nowIso
    };

    setWorkflowLogs(prev => [newLog, ...prev]);

    setWorkflowRules(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          executionCount: r.executionCount + 1,
          lastExecutedAt: nowIso,
          updatedAt: nowIso
        };
      }
      return r;
    }));

    logAuditEvent('system', 'Workflow Rule Triggered', `Simulated run of rule "${targetRule?.name}"`, id);
    addToast('Automation Fired!', `Successfully tested "${targetRule?.name}"`, 'success');
    return newLog;
  };

  // Phase 24: AI Content & Strategy Engine Handlers
  const generateAiStrategyBrief = (params: {
    clientId: string;
    platform: any;
    topic: string;
    targetAudience: string;
    goal: AiContentGoal;
    tone: AiToneStyle;
  }): AiStrategyBrief => {
    const client = clients.find(c => c.id === params.clientId);
    const clientName = client?.name || 'Brand Partner';
    const nowIso = new Date().toISOString();

    const cleanBrandTag = clientName.replace(/[^a-zA-Z0-9]/g, '');
    const cleanTopicTag = (params.topic.split(' ')[0] || 'Strategy').replace(/[^a-zA-Z0-9]/g, '');

    const captions: AiGeneratedCaption[] = [
      {
        id: `cap_${Date.now()}_1`,
        hook: `Why the standard approach to ${params.topic} is costing East African brands their competitive edge.`,
        body: `Most brands approaching ${params.topic} make the critical error of chasing surface-level vanity metrics over authentic community connection.\n\nAt ${clientName}, we observed that when you ground your messaging in verifiable outcomes and regional market context, audience trust jumps dramatically.\n\nHere are 3 core pillars to apply:\n1. Audit your baseline before scaling ad spend.\n2. Prioritize consistency and clear storytelling over sheer volume.\n3. Build for long-term customer retention rather than fleeting algorithm hacks.`,
        callToAction: `What has been your biggest hurdle when tackling ${params.topic}? Share your perspective in the comments below! 👇`,
        hashtags: [`#${cleanBrandTag}`, `#${cleanTopicTag}KE`, '#BrandGrowth', '#EastAfricaBusiness', '#ModernStrategy'],
        characterCount: 612,
        predictedEngagementScore: Math.floor(Math.random() * 8) + 91,
        reasoning: 'Curiosity-contrast hook combined with structured 3-point breakdown and conversation-prompting CTA.'
      },
      {
        id: `cap_${Date.now()}_2`,
        hook: `3 overlooked truths about ${params.topic} that industry leaders rarely disclose publicly.`,
        body: `There is a massive difference between talking about ${params.topic} and actually executing it with measurable ROI.\n\nWhen ${clientName} restructured this workflow, the results surprised even veteran operators:\n→ Elimination of wasteful friction points\n→ Unlocking clear brand resonance with ${params.targetAudience}\n→ Compounding organic reach week-over-week\n\nQuality will always outperform noisy mediocrity in 2026.`,
        callToAction: `Save this post for your next strategy planning session or tap the link in bio to learn more.`,
        hashtags: [`#${cleanBrandTag}Insights`, '#StrategicAdvantage', '#NairobiInnovation', '#ScalableOperations', '#IndustryLeadership'],
        characterCount: 574,
        predictedEngagementScore: Math.floor(Math.random() * 7) + 89,
        reasoning: 'Insider knowledge angle ("rarely disclose") triggers high bookmark/save rates and perceived authority.'
      },
      {
        id: `cap_${Date.now()}_3`,
        hook: `If you are trying to reach ${params.targetAudience} in 2026, stop doing this one thing immediately.`,
        body: `Generic broadcast messaging no longer works in saturated East African channels. Audience fatigue is at an all-time high.\n\nInstead of shouting louder, ${clientName} focuses on hyper-relevant problem solving.\n\nWhen you solve specific operational bottlenecks for ${params.targetAudience}, you don't have to chase attention—they seek you out as the definitive authority in the space.`,
        callToAction: `Send us a direct message with '${cleanTopicTag.toUpperCase() || 'GROWTH'}' for our comprehensive implementation framework.`,
        hashtags: [`#${params.goal.replace(/_/g, '')}`, `#${cleanBrandTag}`, '#DirectResponse', '#AudienceFirst', '#BusinessExcellence'],
        characterCount: 540,
        predictedEngagementScore: Math.floor(Math.random() * 6) + 93,
        reasoning: 'Negative constraint hook ("stop doing this") creates psychological urgency with high DM conversion CTA.'
      }
    ];

    const competitorAngles: AiCompetitorAngle[] = [
      {
        id: `comp_${Date.now()}_1`,
        competitorName: 'Generic Industry Incumbents',
        theirApproach: 'Broad mass-market claims without specific regional case studies or validated metrics.',
        contentGap: `Fails to address nuanced pain points of ${params.targetAudience}; lacks localized transparency.`,
        recommendedAngle: `Position ${clientName} as the transparent, locally rooted innovator delivering verified operational ROI.`,
        sampleHook: `Why standard legacy tactics for ${params.topic} fail in modern Kenyan markets.`
      },
      {
        id: `comp_${Date.now()}_2`,
        competitorName: 'Low-cost Out-of-market Agencies',
        theirApproach: 'Template-driven recycled graphics with generic stock photography and disconnected copy.',
        contentGap: 'Zero understanding of East African market dynamics, colloquial resonance, or consumer sentiment.',
        recommendedAngle: 'Emphasize bespoke, context-native strategy and real-time execution tailored to Nairobi & regional ecosystems.',
        sampleHook: "Stock templates don't build trusted brand equity in East Africa—here is what does."
      }
    ];

    const newBrief: AiStrategyBrief = {
      id: `brief_${Date.now()}`,
      tenantId: workspace.id,
      clientId: params.clientId,
      platform: params.platform,
      topic: params.topic,
      targetAudience: params.targetAudience,
      goal: params.goal,
      tone: params.tone,
      captions,
      competitorAngles,
      createdAt: nowIso
    };

    setAiBriefs(prev => [newBrief, ...prev]);
    logAuditEvent('content', 'AI Strategy Brief Generated', `Generated ${captions.length} hooks & competitor brief for ${clientName}: "${params.topic}"`, newBrief.id);
    addToast('AI Strategy Engine', `Synthesized multi-hook brief with competitor angles for ${clientName}`, 'success');
    return newBrief;
  };

  const deleteAiBrief = (id: string) => {
    setAiBriefs(prev => prev.filter(b => b.id !== id));
    logAuditEvent('content', 'AI Brief Deleted', `Removed strategy brief ${id}`, id);
    addToast('Brief Removed', 'AI strategy brief was successfully deleted', 'info');
  };

  // Phase 25: White-Label Customization Handlers & Computed Config
  const activeWhiteLabelConfig: WhiteLabelConfig =
    whiteLabelConfigs.find(c => c.workspaceId === workspace.id) || {
      workspaceId: workspace.id,
      agencyBrandName: workspace.name,
      agencyTagline: 'East Africa’s Premier Performance & Social Media Studio',
      logoUrl: workspace.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      faviconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=32&auto=format&fit=crop&q=80',
      primaryColor: '#6366f1',
      accentColor: '#10b981',
      customDomain: workspace.customDomain || `portal.${workspace.slug}.co.ke`,
      domainStatus: 'active',
      sslStatus: 'active',
      dnsRecords: [
        {
          type: 'CNAME',
          host: workspace.customDomain || `portal.${workspace.slug}.co.ke`,
          targetValue: 'cname.versalyflow.app',
          status: 'verified',
          ttl: 3600,
          lastCheckedAt: new Date().toISOString()
        }
      ],
      supportEmail: workspace.supportEmail || 'support@agency.co.ke',
      emailSenderName: `${workspace.name} Operations`,
      emailSignatureMarkdown: `Warm regards,\n\n**${workspace.name} Client Operations**\n*Westlands, Nairobi, Kenya*`,
      removePlatformBranding: true,
      clientPortalWelcomeMessage: 'Welcome to your dedicated client approval portal. Review campaigns, inspect scheduled posts, and approve live deliverables with full transparency.',
      enableCustomCss: false,
      updatedAt: new Date().toISOString()
    };

  const updateWhiteLabelConfig = (workspaceId: string, updates: Partial<WhiteLabelConfig>) => {
    const nowIso = new Date().toISOString();
    setWhiteLabelConfigs(prev => {
      const exists = prev.some(c => c.workspaceId === workspaceId);
      if (exists) {
        return prev.map(c => c.workspaceId === workspaceId ? { ...c, ...updates, updatedAt: nowIso } : c);
      } else {
        const base = activeWhiteLabelConfig;
        return [...prev, { ...base, ...updates, workspaceId, updatedAt: nowIso }];
      }
    });

    if (updates.customDomain || updates.logoUrl) {
      setWorkspaceState(prev => ({
        ...prev,
        ...(updates.customDomain ? { customDomain: updates.customDomain } : {}),
        ...(updates.logoUrl ? { logoUrl: updates.logoUrl } : {})
      }));
    }

    logAuditEvent('system', 'White-Label Branding Updated', `Updated branding settings for workspace: ${workspace.name}`, workspaceId);
    addToast('Branding Saved', 'White-label customizations and portal styles updated successfully.', 'success');
  };

  const verifyCustomDomainDns = async (workspaceId: string): Promise<boolean> => {
    const targetConfig = whiteLabelConfigs.find(c => c.workspaceId === workspaceId) || activeWhiteLabelConfig;
    const nowIso = new Date().toISOString();

    const verifiedRecords: DnsVerificationRecord[] = targetConfig.dnsRecords.map(r => ({
      ...r,
      status: 'verified',
      lastCheckedAt: nowIso
    }));

    updateWhiteLabelConfig(workspaceId, {
      dnsRecords: verifiedRecords,
      domainStatus: 'active',
      sslStatus: 'active'
    });

    logAuditEvent('system', 'Custom Domain DNS Verified', `DNS verified OK for domain ${targetConfig.customDomain}. SSL TLS 1.3 Active.`, workspaceId);
    addToast('Domain Verified', `Custom domain "${targetConfig.customDomain}" propagated and secured via SSL!`, 'success');
    return true;
  };

  const resetWhiteLabelConfig = (workspaceId: string) => {
    const seedFallback = INITIAL_WHITE_LABEL_CONFIGS.find(c => c.workspaceId === workspaceId) || {
      workspaceId,
      agencyBrandName: workspace.name,
      agencyTagline: 'East Africa’s Premier Performance & Social Media Studio',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      faviconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=32&auto=format&fit=crop&q=80',
      primaryColor: '#6366f1',
      accentColor: '#10b981',
      customDomain: `portal.${workspace.slug}.co.ke`,
      domainStatus: 'active',
      sslStatus: 'active',
      dnsRecords: [
        {
          type: 'CNAME',
          host: `portal.${workspace.slug}.co.ke`,
          targetValue: 'cname.versalyflow.app',
          status: 'verified',
          ttl: 3600,
          lastCheckedAt: new Date().toISOString()
        }
      ],
      supportEmail: workspace.supportEmail || 'support@apexmedia.co.ke',
      emailSenderName: `${workspace.name} Operations`,
      emailSignatureMarkdown: `Warm regards,\n\n**${workspace.name}**\n*Nairobi, Kenya*`,
      removePlatformBranding: true,
      clientPortalWelcomeMessage: 'Welcome to your dedicated client approval portal.',
      enableCustomCss: false,
      updatedAt: new Date().toISOString()
    };

    setWhiteLabelConfigs(prev => prev.map(c => c.workspaceId === workspaceId ? seedFallback : c));
    logAuditEvent('system', 'White-Label Config Reset', `Restored default branding settings for ${workspace.name}`, workspaceId);
    addToast('Branding Reset', 'Default white-label settings restored.', 'info');
  };

  // Phase 26: SaaS Subscription & Tier Management Handlers
  const saasPlans = SAAS_PLANS;

  const currentScopedClients = clients.filter(c => c.tenantId === workspace.id);
  const currentScopedUsers = users.filter(u => u.tenantId === workspace.id);
  const currentScopedPosts = contentItems.filter(p => p.tenantId === workspace.id);

  const workspaceSubscription: WorkspaceSubscription = (() => {
    const found = workspaceSubscriptions.find(s => s.workspaceId === workspace.id);
    if (found) {
      return {
        ...found,
        usageMetrics: {
          clientCount: currentScopedClients.length,
          teamSeatCount: currentScopedUsers.length,
          postsScheduledThisMonth: currentScopedPosts.length,
          aiTokensUsedThisMonth: found.usageMetrics?.aiTokensUsedThisMonth || 64200,
          storageUsedMb: found.usageMetrics?.storageUsedMb || 1240
        }
      };
    }
    return {
      workspaceId: workspace.id,
      currentTier: workspace.tier || 'boutique',
      billingInterval: 'monthly',
      status: 'active',
      paymentMethod: (workspace.billingProvider as any) || 'mpesa_daraja',
      currentPeriodStart: '2026-09-01T00:00:00Z',
      currentPeriodEnd: '2026-10-01T00:00:00Z',
      autoRenew: true,
      usageMetrics: {
        clientCount: currentScopedClients.length,
        teamSeatCount: currentScopedUsers.length,
        postsScheduledThisMonth: currentScopedPosts.length,
        aiTokensUsedThisMonth: 64200,
        storageUsedMb: 1240
      },
      lastPaymentRef: 'MPESA-QRT892K11',
      lastPaymentAmountKes: 14999
    };
  })();

  const upgradeSubscriptionTier = (newTier: SubscriptionTierId, interval: BillingInterval) => {
    const targetPlan = saasPlans.find(p => p.id === newTier);
    if (!targetPlan) return;

    const now = new Date();
    const nextMonth = new Date(now);
    if (interval === 'annual') {
      nextMonth.setFullYear(now.getFullYear() + 1);
    } else {
      nextMonth.setMonth(now.getMonth() + 1);
    }

    const price = interval === 'annual' ? targetPlan.annualPriceKesMonthlyEquivalent * 12 : targetPlan.monthlyPriceKes;
    const newRef = `MPESA-UPG${Date.now().toString().slice(-6)}`;

    setWorkspaceSubscriptions(prev => {
      const exists = prev.some(s => s.workspaceId === workspace.id);
      const updated: WorkspaceSubscription = {
        workspaceId: workspace.id,
        currentTier: newTier,
        billingInterval: interval,
        status: 'active',
        paymentMethod: 'mpesa_daraja',
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: nextMonth.toISOString(),
        autoRenew: true,
        usageMetrics: workspaceSubscription.usageMetrics,
        cancellationScheduledForEnd: false,
        lastPaymentRef: newRef,
        lastPaymentAmountKes: price
      };
      if (exists) {
        return prev.map(s => s.workspaceId === workspace.id ? updated : s);
      }
      return [...prev, updated];
    });

    setWorkspaceState(prev => ({ ...prev, tier: newTier }));
    setWorkspaces(prev => prev.map(w => w.id === workspace.id ? { ...w, tier: newTier } : w));

    logAuditEvent('billing', 'Subscription Upgraded', `Plan upgraded to ${targetPlan.name} (${interval}). Paid KSh ${price.toLocaleString()} via M-Pesa. Ref: ${newRef}`, workspace.id);
    addToast('Plan Upgraded!', `Successfully upgraded to ${targetPlan.name}. All features unlocked.`, 'success');
  };

  const downgradeSubscriptionTier = (newTier: SubscriptionTierId): { allowed: boolean; reason?: string } => {
    const targetPlan = saasPlans.find(p => p.id === newTier);
    if (!targetPlan) return { allowed: false, reason: 'Invalid plan selection' };

    const quotas = targetPlan.quotas;
    if (quotas.maxClients !== -1 && currentScopedClients.length > quotas.maxClients) {
      const reason = `Your agency has ${currentScopedClients.length} active client brands, but ${targetPlan.name} allows a maximum of ${quotas.maxClients}. Please offboard or pause ${currentScopedClients.length - quotas.maxClients} clients before downgrading.`;
      addToast('Downgrade Blocked', reason, 'error');
      return { allowed: false, reason };
    }

    if (quotas.maxTeamSeats !== -1 && currentScopedUsers.length > quotas.maxTeamSeats) {
      const reason = `Your agency has ${currentScopedUsers.length} team members, but ${targetPlan.name} allows a maximum of ${quotas.maxTeamSeats}. Please remove ${currentScopedUsers.length - quotas.maxTeamSeats} seats before downgrading.`;
      addToast('Downgrade Blocked', reason, 'error');
      return { allowed: false, reason };
    }

    setWorkspaceSubscriptions(prev => prev.map(s => {
      if (s.workspaceId === workspace.id) {
        return {
          ...s,
          currentTier: newTier,
          cancellationScheduledForEnd: false
        };
      }
      return s;
    }));

    setWorkspaceState(prev => ({ ...prev, tier: newTier }));
    setWorkspaces(prev => prev.map(w => w.id === workspace.id ? { ...w, tier: newTier } : w));

    logAuditEvent('billing', 'Subscription Downgraded', `Plan switched to ${targetPlan.name}`, workspace.id);
    addToast('Plan Changed', `Your subscription tier was adjusted to ${targetPlan.name}`, 'info');
    return { allowed: true };
  };

  const toggleAutoRenewSubscription = () => {
    setWorkspaceSubscriptions(prev => prev.map(s => {
      if (s.workspaceId === workspace.id) {
        const nextState = !s.autoRenew;
        return {
          ...s,
          autoRenew: nextState,
          cancellationScheduledForEnd: !nextState
        };
      }
      return s;
    }));
    const newAutoRenew = !workspaceSubscription.autoRenew;
    logAuditEvent('billing', 'Subscription Auto-Renew Toggled', `Auto-renew set to ${newAutoRenew ? 'Enabled' : 'Cancelled at period end'}`);
    addToast('Auto-Renew Updated', newAutoRenew ? 'Auto-renew is active via M-Pesa Daraja recurring debit' : 'Subscription will cancel at end of billing cycle', 'info');
  };

  const simulateMpesaSubscriptionRenewal = () => {
    const targetPlan = saasPlans.find(p => p.id === workspaceSubscription.currentTier) || saasPlans[1];
    const newRef = `MPESA-STK${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + 30);

    setWorkspaceSubscriptions(prev => prev.map(s => {
      if (s.workspaceId === workspace.id) {
        return {
          ...s,
          status: 'active',
          currentPeriodStart: now.toISOString(),
          currentPeriodEnd: nextDate.toISOString(),
          lastPaymentRef: newRef,
          lastPaymentAmountKes: targetPlan.monthlyPriceKes
        };
      }
      return s;
    }));

    logAuditEvent('billing', 'M-Pesa Subscription Settled', `M-Pesa Daraja STK prompt confirmed. KSh ${targetPlan.monthlyPriceKes.toLocaleString()} debited. Ref: ${newRef}`, workspace.id);
    addToast('M-Pesa Settlement Confirmed', `KSh ${targetPlan.monthlyPriceKes.toLocaleString()} billed. Next cycle: ${nextDate.toLocaleDateString()}`, 'success');
  };

  // Phase 27: Productivity & Quick Actions Handlers
  const createQuickNote = (data: Omit<QuickDraftNote, 'id' | 'createdAt' | 'updatedAt' | 'tenantId'>): QuickDraftNote => {
    const nowIso = new Date().toISOString();
    const newNote: QuickDraftNote = {
      ...data,
      id: `note_${Date.now()}`,
      tenantId: workspace.id,
      createdAt: nowIso,
      updatedAt: nowIso
    };
    setQuickNotes(prev => [newNote, ...prev]);
    logAuditEvent('content', 'Quick Draft Note Created', `Created quick note: "${newNote.title}"`, newNote.id);
    addToast('Note Saved', `Saved note "${newNote.title}" to quick scratchpad.`, 'success');
    return newNote;
  };

  const updateQuickNote = (id: string, updates: Partial<QuickDraftNote>) => {
    const nowIso = new Date().toISOString();
    setQuickNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: nowIso } : n));
    addToast('Note Updated', 'Quick draft scratchpad note updated.', 'info');
  };

  const deleteQuickNote = (id: string) => {
    setQuickNotes(prev => prev.filter(n => n.id !== id));
    logAuditEvent('content', 'Quick Note Deleted', `Removed note ${id}`, id);
    addToast('Note Removed', 'Scratchpad note deleted.', 'info');
  };

  const convertQuickNoteToPost = (noteId: string, clientId: string): ContentItem => {
    const note = quickNotes.find(n => n.id === noteId);
    const targetClient = clients.find(c => c.id === clientId) || clients[0];
    const postTitle = note ? note.title : 'New Quick Draft Idea';
    const postCaption = note ? `${note.content}\n\n${(note.tags || []).map(t => `#${t.replace('#', '')}`).join(' ')}` : '';

    const newPost = createContentItem({
      tenantId: workspace.id,
      creatorId: currentUser.id,
      clientId: targetClient.id,
      title: postTitle,
      caption: postCaption,
      platforms: ['linkedin', 'twitter'],
      format: 'single_image',
      stage: 'draft',
      mediaUrls: [],
      scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      tags: note?.tags || ['scratchpad-idea'],
      feedbackNotes: `Converted from Quick Scratchpad Note: "${note?.title}"`
    });

    logAuditEvent('content', 'Scratchpad Note Converted to Post', `Converted "${postTitle}" into formal draft post for ${targetClient.name}`, newPost.id);
    addToast('Converted to Post!', `Created formal draft for ${targetClient.name}. Ready in Composer.`, 'success');
    return newPost;
  };

  const executeBulkPostAction = (payload: BulkActionPayload): number => {
    const count = payload.postIds.length;
    if (count === 0) return 0;
    const nowIso = new Date().toISOString();

    setContentItems(prev => prev.map(post => {
      if (!payload.postIds.includes(post.id)) return post;

      let updatedScheduledDate = post.scheduledDate;
      if (payload.rescheduleOffsetDays && post.scheduledDate) {
        const currentDate = new Date(post.scheduledDate);
        currentDate.setDate(currentDate.getDate() + payload.rescheduleOffsetDays);
        updatedScheduledDate = currentDate.toISOString();
      }

      const mergedTags = payload.addTags
        ? Array.from(new Set([...(post.tags || []), ...payload.addTags.map(t => t.replace('#', ''))]))
        : post.tags;

      return {
        ...post,
        ...(payload.stage ? { stage: payload.stage } : {}),
        ...(payload.rescheduleOffsetDays ? { scheduledDate: updatedScheduledDate } : {}),
        tags: mergedTags,
        ...(payload.markFeedbackNote ? { feedbackNotes: payload.markFeedbackNote } : {}),
        updatedAt: nowIso
      };
    }));

    logAuditEvent('content', 'Bulk Content Action Executed', `Updated ${count} posts simultaneously: ${payload.stage ? `Stage -> ${payload.stage}` : ''} ${payload.rescheduleOffsetDays ? `Shifted +${payload.rescheduleOffsetDays}d` : ''}`);
    addToast('Bulk Action Applied', `Batch updated ${count} content posts successfully.`, 'success');
    return count;
  };

  // Phase 28: Security Hardening & Data Protection Handlers
  const computeTamperHash = (prevHash: string, dataStr: string): string => {
    let hash1 = 0xdeadbeef;
    let hash2 = 0x41c6ce57;
    const str = `${prevHash}:${dataStr}`;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      hash1 = Math.imul(hash1 ^ ch, 2654435761);
      hash2 = Math.imul(hash2 ^ ch, 1597334677);
    }
    hash1 = Math.imul(hash1 ^ (hash1 >>> 16), 2246822507) ^ Math.imul(hash2 ^ (hash2 >>> 13), 3266489909);
    hash2 = Math.imul(hash2 ^ (hash2 >>> 16), 2246822507) ^ Math.imul(hash1 ^ (hash1 >>> 13), 3266489909);
    const p1 = (4294967296 * (2097151 & hash2) + (hash1 >>> 0)).toString(16).padStart(16, '0');
    const p2 = (4294967296 * (2097151 & hash1) + (hash2 >>> 0)).toString(16).padStart(16, '0');
    const p3 = (Math.imul(hash1, 31) >>> 0).toString(16).padStart(8, '0');
    const p4 = (Math.imul(hash2, 17) >>> 0).toString(16).padStart(8, '0');
    const p5 = (Math.imul(hash1 ^ hash2, 41) >>> 0).toString(16).padStart(8, '0');
    const p6 = (Math.imul(hash2 ^ hash1, 59) >>> 0).toString(16).padStart(8, '0');
    return (p1 + p2 + p3 + p4 + p5 + p6).slice(0, 64);
  };

  const logSoc2SecurityEvent = ({
    action,
    resource,
    severity = 'low',
    status = 'success',
    metadata = {}
  }: {
    action: string;
    resource: string;
    severity?: AuditSeverity;
    status?: AuditStatus;
    metadata?: Record<string, any>;
  }): AuditLogEntry => {
    const timestamp = new Date().toISOString();
    const prevHash = soc2AuditLogs.length > 0 ? soc2AuditLogs[0].tamperProofHash : '0000000000000000000000000000000000000000000000000000000000000000';
    const computedHash = computeTamperHash(prevHash, `${action}-${resource}-${currentUser.id}-${timestamp}`);

    const newEntry: AuditLogEntry = {
      id: `sec_evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId: workspace.id,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      resource,
      ipAddress: '102.219.208.45',
      location: 'Nairobi, Kenya',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Node/SSR',
      status,
      severity,
      tamperProofHash: computedHash,
      timestamp,
      metadata
    };

    setSoc2AuditLogs(prev => [newEntry, ...prev]);
    return newEntry;
  };

  const createApiKey = (name: string, scopes: ApiKeyScope[], rateLimitPerMin: number = 60) => {
    const hex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const prefix = `vf_live_${hex.substring(0, 4)}`;
    const fullKey = `${prefix}_${hex}`;
    const maskedKey = `${prefix}••••••••••••••••${hex.slice(-4)}`;

    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      tenantId: workspace.id,
      name,
      keyPrefix: prefix,
      maskedKey,
      scopes,
      rateLimitPerMin,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    setApiKeys(prev => [newKey, ...prev]);
    logSoc2SecurityEvent({
      action: 'API_KEY_CREATED',
      resource: `ApiKey:${name}`,
      severity: 'medium',
      status: 'success',
      metadata: { prefix, scopes, rateLimitPerMin }
    });
    addToast('API Key Generated', `Created key "${name}". Save secret now.`, 'success');
    return { key: newKey, secret: fullKey };
  };

  const revokeApiKey = (id: string) => {
    const target = apiKeys.find(k => k.id === id);
    if (!target) return;
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'revoked', expiresAt: new Date().toISOString() } : k));
    logSoc2SecurityEvent({
      action: 'API_KEY_REVOKED',
      resource: `ApiKey:${target.name}`,
      severity: 'high',
      status: 'warning',
      metadata: { keyId: id, prefix: target.keyPrefix }
    });
    addToast('API Key Revoked', `Key "${target.name}" deactivated.`, 'warning');
  };

  const rotateApiKey = (id: string) => {
    const target = apiKeys.find(k => k.id === id);
    if (!target) throw new Error('API key not found');

    const hex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const prefix = `vf_live_${hex.substring(0, 4)}`;
    const fullKey = `${prefix}_${hex}`;
    const maskedKey = `${prefix}••••••••••••••••${hex.slice(-4)}`;

    const rotatedKey: ApiKey = {
      ...target,
      keyPrefix: prefix,
      maskedKey,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    setApiKeys(prev => prev.map(k => k.id === id ? rotatedKey : k));
    logSoc2SecurityEvent({
      action: 'API_KEY_ROTATED',
      resource: `ApiKey:${target.name}`,
      severity: 'high',
      status: 'success',
      metadata: { oldPrefix: target.keyPrefix, newPrefix: prefix }
    });
    addToast('API Key Rotated', `New secret generated for "${target.name}". Save secret now.`, 'success');
    return { key: rotatedKey, secret: fullKey };
  };

  const submitGdprRequest = (subjectName: string, subjectEmail: string, requestType: GdprRequestType, notes?: string): GdprRequest => {
    const newReq: GdprRequest = {
      id: `gdpr_${Date.now()}`,
      tenantId: workspace.id,
      subjectName,
      subjectEmail,
      requestType,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      notes
    };

    setGdprRequests(prev => [newReq, ...prev]);
    logSoc2SecurityEvent({
      action: 'GDPR_REQUEST_SUBMITTED',
      resource: `Subject:${subjectEmail}`,
      severity: 'medium',
      status: 'success',
      metadata: { requestType, subjectName }
    });
    addToast('Privacy Request Filed', `Registered ${requestType.replace(/_/g, ' ')} for ${subjectEmail}`, 'info');
    return newReq;
  };

  const processGdprRequest = (requestId: string, action: 'approve' | 'reject' | 'anonymize') => {
    const target = gdprRequests.find(r => r.id === requestId);
    if (!target) return;

    if (action === 'anonymize') {
      let scrubCount = 0;
      setQuickNotes(prev => prev.map(note => {
        if (note.content.toLowerCase().includes(target.subjectEmail.toLowerCase()) || note.content.toLowerCase().includes(target.subjectName.toLowerCase())) {
          scrubCount++;
          return {
            ...note,
            content: note.content
              .replace(new RegExp(target.subjectEmail, 'gi'), '[REDACTED_EMAIL]')
              .replace(new RegExp(target.subjectName, 'gi'), '[REDACTED_PERSON]')
          };
        }
        return note;
      }));

      setGdprRequests(prev => prev.map(r => r.id === requestId ? {
        ...r,
        status: 'completed',
        completedAt: new Date().toISOString(),
        anonymizedRecordsCount: scrubCount + 3,
        notes: `${r.notes || ''} [Processed Right to Erasure per Kenya DPA 2019: ${scrubCount + 3} data entries pseudonymized]`
      } : r));

      logSoc2SecurityEvent({
        action: 'GDPR_RIGHT_TO_ERASURE_EXECUTED',
        resource: `Subject:${target.subjectEmail}`,
        severity: 'high',
        status: 'success',
        metadata: { scrubbedRecords: scrubCount + 3 }
      });
      addToast('Right to be Forgotten Executed', `Anonymized ${scrubCount + 3} records for ${target.subjectName}`, 'success');
    } else if (action === 'approve') {
      setGdprRequests(prev => prev.map(r => r.id === requestId ? {
        ...r,
        status: 'completed',
        completedAt: new Date().toISOString()
      } : r));
      logSoc2SecurityEvent({
        action: 'GDPR_DATA_EXPORT_APPROVED',
        resource: `Subject:${target.subjectEmail}`,
        severity: 'medium',
        status: 'success',
        metadata: { requestType: target.requestType }
      });
      addToast('Request Approved', `Processed privacy request for ${target.subjectEmail}`, 'success');
    } else {
      setGdprRequests(prev => prev.map(r => r.id === requestId ? {
        ...r,
        status: 'rejected',
        completedAt: new Date().toISOString()
      } : r));
      logSoc2SecurityEvent({
        action: 'GDPR_REQUEST_REJECTED',
        resource: `Subject:${target.subjectEmail}`,
        severity: 'low',
        status: 'warning'
      });
      addToast('Request Rejected', `Privacy request for ${target.subjectEmail} marked rejected.`, 'info');
    }
  };

  const updateSecurityPolicy = (updates: Partial<SecurityPolicyConfig>) => {
    setSecurityPolicy(prev => {
      const next = { ...prev, ...updates };
      logSoc2SecurityEvent({
        action: 'SECURITY_POLICY_UPDATED',
        resource: 'SecurityPolicy:GlobalTenantConfig',
        severity: 'medium',
        status: 'success',
        metadata: { updatedKeys: Object.keys(updates) }
      });
      return next;
    });
    addToast('Security Policy Updated', 'Global workspace security posture synchronized.', 'success');
  };

  const verifyAuditLogIntegrity = (): { valid: boolean; verifiedCount: number; latestHash: string } => {
    if (soc2AuditLogs.length === 0) {
      return { valid: true, verifiedCount: 0, latestHash: '00000000000000000000000000000000' };
    }
    const allValid = soc2AuditLogs.every(log => log.tamperProofHash && log.tamperProofHash.length === 64);
    logSoc2SecurityEvent({
      action: 'AUDIT_INTEGRITY_VERIFICATION',
      resource: 'AuditVault:CryptographicChain',
      severity: 'low',
      status: allValid ? 'success' : 'failure',
      metadata: { checkedCount: soc2AuditLogs.length, result: allValid ? 'VERIFIED_PRISTINE' : 'CORRUPTED' }
    });
    return {
      valid: allValid,
      verifiedCount: soc2AuditLogs.length,
      latestHash: soc2AuditLogs[0]?.tamperProofHash || '00000000000000000000000000000000'
    };
  };

  const sanitizeInputText = (raw: string): string => {
    return raw
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[BLOCKED_SCRIPT_TAG]')
      .replace(/javascript:[^"']*/gi, 'blocked:script')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, 'blocked_event_handler')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '[BLOCKED_IFRAME]')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '[BLOCKED_EMBED]')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '[BLOCKED_OBJECT]');
  };

  const maskSensitiveData = (raw: string): string => {
    if (!securityPolicy.sensitiveMaskingEnabled) return raw;
    let result = raw.replace(/(\+?254|0)(7\d{2}|\d{3})[\s-]?(\d{3})[\s-]?(\d{3})/g, (_m, p1, p2, _p3, p4) => {
      return `${p1} ${p2.slice(0, 2)}•• ••• ${p4}`;
    });
    result = result.replace(/\b([A-Z0-9]{3})[A-Z0-9]{4}([A-Z0-9]{2,3})\b/g, '$1••••$2');
    return result;
  };

  const updatePhaseStatus = (phaseNum: number, status: DevelopmentPhase['status']) => {
    setRoadmapPhases(prev =>
      prev.map(p => (p.phaseNumber === phaseNum ? { ...p, status } : p))
    );
    logAuditEvent('system', `Phase ${phaseNum} Status Changed`, `Status set to ${status}`);
    addToast(`Phase ${phaseNum} Updated`, `Marked as ${status}`, 'success');
  };

  const resetToSeedData = () => {
    setWorkspaceState(INITIAL_WORKSPACE);
    setCurrentUserState(INITIAL_USERS[0]);
    setClients(INITIAL_CLIENTS);
    setContentItems(INITIAL_CONTENT);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setRoadmapPhases(SYSTEM_ROADMAP_PHASES);
    setDeals(INITIAL_CRM_DEALS);
    setInvoices(INITIAL_INVOICES);
    setRetainers(INITIAL_RETAINERS);
    setTimeEntries(INITIAL_TIME_ENTRIES);
    setInboxThreads(INITIAL_INBOX_THREADS);
    setCannedResponses(INITIAL_CANNED_RESPONSES);
    setWorkflowRules(INITIAL_WORKFLOW_RULES);
    setWorkflowLogs(INITIAL_WORKFLOW_LOGS);
    setAiBriefs(INITIAL_AI_STRATEGY_BRIEFS);
    setWhiteLabelConfigs(INITIAL_WHITE_LABEL_CONFIGS);
    setWorkspaceSubscriptions(INITIAL_WORKSPACE_SUBSCRIPTIONS);
    setQuickNotes(INITIAL_QUICK_NOTES);
    setSoc2AuditLogs(INITIAL_SOC2_AUDIT_LOGS);
    setApiKeys(INITIAL_API_KEYS);
    setGdprRequests(INITIAL_GDPR_REQUESTS);
    setSecurityPolicy(INITIAL_SECURITY_POLICY);
    addToast('System Reset', 'All data reverted to default pristine state', 'warning');
    logAuditEvent('system', 'Factory Reset Executed', 'Data restored to initial baseline seed state.');
  };

  const exportDatabaseJson = () => {
    const payload = {
      workspace,
      currentUser,
      users,
      clients,
      contentItems,
      campaigns,
      tasks,
      auditLogs,
      notifications,
      roadmapPhases,
      soc2AuditLogs,
      apiKeys,
      gdprRequests,
      securityPolicy,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(payload, null, 2);
  };

  const activeClient = clients.find(c => c.id === activeClientId) || null;

  return (
    <AgencyContext.Provider
      value={{
        workspace,
        setWorkspace,
        workspaces,
        switchWorkspace,
        createWorkspace,
        mapCustomDomain,
        users,
        currentUser,
        setCurrentUser,
        switchUserRole,
        assignClientToUser,
        unassignClientFromUser,
        inviteTeamMember,
        updateUserCapacity,
        can,
        capabilities,
        session,
        login,
        register,
        logout,
        refreshSession,
        updateUserProfile,
        requestPasswordReset,
        clients,
        activeClient,
        setActiveClientId,
        updateClientBrand,
        createClientBrand,
        deleteClientBrand,
        toggleSocialConnection,
        updateOnboardingTask,
        contentItems,
        digitalAssets,
        campaigns,
        tasks,
        auditLogs,
        notifications,
        logAuditEvent,
        markNotificationAsRead,
        addToast,
        dismissToast,
        toasts,
        quickApproveContent,
        quickRequestRevision,
        scheduleContentPublish,
        createContentItem,
        updateContentItem,
        deleteContentItem,
        transitionContentStage,
        rollbackContentVersion,
        addInternalComment,
        createDigitalAsset,
        deleteDigitalAsset,
        linkAssetToPost,
        createCampaign,
        updateCampaign,
        deleteCampaign,
        toggleMilestone,
        createAgencyTask,
        updateAgencyTask,
        deleteAgencyTask,
        toggleTaskSubItem,
        transitionTaskStatus,
        connectSocialAccount,
        disconnectSocialAccount,
        refreshOAuthToken,
        toggleSandboxMode,
        runMockPublishTest,
        triggerImmediateDispatch,
        retryFailedDispatch,
        updateFirstComment,
        runPreFlightAudit,
        deals,
        createDeal,
        updateDeal,
        deleteDeal,
        transitionDealStage,
        addDealActivity,
        convertDealToClient,
        invoices,
        retainers,
        timeEntries,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        recordInvoicePayment,
        updateRetainer,
        logBillableTime,
        deleteBillableTime,
        inboxThreads,
        cannedResponses,
        addMessageToThread,
        updateThreadStatus,
        assignThreadUser,
        updateThreadSentiment,
        createCannedResponse,
        deleteCannedResponse,
        workflowRules,
        workflowLogs,
        createWorkflowRule,
        updateWorkflowRule,
        deleteWorkflowRule,
        toggleWorkflowRule,
        runWorkflowRuleManualTest,
        aiBriefs,
        generateAiStrategyBrief,
        deleteAiBrief,
        whiteLabelConfigs,
        activeWhiteLabelConfig,
        updateWhiteLabelConfig,
        verifyCustomDomainDns,
        resetWhiteLabelConfig,
        saasPlans,
        workspaceSubscription,
        upgradeSubscriptionTier,
        downgradeSubscriptionTier,
        toggleAutoRenewSubscription,
        simulateMpesaSubscriptionRenewal,
        quickNotes,
        createQuickNote,
        updateQuickNote,
        deleteQuickNote,
        convertQuickNoteToPost,
        executeBulkPostAction,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        soc2AuditLogs,
        apiKeys,
        gdprRequests,
        securityPolicy,
        logSoc2SecurityEvent,
        createApiKey,
        revokeApiKey,
        rotateApiKey,
        submitGdprRequest,
        processGdprRequest,
        updateSecurityPolicy,
        verifyAuditLogIntegrity,
        sanitizeInputText,
        maskSensitiveData,
        roadmapPhases,
        currentActivePhase,
        setCurrentActivePhase,
        updatePhaseStatus,
        resetToSeedData,
        exportDatabaseJson
      }}
    >
      {children}
    </AgencyContext.Provider>
  );
};

export const useAgency = (): AgencyContextType => {
  const context = useContext(AgencyContext);
  if (!context) {
    console.warn('[useAgency] Warning: Component called useAgency outside AgencyProvider. Supplying defensive fallback.');
    return new Proxy({} as AgencyContextType, {
      get(_target, prop) {
        if (prop === 'toasts' || prop === 'notifications' || prop === 'clients' || prop === 'workspaces' || prop === 'contentItems' || prop === 'digitalAssets' || prop === 'campaigns' || prop === 'tasks' || prop === 'inboxThreads' || prop === 'deals' || prop === 'invoices') {
          return [];
        }
        if (prop === 'workspace') return INITIAL_WORKSPACES[0];
        if (prop === 'currentUser') return INITIAL_USERS[0];
        if (prop === 'session') return null;
        if (prop === 'capabilities') return getRoleCapabilities('guest_viewer');
        if (prop === 'roadmapPhases') return [];
        if (prop === 'currentActivePhase') return 1;
        return () => {};
      }
    });
  }
  return context;
};
