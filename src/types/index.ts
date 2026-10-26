/**
 * PulseBrand Agency OS - Foundational Type Definitions
 * Phase 01: Foundation
 */

export type Role =
  | 'super_admin'
  | 'agency_owner'
  | 'account_manager'
  | 'content_creator'
  | 'client_approver'
  | 'freelance_contributor'
  | 'guest_viewer';

export type Permission =
  // Workspace & Tenancy
  | 'workspace:manage'
  | 'workspace:view_billing'
  | 'workspace:invite_members'
  | 'workspace:switch'
  // Client Management
  | 'client:create'
  | 'client:edit'
  | 'client:delete'
  | 'client:view_all'
  // Content Lifecycle
  | 'content:create'
  | 'content:edit_own'
  | 'content:edit_all'
  | 'content:submit_review'
  | 'content:internal_approve'
  | 'content:client_signoff'
  | 'content:schedule_publish'
  | 'content:delete'
  // Financials & Retainers
  | 'financials:view_retainers'
  | 'financials:manage_invoicing'
  // Analytics & Audit
  | 'analytics:view_client'
  | 'analytics:view_agency'
  | 'audit:view_trail';

export interface RoleCapabilities {
  canManageWorkspaces: boolean;
  canManageBilling: boolean;
  canInviteMembers: boolean;
  canCreateClients: boolean;
  canEditClientProfiles: boolean;
  canDraftContent: boolean;
  canSubmitInternalReview: boolean;
  canSubmitForClientReview: boolean;
  canApproveAsClient: boolean;
  canPublishDirectly: boolean;
  canViewFinancials: boolean;
  canAccessAuditLogs: boolean;
  isClientRestrictedView: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  tenantId: string;
  assignedClientIds: string[];
  createdAt: string;
  // Auth & Security fields (Phase 03)
  mfaEnabled?: boolean;
  mfaSecret?: string;
  lastLoginAt?: string;
  emailVerified?: boolean;
  jobTitle?: string;
  phoneNumber?: string;
  // Phase 09: Team & Capacity Allocation fields
  skills?: string[];
  maxWeeklyCapacityHours?: number;
  currentAllocatedHours?: number;
  locationCity?: string;
  availabilityStatus?: 'available' | 'busy' | 'on_leave';
}

export type AuthProviderType = 'email_password' | 'google' | 'magic_link' | 'sso_saml';

export interface AuthSession {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
  provider: AuthProviderType;
  ipAddress?: string;
  deviceInfo?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  provider: AuthProviderType;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  role: Role;
  agencyName?: string;
  agencySlug?: string;
}

export interface TenantWorkspace {
  id: string;
  name: string;
  slug: string;
  tier: 'freelancer' | 'boutique' | 'enterprise';
  logoUrl?: string;
  customDomain?: string;
  timezone: string;
  currency: string;
  city?: string;
  country?: string;
  supportEmail?: string;
  billingProvider?: 'mpesa_daraja' | 'stripe' | 'pesapal';
  createdAt: string;
  memberCount: number;
  clientCount: number;
}

export type SocialPlatform = 'instagram' | 'linkedin' | 'twitter' | 'tiktok' | 'facebook' | 'youtube';

export type OAuthTokenHealth = 'healthy' | 'expiring_soon' | 'expired' | 'revoked' | 'sandbox_active';

export interface SocialOAuthPermissions {
  publishContent: boolean;
  readInsights: boolean;
  managePages: boolean;
  directMessages: boolean;
}

export interface SocialAccount {
  id: string;
  clientId?: string;
  platform: SocialPlatform;
  handle: string;
  accountName: string;
  connected: boolean;
  followerCount: number;
  avatarUrl?: string;
  lastSyncedAt?: string;
  // Phase 17: Social Account Connections & OAuth Tokens
  tokenHealth?: OAuthTokenHealth;
  tokenExpiresAt?: string; // ISO date string
  scopesGranted?: string[];
  permissions?: SocialOAuthPermissions;
  sandboxMode?: boolean; // Mock publishing testing mode
  apiEndpointRegion?: string;
  reAuthRequired?: boolean;
}

