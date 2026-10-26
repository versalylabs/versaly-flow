/**
 * Versaly Flow - Documentation & Knowledge Base Service
 * Phase 33: Documentation & Knowledge Base
 * Agency SOP Templates, User Manual, Client Approval Cheat-Sheet & API Reference
 */

import {
  AgencySopItem,
  UserGuideArticle,
  ClientApprovalCheatSheet,
  ApiDocEndpoint,
  SopCategory,
  Role
} from '../types';

class DocumentationService {
  private sops: AgencySopItem[] = [
    {
      id: 'sop_crisis_pr',
      title: 'Kenyan Social PR Incident & Brand Backlash Protocol',
      category: 'crisis_management',
      department: 'Brand Communications & Strategy',
      lastUpdated: '2026-09-20',
      turnaroundSla: '15 Minutes Initial Response',
      ownerRole: 'account_manager',
      summary: 'Immediate operational response guidelines for viral criticism, influencer fallout, misinformation, or brand reputational threats across Kenyan digital channels.',
      tags: ['crisis', 'pr', 'twitter/x', 'escalation', 'kenya'],
      escalationPath: 'Content Creator -> Account Manager -> Agency Owner -> Client Legal/Communications Lead',
      steps: [
        {
          stepNumber: 1,
          title: 'Immediate Kill-Switch & Dispatch Pause',
          instruction: 'Navigate to the Dispatch Queue (Publishing Engine) and freeze all pending automated dispatches for the affected brand within 5 minutes to prevent tone-deaf scheduled tweets/posts.',
          checklist: ['Halt Dispatch Queue', 'Check scheduled reels & stories', 'Notify internal editorial pod']
        },
        {
          stepNumber: 2,
          title: 'Severity Assessment & Sentiment Triage',
          instruction: 'Classify incident level in Unified Inbox: Tier 1 (Isolated troll/complaint), Tier 2 (Trending hashtag/emerging controversy), or Tier 3 (National press/regulatory breach/legal threat).',
          checklist: ['Classify Tier (1-3)', 'Snapshot offending posts and top engagement comments', 'Log in SOC2 Audit Trail']
        },
        {
          stepNumber: 3,
          title: 'Holding Statement Protocol',
          instruction: 'Issue pre-approved Holding Statement acknowledging the concern without premature admission of liability. Tone must be empathetic, measured, and authentic.',
          checklist: ['Select verified holding template', 'Verify client signatory approval', 'Publish on verified channels within 15 mins']
        },
        {
          stepNumber: 4,
          title: 'Active Listening & Post-Mortem',
          instruction: 'Monitor sentiment in Analytics & Insights every 30 minutes. Once stabilized, conduct internal retrospective and compile Diagnostic Incident debrief within 24 hours.',
          checklist: ['Track net sentiment inflection', 'Export conversation graph', 'Deliver retrospective report to client']
        }
      ],
      contentMarkdown: `# SOP: Kenyan Social PR Incident & Brand Backlash Protocol

**Department:** Brand Communications & Strategy  
**Turnaround SLA:** 15 Minutes Initial Response  
**Escalation Path:** Content Creator → Account Manager → Agency Owner → Client Legal Lead

---

## 1. Immediate Dispatch Freeze
When an emerging controversy or viral backlash is flagged:
1. Open **Publishing Engine** and click **"Pause Automated Dispatch"**.
2. Confirm zero scheduled posts are released across TikTok, Instagram, X (Twitter), or LinkedIn.

## 2. Severity Classification Matrix
- **Tier 1 (Mild):** < 50 negative mentions/hour. Route to Community Moderator using pre-approved empathy macros.
- **Tier 2 (Moderate):** 50–500 mentions/hour or micro-influencer pickup. Account Manager must draft tailored holding reply.
- **Tier 3 (Severe):** > 500 mentions/hour, trending topic, or national news coverage. Trigger immediate emergency call with Client Executive Sponsor.

## 3. Holding Statement Guideline
> "We hear you and appreciate you bringing this to our attention. Our team is actively investigating the situation to address it properly. We will share a full update shortly."
`
    },
    {
      id: 'sop_content_turnaround',
      title: '48-Hour Multi-Channel Editorial Sign-Off SLA',
      category: 'content_publishing',
      department: 'Content Studio & Design',
      lastUpdated: '2026-09-22',
      turnaroundSla: '48 Hours End-to-End',
      ownerRole: 'content_creator',
      summary: 'Standardized editorial lifecycle workflow: drafting, caption localization, peer QA, external client review, and automated publishing dispatch.',
      tags: ['content', 'editorial', 'kanban', 'sla', 'review'],
      escalationPath: 'Content Creator -> Account Manager -> Client Approver',
      steps: [
        {
          stepNumber: 1,
          title: 'Brief Ingestion & Asset Sourcing',
          instruction: 'Review monthly campaign brief. Source high-res photography or video from Brand Media Vault (DAM). Verify asset copyright and resolution specs (1080x1350 for IG, 1080x1920 for 9:16 reels).',
          checklist: ['Check DAM resolution', 'Adhere to client color palette', 'Validate brand typography']
        },
        {
          stepNumber: 2,
          title: 'Drafting & Swahili/English Localization',
          instruction: 'Compose copy in Content Composer. Include primary hook, value proposition, relevant hashtags, and localized Kenyan cultural context (e.g. Sheng/Swahili colloquialisms where appropriate).',
          checklist: ['Draft hook & body', 'Include call-to-action (CTA)', 'Run AI Strategy Tone Check']
        },
        {
          stepNumber: 3,
          title: 'Internal Peer QA & Stage Advancement',
          instruction: 'Move item to Internal Review on Editorial Kanban. Account Manager inspects grammar, brand safety, UTM links, and visual composition within 12 hours.',
          checklist: ['Verify UTM tracking parameters', 'Spelling & grammar validation', 'Move to "client_review"']
        },
        {
          stepNumber: 4,
          title: 'Client Sign-Off & Automated Scheduling',
          instruction: 'Client Approver receives notification in Approvals Portal. Once cryptographically signed off, item automatically advances to Scheduled queue on Matrix Calendar.',
          checklist: ['Verify client digital signature', 'Lock schedule date/time (EAT)', 'Queue in publishing engine']
        }
      ],
      contentMarkdown: `# SOP: 48-Hour Multi-Channel Editorial Sign-Off SLA

**Turnaround SLA:** 48 Hours Brief-to-Publish  
**Target Channels:** Instagram, TikTok, LinkedIn, Facebook, X

---

### Step-by-Step Milestones
- **Hour 0 - 16:** Creator drafts copy and visual creative in *Content Composer*.
- **Hour 16 - 24:** Account Manager completes *Internal Review* and compliance checks.
- **Hour 24 - 44:** Client Approver reviews item in *Approvals Portal* and signs off or requests adjustments.
- **Hour 44 - 48:** Dispatch queue locks in optimal publishing slot based on East Africa Time (EAT) peak engagement.
`
    },
    {
      id: 'sop_client_onboarding',
      title: '7-Day Brand Strategy & DAM Asset Ingestion Checklist',
      category: 'client_onboarding',
      department: 'Client Services & Onboarding',
      lastUpdated: '2026-09-18',
      turnaroundSla: '7 Business Days',
      ownerRole: 'account_manager',
      summary: 'Comprehensive onboarding protocol for new retainer clients: workspace isolation, brand guideline ingest, social OAuth credential connection, and team allocation.',
      tags: ['onboarding', 'new_client', 'dam', 'oauth', 'retainer'],
      escalationPath: 'Account Manager -> Agency Owner',
      steps: [
        {
          stepNumber: 1,
          title: 'Tenant Isolation & Profile Creation',
          instruction: 'Create client profile in Client Management. Define industry category, monthly retainer fee in KES, target demographic, and primary brand colors.',
          checklist: ['Create Client entity', 'Set KES retainer fee', 'Assign dedicated Account Manager']
        },
        {
          stepNumber: 2,
          title: 'Social Media OAuth Channel Connections',
          instruction: 'Send secure OAuth onboarding links to client social admin for Meta Graph, TikTok for Business, and LinkedIn UGC APIs in Social Connections Hub.',
          checklist: ['Connect Meta Business Suite', 'Connect TikTok Ad Account', 'Connect LinkedIn Company Page']
        },
        {
          stepNumber: 3,
          title: 'Brand Media Vault (DAM) Asset Migration',
          instruction: 'Upload official logo vectors (SVG/PNG), font files, photography guidelines, product catalogues, and brand tone-of-voice PDF into Brand Media Vault.',
          checklist: ['Upload vector logos', 'Create asset folders by campaign', 'Tag color palettes']
        },
        {
          stepNumber: 4,
          title: 'Stakeholder Approver Access Provisioning',
          instruction: 'Invite brand approvers via RBAC module with role "client_approver". Ensure client view scoping restricts all financial margins and internal team notes.',
          checklist: ['Send Approver invite', 'Verify client-restricted view', 'Conduct 15-min walk-through']
        }
      ],
      contentMarkdown: `# SOP: 7-Day Brand Strategy & DAM Asset Ingestion

**Purpose:** Seamlessly transition a signed retainer contract into an active operational workspace.

---

### Onboarding Milestones
1. **Day 1:** Commercial agreement signed & initial invoice issued via M-Pesa / Bank transfer.
2. **Day 2:** Brand profile & team allocation configured in Versaly Flow.
3. **Day 3:** OAuth channel integration verified in Social Connections Hub.
4. **Day 4-5:** Brand Media Vault (DAM) populated with client assets.
5. **Day 6:** AI Strategy Brief generated for initial 30-day editorial roadmap.
6. **Day 7:** Client approvals portal walkthrough & inaugural post sign-off.
`
    },
    {
      id: 'sop_paid_media',
      title: 'M-Pesa & Credit Card Ad Spend Reconciliation & Escalation',
      category: 'paid_media',
      department: 'Performance Marketing & Finance',
      lastUpdated: '2026-09-15',
      turnaroundSla: '24 Hours Budget Validation',
      ownerRole: 'agency_owner',
      summary: 'Financial governance protocol for social advertising budgets, daily cap limits, M-Pesa float management, and overspend mitigation.',
      tags: ['paid_ads', 'budget', 'mpesa', 'finance', 'meta_ads'],
      escalationPath: 'Performance Marketer -> Account Manager -> Agency Owner',
      steps: [
        {
          stepNumber: 1,
          title: 'Pre-Flight Budget Allocation Check',
          instruction: 'Cross-reference monthly media budget with client retainer contract in Billing & Retainers before launching ad sets.',
          checklist: ['Verify cleared retainer funds', 'Set lifetime spend caps', 'Configure daily budget limits']
        },
        {
          stepNumber: 2,
          title: 'Float Balance & Currency Hedging',
          instruction: 'Verify M-Pesa Daraja B2B corporate float or USD card balances in Financials to ensure zero campaign interruptions during high-traffic spikes.',
          checklist: ['Audit float balance', 'Account for KES/USD conversion variances', 'Set 15% safety buffer']
        },
        {
          stepNumber: 3,
          title: 'ROAS & CPA Guardrails',
          instruction: 'Monitor Meta & TikTok campaigns in Analytics. If CPA exceeds the agreed target by >25% for 48 consecutive hours, pause ad set immediately.',
          checklist: ['Review CPA vs Benchmark', 'Pause underperforming creatives', 'Reallocate budget to winning variant']
        }
      ],
      contentMarkdown: `# SOP: Paid Media Ad Spend Reconciliation & Governance

**Objective:** Zero unauthorized ad overspends, 100% financial transparency.

---

### Spend Thresholds & Alerts
- **Warning Sentinel:** When monthly ad spend reaches 80% of client threshold, automated notification fires in TopNav.
- **Hard Stop:** At 100% of approved budget, ad delivery automatically switches off unless explicit written top-up authorization is uploaded.
`
    },
    {
      id: 'sop_community_moderation',
      title: 'Sentiment Routing, Troll Handling & Toxic Speech Triage',
      category: 'community_management',
      department: 'Community Engagement Pod',
      lastUpdated: '2026-09-24',
      turnaroundSla: '30 Minutes for Negative Sentiment',
      ownerRole: 'content_creator',
      summary: 'Rules of engagement for comments, DMs, reviews, and community sentiment management across Instagram, TikTok, LinkedIn, and Facebook.',
      tags: ['community', 'moderation', 'inbox', 'sentiment', 'dms'],
      escalationPath: 'Community Moderator -> Account Manager -> Client Lead',
      steps: [
        {
          stepNumber: 1,
          title: 'Automated Sentiment Classification',
          instruction: 'Incoming mentions and DMs in Unified Inbox are tagged by AI Sentiment Analyzer into: Positive, Inquiring, Neutral, Negative, or Urgent.',
          checklist: ['Filter inbox by "urgent" or "negative"', 'Prioritize customer service inquiries', 'Flag harassment']
        },
        {
          stepNumber: 2,
          title: 'Response Protocol by Sentiment Type',
          instruction: 'Positive feedback: engage within 2 hours with authentic appreciation. Inquiries: answer product/service questions using verified Brand FAQ macros within 1 hour.',
          checklist: ['Use pre-approved brand voice', 'Avoid generic automated responses', 'Verify pricing accuracy']
        },
        {
          stepNumber: 3,
          title: 'Defamation & Toxic Speech Handling',
          instruction: 'For hate speech, ethnic slurs, or harassment: hide comment immediately (do not delete to preserve evidentiary trail), log incident, and block repeat offenders.',
          checklist: ['Hide offending comment', 'Capture screenshot for incident record', 'Do not engage in public arguments']
        }
      ],
      contentMarkdown: `# SOP: Community Engagement & Moderation Guidelines

**Key Mantra:** Never argue publicly. Empathize, clarify, and move sensitive resolution into private direct channels (DMs/Email).

---

### Response Time Matrix
- **Urgent / Backlash:** ≤ 15 Minutes
- **Product & Pricing Inquiries:** ≤ 60 Minutes
- **General Praise & Mentions:** ≤ 120 Minutes
`
    },
    {
      id: 'sop_dpa_compliance',
      title: 'Kenya Data Protection Act (DPA 2019) & Privacy Compliance',
      category: 'compliance',
      department: 'Legal, Compliance & InfoSec',
      lastUpdated: '2026-09-19',
      turnaroundSla: 'Immediate / Continuous',
      ownerRole: 'super_admin',
      summary: 'Mandatory guidelines for handling client customer data, social contest entries, phone numbers (M-Pesa), and image release consents under Kenyan Law.',
      tags: ['compliance', 'dpa', 'kenya', 'privacy', 'soc2'],
      escalationPath: 'Account Manager -> Super Admin -> Data Protection Officer',
      steps: [
        {
          stepNumber: 1,
          title: 'Consent for Social Contest & Lead Capture',
          instruction: 'Any social contest collecting personal identifiers (names, phone numbers, email addresses) must display clear consent opt-in terms per ODPC requirements.',
          checklist: ['Verify explicit opt-in check', 'No bundling of contest with marketing consent', 'Store records encrypted']
        },
        {
          stepNumber: 2,
          title: 'Photography & Model Release Forms',
          instruction: 'Before publishing brand photography featuring recognizable individuals, upload executed Model Release Consent into Brand Media Vault.',
          checklist: ['Obtain signed release form', 'Tag asset with "Release: Verified"', 'Archive in DAM vault']
        },
        {
          stepNumber: 3,
          title: 'Right to Erasure & Data Deletion',
          instruction: 'When a customer requests data removal, execute scrubbing in CRM & Unified Inbox within 72 hours and record verification log in SOC2 Audit Trail.',
          checklist: ['Locate customer records', 'Purge identifying fields', 'Generate compliance certificate']
        }
      ],
      contentMarkdown: `# SOP: Kenya Data Protection Act (DPA 2019) Compliance

**Regulatory Authority:** Office of the Data Protection Commissioner (ODPC) Kenya  
**Statute:** Data Protection Act, No. 24 of 2019

---

### Core Tenets for Agency Operations
1. **Lawful Basis:** Never publish or distribute customer likeness or contact information without express written consent.
2. **Data Minimization:** Only collect fields strictly required for campaign fulfillment.
3. **Storage Security:** All customer information in Versaly Flow is segregated in tenant-isolated encrypted stores.
`
    }
  ];

