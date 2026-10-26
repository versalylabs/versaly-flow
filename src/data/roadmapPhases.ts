import { DevelopmentPhase } from '../types';

export const SYSTEM_ROADMAP_PHASES: DevelopmentPhase[] = [
  {
    phaseNumber: 1,
    title: 'Foundation',
    category: 'Core Architecture',
    summary: 'Establish base design system tokens, strict TypeScript schemas, state persistence contracts, and foundational application primitives.',
    status: 'completed',
    keyDeliverables: [
      'Design tokens & dark slate typography hierarchy',
      'Exhaustive TypeScript interfaces for agencies, clients & content',
      'Persistent reactive state storage engine',
      'Foundation status & architecture inspector'
    ]
  },
  {
    phaseNumber: 2,
    title: 'Project Architecture',
    category: 'Core Architecture',
    summary: 'Implement modular folder hierarchy, repository pattern, decoupled service layer, event bus, and clean client-side routing.',
    status: 'completed',
    keyDeliverables: [
      'Layered service abstraction (API, storage, event dispatchers)',
      'Global navigation & module router layout',
      'Event emission pipeline for cross-module sync',
      'Error boundary & defensive fallback trees'
    ]
  },
  {
    phaseNumber: 3,
    title: 'Authentication',
    category: 'Identity & Access',
    summary: 'Multi-provider authentication flows, session persistence, secure credential handling, and password reset workflows.',
    status: 'completed',
    keyDeliverables: [
      'Secure login/registration & guest-mode switchers',
      'Session token lifecycle & auto-refresh',
      'Multi-factor auth placeholders & security flags',
      'User profile management & avatar uploads'
    ]
  },
  {
    phaseNumber: 4,
    title: 'Multi-Tenancy',
    category: 'Identity & Access',
    summary: 'Agency workspace isolation, tenant scoping, fast workspace switching, and isolated data containment per agency.',
    status: 'completed',
    keyDeliverables: [
      'Tenant context provider & scoped data queries',
      'Workspace creation & switcher switcher UI',
      'Agency domain & vanity slug mapping',
      'Tenant data isolation validation tests'
    ]
  },
  {
    phaseNumber: 5,
    title: 'RBAC (Role-Based Access Control)',
    category: 'Identity & Access',
    summary: 'Granular permissions matrix for SuperAdmin, Agency Owner, Account Manager, Creator, Client Approver, and Guest.',
    status: 'completed',
    keyDeliverables: [
      'Strict permission matrix check hooks',
      'Role switcher with live UI capability gating',
      'Read-only client view locks',
      'Sensitive action guardrails'
    ]
  },
  {
    phaseNumber: 6,
    title: 'Executive Dashboard',
    category: 'Core Architecture',
    summary: 'Unified command center with real-time campaign velocity, approval queue counts, client health scores, and SLA clocks.',
    status: 'completed',
    keyDeliverables: [
      'Real-time agency KPI summary cards (ARR, active retainers, posts)',
      'Urgent approval queue quick-action rail',
      'Client health & delivery SLA matrix',
      'Recent activity feed & audit stream'
    ]
  },
  {
    phaseNumber: 7,
    title: 'Client Management',
    category: 'Client Operations',
    summary: 'Centralized client directory, brand guideline repositories, social handle registry, and SLA trackers.',
    status: 'completed',
    keyDeliverables: [
      'Client directory with searchable multi-brand filters',
      'Brand guideline profile (tones, typography, colors, do/don’t)',
      'Social account connections inspector',
      'Client contract & retainer allocation tracker'
    ]
  },
  {
    phaseNumber: 8,
    title: 'Client Onboarding',
    category: 'Client Operations',
    summary: 'Interactive onboarding wizard, asset collection intake forms, brand kit questionnaires, and social access handoffs.',
    status: 'completed',
    keyDeliverables: [
      'Step-by-step agency intake wizard',
      'Brand asset & credential submission forms',
      'Automated onboarding progress checklist',
      'Instant brand workspace generator'
    ]
  },
  {
    phaseNumber: 9,
    title: 'Team & Resource Allocation',
    category: 'Client Operations',
    summary: 'Member rosters, capacity planning, workload distribution, and role-based client assignments.',
    status: 'completed',
    keyDeliverables: [
      'Agency team directory & skill tags',
      'Workload capacity meter per creator/manager',
      'One-click client assignment switcher',
      'Team member invite & invitation links'
    ]
  },
  {
    phaseNumber: 10,
    title: 'Content Creation & Composer',
    category: 'Content Lifecycle',
    summary: 'Multi-network post composer (Instagram, LinkedIn, X, TikTok, Facebook, YouTube) with live device previews & character counters.',
    status: 'completed',
    keyDeliverables: [
      'Multi-channel post editor with markdown and emoji picker',
      'Network-specific character & hashtag limits',
      'Format selectors (Reels, Carousels, Threads, Stories)',
      'Live mobile screen mockups'
    ]
  },
  {
    phaseNumber: 11,
    title: 'Interactive Content Calendar',
    category: 'Content Lifecycle',
    summary: 'Multi-view editorial calendar (Monthly, Weekly, List, Grid) with drag-and-drop rescheduling and optimal time slots.',
    status: 'completed',
    keyDeliverables: [
      'Month/Week/Day interactive calendar view',
      'Drag-and-drop date rescheduling',
      'Platform & client color-coded badges',
      'Best-time-to-post recommendations'
    ]
  },
  {
    phaseNumber: 12,
    title: 'Editorial Workflow & Versioning',
    category: 'Content Lifecycle',
    summary: 'Multi-stage review pipeline (Draft, Internal Review, Client Review, Approved, Scheduled) with diff history.',
    status: 'completed',
    keyDeliverables: [
      'Visual Kanban workflow stages',
      'Post version history & rollback comparison',
      'Internal team feedback comments',
      'Stage advancement triggers'
    ]
  },
  {
    phaseNumber: 13,
    title: 'Client Approvals Portal',
    category: 'Content Lifecycle',
    summary: 'Frictionless one-click approval links, line-item feedback, revision requests, and timestamped approval signatures.',
    status: 'completed',
    keyDeliverables: [
      'Client guest review portal (no complex login required)',
      'One-click Approve / Request Changes buttons',
      'Inline comment annotations per post/asset',
      'Immutable approval audit timestamps'
    ]
  },
  {
    phaseNumber: 14,
    title: 'Digital Asset Management (DAM)',
    category: 'Content Lifecycle',
    summary: 'Tagged media library, brand asset kits, cloud uploaders, aspect ratio crops, and asset usage rights tracking.',
    status: 'completed',
    keyDeliverables: [
      'High-speed media grid with tag & folder organization',
      'Brand logo & font asset vaults',
      'Aspect ratio presets (1:1, 4:5, 16:9, 9:16)',
      'Media usage counters across posts'
    ]
  },
  {
    phaseNumber: 15,
    title: 'Campaign Strategy & Management',
    category: 'Execution & Delivery',
    summary: 'Thematic multi-channel campaign groups, budget allocation, deliverable timelines, and milestone tracking.',
    status: 'completed',
    keyDeliverables: [
      'Campaign creation with objectives & target KPIs',
      'Cross-post bundling under single campaigns',
      'Budget expenditure tracking vs planned retainer',
      'Milestone Gantt timeline'
    ]
  },
  {
    phaseNumber: 16,
    title: 'Task & Project Management',
    category: 'Execution & Delivery',
    summary: 'Kanban boards, task dependencies, priority flags, assignment checklists, and internal proofing deadlines.',
    status: 'completed',
    keyDeliverables: [
      'Agency task boards with sprint swimlanes',
      'Checklist items with sub-task progress',
      'Urgent SLA countdown badges',
      'Direct link between tasks and post drafts'
    ]
  },
  {
    phaseNumber: 17,
    title: 'Social Account Connections',
    category: 'Execution & Delivery',
    summary: 'Secure OAuth connectors for Meta, LinkedIn, X, TikTok, and YouTube with token lifecycle tracking.',
    status: 'completed',
    keyDeliverables: [
      'Connection management interface with health checks',
      'OAuth token expiration alerts & re-auth alerts',
      'Permissions check (publish, read_insights, manage_pages)',
      'Sandbox/mock publishing testing mode'
    ]
  },
  {
    phaseNumber: 18,
    title: 'Publishing & Scheduling Engine',
    category: 'Execution & Delivery',
    summary: 'Smart queue dispatcher, timezone-aware scheduling, retry policies, and platform-specific post previewers.',
    status: 'completed',
    keyDeliverables: [
      'Timezone-aware dispatch queue',
      'Publish status monitor with retry engine',
      'Automated first-comment publishing (hashtags)',
      'Pre-flight validator (aspect ratios, video lengths)'
    ]
  },
  {
    phaseNumber: 19,
    title: 'Analytics & Performance Reporting',
    category: 'Execution & Delivery',
    summary: 'Cross-platform reach, engagement rate calculations, top-performing post breakdowns, and exportable client reports.',
    status: 'completed',
    keyDeliverables: [
      'Unified engagement & reach telemetry charts',
      'Top-performing creative leaderboards',
      'White-label branded PDF/CSV client report export',
      'Automated weekly/monthly report summaries'
    ]
  },
  {
    phaseNumber: 20,
    title: 'Agency CRM & Leads Pipeline',
    category: 'Business & CRM',
    summary: 'Prospect deal pipeline, pitch stage tracking, proposal attachments, and client lifecycle stages.',
    status: 'completed',
    keyDeliverables: [
      'Agency sales pipeline Kanban (Lead, Discovery, Proposal, Won)',
      'Deal value calculations & expected win rate',
      'Client notes, pitch deck links & contact cards',
      'Seamless conversion of Won deals into Active Clients'
    ]
  },
  {
    phaseNumber: 21,
    title: 'Billing, Retainers & Invoicing',
    category: 'Business & CRM',
    summary: 'Retainer budget meters, one-off project invoicing, Stripe integration stubs, and billable hour logs.',
    status: 'completed',
    keyDeliverables: [
      'Monthly retainer tracking with overage alerts',
      'Invoice generator with printable PDF templates',
      'Stripe checkout/payment status tracking',
      'Agency revenue forecasting dashboard'
    ]
  },
  {
    phaseNumber: 22,
    title: 'Unified Communication & Inbox',
    category: 'Business & CRM',
    summary: 'Unified social inbox for incoming comments, DMs, review notes, and team-to-client threaded messaging.',
    status: 'completed',
    keyDeliverables: [
      'Consolidated social interaction inbox',
      'Internal team mention threads (@teammate)',
      'Canned replies & sentiment badges',
      'Client discussion channels'
    ]
  },
  {
    phaseNumber: 23,
    title: 'Workflow Automation',
    category: 'Intelligence & Scale',
    summary: 'Custom if-this-then-that rule engine for automated tagging, approval reminders, and webhooks.',
    status: 'completed',
    keyDeliverables: [
      'Visual trigger-condition-action workflow builder',
      'Automated reminders for pending client reviews',
      'Auto-tagging based on post content and platform',
      'Webhook dispatcher for Slack/Email alerts'
    ]
  },
  {
    phaseNumber: 24,
    title: 'AI Content & Strategy Engine',
    category: 'Intelligence & Scale',
    summary: 'Gemini-powered caption generator, hashtag optimizer, competitor angle brainstorming, and sentiment analysis.',
    status: 'completed',
    keyDeliverables: [
      'Tone-matched caption generation (using brand guidelines)',
      'Smart hashtag set generator with volume estimations',
      'Content repurposing tool (e.g. blog to 5 tweets + 1 carousel)',
      'Social copy sentiment & readability audit'
    ]
  },
  {
    phaseNumber: 25,
    title: 'White-Label Customization',
    category: 'Intelligence & Scale',
    summary: 'Custom domain support, branded client portals, custom color themes, and agency logo watermarks.',
    status: 'completed',
    keyDeliverables: [
      'Custom agency branding configuration (logo, favicon, hex colors)',
      'Vanity client portal URLs (e.g., portal.agencyname.com)',
      'Custom email footer & notification signatures',
      'Remove PulseBrand badge toggle for enterprise'
    ]
  },
  {
    phaseNumber: 26,
    title: 'SaaS Subscription & Tier Management',
    category: 'Intelligence & Scale',
    summary: 'Multi-tier SaaS plans (Freelancer, Boutique Agency, Global Agency), seat limits, and usage metering.',
    status: 'completed',
    keyDeliverables: [
      'Tier feature comparison & upgrade modals',
      'Client limit & seat allocation enforcement',
      'Usage metrics (posts scheduled, AI tokens used)',
      'Plan downgrade & cancellation guardrails'
    ]
  },
  {
    phaseNumber: 27,
    title: 'Productivity & Quick Actions',
    category: 'Intelligence & Scale',
    summary: 'Global Cmd+K command bar, keyboard navigation shortcuts, bulk status editors, and quick-draft shortcuts.',
    status: 'completed',
    keyDeliverables: [
      'Universal Cmd+K spotlight search & action launcher',
      'Keyboard shortcuts for calendar navigation & approval',
      'Bulk post status updates and batch scheduling',
      'Quick draft scratchpad'
    ]
  },
  {
    phaseNumber: 28,
    title: 'Security Hardening & Data Protection',
    category: 'Hardening & Launch',
    summary: 'SOC2-ready audit trail logs, data sanitization, CSRF/XSS safeguards, and encrypted key storage.',
    status: 'completed',
    keyDeliverables: [
      'Immutable activity audit trail for every action',
      'Input sanitization & content security policy compliance',
      'Scoped API key & secret encryption handlers',
      'Data export & GDPR "right to be forgotten" tools'
    ]
  },
  {
    phaseNumber: 29,
    title: 'Performance Optimization',
    category: 'Hardening & Launch',
    summary: 'Virtualized feed rendering, image lazy-loading, query caching, and sub-100ms UI interactions.',
    status: 'completed',
    keyDeliverables: [
      'Virtualized calendar and post grid rendering',
      'Optimized asset thumbnails with responsive sizes',
      'Debounced client search & indexed filter cache',
      'Instant optimistic UI state updates'
    ]
  },
  {
    phaseNumber: 30,
    title: 'Automated Testing & Verification',
    category: 'Hardening & Launch',
    summary: 'Unit tests, contract test suites, end-to-end user journey smoke tests, and validation gates.',
    status: 'completed',
    keyDeliverables: [
      'Core business logic test harness',
      'Approval state transition contract validation',
      'Role permission boundary tests',
      'Mock publishing failure resilience tests'
    ]
  },
  {
    phaseNumber: 31,
    title: 'Infrastructure & Cloud Configuration',
    category: 'Hardening & Launch',
    summary: 'Production container specifications, environment variable safety checks, and edge caching configs.',
    status: 'completed',
    keyDeliverables: [
      'Strict production environment variable validation',
      'Static asset compression & cache headers',
      'Port 3000 dev server & cloud container alignment',
      'Health check endpoint specifications'
    ]
  },
  {
    phaseNumber: 32,
    title: 'System Health & Observability',
    category: 'Hardening & Launch',
    summary: 'Telemetry loggers, error boundary captures, health-check probes, and API rate-limit sentinels.',
    status: 'completed',
    keyDeliverables: [
      'Live system health inspection console',
      'Client error boundary with one-click report generator',
      'API rate-limit warning monitors',
      'Network connectivity state indicators'
    ]
  },
  {
    phaseNumber: 33,
    title: 'Documentation & Knowledge Base',
    category: 'Hardening & Launch',
    summary: 'Agency SOP templates, user manual, interactive feature tours, and API documentation.',
    status: 'completed',
    keyDeliverables: [
      'Built-in Agency SOP templates for social workflows',
      'Interactive feature walkthrough tooltips',
      'Client approval cheat-sheet for brand stakeholders',
      'System architecture technical guide'
    ]
  },
  {
    phaseNumber: 34,
    title: 'Design Polish & Accessibility',
    category: 'Hardening & Launch',
    summary: 'Micro-interactions, WCAG AA compliance audit, sound feedback hooks, and responsive mobile polish.',
    status: 'completed',
    keyDeliverables: [
      'WCAG AA 4.5:1 contrast audit & focus rings',
      'Subtle motion feedback with reduced-motion support',
      'Fluid mobile breakpoints for phones & tablets',
      'Haptic & audio interaction cues'
    ]
  },
  {
    phaseNumber: 35,
    title: 'Live Deployment',
    category: 'Hardening & Launch',
    summary: 'Production build verification, bundle size optimization, and live release launch verification.',
    status: 'planned',
    keyDeliverables: [
      'Production Vite build verification',
      'Zero fatal lint errors or broken imports',
      'Asset CDN pre-caching readiness',
      'Live public deployment validation'
    ]
  },
  {
    phaseNumber: 36,
    title: 'Stabilization & Continuous Monitoring',
    category: 'Hardening & Launch',
    summary: 'Post-launch rollback safeguards, telemetry monitoring, feedback capture, and active hotfix routines.',
    status: 'planned',
    keyDeliverables: [
      'Post-deployment stability dashboard',
      'In-app user feedback & bug submission modal',
      'Zero-downtime hotfix patch protocol',
      'Final milestone project sign-off certification'
    ]
  }
];