export interface BrandGuidelineDetails {
  primaryFont?: string;
  secondaryFont?: string;
  colorPalette?: { name: string; hex: string }[];
  dos: string[];
  donts: string[];
  targetAudience?: string;
  keyHashtags?: string[];
}

export interface ClientContact {
  name: string;
  email: string;
  phone?: string;
  roleTitle: string;
  isPrimarySignoff: boolean;
}

export interface OnboardingChecklist {
  ndaSigned: boolean;
  retainerContractSigned: boolean;
  brandAssetsReceived: boolean;
  socialAccessGranted: boolean;
  primaryApproverConfirmed: boolean;
  kickoffCompleted: boolean;
}

export interface ClientBrand {
  id: string;
  tenantId: string;
  name: string;
  industry: string;
  website: string;
  accentColor: string;
  logoUrl?: string;
  status: 'active' | 'onboarding' | 'paused' | 'churned';
  toneOfVoice: string[];
  brandGuidelinesSummary: string;
  guidelineDetails?: BrandGuidelineDetails;
  contacts?: ClientContact[];
  onboardingChecklist?: OnboardingChecklist;
  onboardingProgress?: number;
  assignedManagerId: string;
  socialAccounts: SocialAccount[];
  retainerMonthlyValue: number;
  monthlyPostQuota: number;
  currentMonthPublishedCount: number;
  pendingApprovalCount: number;
  createdAt: string;
}

export type ContentStage =
  | 'draft'
  | 'internal_review'
  | 'client_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'revision_requested';

export type PostFormat = 'single_image' | 'carousel' | 'video_reel' | 'thread' | 'story' | 'short';

export interface ContentApprovalLog {
  id: string;
  contentId: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: 'submitted' | 'approved' | 'rejected' | 'commented' | 'revised';
  notes?: string;
  timestamp: string;
}

export interface ContentVersion {
  versionNumber: number;
  caption: string;
  title: string;
  modifiedBy: string;
  modifiedByName: string;
  timestamp: string;
  changeSummary?: string;
}

export interface InternalComment {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  comment: string;
  timestamp: string;
}

export type DispatchStatus = 'queued' | 'dispatching' | 'published' | 'failed' | 'retrying';

export interface PreFlightValidation {
  aspectRatioValid: boolean;
  aspectRatioNote?: string;
  videoDurationSeconds?: number;
  videoDurationValid?: boolean;
  captionLengthValid: boolean;
  captionLengthNote?: string;
  hasRequiredHashtags: boolean;
  mediaEncodingValid: boolean;
  passedAll: boolean;
}

export interface ContentItem {
  id: string;
  tenantId: string;
  clientId: string;
  campaignId?: string;
  creatorId: string;
  title: string;
  caption: string;
  platforms: SocialPlatform[];
  format: PostFormat;
  stage: ContentStage;
  mediaUrls: string[];
  scheduledDate?: string;
  publishedDate?: string;
  tags: string[];
  approvalHistory: ContentApprovalLog[];
  versions?: ContentVersion[];
  internalComments?: InternalComment[];
  feedbackNotes?: string;
  metrics?: {
    impressions?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    clicks?: number;
  };
  createdAt: string;
  updatedAt: string;
  // Phase 18: Publishing & Scheduling Engine
  dispatchStatus?: DispatchStatus;
  retryCount?: number;
  maxRetries?: number;
  lastDispatchAttempt?: string;
  dispatchErrorNote?: string;
  firstCommentText?: string; // Automated first-comment publishing (hashtags)
  targetTimezone?: string; // Timezone-aware dispatch (defaults to 'Africa/Nairobi' EAT)
  preFlightCheck?: PreFlightValidation;
}