  private userGuides: UserGuideArticle[] = [
    {
      id: 'guide_quickstart',
      title: 'Agency Workspace Quick Start Guide',
      targetAudience: 'all',
      category: 'getting_started',
      summary: 'Everything you need to navigate Versaly Flow, configure your agency brand, invite team members, and manage your first client.',
      readTimeMinutes: 4,
      keyFeatures: [
        'Multi-tenant workspace isolation',
        'Command Palette (Cmd+K / Ctrl+K) instant navigation',
        'Real-time East Africa Time (EAT) status bar',
        'Dynamic role-based sidebar adaptation'
      ],
      stepByStep: [
        {
          heading: '1. Explore Your Executive Dashboard',
          detail: 'Upon logging in, review top-line metrics: Active Clients, Scheduled Dispatches, Overdue Invoices, and Net Engagement velocity across all active social channels.'
        },
        {
          heading: '2. Add Your First Brand Client',
          detail: 'Head to "Client Profiles" under Clients & Growth. Click "+ Add New Client" to define the client name, industry, assigned account manager, and monthly KES retainer fee.'
        },
        {
          heading: '3. Leverage Quick Actions & Cmd+K',
          detail: 'Press Cmd+K (Mac) or Ctrl+K (Windows) from anywhere to summon the universal Spotlight search. Jump directly to any tool, search content items, or create new posts in milliseconds.'
        }
      ],
      proTips: [
        'Use keyboard shortcut "C" inside the Command Palette to draft a new post immediately.',
        'Toggle between clients using the top navigation client selector to focus your workspace view.'
      ]
    },
    {
      id: 'guide_content_workflow',
      title: 'Mastering the 6-Stage Editorial Kanban',
      targetAudience: ['agency_owner', 'account_manager', 'content_creator'],
      category: 'content_workflow',
      summary: 'Learn how posts flow smoothly from initial idea to live social dispatch with multi-tier approval gates.',
      readTimeMinutes: 6,
      keyFeatures: [
        '6 Distinct Editorial Stages: Ideation, Draft, Internal Review, Client Review, Scheduled, Published',
        'Drag-and-drop Kanban interface with instant stage updates',
        'Pre-flight quality assurance check before advancing to client',
        'Built-in feedback threaded comments'
      ],
      stepByStep: [
        {
          heading: '1. Drafting in Content Composer',
          detail: 'Craft your post text, choose targeted social networks (Instagram, LinkedIn, X, TikTok), and attach assets from the Brand Media Vault.'
        },
        {
          heading: '2. Internal Peer Review Gate',
          detail: 'Once drafted, move the card to "Internal Review". The Account Manager verifies copy quality, hashtag density, brand guidelines, and UTM links.'
        },
        {
          heading: '3. Client Approval Hand-Off',
          detail: 'Advancing to "Client Review" triggers an instant portal notification to the client approver, who can approve or request revisions without seeing internal agency discussions.'
        },
        {
          heading: '4. Automated Dispatch Synchronization',
          detail: 'Once signed off, the post automatically locks into its scheduled EAT publishing slot on the matrix calendar.'
        }
      ],
      proTips: [
        'Hover over any post card on the Kanban board to preview its formatted social media card render.',
        'Filter the board by Client to run dedicated weekly editorial review calls.'
      ]
    },
    {
      id: 'guide_approvals_portal',
      title: 'Client Approvals Portal: Fast Sign-Offs & Audit Trails',
      targetAudience: ['client_approver', 'account_manager'],
      category: 'publishing',
      summary: 'A friction-free interface designed specifically for external brand stakeholders to inspect, comment on, and approve creative work.',
      readTimeMinutes: 3,
      keyFeatures: [
        'One-click digital signature sign-off with SHA256 audit fingerprint',
        'Precision feedback notes with line-item revision requests',
        'Zero agency internal noise: client sees only relevant marketing creative',
        'Mobile-optimized touch approval experience'
      ],
      stepByStep: [
        {
          heading: '1. Accessing Your Pending Reviews',
          detail: 'Navigate to "Approvals Portal" in the sidebar. You will see all creative items currently waiting for your brand sign-off.'
        },
        {
          heading: '2. Inspecting Post Mockups',
          detail: 'Click any item to view high-fidelity mockups of exactly how the post will appear on Instagram, TikTok, LinkedIn, or Facebook.'
        },
        {
          heading: '3. Requesting Edits vs Approving',
          detail: 'If changes are needed, click "Request Revisions" and detail your adjustment. If satisfied, click "Approve & Schedule" to lock it for dispatch.'
        }
      ],
      proTips: [
        'Approvals are recorded with cryptographic timestamps for complete peace of mind and accountability.',
        'Use batch review to approve an entire weekly content calendar in under 2 minutes.'
      ]
    },
    {
      id: 'guide_mpesa_billing',
      title: 'M-Pesa Daraja 2.0 Invoicing & Retainer Management',
      targetAudience: ['agency_owner', 'account_manager'],
      category: 'billing_financials',
      summary: 'Automate agency retainer collections in Kenyan Shillings (KES) with instantaneous Lipa Na M-Pesa STK push prompts.',
      readTimeMinutes: 5,
      keyFeatures: [
        'Direct Safaricom Daraja 2.0 STK push triggering to client mobile numbers',
        'Real-time webhook confirmation & automatic invoice status reconciliation',
        'Downloadable branded PDF invoices with KRA e-TIMS compliance notes',
        'Monthly recurring retainer tracker'
      ],
      stepByStep: [
        {
          heading: '1. Generating a Retainer Invoice',
          detail: 'Open Billing & Invoicing. Click "+ New Invoice", select the client, set the billing cycle, and specify retainer line items in KES.'
        },
        {
          heading: '2. Triggering M-Pesa STK Push',
          detail: 'Click "Collect via M-Pesa" on any pending invoice. Enter the client accounts contact phone number (2547XXXXXXXX) and dispatch the instant prompt.'
        },
        {
          heading: '3. Reconciling Settlement',
          detail: 'Upon PIN entry on the phone, the Daraja webhook immediately flags the invoice as "Paid" and updates your agency cash flow telemetry.'
        }
      ],
      proTips: [
        'Configure automated reminder alerts 3 days before monthly retainer renewal dates.',
        'Export monthly revenue reports into Excel or CSV for accounting reconciliation.'
      ]
    },
    {
      id: 'guide_gemini_ai',
      title: 'AI Strategy Studio with Google Gemini',
      targetAudience: ['agency_owner', 'account_manager', 'content_creator'],
      category: 'automation_ai',
      summary: 'Harness enterprise generative AI to create complete multi-channel campaign briefs, localized Swahili hooks, and editorial calendars in seconds.',
      readTimeMinutes: 4,
      keyFeatures: [
        'One-click multi-channel campaign generator (IG, TikTok, LinkedIn, X)',
        'Audience persona targeting calibrated for East African and Pan-African markets',
        'Tone customization: Premium, Conversational, Witty, Sheng/Swahili blend',
        'Direct "Send to Composer" one-click action'
      ],
      stepByStep: [
        {
          heading: '1. Defining Campaign Objective',
          detail: 'Enter your brand client, campaign name, primary target demographic, and core marketing goal in AI Strategy Studio.'
        },
        {
          heading: '2. Generating Strategy Brief',
          detail: 'Click "Generate Campaign Brief". Gemini analyzes your brand profile and outputs 4 coordinated channel deliverables complete with copy, hashtags, and visual directions.'
        },
        {
          heading: '3. Pushing to Editorial Kanban',
          detail: 'Review the generated deliverables and click "Push to Content Composer" to turn the AI brief into actionable draft posts ready for refinement.'
        }
      ],
      proTips: [
        'Include your client specific brand guidelines in the prompt to ensure 100% voice alignment.',
        'Use the "Regenerate Variant" button to quickly explore alternative hook angles.'
      ]
    },
    {
      id: 'guide_observability',
      title: 'System Health, Telemetry & Error Boundary Protocols',
      targetAudience: ['super_admin', 'agency_owner'],
      category: 'administration',
      summary: 'Understand the platform observability architecture: live ring-buffer logs, error boundary incident reporting, and API sentinels.',
      readTimeMinutes: 5,
      keyFeatures: [
        'Circular 1,000-event in-memory telemetry buffer with live streaming',
        'Automatic client error boundary with one-click JSON incident downloads',
        'Rate limit sentinels for M-Pesa Daraja, Meta Graph, and Gemini AI',
        'Circuit breaker proxies for downstream service stability'
      ],
      stepByStep: [
        {
          heading: '1. Accessing Health & Observability Console',
          detail: 'Super admins can navigate to "Health & Observability" in the Platform Admin section of the sidebar.'
        },
        {
          heading: '2. Investigating Runtime Incidents',
          detail: 'Switch to the "Error Boundary & Incidents" tab to review intercepted client exceptions, full stack traces, and preceding telemetry events.'
        },
        {
          heading: '3. Managing Rate Limit Sentinels',
          detail: 'Inspect live API quota consumption in the "Rate-Limit Sentinels" tab to preemptively catch external quota throttling before it impacts dispatches.'
        }
      ],
      proTips: [
        'Download the Diagnostic Incident Bundle (.json) whenever escalating an issue to the platform engineering team.',
        'Circuit breakers automatically recover when upstream services regain stability.'
      ]
    }
  ];

