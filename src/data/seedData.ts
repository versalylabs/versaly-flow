import {
  TenantWorkspace,
  User,
  ClientBrand,
  ContentItem,
  DigitalAsset,
  Campaign,
  AgencyTask,
  AuditEvent,
  SystemNotification,
  CrmDeal,
  AgencyInvoice,
  RetainerPlan,
  BillableTimeEntry,
  InboxThread,
  CannedResponse,
  WorkflowRule,
  WorkflowExecutionLog,
  AiStrategyBrief,
  WhiteLabelConfig,
  SubscriptionPlan,
  WorkspaceSubscription,
  QuickDraftNote,
  AuditLogEntry,
  ApiKey,
  GdprRequest,
  SecurityPolicyConfig
} from '../types';

/**
 * PulseBrand Agency OS - Initial Seed Data (Kenyan-Based Market)
 * Primary Agency: Apex Media Nairobi (Westlands, Nairobi, Kenya)
 * Currency: KES (Kenyan Shilling), Timezone: Africa/Nairobi (EAT / UTC+3)
 */

export const INITIAL_WORKSPACES: TenantWorkspace[] = [
  {
    id: 'workspace_apex_nairobi',
    name: 'Apex Media Collective Kenya',
    slug: 'apex-media-ke',
    tier: 'boutique',
    timezone: 'Africa/Nairobi (EAT)',
    currency: 'KES (KSh)',
    city: 'Nairobi',
    country: 'Kenya',
    supportEmail: 'habari@apexmedia.co.ke',
    billingProvider: 'mpesa_daraja',
    customDomain: 'portal.apexmedia.co.ke',
    logoUrl: '/logo.png',
    createdAt: '2026-01-15T08:00:00Z',
    memberCount: 6,
    clientCount: 4,
  },
  {
    id: 'workspace_savannah_digital',
    name: 'Savannah Digital Creative',
    slug: 'savannah-digital',
    tier: 'freelancer',
    timezone: 'Africa/Nairobi (EAT)',
    currency: 'KES (KSh)',
    city: 'Mombasa',
    country: 'Kenya',
    supportEmail: 'info@savannahdigital.co.ke',
    billingProvider: 'mpesa_daraja',
    customDomain: 'portal.savannahdigital.co.ke',
    createdAt: '2026-03-01T09:00:00Z',
    memberCount: 3,
    clientCount: 2,
  },
  {
    id: 'workspace_rift_growth',
    name: 'Rift Valley Growth Lab',
    slug: 'rift-valley-growth',
    tier: 'enterprise',
    timezone: 'Africa/Nairobi (EAT)',
    currency: 'KES (KSh)',
    city: 'Nakuru',
    country: 'Kenya',
    supportEmail: 'ops@riftgrowthlab.co.ke',
    billingProvider: 'pesapal',
    customDomain: 'agency.riftgrowthlab.co.ke',
    createdAt: '2026-02-10T10:00:00Z',
    memberCount: 12,
    clientCount: 8,
  }
];

export const INITIAL_WORKSPACE: TenantWorkspace = INITIAL_WORKSPACES[0];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_super_admin_versalylabs',
    name: 'Versaly Platform Admin',
    email: 'versalylabs@gmail.com',
    role: 'super_admin',
    tenantId: 'workspace_apex_nairobi',
    assignedClientIds: ['client_01', 'client_02', 'client_03', 'client_04'],
    createdAt: '2026-01-01T08:00:00Z',
    jobTitle: 'Global Platform Administrator',
    phoneNumber: '+254 700 000 000',
    emailVerified: true,
    mfaEnabled: true,
    lastLoginAt: '2026-09-25T08:00:00Z',
    skills: ['Platform Governance', 'Multi-Tenancy Architecture', 'Security Engineering', 'Full Platform Access'],
    maxWeeklyCapacityHours: 40,
    currentAllocatedHours: 20,
    locationCity: 'Nairobi (Platform HQ)',
    availabilityStatus: 'available'
  },
  {
    id: 'user_01',
    name: 'Wanjiku Mwangi',
    email: 'wanjiku@apexmedia.co.ke',
    role: 'agency_owner',
    tenantId: 'workspace_apex_nairobi',
    assignedClientIds: ['client_01', 'client_02', 'client_03', 'client_04'],
    createdAt: '2026-01-15T08:00:00Z',
    jobTitle: 'Managing Director & Founder',
    phoneNumber: '+254 712 345 678',
    emailVerified: true,
    mfaEnabled: true,
    lastLoginAt: '2026-09-24T09:30:00Z',
    skills: ['Brand Strategy', 'Executive Signoff', 'Commercial Retainers', 'Growth'],
    maxWeeklyCapacityHours: 40,
    currentAllocatedHours: 32,
    locationCity: 'Nairobi (Kilimani HQ)',
    availabilityStatus: 'available'
  },
  {
    id: 'user_02',
    name: 'Kevin Otieno',
    email: 'kevin.otieno@apexmedia.co.ke',
    role: 'account_manager',
    tenantId: 'workspace_apex_nairobi',
    assignedClientIds: ['client_01', 'client_02'],
    createdAt: '2026-02-01T09:30:00Z',
    jobTitle: 'Senior Account Director',
    phoneNumber: '+254 722 890 123',
    emailVerified: true,
    mfaEnabled: false,
    lastLoginAt: '2026-09-24T08:15:00Z',
    skills: ['Client Relations', 'SLA Management', 'Editorial Planning', 'B2B Tech'],
    maxWeeklyCapacityHours: 40,
    currentAllocatedHours: 36,
    locationCity: 'Nairobi (Westlands)',
    availabilityStatus: 'busy'
  },
  {
    id: 'user_03',
    name: 'Amina Abdi',
    email: 'amina.abdi@apexmedia.co.ke',
    role: 'content_creator',
    tenantId: 'workspace_apex_nairobi',
    assignedClientIds: ['client_01', 'client_03'],
    createdAt: '2026-02-10T11:00:00Z',
    jobTitle: 'Creative Copywriter & Visual Lead',
    phoneNumber: '+254 733 456 789',
    emailVerified: true,
    mfaEnabled: false,
    lastLoginAt: '2026-09-24T09:10:00Z',
    skills: ['Short-form Video', 'Swahili Copywriting', 'Instagram Reels', 'TikTok'],
    maxWeeklyCapacityHours: 40,
    currentAllocatedHours: 38,
    locationCity: 'Nairobi (Lavington)',
    availabilityStatus: 'busy'
  },
  {
    id: 'user_06',
    name: 'Dennis Kiprono',
    email: 'dennis.kiprono@apexmedia.co.ke',
    role: 'content_creator',
    tenantId: 'workspace_apex_nairobi',
    assignedClientIds: ['client_02', 'client_04'],
    createdAt: '2026-04-01T09:00:00Z',
    jobTitle: 'Motion Graphic Designer & Editor',
    phoneNumber: '+254 711 223 344',
    emailVerified: true,
    mfaEnabled: false,
    lastLoginAt: '2026-09-24T08:45:00Z',
    skills: ['After Effects', 'Carousel Design', 'Brand Guidelines', 'Typography'],
    maxWeeklyCapacityHours: 40,
    currentAllocatedHours: 24,
    locationCity: 'Nairobi (Karen)',
    availabilityStatus: 'available'
  },
  {
    id: 'user_04',
    name: 'Brian Kiprop',
    email: 'brian@keringetorganics.co.ke',
    role: 'client_approver',
    tenantId: 'workspace_apex_nairobi',
    assignedClientIds: ['client_01'],
    createdAt: '2026-03-01T14:15:00Z',
    jobTitle: 'Head of Marketing, Keringet Organics',
    phoneNumber: '+254 701 234 567',
    emailVerified: true,
    mfaEnabled: false,
    lastLoginAt: '2026-09-24T07:45:00Z',
    skills: ['Client Signoff', 'Organic Terroir', 'Brand Compliance'],
    maxWeeklyCapacityHours: 10,
    currentAllocatedHours: 4,
    locationCity: 'Nairobi / Kericho',
    availabilityStatus: 'available'
  },
  {
    id: 'user_05',
    name: 'Faith Chebet',
    email: 'faith.chebet@twigaenergy.co.ke',
    role: 'client_approver',
    tenantId: 'workspace_apex_nairobi',
    assignedClientIds: ['client_02'],
    createdAt: '2026-03-05T10:00:00Z',
    jobTitle: 'Brand Communications Lead, Twiga Solar',
    phoneNumber: '+254 798 765 432',
    emailVerified: true,
    mfaEnabled: false,
    lastLoginAt: '2026-09-23T16:20:00Z',
    skills: ['B2B Clean Energy', 'Technical Telemetry', 'Corporate Communications'],
    maxWeeklyCapacityHours: 10,
    currentAllocatedHours: 3,
    locationCity: 'Nairobi (Industrial Area)',
    availabilityStatus: 'available'
  }
];