export interface DigitalAsset {
  id: string;
  tenantId: string;
  clientId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  category: 'photography' | 'logo' | 'vector_icon' | 'video' | 'guideline_doc' | 'typography';
  fileFormat: string; // e.g. 'PNG', 'JPG', 'MP4', 'SVG', 'PDF'
  fileSizeBytes: number;
  dimensions?: {
    width: number;
    height: number;
  };
  aspectRatio: '1:1' | '4:5' | '16:9' | '9:16' | 'free';
  tags: string[];
  usageCount: number;
  linkedPostIds?: string[];
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
}

export interface CampaignMilestone {
  id: string;
  title: string;
  targetDate: string;
  completed: boolean;
  assignedRole?: string;
}

export interface CampaignKPI {
  metric: string;
  target: number;
  current: number;
  unit: string;
}

export interface Campaign {
  id: string;
  tenantId: string;
  clientId: string;
  name: string;
  objective: 'brand_awareness' | 'lead_generation' | 'product_launch' | 'event_promo' | 'community_growth';
  startDate: string;
  endDate: string;
  budgetAllocated: number; // in KES
  budgetSpent: number; // in KES
  status: 'planning' | 'in_progress' | 'completed' | 'paused';
  targetPostCount: number;
  publishedPostCount: number;
  description?: string;
  kpis?: CampaignKPI[];
  milestones?: CampaignMilestone[];
  targetAudience?: string;
  primaryHashtag?: string;
}

export interface TaskSubItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface AgencyTask {
  id: string;
  tenantId: string;
  clientId: string;
  campaignId?: string;
  assignedToUserId: string;
  assignedToUserName?: string;
  assignedToUserRole?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  dueDate: string;
  contentId?: string;
  checklist?: TaskSubItem[];
  estimatedHours?: number;
  actualHours?: number;
  dependencies?: string[]; // IDs of predecessor tasks
  category?: 'creative_production' | 'copywriting' | 'client_approval' | 'ad_ops' | 'strategy';
}

export interface AuditEvent {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  category: 'auth' | 'content' | 'client' | 'approval' | 'system' | 'billing';
  action: string;
  targetId?: string;
  details: string;
  timestamp: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  link?: string;
}

export type DevelopmentPhaseCategory =
  | 'Core Architecture'
  | 'Identity & Access'
  | 'Client Operations'
  | 'Content Lifecycle'
  | 'Execution & Delivery'
  | 'Business & CRM'
  | 'Intelligence & Scale'
  | 'Hardening & Launch';

export interface DevelopmentPhase {
  phaseNumber: number;
  title: string;
  category: DevelopmentPhaseCategory;
  summary: string;
  status: 'planned' | 'in_progress' | 'completed';
  completionDate?: string;
  keyDeliverables: string[];
}

// Phase 19: Analytics & Performance Reporting
export interface PlatformMetricSummary {
  platform: SocialPlatform;
  totalFollowers: number;
  followerGrowth: number;
  impressions: number;
  reach: number;
  engagements: number;
  clicks: number;
  engagementRate: number;
  postCount: number;
}

export interface DailyAnalyticsDataPoint {
  date: string;
  impressions: number;
  reach: number;
  engagements: number;
  clicks: number;
}

export interface ClientReportConfig {
  id: string;
  tenantId: string;
  clientId: string;
  title: string;
  dateRange: 'last_7_days' | 'last_30_days' | 'last_90_days' | 'quarter_to_date' | 'custom';
  startDate?: string;
  endDate?: string;
  includeTopPosts: boolean;
  includePlatformBreakdown: boolean;
  includeAudienceGrowth: boolean;
  includeRecommendations: boolean;
  whiteLabelBranding: boolean;
  customLogoUrl?: string;
  executiveSummaryNotes?: string;
  automatedCadence?: 'weekly' | 'monthly' | 'disabled';
  recipientEmails?: string[];
  lastGeneratedAt?: string;
}