  private clientCheatSheets: ClientApprovalCheatSheet[] = [
    {
      id: 'cs_quick_approval',
      title: 'How to Review & Approve Content in Under 60 Seconds',
      section: 'overview',
      headline: 'Effortless, mobile-friendly marketing sign-offs without logins or complex training.',
      keyInstructions: [
        'Open your unique client portal link on your phone, tablet, or laptop.',
        'Inspect the real-time social mockup to see how your brand appears on Instagram, TikTok, or LinkedIn.',
        'Click the green "Approve & Schedule" button. Your approval is timestamped and locked into the calendar.'
      ],
      slaExpectation: '24–48 Hours prior to scheduled publishing date for seamless dispatch.',
      doAndDont: {
        do: [
          'Verify key dates, promotional discount codes, and product pricing.',
          'Check that tagged brand partners and handles are accurate.',
          'Review video and photo creative for brand alignment.'
        ],
        dont: [
          'Do not approve if mandatory legal disclaimers are missing.',
          'Do not wait until the hour of publishing to request major conceptual overhauls.',
          'Do not share direct approval links with unverified external third parties.'
        ]
      }
    },
    {
      id: 'cs_requesting_edits',
      title: 'Requesting Revisions & Providing Actionable Feedback',
      section: 'requesting_edits',
      headline: 'Get exactly the changes you want with clear, constructive feedback.',
      keyInstructions: [
        'Click "Request Changes" on any post requiring adjustments.',
        'Be specific: specify whether the feedback applies to the Caption, the Visual/Video, or the Scheduled Date.',
        'Your dedicated Account Manager receives an instant alert and re-submits a revised draft within 12–24 hours.'
      ],
      slaExpectation: 'Revision turnaround within 24 hours of client comment submission.',
      doAndDont: {
        do: [
          'State concrete replacements (e.g. "Change price from KES 4,500 to KES 4,999").',
          'Upload reference images or updated logos if new assets are available.',
          'Group all related feedback for a post into a single revision request.'
        ],
        dont: [
          'Avoid ambiguous feedback like "Make it pop" or "I don\'t like the vibe".',
          'Do not send feedback across disparate WhatsApp threads—keep it centralized in the portal for traceability.'
        ]
      }
    },
    {
      id: 'cs_audit_security',
      title: 'Digital Signatures & Legal Accountability Guarantee',
      section: 'signoff_audit',
      headline: 'Bank-grade audit records verifying who approved what, and when.',
      keyInstructions: [
        'Every sign-off records the approver email, IP address, timestamp, and asset SHA256 checksum.',
        'Neither the agency nor the client can alter post creative after approval without generating a new revision record.',
        'Export compliance sign-off certificates whenever required for internal audit or legal reporting.'
      ],
      slaExpectation: 'Permanent audit trail archived in SOC2 compliance log.',
      doAndDont: {
        do: [
          'Ensure your designated approver has organizational sign-off authority.',
          'Request an end-of-quarter sign-off audit log from your Account Manager if needed.'
        ],
        dont: [
          'Never permit informal verbal sign-offs for high-spend promotional campaigns.'
        ]
      }
    },
    {
      id: 'cs_faq',
      title: 'External Stakeholder FAQ',
      section: 'faq',
      headline: 'Common questions from brand marketing directors, CMOs, and brand managers.',
      keyInstructions: [
        'Q: Can I review content on my smartphone?\nA: Yes! The Approvals Portal is 100% responsive and optimized for mobile touchscreens.',
        'Q: What happens if I miss an approval deadline?\nA: Posts pending approval are never published automatically without sign-off. They remain held in the queue.',
        'Q: Can multiple executives approve posts?\nA: Yes. We can configure sequential or multi-tier sign-off rules for your organization.'
      ],
      slaExpectation: 'Support team response within 30 minutes during business hours (8am - 6pm EAT).',
      doAndDont: {
        do: [
          'Contact your Account Manager via the in-portal chat if you need an emergency schedule change.'
        ],
        dont: [
          'Do not hesitate to reach out if you need additional stakeholders invited to the portal.'
        ]
      }
    }
  ];