export const INITIAL_CLIENTS: ClientBrand[] = [
  {
    id: 'client_01',
    tenantId: 'workspace_apex_nairobi',
    name: 'Keringet Organics Kenya',
    industry: 'Organic Health & Herbal Wellness',
    website: 'https://keringetorganics.co.ke',
    accentColor: '#10b981',
    status: 'active',
    toneOfVoice: ['Grounded Kenyan botanical wisdom', 'Clinically pure', 'Warm Afro-modern luxury', 'No synthetic hype'],
    brandGuidelinesSummary: 'Sunlit tea estate visuals from Kericho; clean typography with earthy greens; storytelling emphasizing local smallholder farmers.',
    guidelineDetails: {
      primaryFont: 'Cabinet Grotesk / Inter',
      secondaryFont: 'Editorial New / Playfair',
      colorPalette: [
        { name: 'Kericho Emerald', hex: '#10b981' },
        { name: 'Tea Leaf Deep', hex: '#064e3b' },
        { name: 'Highland Mist', hex: '#f0fdf4' },
        { name: 'Rift Gold', hex: '#eab308' }
      ],
      dos: [
        'Feature real Kenyan tea smallholder farmers and Kericho terroir',
        'Use natural daylight photography with sun flares and green leaves',
        'Incorporate clean botanical ingredient callouts and health benefits'
      ],
      donts: [
        'Never use generic western stock models or laboratory sterile aesthetics',
        'Avoid unsubstantiated medical claims or pharmaceutical terminology',
        'Do not use synthetic neon graphics or aggressive sales stickers'
      ],
      targetAudience: 'Health-conscious Kenyan urbanites, wellness seekers, and diaspora enthusiasts.',
      keyHashtags: ['#KeringetOrganics', '#MadeInKenya', '#KerichoTea', '#AfroWellness', '#NaturalHealthKE']
    },
    contacts: [
      {
        name: 'Brian Kiprop',
        email: 'brian@keringetorganics.co.ke',
        phone: '+254 701 234 567',
        roleTitle: 'Head of Marketing',
        isPrimarySignoff: true
      },
      {
        name: 'Wanjira Kamau',
        email: 'w.kamau@keringetorganics.co.ke',
        phone: '+254 722 987 654',
        roleTitle: 'Brand Quality Specialist',
        isPrimarySignoff: false
      }
    ],
    assignedManagerId: 'user_02',
    socialAccounts: [
      {
        id: 'soc_01',
        clientId: 'client_01',
        platform: 'instagram',
        handle: '@keringetorganics',
        accountName: 'Keringet Organics Official',
        connected: true,
        followerCount: 64200,
        lastSyncedAt: '2026-09-24T08:30:00Z',
        tokenHealth: 'healthy',
        tokenExpiresAt: '2026-11-24T08:30:00Z',
        scopesGranted: ['instagram_basic', 'instagram_content_publish', 'pages_read_engagement', 'business_management'],
        permissions: {
          publishContent: true,
          readInsights: true,
          managePages: true,
          directMessages: false
        },
        sandboxMode: false,
        apiEndpointRegion: 'af-south-1 (Nairobi Edge)'
      },
      {
        id: 'soc_02',
        clientId: 'client_01',
        platform: 'tiktok',
        handle: '@keringetwellness',
        accountName: 'Keringet Skin & Wellness KE',
        connected: true,
        followerCount: 112500,
        lastSyncedAt: '2026-09-24T08:30:00Z',
        tokenHealth: 'expiring_soon',
        tokenExpiresAt: '2026-09-27T14:00:00Z', // 3 days remaining
        scopesGranted: ['video.upload', 'video.publish', 'user.info.basic'],
        permissions: {
          publishContent: true,
          readInsights: true,
          managePages: false,
          directMessages: false
        },
        sandboxMode: false,
        apiEndpointRegion: 'global-v2',
        reAuthRequired: false
      }
    ],
    retainerMonthlyValue: 350000, // KES 350,000 / month
    monthlyPostQuota: 20,
    currentMonthPublishedCount: 14,
    pendingApprovalCount: 3,
    createdAt: '2026-02-01T10:00:00Z'
  },
  {
    id: 'client_02',
    tenantId: 'workspace_apex_nairobi',
    name: 'Twiga Solar Technologies',
    industry: 'Renewable Clean Energy & Commercial Solar',
    website: 'https://twigasolar.co.ke',
    accentColor: '#3b82f6',
    status: 'active',
    toneOfVoice: ['Engineering rigor', 'High-impact East African decarbonization', 'Authoritative B2B corporate'],
    brandGuidelinesSummary: 'Rooftop solar commercial installations in Industrial Area Nairobi, crisp telemetry dashboards, farmer irrigation case studies.',
    guidelineDetails: {
      primaryFont: 'Space Grotesk / Inter',
      secondaryFont: 'JetBrains Mono',
      colorPalette: [
        { name: 'Twiga Solar Blue', hex: '#3b82f6' },
        { name: 'Grid Amber', hex: '#f59e0b' },
        { name: 'Nairobi Slate', hex: '#0f172a' },
        { name: 'High-Yield Cyan', hex: '#06b6d4' }
      ],
      dos: [
        'Highlight measurable kWh output, commercial ROI in KES, and diesel offset statistics',
        'Use wide drone shots of solar arrays across tea estates and manufacturing plants',
        'Showcase East African engineering teams and certified technicians in PPE'
      ],
      donts: [
        'Do not use vague climate buzzwords without real engineering or telemetry data',
        'Never post unbranded low-resolution phone photos from construction sites',
        'Avoid comparing against national grid utility in an overly adversarial tone'
      ],
      targetAudience: 'Chief Operations Officers, commercial farm directors, factory managers across East Africa.',
      keyHashtags: ['#TwigaSolar', '#CommercialSolarKE', '#CleanEnergyAfrica', '#KenyaManufacturing']
    },
    contacts: [
      {
        name: 'Faith Chebet',
        email: 'faith.chebet@twigaenergy.co.ke',
        phone: '+254 798 765 432',
        roleTitle: 'Brand Communications Lead',
        isPrimarySignoff: true
      },
      {
        name: 'Eng. Dennis Mutua',
        email: 'd.mutua@twigaenergy.co.ke',
        phone: '+254 711 334 556',
        roleTitle: 'Chief Technical Officer',
        isPrimarySignoff: false
      }
    ],
    assignedManagerId: 'user_02',
    socialAccounts: [
      {
        id: 'soc_03',
        clientId: 'client_02',
        platform: 'linkedin',
        handle: 'twiga-solar-technologies',
        accountName: 'Twiga Solar Technologies Africa',
        connected: true,
        followerCount: 41800,
        lastSyncedAt: '2026-09-24T09:00:00Z',
        tokenHealth: 'healthy',
        tokenExpiresAt: '2026-12-15T10:00:00Z',
        scopesGranted: ['w_member_social', 'r_organization_social', 'rw_organization_admin'],
        permissions: {
          publishContent: true,
          readInsights: true,
          managePages: true,
          directMessages: false
        },
        sandboxMode: false,
        apiEndpointRegion: 'eu-west-1'
      },
      {
        id: 'soc_04',
        clientId: 'client_02',
        platform: 'twitter',
        handle: '@TwigaSolarKE',
        accountName: 'Twiga Solar Africa',
        connected: true,
        followerCount: 22600,
        lastSyncedAt: '2026-09-24T09:00:00Z',
        tokenHealth: 'healthy',
        tokenExpiresAt: '2026-10-30T12:00:00Z',
        scopesGranted: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
        permissions: {
          publishContent: true,
          readInsights: true,
          managePages: false,
          directMessages: false
        },
        sandboxMode: true, // Sandbox mock mode testing active
        apiEndpointRegion: 'api.x.com-v2'
      }
    ],
    retainerMonthlyValue: 520000, // KES 520,000 / month
    monthlyPostQuota: 16,
    currentMonthPublishedCount: 12,
    pendingApprovalCount: 2,
    createdAt: '2026-02-15T11:30:00Z'
  },
  {
    id: 'client_03',
    tenantId: 'workspace_apex_nairobi',
    name: 'Mount Kenya Specialty Coffee Roasters',
    industry: 'Direct-Trade Specialty Arabica',
    website: 'https://mtkenyacoffee.co.ke',
    accentColor: '#f59e0b',
    status: 'active',
    toneOfVoice: ['Sensory & terroir-focused (Nyeri SL28/SL34)', 'Passionate barista craft', 'Celebrating cooperative coffee farmers'],
    brandGuidelinesSummary: 'Rich volcanic soil tones, latte art in Nairobi cafe settings, origin processing wet mills on Mt. Kenya slopes.',
    assignedManagerId: 'user_02',
    socialAccounts: [
      {
        id: 'soc_05',
        clientId: 'client_03',
        platform: 'instagram',
        handle: '@mtkenyaroasters',
        accountName: 'Mount Kenya Coffee Roasters',
        connected: true,
        followerCount: 38400,
        lastSyncedAt: '2026-09-23T18:00:00Z',
        tokenHealth: 'healthy',
        tokenExpiresAt: '2026-11-10T16:00:00Z',
        scopesGranted: ['instagram_basic', 'instagram_content_publish', 'pages_show_list'],
        permissions: {
          publishContent: true,
          readInsights: true,
          managePages: false,
          directMessages: false
        },
        sandboxMode: false,
        apiEndpointRegion: 'af-south-1 (Nairobi Edge)'
      },
      {
        id: 'soc_07',
        clientId: 'client_03',
        platform: 'youtube',
        handle: '@MountKenyaCoffeeRoasters',
        accountName: 'Mt. Kenya Roastery TV',
        connected: true,
        followerCount: 14200,
        lastSyncedAt: '2026-09-24T06:00:00Z',
        tokenHealth: 'healthy',
        tokenExpiresAt: '2026-12-01T12:00:00Z',
        scopesGranted: ['youtube.upload', 'youtube.readonly'],
        permissions: {
          publishContent: true,
          readInsights: true,
          managePages: false,
          directMessages: false
        },
        sandboxMode: false,
        apiEndpointRegion: 'global-v3'
      }
    ],
    retainerMonthlyValue: 280000, // KES 280,000 / month
    monthlyPostQuota: 18,
    currentMonthPublishedCount: 11,
    pendingApprovalCount: 1,
    createdAt: '2026-03-01T09:00:00Z'
  },
  {
    id: 'client_04',
    tenantId: 'workspace_apex_nairobi',
    name: 'Nairobi Urban Athletics (Mbio Club)',
    industry: 'Performance Sportswear & High-Altitude Marathon Gear',
    website: 'https://mbioclub.co.ke',
    accentColor: '#ec4899',
    status: 'onboarding',
    toneOfVoice: ['Relentless Iten training grit', 'Kenyan athletic legacy', 'Modern street-running culture in Nairobi'],
    brandGuidelinesSummary: 'Morning mist runs in Karura Forest, high-altitude training camps in Iten, high-contrast typography.',
    onboardingChecklist: {
      ndaSigned: true,
      retainerContractSigned: true,
      brandAssetsReceived: true,
      socialAccessGranted: false,
      primaryApproverConfirmed: true,
      kickoffCompleted: false
    },
    onboardingProgress: 66,
    guidelineDetails: {
      primaryFont: 'Druk Wide / Inter',
      secondaryFont: 'Space Mono',
      colorPalette: [
        { name: 'Mbio Hot Pink', hex: '#ec4899' },
        { name: 'Iten Track Ochre', hex: '#b45309' },
        { name: 'Nairobi Asphalt', hex: '#1e293b' }
      ],
      dos: [
        'Capture authentic morning condensation and marathon pace splits in Karura Forest',
        'Showcase real Kenyan distance runners and track spikes on red clay'
      ],
      donts: [
        'Do not feature generic indoor gym treadmills',
        'Avoid leisurely fashion poses that feel disconnected from athletic training'
      ],
      targetAudience: 'Marathoners, weekend running club enthusiasts in Nairobi, high-altitude fitness athletes.',
      keyHashtags: ['#MbioClub', '#ItenTrained', '#KaruraRunners', '#KenyanAthletics']
    },
    contacts: [
      {
        name: 'Kipchumba Lagat',
        email: 'kip@mbioclub.co.ke',
        phone: '+254 733 445 566',
        roleTitle: 'Brand Director & Co-Founder',
        isPrimarySignoff: true
      }
    ],
    assignedManagerId: 'user_02',
    socialAccounts: [
      {
        id: 'soc_06',
        platform: 'tiktok',
        handle: '@mbioclubnairobi',
        accountName: 'Mbio Club Nairobi',
        connected: false,
        followerCount: 9800,
      }
    ],
    retainerMonthlyValue: 400000, // KES 400,000 / month
    monthlyPostQuota: 24,
    currentMonthPublishedCount: 0,
    pendingApprovalCount: 0,
    createdAt: '2026-09-18T14:00:00Z'
  },

  // Client for Savannah Digital Workspace (Tenant Isolation verification)
  {
    id: 'client_05',
    tenantId: 'workspace_savannah_digital',
    name: 'Diani Beachfront Resorts',
    industry: 'Coastal Luxury Hospitality & Marine Eco-Tourism',
    website: 'https://dianibeachfront.co.ke',
    accentColor: '#06b6d4',
    status: 'active',
    toneOfVoice: ['Coastal serenity', 'Swahili coastal architectural elegance', 'Warm Kenyan ocean hospitality'],
    brandGuidelinesSummary: 'Turquoise Indian Ocean waters, dhow sunset sails, Swahili seafood cuisine.',
    assignedManagerId: 'user_01',
    socialAccounts: [
      {
        id: 'soc_07',
        platform: 'instagram',
        handle: '@dianibeachfront',
        accountName: 'Diani Beachfront Luxury',
        connected: true,
        followerCount: 52100,
      }
    ],
    retainerMonthlyValue: 320000,
    monthlyPostQuota: 16,
    currentMonthPublishedCount: 8,
    pendingApprovalCount: 1,
    createdAt: '2026-03-10T10:00:00Z'
  }
];