// Phase 20: Agency CRM & Leads Pipeline
export type DealStage = 'lead' | 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface DealActivity {
  id: string;
  dealId: string;
  timestamp: string;
  authorId: string;
  authorName: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'proposal_sent' | 'stage_changed';
  notes: string;
}

export interface CrmDeal {
  id: string;
  tenantId: string;
  companyName: string;
  industry: string;
  website?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  contactTitle?: string;
  dealValueMonthly: number; // in KES or local currency
  contractMonths: number; // e.g. 6 or 12 months
  stage: DealStage;
  probabilityPercent: number; // 0 - 100
  assignedUserId: string;
  assignedUserName?: string;
  pitchDeckUrl?: string;
  proposalSentDate?: string;
  expectedCloseDate: string;
  notes?: string;
  activities?: DealActivity[];
  lossReason?: string;
  convertedClientId?: string;
  createdAt: string;
  updatedAt: string;
}

// Phase 21: Billing, Retainers & Invoicing
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type PaymentGateway = 'stripe' | 'mpesa' | 'mpesa_daraja' | 'bank_transfer' | 'card' | 'cash';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface AgencyInvoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-0042"
  tenantId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  currency: 'KES' | 'USD' | 'EUR' | 'GBP';
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRatePercent: number; // e.g. 16% for VAT
  taxAmount: number;
  discountAmount?: number;
  totalAmount: number;
  status: InvoiceStatus;
  notes?: string;
  paymentMethod?: PaymentGateway;
  paidAt?: string;
  transactionReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RetainerPlan {
  id: string;
  tenantId: string;
  clientId: string;
  clientName: string;
  tierName: string; // e.g. "Growth Retainer", "Enterprise Presence"
  monthlyFee: number;
  currency: 'KES' | 'USD' | 'EUR' | 'GBP';
  allocatedHours: number;
  usedHours: number;
  hourlyOverageRate: number;
  billingCycleDay: number; // e.g. 1st of every month
  deliverableQuota: {
    postsPerMonth: number;
    reelsPerMonth: number;
    paidAdsCampaigns: number;
    strategyCalls: number;
  };
  status: 'active' | 'warning' | 'exhausted' | 'paused';
  periodStart: string;
  periodEnd: string;
}

export interface BillableTimeEntry {
  id: string;
  tenantId: string;
  clientId: string;
  retainerId?: string;
  userId: string;
  userName: string;
  date: string;
  durationMinutes: number;
  category: 'content_creation' | 'community_management' | 'strategy_review' | 'analytics_reporting' | 'paid_ads' | 'video_editing';
  description: string;
  isBillable: boolean;
  hourlyRate: number;
  invoiced: boolean;
  createdAt: string;
}

// Phase 22: Unified Communication & Inbox
export type InboxThreadType = 'comment' | 'direct_message' | 'mention' | 'review_feedback';
export type MessageSentiment = 'positive' | 'neutral' | 'negative' | 'urgent';
export type ThreadStatus = 'open' | 'pending' | 'resolved' | 'archived';

export interface InboxMessage {
  id: string;
  threadId: string;
  senderType: 'customer' | 'agent' | 'internal_team' | 'system';
  senderName: string;
  senderHandle?: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  attachments?: string[];
  isInternalNote?: boolean;
  mentions?: string[];
}