  private apiEndpoints: ApiDocEndpoint[] = [
    {
      id: 'api_auth_login',
      method: 'POST',
      path: '/api/v1/auth/login',
      title: 'Authenticate Agency User & Issue JWT',
      category: 'authentication',
      description: 'Authenticates a user with email and password credentials, returning an access token and user profile with role permissions.',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      requestBodySample: JSON.stringify({
        email: 'versalylabs@gmail.com',
        password: '••••••••••••'
      }, null, 2),
      responseBodySample: JSON.stringify({
        status: 'success',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 'usr_admin_01',
          name: 'Versaly Super Admin',
          email: 'versalylabs@gmail.com',
          role: 'super_admin',
          tenantId: 'global'
        }
      }, null, 2),
      curlSnippet: `curl -X POST https://app.versalyflow.com/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"versalylabs@gmail.com","password":"labversaly-16"}'`
    },
    {
      id: 'api_clients_list',
      method: 'GET',
      path: '/api/v1/clients',
      title: 'List Scoped Brand Clients',
      category: 'clients',
      description: 'Retrieves all brand clients scoped to the authenticated tenant workspace with active contract status and assigned manager.',
      headers: {
        'Authorization': 'Bearer <ACCESS_TOKEN>',
        'Accept': 'application/json'
      },
      responseBodySample: JSON.stringify({
        data: [
          {
            id: 'c1',
            tenantId: 'tenant_agency_01',
            name: 'Mara Safari Lodge',
            industry: 'Hospitality & Luxury Travel',
            monthlyRetainerKes: 250000,
            status: 'active',
            assignedManager: 'Kevin Otieno'
          }
        ],
        total: 1
      }, null, 2),
      curlSnippet: `curl -X GET https://app.versalyflow.com/api/v1/clients \\
  -H "Authorization: Bearer YOUR_TOKEN"`
    },
    {
      id: 'api_content_create',
      method: 'POST',
      path: '/api/v1/content',
      title: 'Draft & Queue Multi-Channel Social Post',
      category: 'content',
      description: 'Creates a new draft or scheduled content item with target channel allocations, media attachments, and optional AI brief references.',
      headers: {
        'Authorization': 'Bearer <ACCESS_TOKEN>',
        'Content-Type': 'application/json'
      },
      requestBodySample: JSON.stringify({
        clientId: 'c1',
        title: 'Sunset Over the Mara Savannah',
        caption: 'Golden hour at Mara Safari Lodge. Experience the great migration up close. Book your 2026 safari today.',
        channels: ['instagram', 'linkedin'],
        stage: 'draft',
        scheduledFor: '2026-10-05T15:30:00+03:00'
      }, null, 2),
      responseBodySample: JSON.stringify({
        status: 'created',
        id: 'post_9921_mara',
        stage: 'draft',
        dispatchStatus: 'idle',
        createdAt: '2026-09-25T23:10:00Z'
      }, null, 2),
      curlSnippet: `curl -X POST https://app.versalyflow.com/api/v1/content \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"clientId":"c1","title":"Savannah Sunset","stage":"draft"}'`
    },
    {
      id: 'api_billing_mpesa_stk',
      method: 'POST',
      path: '/api/v1/billing/mpesa/stk',
      title: 'Initiate Safaricom Lipa Na M-Pesa STK Push',
      category: 'billing',
      description: 'Triggers an instant Daraja 2.0 STK push prompt to the customer phone for invoice settlement in Kenyan Shillings (KES).',
      headers: {
        'Authorization': 'Bearer <ACCESS_TOKEN>',
        'Content-Type': 'application/json'
      },
      requestBodySample: JSON.stringify({
        invoiceId: 'inv_101',
        phoneNumber: '254712345678',
        amountKes: 185000,
        accountReference: 'MARA-OCT-RETAINER'
      }, null, 2),
      responseBodySample: JSON.stringify({
        merchantRequestId: '29115-4926207-1',
        checkoutRequestId: 'ws_CO_25092026231012345',
        responseCode: '0',
        responseDescription: 'Success. Request accepted for processing',
        customerMessage: 'Success. Request accepted for processing'
      }, null, 2),
      curlSnippet: `curl -X POST https://app.versalyflow.com/api/v1/billing/mpesa/stk \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"invoiceId":"inv_101","phoneNumber":"254712345678","amountKes":185000}'`
    },
    {
      id: 'api_telemetry_health',
      method: 'GET',
      path: '/api/v1/telemetry/health',
      title: 'System Health Check & Rate Sentinel Status',
      category: 'telemetry',
      description: 'Returns live node health status, memory footprint, RTT latency, active circuit breaker states, and external API quotas.',
      headers: {
        'Accept': 'application/json'
      },
      responseBodySample: JSON.stringify({
        status: 'healthy',
        timestamp: '2026-09-25T23:10:00Z',
        uptimeSeconds: 86400,
        checks: [
          { name: 'v8_heap', status: 'ok', usedMb: 42.1 },
          { name: 'in_memory_store', status: 'ok', count: 18 },
          { name: 'daraja_gateway', status: 'ok', rttMs: 18.4 }
        ],
        rateSentinels: {
          mpesaDaraja: { quotaLimit: 50, quotaUsed: 14, status: 'nominal' },
          metaGraph: { quotaLimit: 200, quotaUsed: 168, status: 'warning' }
        }
      }, null, 2),
      curlSnippet: `curl -X GET https://app.versalyflow.com/api/v1/telemetry/health`
    },
    {
      id: 'api_webhooks_meta',
      method: 'POST',
      path: '/api/v1/webhooks/meta',
      title: 'Meta Graph Webhook Ingestion (IG/FB)',
      category: 'webhooks',
      description: 'Ingests verified Meta Graph webhook payloads for comments, mentions, direct messages, and reel engagement updates.',
      headers: {
        'X-Hub-Signature-256': 'sha256=d5b3c4...',
        'Content-Type': 'application/json'
      },
      requestBodySample: JSON.stringify({
        object: 'instagram',
        entry: [
          {
            id: 'ig_business_account_1',
            time: 1790320200,
            changes: [
              {
                field: 'comments',
                value: {
                  id: 'comment_9941',
                  text: 'Can we book private game drives for December?',
                  from: { id: 'usr_visitor_12', username: 'safari_enthusiast' }
                }
              }
            ]
          }
        ]
      }, null, 2),
      responseBodySample: JSON.stringify({
        status: 'received',
        routedThreadId: 'th_9941',
        assignedSentiment: 'inquiring'
      }, null, 2),
      curlSnippet: `curl -X POST https://app.versalyflow.com/api/v1/webhooks/meta \\
  -H "X-Hub-Signature-256: sha256=VALID_SIG" \\
  -H "Content-Type: application/json" \\
  -d '{"object":"instagram","entry":[...]}'`
    }
  ];

  /**
   * SOP Query & Retrieval
   */
  public getSops(filter?: {
    category?: SopCategory | 'all';
    search?: string;
    department?: string;
  }): AgencySopItem[] {
    let result = [...this.sops];

    if (filter) {
      if (filter.category && filter.category !== 'all') {
        result = result.filter(s => s.category === filter.category);
      }
      if (filter.department && filter.department !== 'all') {
        result = result.filter(s => s.department === filter.department);
      }
      if (filter.search?.trim()) {
        const q = filter.search.toLowerCase().trim();
        result = result.filter(
          s =>
            s.title.toLowerCase().includes(q) ||
            s.summary.toLowerCase().includes(q) ||
            s.tags.some(t => t.toLowerCase().includes(q)) ||
            s.department.toLowerCase().includes(q)
        );
      }
    }

    return result;
  }

  public getSopById(id: string): AgencySopItem | undefined {
    return this.sops.find(s => s.id === id);
  }

  public exportSopAsMarkdown(sop: AgencySopItem): string {
    return `# ${sop.title}
**Category:** ${sop.category}  
**Department:** ${sop.department}  
**Turnaround SLA:** ${sop.turnaroundSla}  
**Owner Role:** ${sop.ownerRole}  
**Last Updated:** ${sop.lastUpdated}  
**Escalation Path:** ${sop.escalationPath}  

---

## Executive Summary
${sop.summary}

## Operational Procedure Steps
${sop.steps
  .map(
    st => `### Step ${st.stepNumber}: ${st.title}
${st.instruction}
${st.checklist ? st.checklist.map(c => `- [ ] ${c}`).join('\n') : ''}`
  )
  .join('\n\n')}

---
*Exported from Versaly Flow Agency Operating System Knowledge Base*
`;
  }

  /**
   * User Guide Query & Retrieval
   */
  public getUserGuides(filter?: {
    category?: string | 'all';
    audience?: Role | 'all';
    search?: string;
  }): UserGuideArticle[] {
    let result = [...this.userGuides];

    if (filter) {
      if (filter.category && filter.category !== 'all') {
        result = result.filter(g => g.category === filter.category);
      }
      if (filter.audience && filter.audience !== 'all') {
        result = result.filter(
          g => g.targetAudience === 'all' || (Array.isArray(g.targetAudience) && g.targetAudience.includes(filter.audience as Role))
        );
      }
      if (filter.search?.trim()) {
        const q = filter.search.toLowerCase().trim();
        result = result.filter(
          g =>
            g.title.toLowerCase().includes(q) ||
            g.summary.toLowerCase().includes(q) ||
            g.keyFeatures.some(f => f.toLowerCase().includes(q))
        );
      }
    }

    return result;
  }

  public getUserGuideById(id: string): UserGuideArticle | undefined {
    return this.userGuides.find(g => g.id === id);
  }

  /**
   * Client Approval Cheat-Sheets
   */
  public getClientCheatSheets(): ClientApprovalCheatSheet[] {
    return [...this.clientCheatSheets];
  }

  /**
   * API Endpoints Reference
   */
  public getApiEndpoints(filter?: {
    category?: string | 'all';
    method?: string | 'all';
    search?: string;
  }): ApiDocEndpoint[] {
    let result = [...this.apiEndpoints];

    if (filter) {
      if (filter.category && filter.category !== 'all') {
        result = result.filter(e => e.category === filter.category);
      }
      if (filter.method && filter.method !== 'all') {
        result = result.filter(e => e.method === filter.method);
      }
      if (filter.search?.trim()) {
        const q = filter.search.toLowerCase().trim();
        result = result.filter(
          e =>
            e.title.toLowerCase().includes(q) ||
            e.path.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q)
        );
      }
    }

    return result;
  }

  /**
   * Technical Architecture Documentation Specifications
   */
  public getArchitectureOverview(): {
    systemName: string;
    version: string;
    runtime: string;
    containerTopology: string;
    securityStandards: string[];
    coreModulesCount: number;
    tenancyModel: string;
    dataGuarantees: string[];
  } {
    return {
      systemName: 'Versaly Flow Agency Operating System',
      version: '1.0.0 (Enterprise Release)',
      runtime: 'Node.js 22 LTS (Alpine Linux Container)',
      containerTopology: 'Nginx Edge Gateway (Port 3000 Ingress) -> Node Runtime with Dumb-Init',
      securityStandards: ['SOC2 Type II Audit Trails', 'Kenya DPA 2019 Compliance', 'SHA-256 Checksums', 'RBAC Matrix'],
      coreModulesCount: 33,
      tenancyModel: 'Isolated Multi-Tenant Scoping (TenantId Partitioning)',
      dataGuarantees: [
        'Zero cross-tenant data leakage',
        'Strict role-based UI access gating',
        'Defensive error boundary with telemetry bundle preservation',
        'Idempotent M-Pesa Daraja 2.0 transaction reconciliation'
      ]
    };
  }
}

export const documentationService = new DocumentationService();