export const INITIAL_CONTENT: ContentItem[] = [
  {
    id: 'post_01',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_01',
    campaignId: 'camp_01',
    creatorId: 'user_03',
    title: 'Kericho Purple Tea & Moringa Antioxidant Barrier Serum Launch',
    caption: 'Did you know that high-altitude purple tea grown on the slopes of the Mau Escarpment yields 3x more anthocyanins than conventional green tea?\n\nOur new cold-pressed formula delivers unmatched defense against equatorial UV oxidative stress. Formulated and packaged right here in Nairobi.\n\nPre-orders now live. Link in bio! 🌿🇰🇪\n\n#KenyanSkincare #CleanBeautyKE #PurpleTeaMagic #NairobiBeauty',
    platforms: ['instagram', 'tiktok'],
    format: 'carousel',
    stage: 'client_review',
    mediaUrls: [],
    scheduledDate: '2026-09-28T16:00:00Z',
    tags: ['education', 'product_reveal', 'made_in_kenya'],
    approvalHistory: [
      {
        id: 'appr_01',
        contentId: 'post_01',
        userId: 'user_03',
        userName: 'Amina Abdi',
        userRole: 'content_creator',
        action: 'submitted',
        notes: 'Carousel graphics match Keringet updated earthy green and Kericho stone palette.',
        timestamp: '2026-09-24T06:15:00Z'
      },
      {
        id: 'appr_02',
        contentId: 'post_01',
        userId: 'user_02',
        userName: 'Kevin Otieno',
        userRole: 'account_manager',
        action: 'approved',
        notes: 'Passed internal compliance review. Routed to Brian Kiprop for final client approval.',
        timestamp: '2026-09-24T08:00:00Z'
      }
    ],
    feedbackNotes: 'Waiting on client approval from Brian Kiprop before Friday 4 PM EAT deadline.',
    versions: [
      {
        versionNumber: 1,
        title: 'Kericho Purple Tea & Moringa Serum Launch (Initial Draft)',
        caption: 'Mau Escarpment tea serum. Pre-orders live now!',
        modifiedBy: 'user_03',
        modifiedByName: 'Amina Abdi',
        timestamp: '2026-09-23T15:20:00Z',
        changeSummary: 'First creator draft'
      },
      {
        versionNumber: 2,
        title: 'Kericho Purple Tea & Moringa Antioxidant Barrier Serum Launch',
        caption: 'Did you know that high-altitude purple tea grown on the slopes of the Mau Escarpment yields 3x more anthocyanins than conventional green tea?\n\nOur new cold-pressed formula delivers unmatched defense against equatorial UV oxidative stress. Formulated and packaged right here in Nairobi.\n\nPre-orders now live. Link in bio! 🌿🇰🇪\n\n#KenyanSkincare #CleanBeautyKE #PurpleTeaMagic #NairobiBeauty',
        modifiedBy: 'user_02',
        modifiedByName: 'Kevin Otieno',
        timestamp: '2026-09-24T08:00:00Z',
        changeSummary: 'Expanded hook with anthocyanin scientific data and regional hashtags'
      }
    ],
    internalComments: [
      {
        id: 'comm_01',
        userId: 'user_02',
        userName: 'Kevin Otieno',
        userRole: 'account_manager',
        comment: 'Amina, make sure slide 4 explicitly highlights that this is packaged locally in Nairobi.',
        timestamp: '2026-09-24T07:15:00Z'
      },
      {
        id: 'comm_02',
        userId: 'user_03',
        userName: 'Amina Abdi',
        userRole: 'content_creator',
        comment: 'Done! Slide 4 graphics now show the Naivasha road fulfillment facility.',
        timestamp: '2026-09-24T07:50:00Z'
      }
    ],
    createdAt: '2026-09-23T15:20:00Z',
    updatedAt: '2026-09-24T08:00:00Z'
  },
  {
    id: 'post_02',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_02',
    campaignId: 'camp_02',
    creatorId: 'user_03',
    title: 'Commercial Solar Microgrids: Cutting Factory Energy Bills by 48% in Nakuru',
    caption: 'Heavy manufacturers in Kenya face peak-rate grid tariffs exceeding KSh 22 per kWh. Twiga Solar recently commissioned a 750kWp rooftop installation for a Nakuru agro-processor.\n\nResults after 90 days:\n→ KSh 1.8M saved monthly on power expenses\n→ 99.4% uptime with automated battery backup\n→ Zero diesel generator burn during daytime peak hours\n\nReady to transition your Kenyan manufacturing facility to clean commercial solar? Reach out to our engineering team.',
    platforms: ['linkedin', 'twitter'],
    format: 'single_image',
    stage: 'approved',
    mediaUrls: [],
    scheduledDate: '2026-09-25T13:30:00Z',
    tags: ['clean_energy_ke', 'manufacturing_kenya', 'b2b_solar'],
    approvalHistory: [
      {
        id: 'appr_03',
        contentId: 'post_02',
        userId: 'user_05',
        userName: 'Faith Chebet',
        userRole: 'client_approver',
        action: 'approved',
        notes: 'Engineering metrics verified against EPRA compliance standards. Good to post at 10:30 AM EAT.',
        timestamp: '2026-09-24T07:45:00Z'
      }
    ],
    createdAt: '2026-09-22T10:00:00Z',
    updatedAt: '2026-09-24T07:45:00Z'
  },
  {
    id: 'post_03',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_03',
    creatorId: 'user_03',
    title: 'Nyeri SL28 Anaerobic Washed: Harvest Notes from Othaya Farmers Cooperative',
    caption: 'Crisp blackcurrant acidity, bergamot florality, and sweet cane sugar finish. Hand-picked at 1,850m elevation on the volcanic slopes of Mt. Kenya.\n\nTasting flights available starting this weekend at our Westlands roastery bar!\n\n#SpecialtyCoffeeKE #NyeriCoffee #KenyanArabica #SingleOriginKE',
    platforms: ['instagram'],
    format: 'single_image',
    stage: 'scheduled',
    mediaUrls: ['https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=1080&auto=format&fit=crop'],
    scheduledDate: '2026-09-26T14:00:00Z',
    tags: ['limited_release', 'roastery_update', 'coffee_origin'],
    approvalHistory: [],
    createdAt: '2026-09-21T11:00:00Z',
    updatedAt: '2026-09-23T16:00:00Z',
    dispatchStatus: 'queued',
    targetTimezone: 'Africa/Nairobi (EAT +03:00)',
    firstCommentText: '#SpecialtyCoffee #BaristaLife #KenyanCoffeeLovers #NyeriSL28 #DirectTradeAfrica',
    preFlightCheck: {
      aspectRatioValid: true,
      aspectRatioNote: 'Square 1:1 format compliant with Instagram Feed guidelines',
      captionLengthValid: true,
      captionLengthNote: '228 chars within 2,200 char Instagram limit',
      hasRequiredHashtags: true,
      mediaEncodingValid: true,
      passedAll: true
    }
  },
  {
    id: 'post_05',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_04',
    creatorId: 'user_06',
    title: 'Karura Forest Morning Tempo 15k: Meetup & Shoe Trial',
    caption: 'Join the Mbio Club pace pacers this Saturday 6:30 AM at Gate A, Karura Forest. Free hydration and carbon plate road tests courtesy of Nairobi Urban Athletics. Lace up, Kenya! 🇰🇪🏃‍♂️⚡️\n\n#MbioClub #KaruraRunners #NairobiFitness #MarathonSeason',
    platforms: ['tiktok', 'instagram'],
    format: 'video_reel',
    stage: 'scheduled',
    mediaUrls: ['https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1080&auto=format&fit=crop'],
    scheduledDate: '2026-09-27T06:30:00Z',
    tags: ['weekend_run', 'karura', 'community'],
    approvalHistory: [],
    createdAt: '2026-09-22T14:00:00Z',
    updatedAt: '2026-09-24T09:00:00Z',
    dispatchStatus: 'queued',
    targetTimezone: 'Africa/Nairobi (EAT +03:00)',
    firstCommentText: 'Meeting point location pin pinned on our link in bio! Arrive by 6:15 AM for warm-up dynamic stretches. 🏃',
    preFlightCheck: {
      aspectRatioValid: true,
      aspectRatioNote: '9:16 vertical reel optimized for mobile TikTok/IG',
      videoDurationSeconds: 28,
      videoDurationValid: true,
      captionLengthValid: true,
      hasRequiredHashtags: true,
      mediaEncodingValid: true,
      passedAll: true
    }
  },
  {
    id: 'post_06',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_01',
    campaignId: 'camp_01',
    creatorId: 'user_03',
    title: 'Moringa Superfood Hydration Mist: Midday Desk Reset',
    caption: 'Keep your barrier locked during long workdays in air-conditioned offices. Infused with organic Naivasha rosewater and cold-pressed Kericho moringa seed extract.\n\nAvailable now across Goodlife Pharmacies in Nairobi.',
    platforms: ['instagram', 'facebook'],
    format: 'carousel',
    stage: 'scheduled',
    mediaUrls: ['https://images.unsplash.com/photo-1608248597359-0021c17ca4ca?w=1080&auto=format&fit=crop'],
    scheduledDate: '2026-09-29T11:00:00Z',
    tags: ['skincare', 'nairobi_wellness', 'moringa'],
    approvalHistory: [],
    createdAt: '2026-09-23T10:00:00Z',
    updatedAt: '2026-09-24T10:00:00Z',
    dispatchStatus: 'retrying',
    retryCount: 1,
    maxRetries: 3,
    lastDispatchAttempt: '2026-09-24T11:00:00Z',
    dispatchErrorNote: 'Instagram Graph API 429 Too Many Requests (Rate limit backoff active; auto-retry scheduled)',
    targetTimezone: 'Africa/Nairobi (EAT +03:00)',
    firstCommentText: '#CleanBeautyKenya #MoringaOil #NairobiSkincare #AfroModernLuxury',
    preFlightCheck: {
      aspectRatioValid: true,
      aspectRatioNote: '4:5 portrait carousel cards',
      captionLengthValid: true,
      hasRequiredHashtags: true,
      mediaEncodingValid: true,
      passedAll: true
    }
  },
  {
    id: 'post_07',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_02',
    campaignId: 'camp_02',
    creatorId: 'user_06',
    title: 'Kenya Power Time-of-Use Tariffs vs Commercial Solar PPA',
    caption: 'Are you overpaying for off-peak industrial power? We broke down the true unit cost of industrial power in Athi River and Thika. Download our executive whitepaper.\n\nLink in comments below.',
    platforms: ['linkedin'],
    format: 'single_image',
    stage: 'scheduled',
    mediaUrls: ['https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1080&auto=format&fit=crop'],
    scheduledDate: '2026-09-30T09:15:00Z',
    tags: ['solar_ppa', 'clean_energy_ke', 'kenya_manufacturing'],
    approvalHistory: [],
    createdAt: '2026-09-23T12:00:00Z',
    updatedAt: '2026-09-24T08:30:00Z'
  },
  {
    id: 'post_08',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_03',
    creatorId: 'user_03',
    title: 'Cold Brew Bottling Line at Mount Kenya Roastery',
    caption: 'Behind the scenes: steeped for 22 hours in purified Aberdare mountain spring water. Bottled fresh weekly in recyclable glass bottles.',
    platforms: ['instagram', 'tiktok'],
    format: 'video_reel',
    stage: 'scheduled',
    mediaUrls: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1080&auto=format&fit=crop'],
    scheduledDate: '2026-10-02T13:00:00Z',
    tags: ['cold_brew', 'specialty_coffee', 'nairobi_eats'],
    approvalHistory: [],
    createdAt: '2026-09-24T07:00:00Z',
    updatedAt: '2026-09-24T09:15:00Z'
  },

  // Post in Savannah Digital tenant (for multi-tenant isolation testing)
  {
    id: 'post_04',
    tenantId: 'workspace_savannah_digital',
    clientId: 'client_05',
    creatorId: 'user_01',
    title: 'Sunset Dhow Excursions in Wasini Island',
    caption: 'Sail the calm waters of the Kisite-Mpunguti Marine Park as the sun dips beneath the horizon. Experience coastal magic with Diani Beachfront Resorts.',
    platforms: ['instagram'],
    format: 'single_image',
    stage: 'approved',
    mediaUrls: [],
    scheduledDate: '2026-09-27T15:00:00Z',
    tags: ['coastal_kenya', 'magicalkenya'],
    approvalHistory: [],
    createdAt: '2026-09-22T08:00:00Z',
    updatedAt: '2026-09-23T12:00:00Z'
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp_01',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_01',
    name: 'Q3 Mau Escarpment Herbal Defense Push',
    objective: 'product_launch',
    startDate: '2026-09-15',
    endDate: '2026-10-15',
    budgetAllocated: 250000, // KES 250,000
    budgetSpent: 115000, // KES 115,000
    status: 'in_progress',
    targetPostCount: 12,
    publishedPostCount: 4,
    description: 'National launch campaign for the Purple Tea & Moringa antioxidant skincare line, targeting modern Nairobi professionals and beauty retail distributors.',
    targetAudience: 'Nairobi corporate women & men (24-42) seeking regional clean skincare',
    primaryHashtag: '#KenyanSkincare',
    kpis: [
      { metric: 'Serum Pre-orders', target: 800, current: 420, unit: 'units' },
      { metric: 'Instagram Reach', target: 120000, current: 78500, unit: 'accounts' },
      { metric: 'TikTok Video Views', target: 250000, current: 164000, unit: 'views' }
    ],
    milestones: [
      { id: 'm1', title: 'Product Photography & Asset Approval', targetDate: '2026-09-18', completed: true, assignedRole: 'Creative Director' },
      { id: 'm2', title: 'Goodlife Pharmacy Stockist Announcement', targetDate: '2026-09-25', completed: true, assignedRole: 'Account Manager' },
      { id: 'm3', title: 'Mid-Campaign Influencer PR Box Unboxing', targetDate: '2026-10-02', completed: false, assignedRole: 'Content Creator' },
      { id: 'm4', title: 'Campaign Post-Mortem & ROI Report', targetDate: '2026-10-15', completed: false, assignedRole: 'Lead Strategist' }
    ]
  },
  {
    id: 'camp_02',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_02',
    name: 'East Africa Clean Energy Industrial Forum 2026',
    objective: 'lead_generation',
    startDate: '2026-09-01',
    endDate: '2026-10-05',
    budgetAllocated: 400000, // KES 400,000
    budgetSpent: 260000, // KES 260,000
    status: 'in_progress',
    targetPostCount: 8,
    publishedPostCount: 5,
    description: 'High-intent B2B thought-leadership campaign positioning Twiga Solar as the premier commercial solar PPA partner for industrial manufacturing clusters in Athi River, Thika, and Nakuru.',
    targetAudience: 'C-suite manufacturing executives, industrial plant managers, CFOs',
    primaryHashtag: '#SolarKE',
    kpis: [
      { metric: 'Industrial Audit Inquiries', target: 25, current: 18, unit: 'MQLs' },
      { metric: 'LinkedIn Whitepaper Downloads', target: 350, current: 285, unit: 'downloads' },
      { metric: 'Executive Engagement Rate', target: 4.5, current: 5.2, unit: '%' }
    ],
    milestones: [
      { id: 'm5', title: 'EPRA Tariff Analysis Whitepaper Release', targetDate: '2026-09-08', completed: true, assignedRole: 'Senior Copywriter' },
      { id: 'm6', title: 'Nakuru Agro-Processing Case Study Video', targetDate: '2026-09-24', completed: true, assignedRole: 'Videographer' },
      { id: 'm7', title: 'KICC Industrial Energy Summit Panel Promo', targetDate: '2026-09-30', completed: false, assignedRole: 'Account Manager' }
    ]
  },
  {
    id: 'camp_03',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_03',
    name: 'Single-Origin Mt. Kenya Micro-Lot Spring Series',
    objective: 'brand_awareness',
    startDate: '2026-09-20',
    endDate: '2026-10-31',
    budgetAllocated: 180000,
    budgetSpent: 45000,
    status: 'in_progress',
    targetPostCount: 10,
    publishedPostCount: 2,
    description: 'Artisanal roastery release celebrating Nyeri SL28 volcanic terroir, anaerobic cold brew processing, and direct trade relationships with cooperative farmers.',
    targetAudience: 'Nairobi specialty coffee lovers, café owners, diaspora buyers',
    primaryHashtag: '#SpecialtyCoffeeKE',
    kpis: [
      { metric: 'Tasting Flight Bookings', target: 200, current: 65, unit: 'seats' },
      { metric: 'Direct Webshop 250g Bag Sales', target: 500, current: 140, unit: 'bags' }
    ],
    milestones: [
      { id: 'm8', title: 'Farmer Cooperative Harvest Video Premiere', targetDate: '2026-09-23', completed: true, assignedRole: 'Content Creator' },
      { id: 'm9', title: 'Weekend Cupping Sessions at Westlands Bar', targetDate: '2026-10-03', completed: false, assignedRole: 'Account Manager' }
    ]
  },
  {
    id: 'camp_04',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_04',
    name: 'Karura Trail Tempo & Standard Chartered Marathon Countdown',
    objective: 'community_growth',
    startDate: '2026-09-10',
    endDate: '2026-10-25',
    budgetAllocated: 320000,
    budgetSpent: 190000,
    status: 'in_progress',
    targetPostCount: 14,
    publishedPostCount: 6,
    description: 'Community training hub and gear test activations leading up to the StanChart Nairobi Marathon, engaging recreational and competitive runners across Nairobi clubs.',
    targetAudience: 'Nairobi fitness community, weekend runners, Karura trail athletes',
    primaryHashtag: '#MbioClub',
    kpis: [
      { metric: 'Weekly Run Attendees', target: 250, current: 210, unit: 'runners' },
      { metric: 'Shoe Trial Registrations', target: 150, current: 135, unit: 'trials' }
    ],
    milestones: [
      { id: 'm10', title: 'Karura Forest Route Map & Pacing Drops', targetDate: '2026-09-12', completed: true, assignedRole: 'Graphic Designer' },
      { id: 'm11', title: 'Carbo-Load Social Evening at Alchemist', targetDate: '2026-10-18', completed: false, assignedRole: 'Event Coordinator' }
    ]
  }
];