export interface InboxThread {
  id: string;
  tenantId: string;
  clientId: string;
  platform: SocialPlatform;
  type: InboxThreadType;
  externalPostId?: string;
  externalPostTitle?: string;
  customerName: string;
  customerHandle: string;
  customerAvatar?: string;
  sentiment: MessageSentiment;
  status: ThreadStatus;
  assignedUserId?: string;
  assignedUserName?: string;
  messages: InboxMessage[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CannedResponse {
  id: string;
  tenantId: string;
  title: string;
  category: string;
  content: string;
  shortcut: string;
}

// Phase 23: Workflow Automation
export type WorkflowTriggerType =
  | 'post_created'
  | 'approval_delayed'
  | 'client_approved'
  | 'urgent_inbox_message'
  | 'deal_won'
  | 'retainer_warning';

export type WorkflowConditionOperator = 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'in';

export interface WorkflowCondition {
  id: string;
  field: 'platform' | 'clientId' | 'pendingHours' | 'sentiment' | 'dealValue' | 'captionText';
  operator: WorkflowConditionOperator;
  value: string | number;
}

export type WorkflowActionType =
  | 'send_slack_webhook'
  | 'send_email_reminder'
  | 'auto_tag_post'
  | 'assign_team_member'
  | 'create_agency_task'
  | 'escalate_inbox_ticket';

export interface WorkflowAction {
  id: string;
  type: WorkflowActionType;
  parameters: {
    webhookUrl?: string;
    channelName?: string;
    recipientEmail?: string;
    messageTemplate?: string;
    tagsToApply?: string[];
    assigneeUserId?: string;
    taskPriority?: 'low' | 'medium' | 'high' | 'urgent';
  };
}

export interface WorkflowRule {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: WorkflowTriggerType;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  executionCount: number;
  lastExecutedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecutionLog {
  id: string;
  tenantId: string;
  ruleId: string;
  ruleName: string;
  trigger: WorkflowTriggerType;
  targetEntityName: string;
  status: 'success' | 'failed' | 'skipped';
  details: string;
  timestamp: string;
}

// Phase 24: AI Content & Strategy Engine
export type AiContentGoal = 'engagement' | 'lead_generation' | 'educational' | 'brand_awareness' | 'direct_sales';
export type AiToneStyle = 'professional_authoritative' | 'conversational_relatable' | 'bold_provocative' | 'inspiring_storytelling' | 'playful_witty';

export interface AiGeneratedCaption {
  id: string;
  hook: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  characterCount: number;
  predictedEngagementScore: number;
  reasoning: string;
}

export interface AiCompetitorAngle {
  id: string;
  competitorName: string;
  theirApproach: string;
  contentGap: string;
  recommendedAngle: string;
  sampleHook: string;
}

export interface AiStrategyBrief {
  id: string;
  tenantId: string;
  clientId: string;
  platform: SocialPlatform;
  topic: string;
  targetAudience: string;
  goal: AiContentGoal;
  tone: AiToneStyle;
  captions: AiGeneratedCaption[];
  competitorAngles: AiCompetitorAngle[];
  createdAt: string;
}

// Phase 25: White-Label Customization
export interface DnsVerificationRecord {
  type: 'CNAME' | 'TXT' | 'A';
  host: string;
  targetValue: string;
  status: 'verified' | 'pending' | 'failed';
  ttl: number;
  lastCheckedAt?: string;
}

export interface WhiteLabelConfig {
  workspaceId: string;
  agencyBrandName: string;
  agencyTagline: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string; // e.g. '#6366f1'
  accentColor: string;  // e.g. '#10b981'
  customDomain: string; // e.g. 'portal.apexmedia.co.ke'
  domainStatus: 'active' | 'pending_verification' | 'unconfigured' | 'failed';
  sslStatus: 'active' | 'issuing' | 'expired' | 'unconfigured';
  dnsRecords: DnsVerificationRecord[];
  supportEmail: string;
  emailSenderName: string;
  emailSignatureMarkdown: string;
  removePlatformBranding: boolean; // "Powered by Versaly Flow" removal
  clientPortalWelcomeMessage: string;
  enableCustomCss: boolean;
  customCssSnippet?: string;
  updatedAt: string;
}

// Phase 26: SaaS Subscription & Tier Management
export type SubscriptionTierId = 'freelancer' | 'boutique' | 'enterprise';
export type BillingInterval = 'monthly' | 'annual';

export interface TierFeatureQuota {
  maxClients: number; // -1 for unlimited
  maxTeamSeats: number; // -1 for unlimited
  maxMonthlyPosts: number;
  maxAiTokens: number;
  allowWhiteLabel: boolean;
  allowCustomDomain: boolean;
  allowWorkflowsAutomation: boolean;
  allowDedicatedManager: boolean;
  allowSlaGuarantees: boolean;
}

export interface SubscriptionPlan {
  id: SubscriptionTierId;
  name: string;
  badge?: string;
  description: string;
  monthlyPriceKes: number;
  annualPriceKesMonthlyEquivalent: number;
  monthlyPriceUsd: number;
  quotas: TierFeatureQuota;
  features: string[];
}

export interface WorkspaceSubscription {
  workspaceId: string;
  currentTier: SubscriptionTierId;
  billingInterval: BillingInterval;
  status: 'active' | 'past_due' | 'trialing' | 'cancelled';
  paymentMethod: PaymentGateway;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  autoRenew: boolean;
  usageMetrics: {
    clientCount: number;
    teamSeatCount: number;
    postsScheduledThisMonth: number;
    aiTokensUsedThisMonth: number;
    storageUsedMb: number;
  };
  cancellationScheduledForEnd?: boolean;
  lastPaymentRef?: string;
  lastPaymentAmountKes?: number;
}

// Phase 27: Productivity & Quick Actions
export interface QuickDraftNote {
  id: string;
  tenantId: string;
  title: string;
  content: string;
  tags: string[];
  targetClientId?: string;
  color?: 'amber' | 'emerald' | 'indigo' | 'rose' | 'slate';
  createdAt: string;
  updatedAt: string;
}

export interface BulkActionPayload {
  postIds: string[];
  stage?: ContentStage;
  rescheduleOffsetDays?: number;
  addTags?: string[];
  markFeedbackNote?: string;
}

// Phase 28: Security Hardening & Data Protection
export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AuditStatus = 'success' | 'failure' | 'warning';

export interface AuditLogEntry {
  id: string;
  tenantId: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  resource: string;
  ipAddress: string;
  location?: string;
  userAgent?: string;
  status: AuditStatus;
  severity: AuditSeverity;
  tamperProofHash: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export type ApiKeyScope = 'read' | 'write' | 'admin' | 'webhooks';
export type ApiKeyStatus = 'active' | 'revoked' | 'expired';

export interface ApiKey {
  id: string;
  tenantId: string;
  name: string;
  keyPrefix: string;
  maskedKey: string;
  fullKey?: string;
  scopes: ApiKeyScope[];
  rateLimitPerMin: number;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  status: ApiKeyStatus;
}

export type GdprRequestType = 'export_data' | 'forget_personal_info' | 'rectify_records';
export type GdprRequestStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

export interface GdprRequest {
  id: string;
  tenantId: string;
  subjectEmail: string;
  subjectName: string;
  requestType: GdprRequestType;
  status: GdprRequestStatus;
  requestedAt: string;
  completedAt?: string;
  anonymizedRecordsCount?: number;
  notes?: string;
}

export interface SecurityPolicyConfig {
  twoFactorRequired: boolean;
  sessionTimeoutMinutes: number;
  ipAllowlist: string[];
  strictXssSanitization: boolean;
  sensitiveMaskingEnabled: boolean;
  rateLimitingEnabled: boolean;
  tamperHashVerification: boolean;
}

// Phase 29: Performance Optimization
export interface PerformanceBenchmarkMetrics {
  fps: number;
  renderTimeMs: number;
  domNodesMounted: number;
  totalDatasetSize: number;
  cacheHitRatio: number;
  cacheLookupsCount: number;
  memoryUsageMb: number;
  virtualizationActive: boolean;
  lcpSeconds: number; // Largest Contentful Paint
  fidMs: number; // First Input Delay
  clsScore: number; // Cumulative Layout Shift
}

export interface CacheEntry<T = any> {
  key: string;
  data: T;
  cachedAt: number;
  hits: number;
  sizeBytes: number;
  ttlMs: number;
}

export interface OptimisticMutationLog {
  id: string;
  action: string;
  targetId: string;
  optimisticState: Record<string, any>;
  previousState: Record<string, any>;
  status: 'optimistic' | 'confirmed' | 'rolled_back';
  latencyMs: number;
  timestamp: string;
}

// Phase 30: Automated Testing & Verification
export type TestStatus = 'passed' | 'failed' | 'running' | 'skipped';

export interface TestCaseResult {
  id: string;
  suite: string;
  name: string;
  category: 'Unit' | 'Integration' | 'Security' | 'E2E';
  status: TestStatus;
  durationMs: number;
  assertionCount: number;
  errorMessage?: string;
  details?: string;
}

export interface TestSuiteSummary {
  name: string;
  category: 'Unit' | 'Integration' | 'Security' | 'E2E';
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  status: 'idle' | 'running' | 'passed' | 'failed';
}

export interface E2EJourneyStep {
  stepNumber: number;
  name: string;
  actor: string;
  actorRole: Role;
  status: 'pending' | 'active' | 'completed' | 'failed';
  log: string;
  timestamp?: string;
  outputPayload?: Record<string, any>;
}

// Phase 31: Infrastructure & Cloud Configuration
export type EnvironmentTier = 'development' | 'staging' | 'production';

export type EnvVarCategory = 'core' | 'database' | 'security' | 'integrations' | 'storage' | 'ai';

export type EnvValidationStatus = 'valid' | 'missing' | 'insecure_default' | 'invalid_format';

export interface EnvVarDefinition {
  key: string;
  category: EnvVarCategory;
  required: boolean;
  isSecret: boolean;
  defaultValue?: string;
  currentValue?: string;
  description: string;
  status: EnvValidationStatus;
  validationRule?: string;
  errorMessage?: string;
}

export interface EnvAuditReport {
  environment: EnvironmentTier;
  totalVars: number;
  validCount: number;
  missingCount: number;
  insecureDefaultCount: number;
  safetyScore: number; // 0-100%
  timestamp: string;
  variables: EnvVarDefinition[];
}

export interface ContainerSpec {
  name: string;
  baseImage: string;
  targetPort: number;
  workdir: string;
  nodeVersion: string;
  stages: {
    name: string;
    description: string;
    commands: string[];
  }[];
  healthcheck: {
    testCommand: string;
    interval: string;
    timeout: string;
    retries: number;
    startPeriod: string;
  };
  resourceLimits: {
    cpuLimit: string;
    memoryLimitMb: number;
    cpuReservation: string;
    memoryReservationMb: number;
  };
}

export interface EdgeCacheRule {
  id: string;
  pathPattern: string;
  description: string;
  cacheControl: string;
  browserTtlSeconds: number;
  cdnTtlSeconds: number;
  staleWhileRevalidateSeconds?: number;
  compression: ('gzip' | 'brotli' | 'zstd')[];
  securityHeadersIncluded: boolean;
}

export interface HealthProbeCheck {
  id: string;
  name: string;
  target: string;
  ok: boolean;
  latencyMs: number;
  message?: string;
}

export interface HealthProbeReport {
  endpoint: '/healthz' | '/readyz' | '/livez';
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptimeSeconds: number;
  timestamp: string;
  latencyMs: number;
  checks: HealthProbeCheck[];
  memory: {
    rssMb: number;
    heapTotalMb: number;
    heapUsedMb: number;
    externalMb: number;
  };
}

// Phase 32: System Health & Observability
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  level: LogLevel;
  subsystem: string;
  message: string;
  traceId: string;
  tenantId?: string;
  userId?: string;
  durationMs?: number;
  metadata?: Record<string, any>;
}

export interface DiagnosticIncidentReport {
  incidentId: string;
  timestamp: string;
  errorName: string;
  errorMessage: string;
  componentStack?: string;
  errorStack?: string;
  activeView: string;
  tenantId: string;
  userId: string;
  userRole: string;
  browserContext: {
    userAgent: string;
    viewport: string;
    online: boolean;
    memoryMb?: number;
  };
  recentTelemetry: TelemetryEvent[];
}

export interface RateLimitSentinel {
  id: string;
  serviceName: string;
  category: 'payment' | 'social_network' | 'ai' | 'internal';
  quotaLimit: number;
  quotaUsed: number;
  windowUnit: 'minute' | 'hour' | 'second';
  resetSecondsRemaining: number;
  throttleThreshold: number; // e.g. 0.8 (80%)
  status: 'nominal' | 'warning' | 'throttled';
}

export interface CircuitBreakerState {
  id: string;
  name: string;
  state: 'closed' | 'open' | 'half_open';
  failureCount: number;
  failureThreshold: number;
  recoveryTimeoutSeconds: number;
  lastFailureTime?: string;
  latencyMs: number;
}

export interface NetworkStatusTelemetry {
  online: boolean;
  effectiveType: string;
  rttMs: number;
  downlinkMbps: number;
  lastPingTimestamp: string;
  jitterMs: number;
}

// =============================================================================
// PHASE 33: DOCUMENTATION & KNOWLEDGE BASE TYPES
// =============================================================================

export type SopCategory =
  | 'crisis_management'
  | 'content_publishing'
  | 'client_onboarding'
  | 'paid_media'
  | 'community_management'
  | 'compliance';

export interface SopStep {
  stepNumber: number;
  title: string;
  instruction: string;
  checklist?: string[];
}

export interface AgencySopItem {
  id: string;
  title: string;
  category: SopCategory;
  department: string;
  lastUpdated: string;
  turnaroundSla: string;
  ownerRole: Role;
  summary: string;
  steps: SopStep[];
  escalationPath: string;
  contentMarkdown: string;
  tags: string[];
}

export interface UserGuideArticle {
  id: string;
  title: string;
  targetAudience: Role[] | 'all';
  category: 'getting_started' | 'content_workflow' | 'publishing' | 'billing_financials' | 'automation_ai' | 'administration';
  summary: string;
  readTimeMinutes: number;
  keyFeatures: string[];
  stepByStep: Array<{ heading: string; detail: string }>;
  proTips: string[];
}

export interface ClientApprovalCheatSheet {
  id: string;
  title: string;
  section: 'overview' | 'reviewing_posts' | 'requesting_edits' | 'signoff_audit' | 'faq';
  headline: string;
  keyInstructions: string[];
  slaExpectation: string;
  doAndDont: { do: string[]; dont: string[] };
}

export interface ApiDocEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  title: string;
  category: 'authentication' | 'clients' | 'content' | 'billing' | 'telemetry' | 'webhooks';
  description: string;
  headers: Record<string, string>;
  requestBodySample?: string;
  responseBodySample: string;
  curlSnippet: string;
}

// ==========================================
// PHASE 34: DESIGN POLISH & ACCESSIBILITY TYPES
// ==========================================

export type MotionPreference = 'full' | 'reduced' | 'none';
export type SoundEffectType = 'success' | 'warning' | 'error' | 'click' | 'toggle' | 'badge';
export type ContrastLevel = 'AAA' | 'AA' | 'Fail';

export interface AccessibilityPreferences {
  reducedMotion: boolean;
  soundEnabled: boolean;
  soundVolume: number; // 0.0 to 1.0
  highContrastMode: boolean;
  screenReaderOptimized: boolean;
  fontSizeScale: number; // 0.9, 1.0, 1.1, 1.25
  focusRingEnhanced: boolean;
}

export interface WcagAuditCheck {
  id: string;
  criterion: string;
  level: 'A' | 'AA' | 'AAA';
  title: string;
  description: string;
  status: 'passed' | 'warning' | 'failed';
  score: number;
  recommendation: string;
  category: 'contrast' | 'keyboard' | 'aria' | 'motion' | 'touch';
}

export interface ContrastAuditResult {
  foreground: string;
  background: string;
  ratio: number;
  normalTextPassed: boolean;
  largeTextPassed: boolean;
  level: ContrastLevel;
}