export const INITIAL_TASKS: AgencyTask[] = [
  {
    id: 'task_01',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_01',
    campaignId: 'camp_01',
    assignedToUserId: 'user_03',
    assignedToUserName: 'Amina Abdi',
    assignedToUserRole: 'Senior Content Creator',
    title: 'Finalize TikTok Video Edit for Purple Tea Serum',
    description: 'Ensure Swahili voiceover subtitle pacing matches Kenyan TikTok trend aesthetics and 9:16 vertical crop.',
    priority: 'urgent',
    status: 'in_progress',
    dueDate: '2026-09-25T18:00:00Z',
    contentId: 'post_01',
    category: 'creative_production',
    estimatedHours: 4,
    actualHours: 2.5,
    checklist: [
      { id: 'sub_01', title: 'Import high-res b-roll from Mau Escarpment shoot', completed: true },
      { id: 'sub_02', title: 'Add Swahili subtitle captions with highlight emphasis', completed: true },
      { id: 'sub_03', title: 'Color-grade tea extraction macro shot in Rec.709', completed: false },
      { id: 'sub_04', title: 'Export 1080x1920 MP4 with loudness normalized to -14 LUFS', completed: false }
    ]
  },
  {
    id: 'task_02',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_02',
    campaignId: 'camp_02',
    assignedToUserId: 'user_02',
    assignedToUserName: 'Kevin Otieno',
    assignedToUserRole: 'Account Manager',
    title: 'Confirm Client Sign-Off on Nakuru Case Study Specs',
    description: 'Faith Chebet confirmed EPRA energy output numbers. Final verification of commercial tariffs.',
    priority: 'medium',
    status: 'done',
    dueDate: '2026-09-24T12:00:00Z',
    contentId: 'post_02',
    category: 'client_approval',
    estimatedHours: 2,
    actualHours: 1.5,
    checklist: [
      { id: 'sub_05', title: 'Cross-check KSh 1.8M monthly savings with engineering log', completed: true },
      { id: 'sub_06', title: 'Submit proof packet to Faith Chebet on client portal', completed: true },
      { id: 'sub_07', title: 'Log client approval signature in audit record', completed: true }
    ]
  },
  {
    id: 'task_03',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_03',
    campaignId: 'camp_03',
    assignedToUserId: 'user_06',
    assignedToUserName: 'Wanjiku Mwangi',
    assignedToUserRole: 'Brand Strategist',
    title: 'Draft Tasting Flight Copy for Nyeri SL28 Micro-Lot',
    description: 'Write evocative origin narrative focusing on Othaya high-altitude volcanic terroir and tasting notes.',
    priority: 'high',
    status: 'in_review',
    dueDate: '2026-09-26T10:00:00Z',
    contentId: 'post_03',
    category: 'copywriting',
    estimatedHours: 3,
    actualHours: 2.8,
    checklist: [
      { id: 'sub_08', title: 'Interview head roaster regarding cupping score (88.5)', completed: true },
      { id: 'sub_09', title: 'Draft Instagram carousel copy and hashtags', completed: true },
      { id: 'sub_10', title: 'Verify farmer cooperative profit-sharing disclaimer', completed: false }
    ]
  },
  {
    id: 'task_04',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_04',
    campaignId: 'camp_04',
    assignedToUserId: 'user_03',
    assignedToUserName: 'Amina Abdi',
    assignedToUserRole: 'Senior Content Creator',
    title: 'Produce Karura Forest Pacing Strategy Infographic',
    description: 'Create multi-panel split carousel mapping 5k, 10k, and 15k routes with elevation profiles.',
    priority: 'medium',
    status: 'todo',
    dueDate: '2026-09-27T08:00:00Z',
    contentId: 'post_05',
    category: 'creative_production',
    estimatedHours: 5,
    actualHours: 0,
    checklist: [
      { id: 'sub_11', title: 'Export GPX elevation data from Karura Gate A trail', completed: false },
      { id: 'sub_12', title: 'Design high-contrast brand layout using Space Mono', completed: false },
      { id: 'sub_13', title: 'Include hydration stops and pace team meeting points', completed: false }
    ]
  },
  {
    id: 'task_05',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_01',
    campaignId: 'camp_01',
    assignedToUserId: 'user_02',
    assignedToUserName: 'Kevin Otieno',
    assignedToUserRole: 'Account Manager',
    title: 'Prepare Goodlife Pharmacy Retail Influencer Gifting Packs',
    description: 'Assemble 15 personalized wooden PR boxes with handwritten notes and full-size serum bottles.',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-09-28T14:00:00Z',
    contentId: 'post_06',
    category: 'strategy',
    estimatedHours: 6,
    actualHours: 3.5,
    checklist: [
      { id: 'sub_14', title: 'Confirm delivery courier addresses in Nairobi suburbs', completed: true },
      { id: 'sub_15', title: 'Print custom Mau Escarpment botanical inserts', completed: true },
      { id: 'sub_16', title: 'Dispatch packages via tracked riders', completed: false }
    ]
  },
  {
    id: 'task_06',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_02',
    campaignId: 'camp_02',
    assignedToUserId: 'user_06',
    assignedToUserName: 'Wanjiku Mwangi',
    assignedToUserRole: 'Brand Strategist',
    title: 'Audit EPRA Time-of-Use Industrial Tariff Whitepaper',
    description: 'Ensure accurate mathematical breakdown of heavy machinery energy savings for B2B LinkedIn distribution.',
    priority: 'urgent',
    status: 'todo',
    dueDate: '2026-09-25T11:00:00Z',
    contentId: 'post_07',
    category: 'ad_ops',
    estimatedHours: 4,
    actualHours: 0,
    checklist: [
      { id: 'sub_17', title: 'Review Kenya Gazette EPRA tariff schedules', completed: false },
      { id: 'sub_18', title: 'Format PDF download landing page link on Twiga Solar', completed: false }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'audit_01',
    tenantId: 'workspace_apex_nairobi',
    userId: 'user_01',
    userName: 'Wanjiku Mwangi',
    category: 'system',
    action: 'Kenyan Multi-Tenancy Architecture Initialized',
    details: 'Tenant isolation active for Apex Media Nairobi (KES / EAT). Multi-workspace sandbox ready.',
    timestamp: '2026-09-24T09:40:00Z'
  },
  {
    id: 'audit_02',
    tenantId: 'workspace_apex_nairobi',
    userId: 'user_02',
    userName: 'Kevin Otieno',
    category: 'approval',
    action: 'Content Approved Internally',
    targetId: 'post_01',
    details: 'Kericho purple tea serum campaign reviewed and dispatched to client Brian Kiprop.',
    timestamp: '2026-09-24T08:00:00Z'
  },
  {
    id: 'audit_03',
    tenantId: 'workspace_apex_nairobi',
    userId: 'user_05',
    userName: 'Faith Chebet',
    category: 'approval',
    action: 'Client Sign-off Recorded',
    targetId: 'post_02',
    details: 'Twiga Solar Nakuru case study scheduled for publishing on LinkedIn & X.',
    timestamp: '2026-09-24T07:45:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif_01',
    title: 'Multi-Tenancy Active',
    message: 'Agency workspace isolation and tenant boundary enforcement enabled for Kenyan market.',
    type: 'success',
    timestamp: '2026-09-24T09:45:00Z',
    read: false
  },
  {
    id: 'notif_02',
    title: 'Client Review Pending',
    message: 'Keringet Organics Kenya has 1 pending carousel awaiting approval before tomorrow.',
    type: 'warning',
    timestamp: '2026-09-24T08:05:00Z',
    read: false
  }
];

export const INITIAL_DIGITAL_ASSETS: DigitalAsset[] = [
  {
    id: 'asset_01',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_01',
    name: 'Keringet Purple Tea Serum Hero Macro Shot',
    url: 'https://images.unsplash.com/photo-1608248597359-0021c17ca4ca?w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1608248597359-0021c17ca4ca?w=300&auto=format&fit=crop',
    category: 'photography',
    fileFormat: 'JPG',
    fileSizeBytes: 2450000,
    dimensions: { width: 2400, height: 2400 },
    aspectRatio: '1:1',
    tags: ['skincare', 'mau_escarpment', 'purple_tea', 'hero_product'],
    usageCount: 4,
    linkedPostIds: ['post_01', 'post_06'],
    uploadedBy: 'user_03',
    uploadedByName: 'Amina Abdi',
    uploadedAt: '2026-09-21T09:30:00Z'
  },
  {
    id: 'asset_02',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_01',
    name: 'Keringet Organics Vector Wordmark & Leaf Emblem',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop',
    category: 'logo',
    fileFormat: 'PNG',
    fileSizeBytes: 680000,
    dimensions: { width: 1800, height: 600 },
    aspectRatio: 'free',
    tags: ['brand_identity', 'official_logo', 'vector', 'transparent'],
    usageCount: 12,
    linkedPostIds: ['post_01', 'post_06'],
    uploadedBy: 'user_02',
    uploadedByName: 'Kevin Otieno',
    uploadedAt: '2026-09-15T10:00:00Z'
  },
  {
    id: 'asset_03',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_02',
    name: 'Nakuru Commercial Agro-Processing Rooftop Solar Array (750kWp)',
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=300&auto=format&fit=crop',
    category: 'photography',
    fileFormat: 'JPG',
    fileSizeBytes: 3820000,
    dimensions: { width: 3840, height: 2160 },
    aspectRatio: '16:9',
    tags: ['solar_installation', 'nakuru_factory', 'epra_certified', 'industrial'],
    usageCount: 3,
    linkedPostIds: ['post_02', 'post_07'],
    uploadedBy: 'user_06',
    uploadedByName: 'Wanjiku Mwangi',
    uploadedAt: '2026-09-20T14:15:00Z'
  },
  {
    id: 'asset_04',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_02',
    name: 'Twiga Solar Engineering Emblem (Dark Mode)',
    url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=300&auto=format&fit=crop',
    category: 'logo',
    fileFormat: 'SVG',
    fileSizeBytes: 145000,
    dimensions: { width: 1200, height: 1200 },
    aspectRatio: '1:1',
    tags: ['solar_brand', 'vector', 'logo_lockup'],
    usageCount: 8,
    linkedPostIds: ['post_02'],
    uploadedBy: 'user_02',
    uploadedByName: 'Kevin Otieno',
    uploadedAt: '2026-09-18T11:00:00Z'
  },
  {
    id: 'asset_05',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_03',
    name: 'Othaya Nyeri SL28 Specialty Coffee Beans Ripe Cherries',
    url: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=300&auto=format&fit=crop',
    category: 'photography',
    fileFormat: 'JPG',
    fileSizeBytes: 2980000,
    dimensions: { width: 3000, height: 2000 },
    aspectRatio: '4:5',
    tags: ['specialty_coffee', 'nyeri', 'sl28', 'high_altitude'],
    usageCount: 2,
    linkedPostIds: ['post_03'],
    uploadedBy: 'user_03',
    uploadedByName: 'Amina Abdi',
    uploadedAt: '2026-09-22T08:45:00Z'
  },
  {
    id: 'asset_06',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_03',
    name: 'Cold Brew Bottling & Nitro Infusion Line (Short Clip)',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop',
    category: 'video',
    fileFormat: 'MP4',
    fileSizeBytes: 18400000,
    dimensions: { width: 1080, height: 1920 },
    aspectRatio: '9:16',
    tags: ['cold_brew', 'video_reel', 'bts_production', 'tiktok_ready'],
    usageCount: 2,
    linkedPostIds: ['post_08'],
    uploadedBy: 'user_03',
    uploadedByName: 'Amina Abdi',
    uploadedAt: '2026-09-23T11:20:00Z'
  },
  {
    id: 'asset_07',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_04',
    name: 'Karura Forest Eucalyptus Canopy Trail Run Morning Light',
    url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=300&auto=format&fit=crop',
    category: 'photography',
    fileFormat: 'JPG',
    fileSizeBytes: 3200000,
    dimensions: { width: 2160, height: 2700 },
    aspectRatio: '4:5',
    tags: ['karura_forest', 'running_club', 'nairobi_athletics', 'morning_tempo'],
    usageCount: 3,
    linkedPostIds: ['post_05'],
    uploadedBy: 'user_06',
    uploadedByName: 'Wanjiku Mwangi',
    uploadedAt: '2026-09-22T16:00:00Z'
  },
  {
    id: 'asset_08',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_04',
    name: 'Mbio Club Custom Display Font Specimen (Druk & Space Mono)',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop',
    category: 'typography',
    fileFormat: 'PDF',
    fileSizeBytes: 4200000,
    dimensions: { width: 1920, height: 1080 },
    aspectRatio: '16:9',
    tags: ['typography', 'brand_guidelines', 'marathon_branding'],
    usageCount: 5,
    linkedPostIds: [],
    uploadedBy: 'user_02',
    uploadedByName: 'Kevin Otieno',
    uploadedAt: '2026-09-19T13:40:00Z'
  }
];

export const INITIAL_CRM_DEALS: CrmDeal[] = [
  {
    id: 'deal_01',
    tenantId: 'workspace_apex_nairobi',
    companyName: 'Safaricom Cloud & Enterprise',
    industry: 'Telecommunications & B2B Cloud',
    website: 'https://business.safaricom.co.ke',
    contactName: 'Catherine Muthoni',
    contactTitle: 'Head of Enterprise Marketing',
    contactEmail: 'cmuthoni@safaricom.co.ke',
    contactPhone: '+254 722 000 111',
    dealValueMonthly: 850000, // KSh 850,000 / mo
    contractMonths: 12,
    stage: 'proposal',
    probabilityPercent: 65,
    assignedUserId: 'user_02',
    assignedUserName: 'Kevin Otieno',
    pitchDeckUrl: 'https://pitch.versalyflow.com/safaricom-enterprise-q4',
    expectedCloseDate: '2026-10-15',
    notes: 'Bespoke multi-channel TikTok & LinkedIn B2B thought leadership proposal submitted. In review with procurement.',
    activities: [
      {
        id: 'act_01',
        dealId: 'deal_01',
        timestamp: '2026-09-20T10:00:00Z',
        authorId: 'user_02',
        authorName: 'Kevin Otieno',
        type: 'meeting',
        notes: 'Discovery presentation with Catherine and product team went exceptionally well. Emphasized local SME case studies.'
      },
      {
        id: 'act_02',
        dealId: 'deal_01',
        timestamp: '2026-09-23T14:30:00Z',
        authorId: 'user_02',
        authorName: 'Kevin Otieno',
        type: 'proposal_sent',
        notes: 'Submitted 12-month retainer deck: 24 LinkedIn carousels/mo, 8 technical short-form video reels, and monthly executive ghostwriting.'
      }
    ],
    createdAt: '2026-09-15T09:00:00Z',
    updatedAt: '2026-09-23T14:30:00Z'
  },
  {
    id: 'deal_02',
    tenantId: 'workspace_apex_nairobi',
    companyName: 'Mara Expeditions Eco-Lodge',
    industry: 'Luxury Safari & Conservation Hospitality',
    website: 'https://maraexpeditions.co.ke',
    contactName: 'Tariq Al-Mansoor',
    contactTitle: 'Managing Director',
    contactEmail: 'tariq@maraexpeditions.co.ke',
    contactPhone: '+254 700 889 900',
    dealValueMonthly: 420000,
    contractMonths: 6,
    stage: 'negotiation',
    probabilityPercent: 80,
    assignedUserId: 'user_01',
    assignedUserName: 'Alex Mwangi',
    pitchDeckUrl: 'https://pitch.versalyflow.com/mara-expeditions-luxury',
    expectedCloseDate: '2026-10-05',
    notes: 'Contract terms finalized. Reviewing SLA on 4K drone videography and conservation storytelling reels.',
    activities: [
      {
        id: 'act_03',
        dealId: 'deal_02',
        timestamp: '2026-09-22T11:00:00Z',
        authorId: 'user_01',
        authorName: 'Alex Mwangi',
        type: 'call',
        notes: 'Call with Tariq in Dubai. Aligned on KSh 420k/mo retainer covering full production and community storytelling.'
      }
    ],
    createdAt: '2026-09-10T12:00:00Z',
    updatedAt: '2026-09-22T11:00:00Z'
  },
  {
    id: 'deal_03',
    tenantId: 'workspace_apex_nairobi',
    companyName: 'KaziPay East Africa',
    industry: 'Fintech & Cross-Border Remittances',
    website: 'https://kazipay.africa',
    contactName: 'Eunice Wanjiku',
    contactTitle: 'Chief Marketing Officer',
    contactEmail: 'eunice@kazipay.africa',
    contactPhone: '+254 715 334 455',
    dealValueMonthly: 600000,
    contractMonths: 12,
    stage: 'discovery',
    probabilityPercent: 40,
    assignedUserId: 'user_02',
    assignedUserName: 'Kevin Otieno',
    expectedCloseDate: '2026-10-30',
    notes: 'Initial social listening audit completed. Identified massive organic TikTok gap vs competitors.',
    activities: [
      {
        id: 'act_04',
        dealId: 'deal_03',
        timestamp: '2026-09-24T09:00:00Z',
        authorId: 'user_02',
        authorName: 'Kevin Otieno',
        type: 'note',
        notes: 'Benchmarking TikTok creator campaigns in Kenya, Uganda, and Rwanda for remittance growth.'
      }
    ],
    createdAt: '2026-09-18T14:00:00Z',
    updatedAt: '2026-09-24T09:00:00Z'
  },
  {
    id: 'deal_04',
    tenantId: 'workspace_apex_nairobi',
    companyName: 'Naivasha Greenhouses Agri-Export',
    industry: 'Floriculture & Horticultural Export',
    website: 'https://naivashagreenhouses.co.ke',
    contactName: 'Peter Van Der Berg',
    contactTitle: 'Managing Partner',
    contactEmail: 'peter@naivashagreen.com',
    contactPhone: '+254 734 778 899',
    dealValueMonthly: 350000,
    contractMonths: 6,
    stage: 'lead',
    probabilityPercent: 20,
    assignedUserId: 'user_01',
    assignedUserName: 'Alex Mwangi',
    expectedCloseDate: '2026-11-15',
    notes: 'Inbound inquiry via website form. Exploring European B2B buyer targeting via LinkedIn and YouTube origin tours.',
    activities: [],
    createdAt: '2026-09-24T08:00:00Z',
    updatedAt: '2026-09-24T08:00:00Z'
  },
  {
    id: 'deal_05',
    tenantId: 'workspace_apex_nairobi',
    companyName: 'Zanzibar Pearl Boutique Spa & Resort',
    industry: 'Luxury Island Wellness',
    website: 'https://zanzibarpearl.com',
    contactName: 'Amina Said',
    contactTitle: 'General Manager',
    contactEmail: 'amina@zanzibarpearl.com',
    contactPhone: '+255 777 123 456',
    dealValueMonthly: 380000,
    contractMonths: 12,
    stage: 'won',
    probabilityPercent: 100,
    assignedUserId: 'user_02',
    assignedUserName: 'Kevin Otieno',
    pitchDeckUrl: 'https://pitch.versalyflow.com/zanzibar-pearl-signed',
    expectedCloseDate: '2026-09-20',
    notes: 'Retainer agreement signed! High-priority candidate for 1-click client conversion into Versaly Flow.',
    activities: [
      {
        id: 'act_05',
        dealId: 'deal_05',
        timestamp: '2026-09-20T16:00:00Z',
        authorId: 'user_02',
        authorName: 'Kevin Otieno',
        type: 'stage_changed',
        notes: 'Signed contract received. 50% upfront retainer deposit cleared via wire.'
      }
    ],
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-20T16:00:00Z'
  }
];

// Phase 21: Billing, Retainers & Invoicing Seed Data
export const INITIAL_RETAINERS: RetainerPlan[] = [
  {
    id: 'ret_01',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_01',
    clientName: 'Kenyan Highland Organics',
    tierName: 'Omnichannel Growth Retainer',
    monthlyFee: 280000,
    currency: 'KES',
    allocatedHours: 45,
    usedHours: 38,
    hourlyOverageRate: 4500,
    billingCycleDay: 1,
    deliverableQuota: {
      postsPerMonth: 20,
      reelsPerMonth: 8,
      paidAdsCampaigns: 2,
      strategyCalls: 2
    },
    status: 'active',
    periodStart: '2026-09-01',
    periodEnd: '2026-09-30'
  },
  {
    id: 'ret_02',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_02',
    clientName: 'Twiga Solar Kenya',
    tierName: 'B2B Enterprise Authority',
    monthlyFee: 420000,
    currency: 'KES',
    allocatedHours: 60,
    usedHours: 58,
    hourlyOverageRate: 5500,
    billingCycleDay: 1,
    deliverableQuota: {
      postsPerMonth: 16,
      reelsPerMonth: 4,
      paidAdsCampaigns: 4,
      strategyCalls: 4
    },
    status: 'warning',
    periodStart: '2026-09-01',
    periodEnd: '2026-09-30'
  },
  {
    id: 'ret_03',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_03',
    clientName: 'Safari Horizon Safaris',
    tierName: 'Global Tourism Showcase',
    monthlyFee: 350000,
    currency: 'KES',
    allocatedHours: 50,
    usedHours: 54,
    hourlyOverageRate: 4500,
    billingCycleDay: 5,
    deliverableQuota: {
      postsPerMonth: 24,
      reelsPerMonth: 12,
      paidAdsCampaigns: 3,
      strategyCalls: 2
    },
    status: 'exhausted',
    periodStart: '2026-09-05',
    periodEnd: '2026-10-04'
  },
  {
    id: 'ret_04',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_04',
    clientName: 'Nairobi Artisan Coffee',
    tierName: 'Local D2C Brand Builder',
    monthlyFee: 190000,
    currency: 'KES',
    allocatedHours: 30,
    usedHours: 19,
    hourlyOverageRate: 3500,
    billingCycleDay: 10,
    deliverableQuota: {
      postsPerMonth: 16,
      reelsPerMonth: 6,
      paidAdsCampaigns: 1,
      strategyCalls: 2
    },
    status: 'active',
    periodStart: '2026-09-10',
    periodEnd: '2026-10-09'
  }
];

export const INITIAL_INVOICES: AgencyInvoice[] = [
  {
    id: 'inv_01',
    invoiceNumber: 'INV-2026-0089',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_01',
    clientName: 'Kenyan Highland Organics',
    clientEmail: 'billing@kenyahighland.co.ke',
    clientAddress: 'Purdy Arms Suite 4, Karen, Nairobi',
    currency: 'KES',
    issueDate: '2026-09-01',
    dueDate: '2026-09-15',
    items: [
      { id: 'item_01', description: 'Monthly Retainer - Organic Superfoods Growth Sprint', quantity: 1, rate: 280000, amount: 280000 },
      { id: 'item_02', description: 'Meta Paid Ads ROAS Optimizations & A/B Testing', quantity: 1, rate: 45000, amount: 45000 }
    ],
    subtotal: 325000,
    taxRatePercent: 16,
    taxAmount: 52000,
    totalAmount: 377000,
    status: 'paid',
    paymentMethod: 'mpesa',
    paidAt: '2026-09-04T11:22:00Z',
    transactionReference: 'QK89X21NAIROBI-MPESA',
    notes: 'Payment confirmed via M-Pesa Daraja B2B Paybill 522522.',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-04T11:22:00Z'
  },
  {
    id: 'inv_02',
    invoiceNumber: 'INV-2026-0090',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_02',
    clientName: 'Twiga Solar Kenya',
    clientEmail: 'accounts@twigasolar.ke',
    clientAddress: 'The Oval 7th Floor, Westlands, Nairobi',
    currency: 'KES',
    issueDate: '2026-09-01',
    dueDate: '2026-09-20',
    items: [
      { id: 'item_03', description: 'B2B Enterprise Retainer - Commercial Solar Thought Leadership', quantity: 1, rate: 420000, amount: 420000 },
      { id: 'item_04', description: 'Nakuru Agro-Processor Video Shoot & Drone Production', quantity: 1, rate: 120000, amount: 120000 }
    ],
    subtotal: 540000,
    taxRatePercent: 16,
    taxAmount: 86400,
    totalAmount: 626400,
    status: 'paid',
    paymentMethod: 'bank_transfer',
    paidAt: '2026-09-18T14:30:00Z',
    transactionReference: 'NCBA-KE-WIRE-984420',
    notes: 'RTGS wire remittance confirmed via NCBA Kenya.',
    createdAt: '2026-09-01T09:00:00Z',
    updatedAt: '2026-09-18T14:30:00Z'
  },
  {
    id: 'inv_03',
    invoiceNumber: 'INV-2026-0091',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_03',
    clientName: 'Safari Horizon Safaris',
    clientEmail: 'finance@safarihorizon.co.ke',
    clientAddress: 'Galleria Business Hub, Langata Road, Nairobi',
    currency: 'KES',
    issueDate: '2026-09-05',
    dueDate: '2026-09-19',
    items: [
      { id: 'item_05', description: 'Global Tourism Retainer - Migration Season Campaign', quantity: 1, rate: 350000, amount: 350000 },
      { id: 'item_06', description: 'August Billable Scope Overage (4 Hours @ KSh 4,500/hr)', quantity: 4, rate: 4500, amount: 18000 }
    ],
    subtotal: 368000,
    taxRatePercent: 16,
    taxAmount: 58880,
    totalAmount: 426880,
    status: 'overdue',
    notes: 'Past due date. Automatic reminder sent on Sept 20. Awaiting European parent company SWIFT confirmation.',
    createdAt: '2026-09-05T10:00:00Z',
    updatedAt: '2026-09-20T08:00:00Z'
  },
  {
    id: 'inv_04',
    invoiceNumber: 'INV-2026-0092',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_04',
    clientName: 'Nairobi Artisan Coffee',
    clientEmail: 'accounts@nairobiartisan.ke',
    clientAddress: 'Gigiri Courtyard, UNEP Avenue, Nairobi',
    currency: 'KES',
    issueDate: '2026-09-10',
    dueDate: '2026-09-25',
    items: [
      { id: 'item_07', description: 'D2C Brand Presence Retainer & Roastery Walkthrough Reels', quantity: 1, rate: 190000, amount: 190000 }
    ],
    subtotal: 190000,
    taxRatePercent: 16,
    taxAmount: 30400,
    totalAmount: 220400,
    status: 'sent',
    notes: 'Client reviewed invoice. Payment scheduled for Sept 25 via Card payment.',
    createdAt: '2026-09-10T12:00:00Z',
    updatedAt: '2026-09-10T12:00:00Z'
  },
  {
    id: 'inv_05',
    invoiceNumber: 'INV-2026-0093',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_01',
    clientName: 'Kenyan Highland Organics',
    clientEmail: 'billing@kenyahighland.co.ke',
    clientAddress: 'Purdy Arms Suite 4, Karen, Nairobi',
    currency: 'KES',
    issueDate: '2026-09-24',
    dueDate: '2026-10-08',
    items: [
      { id: 'item_08', description: 'Q4 Festive Holiday Campaign Shoot & Video Assets Pack', quantity: 1, rate: 160000, amount: 160000 },
      { id: 'item_09', description: 'Health & Wellness Micro-Influencer Seeding Management', quantity: 1, rate: 75000, amount: 75000 }
    ],
    subtotal: 235000,
    taxRatePercent: 16,
    taxAmount: 37600,
    totalAmount: 272600,
    status: 'draft',
    notes: 'Pending final review by Account Manager before client dispatch.',
    createdAt: '2026-09-24T14:00:00Z',
    updatedAt: '2026-09-24T14:00:00Z'
  }
];

export const INITIAL_TIME_ENTRIES: BillableTimeEntry[] = [
  {
    id: 'time_01',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_01',
    retainerId: 'ret_01',
    userId: 'user_03',
    userName: 'Amina Abdi',
    date: '2026-09-24',
    durationMinutes: 180,
    category: 'content_creation',
    description: 'Designed Purple Tea health benefits carousel graphics & edited Naivasha packing reel.',
    isBillable: true,
    hourlyRate: 4500,
    invoiced: false,
    createdAt: '2026-09-24T11:00:00Z'
  },
  {
    id: 'time_02',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_02',
    retainerId: 'ret_02',
    userId: 'user_02',
    userName: 'Kevin Otieno',
    date: '2026-09-24',
    durationMinutes: 120,
    category: 'strategy_review',
    description: 'B2B Q4 strategy roadmap and C-suite LinkedIn thought leadership alignment.',
    isBillable: true,
    hourlyRate: 5500,
    invoiced: false,
    createdAt: '2026-09-24T13:30:00Z'
  },
  {
    id: 'time_03',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_03',
    retainerId: 'ret_03',
    userId: 'user_03',
    userName: 'Amina Abdi',
    date: '2026-09-23',
    durationMinutes: 240,
    category: 'video_editing',
    description: 'Mara river crossing 4K drone color grading, audio synchronization & vertical cropping.',
    isBillable: true,
    hourlyRate: 4500,
    invoiced: false,
    createdAt: '2026-09-23T17:00:00Z'
  },
  {
    id: 'time_04',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_04',
    retainerId: 'ret_04',
    userId: 'user_01',
    userName: 'Alex Mwangi',
    date: '2026-09-22',
    durationMinutes: 90,
    category: 'community_management',
    description: 'Customer inquiry triage, direct message responses & barista interview captions.',
    isBillable: true,
    hourlyRate: 3500,
    invoiced: false,
    createdAt: '2026-09-22T15:00:00Z'
  },
  {
    id: 'time_05',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_02',
    retainerId: 'ret_02',
    userId: 'user_03',
    userName: 'Amina Abdi',
    date: '2026-09-21',
    durationMinutes: 150,
    category: 'paid_ads',
    description: 'Configured LinkedIn Lead Gen Forms targeting commercial facility managers in Nairobi & Mombasa.',
    isBillable: true,
    hourlyRate: 5500,
    invoiced: false,
    createdAt: '2026-09-21T16:00:00Z'
  }
];

// Phase 22: Unified Communication & Inbox Seed Data
export const INITIAL_CANNED_RESPONSES: CannedResponse[] = [
  {
    id: 'canned_01',
    tenantId: 'workspace_apex_nairobi',
    title: 'Nairobi Same-Day Delivery Policy',
    category: 'Logistics',
    shortcut: '/delivery',
    content: 'Habari! We offer same-day rider delivery in Nairobi for all orders placed before 2 PM. Delivery is standard KSh 250 across Westlands, Kilimani, Karen, Gigiri & CBD.'
  },
  {
    id: 'canned_02',
    tenantId: 'workspace_apex_nairobi',
    title: 'Commercial Solar Feasibility Audit',
    category: 'Sales',
    shortcut: '/solar-audit',
    content: 'Hello! We would be glad to evaluate your facility’s load profile and peak KPLC demand tariffs. Please share your last 2 utility bills or book an engineering site survey at twigasolar.ke/audit.'
  },
  {
    id: 'canned_03',
    tenantId: 'workspace_apex_nairobi',
    title: 'Organic Lab Certification & Sourcing',
    category: 'Product',
    shortcut: '/organic-cert',
    content: 'All our products are 100% single-origin certified organic grown along the slopes of Mt. Kenya and the Aberdares, tested by KEBS and verified pesticide-free.'
  },
  {
    id: 'canned_04',
    tenantId: 'workspace_apex_nairobi',
    title: 'Influencer & Brand Collaboration',
    category: 'Partnerships',
    shortcut: '/collab',
    content: 'Jambo! Thank you for reaching out. We love partnering with creators who champion healthy living & East African excellence. Please email your media kit to creators@apexmedia.co.ke.'
  }
];

export const INITIAL_INBOX_THREADS: InboxThread[] = [
  {
    id: 'thread_01',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_01',
    platform: 'instagram',
    type: 'comment',
    externalPostTitle: 'Why Kenya’s Purple Tea is Outperforming Green Tea Globally',
    customerName: 'Wanjiku Mwangi',
    customerHandle: '@wanjiku_lifestyle',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80',
    sentiment: 'positive',
    status: 'open',
    assignedUserId: 'user_03',
    assignedUserName: 'Amina Abdi',
    tags: ['order_inquiry', 'nairobi_delivery', 'purple_tea'],
    messages: [
      {
        id: 'msg_01',
        threadId: 'thread_01',
        senderType: 'customer',
        senderName: 'Wanjiku Mwangi',
        senderHandle: '@wanjiku_lifestyle',
        content: 'Where can I buy the 250g loose leaf tin in Nairobi? Do you deliver to Kilimani?',
        timestamp: '2026-09-24T14:15:00Z'
      },
      {
        id: 'msg_02',
        threadId: 'thread_01',
        senderType: 'internal_team',
        senderName: 'Amina Abdi',
        senderHandle: '@user_03',
        content: '@user_02 Check with Naivasha fulfillment. Do we have the fresh harvest tins in stock today for same-day dispatch?',
        timestamp: '2026-09-24T14:22:00Z',
        isInternalNote: true,
        mentions: ['user_02']
      }
    ],
    createdAt: '2026-09-24T14:15:00Z',
    updatedAt: '2026-09-24T14:22:00Z'
  },
  {
    id: 'thread_02',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_02',
    platform: 'linkedin',
    type: 'direct_message',
    customerName: 'David Kiprop',
    customerHandle: 'david-kiprop-eng',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80',
    sentiment: 'urgent',
    status: 'open',
    assignedUserId: 'user_02',
    assignedUserName: 'Kevin Otieno',
    tags: ['b2b_lead', 'commercial_solar', 'nakuru'],
    messages: [
      {
        id: 'msg_03',
        threadId: 'thread_02',
        senderType: 'customer',
        senderName: 'David Kiprop',
        senderHandle: 'david-kiprop-eng',
        content: 'Hello Twiga team. We manage a 1.2MW cold-chain agro plant outside Eldoret. Seeing your Nakuru microgrid case study, what is your typical EPC delivery timeline and payback period?',
        timestamp: '2026-09-24T13:40:00Z'
      },
      {
        id: 'msg_04',
        threadId: 'thread_02',
        senderType: 'internal_team',
        senderName: 'Kevin Otieno',
        senderHandle: '@user_02',
        content: 'High-value enterprise lead! Assigned to myself. Preparing commercial proposal brief with 3.8-year payback projection.',
        timestamp: '2026-09-24T13:50:00Z',
        isInternalNote: true
      }
    ],
    createdAt: '2026-09-24T13:40:00Z',
    updatedAt: '2026-09-24T13:50:00Z'
  },
  {
    id: 'thread_03',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_03',
    platform: 'twitter',
    type: 'mention',
    customerName: 'Sarah Jenkins',
    customerHandle: '@sarah_travels_uk',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&fit=crop&q=80',
    sentiment: 'positive',
    status: 'resolved',
    assignedUserId: 'user_01',
    assignedUserName: 'Alex Mwangi',
    tags: ['customer_review', 'mara_migration', 'five_stars'],
    messages: [
      {
        id: 'msg_05',
        threadId: 'thread_03',
        senderType: 'customer',
        senderName: 'Sarah Jenkins',
        senderHandle: '@sarah_travels_uk',
        content: 'Just wrapped up our 4-day Mara crossing safari with @SafariHorizonKE! Absolutely breathtaking experience, guide Dennis spotted all the Big 5! 🦁🇰🇪',
        timestamp: '2026-09-23T18:20:00Z'
      },
      {
        id: 'msg_06',
        threadId: 'thread_03',
        senderType: 'agent',
        senderName: 'Alex Mwangi',
        senderHandle: '@SafariHorizonKE',
        content: 'Asante sana Sarah! 🌟 So thrilled Dennis took great care of you. Safe flight back to London and we hope to see you for the Amboseli elephant migration next year!',
        timestamp: '2026-09-23T18:45:00Z'
      }
    ],
    createdAt: '2026-09-23T18:20:00Z',
    updatedAt: '2026-09-23T18:45:00Z'
  },
  {
    id: 'thread_04',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_04',
    platform: 'tiktok',
    type: 'comment',
    externalPostTitle: 'Morning Espresso Pull with Single-Origin Nyeri Peaberry',
    customerName: 'Brian Omondi',
    customerHandle: '@brian_ke_vibes',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop&q=80',
    sentiment: 'neutral',
    status: 'pending',
    tags: ['cafe_hours', 'gigiri', 'amenities'],
    messages: [
      {
        id: 'msg_07',
        threadId: 'thread_04',
        senderType: 'customer',
        senderName: 'Brian Omondi',
        senderHandle: '@brian_ke_vibes',
        content: 'Is the Gigiri roastery pet-friendly? Looking to bring my golden retriever this Saturday morning.',
        timestamp: '2026-09-24T09:10:00Z'
      }
    ],
    createdAt: '2026-09-24T09:10:00Z',
    updatedAt: '2026-09-24T09:10:00Z'
  },
  {
    id: 'thread_05',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_01',
    platform: 'instagram',
    type: 'direct_message',
    customerName: 'Mercy Chege',
    customerHandle: '@mercy_nutrition_ke',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80',
    sentiment: 'negative',
    status: 'open',
    assignedUserId: 'user_02',
    assignedUserName: 'Kevin Otieno',
    tags: ['delivery_delay', 'customer_support'],
    messages: [
      {
        id: 'msg_08',
        threadId: 'thread_05',
        senderType: 'customer',
        senderName: 'Mercy Chege',
        senderHandle: '@mercy_nutrition_ke',
        content: 'Hi, placed an order #KHO-9941 yesterday morning for the Moringa powder bundle but haven’t received the rider tracking link yet. Can someone check please?',
        timestamp: '2026-09-24T11:00:00Z'
      },
      {
        id: 'msg_09',
        threadId: 'thread_05',
        senderType: 'internal_team',
        senderName: 'Kevin Otieno',
        senderHandle: '@user_02',
        content: '@user_01 Let’s ping Sendy courier dispatch and reply with the driver phone number right away.',
        timestamp: '2026-09-24T11:15:00Z',
        isInternalNote: true,
        mentions: ['user_01']
      }
    ],
    createdAt: '2026-09-24T11:00:00Z',
    updatedAt: '2026-09-24T11:15:00Z'
  }
];

// Phase 23: Workflow Automation Seed Data
export const INITIAL_WORKFLOW_RULES: WorkflowRule[] = [
  {
    id: 'rule_01',
    tenantId: 'workspace_apex_nairobi',
    name: 'Pending Client Approval SLA Escalation',
    description: 'When client review is delayed past 24 hours, fire automated email notification & dispatch Slack webhook to account manager.',
    isActive: true,
    trigger: 'approval_delayed',
    conditions: [
      {
        id: 'cond_01',
        field: 'pendingHours',
        operator: 'greater_than',
        value: 24
      }
    ],
    actions: [
      {
        id: 'act_01',
        type: 'send_slack_webhook',
        parameters: {
          channelName: '#client-approvals-sla',
          webhookUrl: 'https://hooks.slack.com/services/T01/B02/VERSALYFLOW',
          messageTemplate: '⚠️ SLA Warning: Content for {client} has been waiting for client signoff for >24 hours. Pinged brand approver.'
        }
      },
      {
        id: 'act_02',
        type: 'send_email_reminder',
        parameters: {
          recipientEmail: 'approver@client.com',
          messageTemplate: 'Habari, your agency social drafts are awaiting signoff in the Versaly Flow portal.'
        }
      }
    ],
    executionCount: 14,
    lastExecutedAt: '2026-09-24T12:00:00Z',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-24T12:00:00Z'
  },
  {
    id: 'rule_02',
    tenantId: 'workspace_apex_nairobi',
    name: 'Auto-Tag Organic & Agro-Export Keywords',
    description: 'Scans new post captions for agricultural keywords and automatically injects high-performing East African export hashtags.',
    isActive: true,
    trigger: 'post_created',
    conditions: [
      {
        id: 'cond_02',
        field: 'captionText',
        operator: 'contains',
        value: 'organic'
      }
    ],
    actions: [
      {
        id: 'act_03',
        type: 'auto_tag_post',
        parameters: {
          tagsToApply: ['sustainable_ke', 'east_africa_agro', 'farm_to_table', 'kenyan_produce']
        }
      }
    ],
    executionCount: 28,
    lastExecutedAt: '2026-09-24T14:00:00Z',
    createdAt: '2026-09-05T10:00:00Z',
    updatedAt: '2026-09-24T14:00:00Z'
  },
  {
    id: 'rule_03',
    tenantId: 'workspace_apex_nairobi',
    name: 'High-Value Won CRM Deal Kickoff Task',
    description: 'When a CRM prospect deal closes as Won with MRR > KSh 200,000, assemble onboarding pod & create strategy task.',
    isActive: true,
    trigger: 'deal_won',
    conditions: [
      {
        id: 'cond_03',
        field: 'dealValue',
        operator: 'greater_than',
        value: 200000
      }
    ],
    actions: [
      {
        id: 'act_04',
        type: 'create_agency_task',
        parameters: {
          taskPriority: 'urgent',
          messageTemplate: 'Assemble Onboarding Pod & Strategy Kickoff for newly won brand'
        }
      },
      {
        id: 'act_05',
        type: 'send_slack_webhook',
        parameters: {
          channelName: '#agency-wins',
          webhookUrl: 'https://hooks.slack.com/services/T01/WINS/VERSALYFLOW',
          messageTemplate: '🎉 Major Deal Closed! Welcoming new client with MRR > 200k. Onboarding pod task initialized.'
        }
      }
    ],
    executionCount: 6,
    lastExecutedAt: '2026-09-20T16:00:00Z',
    createdAt: '2026-09-01T12:00:00Z',
    updatedAt: '2026-09-20T16:00:00Z'
  },
  {
    id: 'rule_04',
    tenantId: 'workspace_apex_nairobi',
    name: 'Urgent Social Inquiry Instant Escalation',
    description: 'When incoming comment or DM is flagged as Urgent SLA sentiment, dispatch immediate alert to crisis responders.',
    isActive: true,
    trigger: 'urgent_inbox_message',
    conditions: [
      {
        id: 'cond_04',
        field: 'sentiment',
        operator: 'equals',
        value: 'urgent'
      }
    ],
    actions: [
      {
        id: 'act_06',
        type: 'escalate_inbox_ticket',
        parameters: {
          taskPriority: 'urgent'
        }
      },
      {
        id: 'act_07',
        type: 'send_slack_webhook',
        parameters: {
          channelName: '#social-crisis-response',
          webhookUrl: 'https://hooks.slack.com/services/T01/CRISIS/VERSALYFLOW',
          messageTemplate: '🚨 Urgent Social Lead or Inbound Inquiry: Customer requires response within 15-minute SLA.'
        }
      }
    ],
    executionCount: 11,
    lastExecutedAt: '2026-09-24T13:40:00Z',
    createdAt: '2026-09-10T09:00:00Z',
    updatedAt: '2026-09-24T13:40:00Z'
  }
];

export const INITIAL_WORKFLOW_LOGS: WorkflowExecutionLog[] = [
  {
    id: 'wlog_01',
    tenantId: 'workspace_apex_nairobi',
    ruleId: 'rule_02',
    ruleName: 'Auto-Tag Organic & Agro-Export Keywords',
    trigger: 'post_created',
    targetEntityName: 'Why Kenya’s Purple Tea is Outperforming Green Tea',
    status: 'success',
    details: 'Keyword "organic" matched. Injected 4 tags: #sustainable_ke, #east_africa_agro, #farm_to_table, #kenyan_produce.',
    timestamp: '2026-09-24T14:00:15Z'
  },
  {
    id: 'wlog_02',
    tenantId: 'workspace_apex_nairobi',
    ruleId: 'rule_04',
    ruleName: 'Urgent Social Inquiry Instant Escalation',
    trigger: 'urgent_inbox_message',
    targetEntityName: 'David Kiprop (LinkedIn 1.2MW Inquiry)',
    status: 'success',
    details: 'Urgent SLA flag detected. Sent Slack webhook to #social-crisis-response and notified Kevin Otieno.',
    timestamp: '2026-09-24T13:40:22Z'
  },
  {
    id: 'wlog_03',
    tenantId: 'workspace_apex_nairobi',
    ruleId: 'rule_01',
    ruleName: 'Pending Client Approval SLA Escalation',
    trigger: 'approval_delayed',
    targetEntityName: 'Twiga Solar Case Study Post',
    status: 'success',
    details: 'Pending review reached 26.5 hours (>24h). Dispatched automated email reminder to Faith Chebet.',
    timestamp: '2026-09-24T12:00:05Z'
  },
  {
    id: 'wlog_04',
    tenantId: 'workspace_apex_nairobi',
    ruleId: 'rule_03',
    ruleName: 'High-Value Won CRM Deal Kickoff Task',
    trigger: 'deal_won',
    targetEntityName: 'Zanzibar Pearl Boutique Spa (KSh 380,000/mo)',
    status: 'success',
    details: 'Deal value KSh 380,000 exceeds KSh 200,000 threshold. Auto-created onboarding sprint task.',
    timestamp: '2026-09-20T16:01:00Z'
  }
];

// Phase 24: AI Content & Strategy Engine Seed Data
export const INITIAL_AI_STRATEGY_BRIEFS: AiStrategyBrief[] = [
  {
    id: 'brief_01',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_01',
    platform: 'instagram',
    topic: 'Purple Tea Health Superiority & Farm-to-Cup Traceability',
    targetAudience: 'Health-conscious urbanites, fitness enthusiasts, and organic specialty tea lovers in Nairobi & European diaspora',
    goal: 'engagement',
    tone: 'inspiring_storytelling',
    captions: [
      {
        id: 'cap_01',
        hook: 'What if your morning cup didn’t just wake you up, but fought cellular inflammation?',
        body: 'Grown exclusively at 2,100 meters on the rich volcanic slopes of Mt. Kenya, our purple tea yields anthocyanin antioxidant levels 3.4x higher than standard green tea.\n\nWhile industrial tea undergoes extensive thermal oxidation, our loose leaf harvest is hand-plucked at dawn by multi-generational smallholder farmers in Nyeri, steamed gently, and tin-sealed within 24 hours.\n\nNo artificial extracts. No microplastics. Just vibrant antioxidant power straight from Kenyan soil.',
        callToAction: 'Tap the link in bio to claim your fresh harvest 250g tin with same-day Nairobi delivery.',
        hashtags: ['#KenyanPurpleTea', '#AntioxidantPower', '#CleanLivingKE', '#NairobiWellness', '#OrganicSuperfoods'],
        characterCount: 588,
        predictedEngagementScore: 94,
        reasoning: 'Curiosity-driven physiological hook, followed by specific altitude proof-point (2,100m) and contrast against industrial tea processing.'
      },
      {
        id: 'cap_02',
        hook: 'Green tea had a great run. But this Kenyan botanical is quietly taking its crown.',
        body: 'Most green teas on supermarket shelves have been sitting in transit warehouses for 8+ months, losing over 40% of their delicate polyphenol potency.\n\nKenyan Highland Organics closes the gap. Every batch is batch-numbered, KEBS lab-verified, and shipped within days of harvest in Naivasha.\n\nThe result? A distinctively crisp, sweet floral infusion naturally low in caffeine and high in heart-protective anthocyanins.',
        callToAction: 'Drop a 🍵 in the comments if you’ve experienced single-origin purple tea!',
        hashtags: ['#SuperfoodTrends', '#EastAfricaAgro', '#TeaConnoisseur', '#SustainableFarming', '#NairobiEats'],
        characterCount: 564,
        predictedEngagementScore: 91,
        reasoning: 'Disruptive displacement hook ("taking its crown") triggers cognitive dissonance and prompts comment reactions with emoji CTA.'
      }
    ],
    competitorAngles: [
      {
        id: 'comp_01',
        competitorName: 'Kericho Gold & Global Big-Tea Brands',
        theirApproach: 'Mass-market teabag commercialization focused on generic breakfast tea convenience.',
        contentGap: 'Complete lack of clinical polyphenol data, no harvest freshness guarantees, bleached paper teabags containing microplastics.',
        recommendedAngle: 'Champion whole loose leaf artisanal purity, scientific anthocyanin lab certificates, and direct smallholder farmer revenue share.',
        sampleHook: 'Why discerning tea drinkers are discarding bleached commercial teabags in 2026.'
      },
      {
        id: 'comp_02',
        competitorName: 'Imported Japanese Matcha Brands',
        theirApproach: 'High-priced wellness ritual marketing charging KSh 4,500+ per 30g tin.',
        contentGap: 'Extremely high import markups, foreign supply chains with zero local East African connection.',
        recommendedAngle: 'Position Kenyan purple tea as a locally grown botanical powerhouse that matches Japanese matcha antioxidants at 50% the price.',
        sampleHook: 'Kenya grows the highest antioxidant tea on Earth. Why are we still importing overpriced matcha?'
      }
    ],
    createdAt: '2026-09-24T10:00:00Z'
  },
  {
    id: 'brief_02',
    tenantId: 'workspace_apex_nairobi',
    clientId: 'client_02',
    platform: 'linkedin',
    topic: 'Commercial Solar Microgrids: Eliminating Peak Grid Tariffs for Agro-Processors',
    targetAudience: 'Chief Financial Officers, Operations Directors & Factory Managers in Kenyan Industrial Hubs (Nairobi, Nakuru, Eldoret, Thika)',
    goal: 'lead_generation',
    tone: 'professional_authoritative',
    captions: [
      {
        id: 'cap_03',
        hook: 'Kenyan manufacturers are paying over KSh 22/kWh for peak grid power. Here is how one Nakuru factory cut that bill by 48%.',
        body: 'Energy tariffs continue to squeeze industrial margins across East Africa. Grid fluctuations, high fuel cost surcharges, and diesel generator runtimes erode operating profits.\n\nTwiga Solar recently completed a 750kWp commercial rooftop solar + battery microgrid for a leading Nakuru macadamia processor.\n\n3 Key Takeaways for Industrial Facility Leaders:\n1. 750kWp rooftop deployment delivered 1.8M KES in direct monthly power savings.\n2. Zero daytime diesel generator fuel burn during peak production cycles.\n3. Turnkey CAPEX payback achieved in under 3.8 years with fully accelerated KRA tax deductions.',
        callToAction: 'Request a complimentary Commercial Energy Audit for your manufacturing plant via the link below.',
        hashtags: ['#RenewableEnergyKenya', '#ManufacturingKE', '#CommercialSolar', '#CFOInsights', '#EastAfricaIndustry'],
        characterCount: 782,
        predictedEngagementScore: 96,
        reasoning: 'Opens with urgent financial pain point (KSh 22/kWh) and delivers verifiable case study ROI metrics tailored for C-suite decision-makers.'
      }
    ],
    competitorAngles: [
      {
        id: 'comp_03',
        competitorName: 'Traditional Commercial Solar EPCs',
        theirApproach: 'Technical engineering jargon focused on inverter specs and panel wattage.',
        contentGap: 'Neglects financial CFO metrics: internal rate of return (IRR), tax write-offs, and monthly cashflow yield.',
        recommendedAngle: 'Lead with financial returns and guaranteed uptime SLAs rather than technical component specs.',
        sampleHook: 'Stop buying solar hardware. Start buying guaranteed 3.8-year cashflow dividends.'
      }
    ],
    createdAt: '2026-09-24T11:30:00Z'
  }
];

// Phase 25: White-Label Customization Seed Data
export const INITIAL_WHITE_LABEL_CONFIGS: WhiteLabelConfig[] = [
  {
    workspaceId: 'workspace_apex_nairobi',
    agencyBrandName: 'Apex Media Collective Kenya',
    agencyTagline: 'East Africa’s Premier Performance & Social Media Studio',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.png',
    primaryColor: '#6366f1',
    accentColor: '#10b981',
    customDomain: 'portal.apexmedia.co.ke',
    domainStatus: 'active',
    sslStatus: 'active',
    dnsRecords: [
      {
        type: 'CNAME',
        host: 'portal.apexmedia.co.ke',
        targetValue: 'cname.versalyflow.app',
        status: 'verified',
        ttl: 3600,
        lastCheckedAt: '2026-09-25T07:30:00Z'
      },
      {
        type: 'TXT',
        host: '_versaly-challenge.apexmedia.co.ke',
        targetValue: 'vf_sec_token_98412_apexke',
        status: 'verified',
        ttl: 3600,
        lastCheckedAt: '2026-09-25T07:30:00Z'
      }
    ],
    supportEmail: 'habari@apexmedia.co.ke',
    emailSenderName: 'Apex Media Client Operations',
    emailSignatureMarkdown: 'Warm regards,\n\n**Apex Media Client Success Team**\n*Westlands Commercial Centre, Ring Road, Nairobi, Kenya*\n*WhatsApp / Call: +254 712 345 678*\n*Web: [apexmedia.co.ke](https://apexmedia.co.ke)*',
    removePlatformBranding: true,
    clientPortalWelcomeMessage: 'Karibu to your dedicated Client Review & Approval Portal. Review campaigns, inspect scheduled posts, and approve live deliverables with full transparency.',
    enableCustomCss: false,
    customCssSnippet: '/* Custom agency font accents */\n.portal-brand-header { letter-spacing: -0.02em; }',
    updatedAt: '2026-09-25T07:30:00Z'
  },
  {
    workspaceId: 'workspace_savannah_digital',
    agencyBrandName: 'Savannah Digital Creative',
    agencyTagline: 'Coastal Creative & Social Strategy from Mombasa to the World',
    logoUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=80',
    faviconUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=32&auto=format&fit=crop&q=80',
    primaryColor: '#059669',
    accentColor: '#d97706',
    customDomain: 'portal.savannahdigital.co.ke',
    domainStatus: 'pending_verification',
    sslStatus: 'issuing',
    dnsRecords: [
      {
        type: 'CNAME',
        host: 'portal.savannahdigital.co.ke',
        targetValue: 'cname.versalyflow.app',
        status: 'pending',
        ttl: 3600,
        lastCheckedAt: '2026-09-24T18:00:00Z'
      }
    ],
    supportEmail: 'info@savannahdigital.co.ke',
    emailSenderName: 'Savannah Digital Client Desk',
    emailSignatureMarkdown: 'Best regards,\n\n**Savannah Digital Client Desk**\n*Nyali Executive Suites, Mombasa, Kenya*',
    removePlatformBranding: false,
    clientPortalWelcomeMessage: 'Welcome to your Savannah Digital client dashboard.',
    enableCustomCss: false,
    updatedAt: '2026-09-24T18:00:00Z'
  }
];

// Phase 26: SaaS Subscription & Tier Management Seed Data
export const SAAS_PLANS: SubscriptionPlan[] = [
  {
    id: 'freelancer',
    name: 'Freelancer Pro',
    badge: 'Starter',
    description: 'Perfect for solo social media managers & boutique consultants managing up to 3 brands.',
    monthlyPriceKes: 4999,
    annualPriceKesMonthlyEquivalent: 3999,
    monthlyPriceUsd: 39,
    quotas: {
      maxClients: 3,
      maxTeamSeats: 2,
      maxMonthlyPosts: 120,
      maxAiTokens: 35000,
      allowWhiteLabel: false,
      allowCustomDomain: false,
      allowWorkflowsAutomation: false,
      allowDedicatedManager: false,
      allowSlaGuarantees: false
    },
    features: [
      'Manage up to 3 Client Brands',
      '2 Team Member Seats',
      '120 Scheduled Posts / Month',
      '35,000 Gemini AI Tokens',
      'Unified Social Inbox & Triage',
      'Client Approvals Portal (Versaly Subdomain)',
      'Community Email Support'
    ]
  },
  {
    id: 'boutique',
    name: 'Boutique Agency',
    badge: 'Most Popular',
    description: 'Designed for scaling digital agencies, performance studios, and creative collectives in East Africa.',
    monthlyPriceKes: 14999,
    annualPriceKesMonthlyEquivalent: 11999,
    monthlyPriceUsd: 119,
    quotas: {
      maxClients: 15,
      maxTeamSeats: 8,
      maxMonthlyPosts: 1000,
      maxAiTokens: 200000,
      allowWhiteLabel: true,
      allowCustomDomain: true,
      allowWorkflowsAutomation: true,
      allowDedicatedManager: false,
      allowSlaGuarantees: true
    },
    features: [
      'Manage up to 15 Client Brands',
      '8 Team Member Seats with RBAC Matrix',
      '1,000 Scheduled Posts / Month',
      '200,000 Gemini Pro AI Tokens',
      'Complete White-Label Agency Branding',
      'Custom Vanity Domain with Automated SSL',
      'Multi-Step Workflow Automations (IFTTT)',
      'Retainer & Billable Time Hours Tracking',
      'M-Pesa Express & Daraja Direct Settlements',
      'Priority SLA Support (under 2 hours)'
    ]
  },
  {
    id: 'enterprise',
    name: 'Global Enterprise Agency',
    badge: 'Scale',
    description: 'For multinational media groups and enterprise networks requiring unlimited capacity and custom SLAs.',
    monthlyPriceKes: 49999,
    annualPriceKesMonthlyEquivalent: 39999,
    monthlyPriceUsd: 399,
    quotas: {
      maxClients: -1, // Unlimited
      maxTeamSeats: -1, // Unlimited
      maxMonthlyPosts: -1, // Unlimited
      maxAiTokens: 1000000,
      allowWhiteLabel: true,
      allowCustomDomain: true,
      allowWorkflowsAutomation: true,
      allowDedicatedManager: true,
      allowSlaGuarantees: true
    },
    features: [
      'Unlimited Client Brands & Workspaces',
      'Unlimited Team Seats & Sub-Agencies',
      'Unlimited Scheduled Posts & Video Dispatches',
      '1,000,000 Gemini Pro AI Strategy Tokens',
      'Remove All Platform Badges & Watermarks',
      'Custom API & Webhook Web Dispatches',
      'Dedicated Account Director in Nairobi',
      '99.95% Guaranteed Uptime SLA & Custom MSA'
    ]
  }
];

export const INITIAL_WORKSPACE_SUBSCRIPTIONS: WorkspaceSubscription[] = [
  {
    workspaceId: 'workspace_apex_nairobi',
    currentTier: 'boutique',
    billingInterval: 'monthly',
    status: 'active',
    paymentMethod: 'mpesa_daraja',
    currentPeriodStart: '2026-09-01T00:00:00Z',
    currentPeriodEnd: '2026-10-01T00:00:00Z',
    autoRenew: true,
    usageMetrics: {
      clientCount: 4,
      teamSeatCount: 6,
      postsScheduledThisMonth: 82,
      aiTokensUsedThisMonth: 64200,
      storageUsedMb: 1240
    },
    cancellationScheduledForEnd: false,
    lastPaymentRef: 'MPESA-QRT892K11',
    lastPaymentAmountKes: 14999
  },
  {
    workspaceId: 'workspace_savannah_digital',
    currentTier: 'freelancer',
    billingInterval: 'monthly',
    status: 'active',
    paymentMethod: 'mpesa_daraja',
    currentPeriodStart: '2026-09-10T00:00:00Z',
    currentPeriodEnd: '2026-10-10T00:00:00Z',
    autoRenew: true,
    usageMetrics: {
      clientCount: 2,
      teamSeatCount: 2,
      postsScheduledThisMonth: 34,
      aiTokensUsedThisMonth: 12400,
      storageUsedMb: 320
    },
    cancellationScheduledForEnd: false,
    lastPaymentRef: 'MPESA-SVD9011J2',
    lastPaymentAmountKes: 4999
  }
];

// Phase 27: Productivity & Quick Actions Seed Data
export const INITIAL_QUICK_NOTES: QuickDraftNote[] = [
  {
    id: 'note_01',
    tenantId: 'workspace_apex_nairobi',
    title: 'Nakuru Solar Farm Drone Footage Angles',
    content: 'Get 4K top-down aerial sweep of the 750kWp rooftop array during morning peak sunlight (9:30 AM). Contrast with smoky diesel generator room to visually highlight zero emissions.',
    tags: ['solar', 'b-roll', 'case-study'],
    targetClientId: 'client_02',
    color: 'emerald',
    createdAt: '2026-09-24T14:20:00Z',
    updatedAt: '2026-09-24T14:20:00Z'
  },
  {
    id: 'note_02',
    tenantId: 'workspace_apex_nairobi',
    title: 'Purple Tea Antioxidant Comparison Infographic Idea',
    content: 'Draft a visual comparison slider: Green Tea (1x polyphenols) vs Blueberries (2.1x) vs Kericho High-Altitude Purple Tea (3.4x). Emphasize single-origin smallholder farming in Nyeri.',
    tags: ['infographic', 'wellness', 'superfoods'],
    targetClientId: 'client_01',
    color: 'indigo',
    createdAt: '2026-09-24T16:45:00Z',
    updatedAt: '2026-09-24T16:45:00Z'
  },
  {
    id: 'note_03',
    tenantId: 'workspace_apex_nairobi',
    title: 'Q4 Agency Retainer Pitch Deck Hook',
    content: 'Headline: "Why Kenya’s top consumer brands are firing generalist agencies in favor of revenue-tied performance retainers." Include M-Pesa automated billing metrics and live client sign-off SLA transparency.',
    tags: ['agency-growth', 'retainers', 'q4'],
    color: 'amber',
    createdAt: '2026-09-25T07:10:00Z',
    updatedAt: '2026-09-25T07:10:00Z'
  }
];

// Phase 28: Security Hardening & Data Protection Seed Data
export const INITIAL_SECURITY_POLICY: SecurityPolicyConfig = {
  twoFactorRequired: true,
  sessionTimeoutMinutes: 60,
  ipAllowlist: ['102.219.208.0/24', '197.232.14.0/24', '105.160.0.0/16'], // Safaricom & Jamii Telkom Kenya corporate ranges
  strictXssSanitization: true,
  sensitiveMaskingEnabled: true,
  rateLimitingEnabled: true,
  tamperHashVerification: true
};

export const INITIAL_API_KEYS: ApiKey[] = [
  {
    id: 'key_01',
    tenantId: 'workspace_apex_nairobi',
    name: 'Zapier Production Lead Sync Webhook',
    keyPrefix: 'vf_live_9b4e',
    maskedKey: 'vf_live_9b4e••••••••••••••••3d8a',
    scopes: ['read', 'write', 'webhooks'],
    rateLimitPerMin: 120,
    createdAt: '2026-08-10T11:00:00Z',
    lastUsedAt: '2026-09-25T08:12:44Z',
    status: 'active'
  },
  {
    id: 'key_02',
    tenantId: 'workspace_apex_nairobi',
    name: 'Custom Client PowerBI Reporting Ingestion',
    keyPrefix: 'vf_live_e31a',
    maskedKey: 'vf_live_e31a••••••••••••••••8c21',
    scopes: ['read'],
    rateLimitPerMin: 60,
    createdAt: '2026-08-22T14:30:00Z',
    lastUsedAt: '2026-09-24T22:05:10Z',
    status: 'active'
  },
  {
    id: 'key_03',
    tenantId: 'workspace_apex_nairobi',
    name: 'Mobile Dispatch Worker v1 (Legacy Token)',
    keyPrefix: 'vf_live_71f0',
    maskedKey: 'vf_live_71f0••••••••••••••••a490',
    scopes: ['read', 'write'],
    rateLimitPerMin: 30,
    createdAt: '2026-06-01T09:00:00Z',
    lastUsedAt: '2026-08-15T16:11:00Z',
    status: 'revoked',
    expiresAt: '2026-08-15T18:00:00Z'
  }
];

export const INITIAL_SOC2_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'sec_evt_01',
    tenantId: 'workspace_apex_nairobi',
    actorId: 'user_01',
    actorName: 'Amina Muthoni',
    actorRole: 'agency_owner',
    action: 'USER_LOGIN_2FA',
    resource: 'Auth:Session_JWT_Safaricom_KE',
    ipAddress: '102.219.208.45',
    location: 'Nairobi, Kenya (Safaricom Fixed LTE)',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
    status: 'success',
    severity: 'low',
    tamperProofHash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    timestamp: '2026-09-25T08:30:15Z',
    metadata: { authProvider: 'totp', deviceTrust: 'hardware_token' }
  },
  {
    id: 'sec_evt_02',
    tenantId: 'workspace_apex_nairobi',
    actorId: 'system_webhook',
    actorName: 'Daraja M-Pesa Gateway Hook',
    actorRole: 'super_admin',
    action: 'WEBHOOK_SIGNATURE_VERIFIED',
    resource: 'Payment:Daraja_Daraja_STK_SVD9011J2',
    ipAddress: '196.201.214.200',
    location: 'Safaricom Data Centre, Thika Road, Kenya',
    userAgent: 'Safaricom-Daraja/2.0 Webhook-Worker',
    status: 'success',
    severity: 'low',
    tamperProofHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    timestamp: '2026-09-25T07:45:10Z',
    metadata: { signatureValid: true, responseCode: '0', amountKes: 4999 }
  },
  {
    id: 'sec_evt_03',
    tenantId: 'workspace_apex_nairobi',
    actorId: 'user_02',
    actorName: 'Kevin Otieno',
    actorRole: 'account_manager',
    action: 'BULK_POST_STAGE_TRANSITION',
    resource: 'Content:Batch_3_Posts_Client_Review',
    ipAddress: '197.232.14.88',
    location: 'Westlands, Nairobi, Kenya',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/127.0.0.0',
    status: 'success',
    severity: 'medium',
    tamperProofHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    timestamp: '2026-09-25T07:15:30Z',
    metadata: { affectedPostIds: ['post_01', 'post_02', 'post_03'], newStage: 'client_review' }
  },
  {
    id: 'sec_evt_04',
    tenantId: 'workspace_apex_nairobi',
    actorId: 'unknown_ip',
    actorName: 'Unrecognized Client IP',
    actorRole: 'client_approver',
    action: 'FAILED_LOGIN_ANOMALY',
    resource: 'Auth:BruteForce_Mitigation',
    ipAddress: '41.90.185.12',
    location: 'Mombasa, Kenya',
    userAgent: 'Python-requests/2.31.0',
    status: 'failure',
    severity: 'critical',
    tamperProofHash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    timestamp: '2026-09-25T04:22:18Z',
    metadata: { attemptsBlocked: 5, rateLimitTriggered: true, autoBannedHours: 24 }
  },
  {
    id: 'sec_evt_05',
    tenantId: 'workspace_apex_nairobi',
    actorId: 'user_01',
    actorName: 'Amina Muthoni',
    actorRole: 'agency_owner',
    action: 'API_KEY_REVOKED',
    resource: 'ApiKey:key_03_Mobile_Dispatch_Worker',
    ipAddress: '102.219.208.45',
    location: 'Nairobi, Kenya',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
    status: 'warning',
    severity: 'high',
    tamperProofHash: 'fc4888633e95ecd3b67242199ac4d41c16d2b105313abda32705e7f84e7f11b0',
    timestamp: '2026-09-24T18:00:00Z',
    metadata: { reason: 'Scheduled key rotation per SOC2 90-day policy' }
  },
  {
    id: 'sec_evt_06',
    tenantId: 'workspace_apex_nairobi',
    actorId: 'user_01',
    actorName: 'Amina Muthoni',
    actorRole: 'agency_owner',
    action: 'WHITE_LABEL_DNS_VERIFIED',
    resource: 'DNS:portal.apexmedia.co.ke',
    ipAddress: '102.219.208.45',
    location: 'Nairobi, Kenya',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
    status: 'success',
    severity: 'low',
    tamperProofHash: '35a9e381b1a27567549b5f8a6f783c167ebf80963b44bd650b074163f56f22ee',
    timestamp: '2026-09-24T15:10:00Z',
    metadata: { cname: 'ssl.versalyflow.net', txtConfirmed: true }
  }
];

export const INITIAL_GDPR_REQUESTS: GdprRequest[] = [
  {
    id: 'gdpr_01',
    tenantId: 'workspace_apex_nairobi',
    subjectEmail: 'former.creator@freelanceke.com',
    subjectName: 'Faith Wanjiku Mwangi',
    requestType: 'forget_personal_info',
    status: 'completed',
    requestedAt: '2026-09-18T10:00:00Z',
    completedAt: '2026-09-19T14:22:00Z',
    anonymizedRecordsCount: 14,
    notes: 'Kenyan DPA 2019 Section 40 Right to Erasure processed. User email and internal draft comments pseudonymized.'
  },
  {
    id: 'gdpr_02',
    tenantId: 'workspace_apex_nairobi',
    subjectEmail: 'legal@marasafarilodge.co.ke',
    subjectName: 'Mara Safari Lodge Legal Team',
    requestType: 'export_data',
    status: 'pending',
    requestedAt: '2026-09-24T16:00:00Z',
    notes: 'Requesting full portable JSON package of all uploaded media assets, approvals log, and contract retainers.'
  }
];
