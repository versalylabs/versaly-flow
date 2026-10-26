/**
 * PulseBrand Agency OS - Client Onboarding Wizard & Pipeline
 * Phase 08: Client Onboarding
 * Localized for East African Agency Ecosystem (Nairobi HQ / KES Retainers / Regional Compliance)
 */

import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { ClientBrand, OnboardingChecklist, SocialPlatform } from '../../types';
import {
  UserPlus,
  CheckCircle2,
  Circle,
  Building2,
  FileCheck,
  UploadCloud,
  Share2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Palette,
  ShieldCheck,
  Send,
  AlertCircle,
  Instagram,
  Linkedin,
  Twitter,
  HelpCircle,
  Phone,
  Mail,
  Flame,
  Check
} from 'lucide-react';

interface WizardFormData {
  // Step 1: Corporate & Tenancy Info
  name: string;
  industry: string;
  website: string;
  city: string;
  country: string;
  accentColor: string;
  // Step 2: Commercial Retainer & SLA
  retainerKES: number;
  monthlyPostQuota: number;
  billingFrequency: 'monthly' | 'quarterly';
  // Step 3: Brand Identity & Guidelines
  toneTags: string;
  guidelinesSummary: string;
  primaryFont: string;
  secondaryFont: string;
  dos: string;
  donts: string;
  targetAudience: string;
  // Step 4: Social Accounts & Asset Handoff
  socialInstagram: string;
  socialLinkedin: string;
  socialTwitter: string;
  socialTiktok: string;
  assetFolderUrl: string;
  // Step 5: Primary Stakeholder & Sign-off
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactRole: string;
}

export const ClientOnboarding: React.FC = () => {
  const {
    workspace,
    currentUser,
    capabilities,
    clients,
    createClientBrand,
    updateOnboardingTask,
    addToast
  } = useAgency();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'wizard'>('pipeline');
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [selectedOnboardingClientId, setSelectedOnboardingClientId] = useState<string>('');

  // Scoped clients for the active agency workspace
  const scopedClients = clients.filter(c => c.tenantId === workspace.id);
  const onboardingClients = scopedClients.filter(c => c.status === 'onboarding');
  const activeClients = scopedClients.filter(c => c.status === 'active');

  // Interactive Wizard Form State
  const [formData, setFormData] = useState<WizardFormData>({
    name: '',
    industry: '',
    website: '',
    city: 'Nairobi',
    country: 'Kenya',
    accentColor: '#10b981',
    retainerKES: 350000,
    monthlyPostQuota: 20,
    billingFrequency: 'monthly',
    toneTags: 'Modern Afro-luxury, Authentic, High-converting, Grounded',
    guidelinesSummary: 'Clean, elevated typography with vibrant regional textures and community focus.',
    primaryFont: 'Cabinet Grotesk / Inter',
    secondaryFont: 'Editorial New / Playfair',
    dos: 'Feature authentic Kenyan storytelling\nUse high-resolution localized imagery\nHighlight measurable customer impact',
    donts: 'Never use generic western stock photos\nAvoid unverified statistics\nDo not use low-contrast text',
    targetAudience: 'Urban East African consumers, corporate leaders, and diaspora brand patrons.',
    socialInstagram: '',
    socialLinkedin: '',
    socialTwitter: '',
    socialTiktok: '',
    assetFolderUrl: 'https://drive.google.com/drive/folders/brand-assets',
    contactName: '',
    contactEmail: '',
    contactPhone: '+254 7',
    contactRole: 'Head of Marketing & Signoff'
  });

  const handleInputChange = (field: keyof WizardFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (wizardStep < 5) {
      setWizardStep(prev => prev + 1);
    } else {
      handleFinalizeOnboarding();
    }
  };

  const handlePrevStep = () => {
    if (wizardStep > 1) {
      setWizardStep(prev => prev - 1);
    }
  };

  const handleFinalizeOnboarding = () => {
    if (!formData.name.trim() || !formData.industry.trim()) {
      addToast('Validation Error', 'Brand name and industry are required', 'error');
      return;
    }

    const tones = formData.toneTags.split(',').map(t => t.trim()).filter(Boolean);
    const dosList = formData.dos.split('\n').map(d => d.trim()).filter(Boolean);
    const dontsList = formData.donts.split('\n').map(d => d.trim()).filter(Boolean);

    // Build social accounts
    const socials: any[] = [];
    if (formData.socialInstagram.trim()) {
      socials.push({
        id: `soc_${Date.now()}_ig`,
        platform: 'instagram' as SocialPlatform,
        handle: formData.socialInstagram.trim(),
        accountName: `${formData.name} Official`,
        connected: false,
        followerCount: 0
      });
    }
    if (formData.socialLinkedin.trim()) {
      socials.push({
        id: `soc_${Date.now()}_li`,
        platform: 'linkedin' as SocialPlatform,
        handle: formData.socialLinkedin.trim(),
        accountName: `${formData.name} Corporate`,
        connected: false,
        followerCount: 0
      });
    }
    if (formData.socialTwitter.trim()) {
      socials.push({
        id: `soc_${Date.now()}_tw`,
        platform: 'twitter' as SocialPlatform,
        handle: formData.socialTwitter.trim(),
        accountName: `${formData.name} KE`,
        connected: false,
        followerCount: 0
      });
    }
    if (formData.socialTiktok.trim()) {
      socials.push({
        id: `soc_${Date.now()}_tt`,
        platform: 'tiktok' as SocialPlatform,
        handle: formData.socialTiktok.trim(),
        accountName: `${formData.name} TikTok`,
        connected: false,
        followerCount: 0
      });
    }

    const created = createClientBrand({
      tenantId: workspace.id,
      name: formData.name.trim(),
      industry: formData.industry.trim(),
      website: formData.website.trim() || `https://${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.co.ke`,
      accentColor: formData.accentColor,
      status: 'onboarding',
      toneOfVoice: tones,
      brandGuidelinesSummary: formData.guidelinesSummary,
      guidelineDetails: {
        primaryFont: formData.primaryFont,
        secondaryFont: formData.secondaryFont,
        colorPalette: [
          { name: 'Primary Accent', hex: formData.accentColor },
          { name: 'Nairobi Slate', hex: '#0f172a' },
          { name: 'Pure White', hex: '#ffffff' }
        ],
        dos: dosList,
        donts: dontsList,
        targetAudience: formData.targetAudience
      },
      contacts: [
        {
          name: formData.contactName.trim() || `${formData.name} Lead`,
          email: formData.contactEmail.trim() || `contact@${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.co.ke`,
          phone: formData.contactPhone.trim(),
          roleTitle: formData.contactRole.trim() || 'Primary Signoff',
          isPrimarySignoff: true
        }
      ],
      onboardingChecklist: {
        ndaSigned: true,
        retainerContractSigned: true,
        brandAssetsReceived: Boolean(formData.assetFolderUrl),
        socialAccessGranted: false,
        primaryApproverConfirmed: true,
        kickoffCompleted: false
      },
      onboardingProgress: 50,
      assignedManagerId: currentUser.id,
      socialAccounts: socials.length > 0 ? socials : [
        {
          id: `soc_${Date.now()}_def`,
          platform: 'instagram',
          handle: `@${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          accountName: `${formData.name} Official`,
          connected: false,
          followerCount: 0
        }
      ],
      retainerMonthlyValue: Number(formData.retainerKES) || 350000,
      monthlyPostQuota: Number(formData.monthlyPostQuota) || 20
    });

    addToast('Client Intake Finalized', `${created.name} enrolled in ${workspace.name} onboarding pipeline`, 'success');
    setSelectedOnboardingClientId(created.id);
    setActiveTab('pipeline');
    setWizardStep(1);
  };

  const currentOnboardingClient = scopedClients.find(c => c.id === selectedOnboardingClientId)
    || onboardingClients[0]
    || scopedClients[0]
    || null;

  const checklistItems: { key: keyof OnboardingChecklist; label: string; desc: string }[] = [
    { key: 'ndaSigned', label: 'Mutual Non-Disclosure Agreement (NDA)', desc: 'Protects proprietary campaign assets and agency margins.' },
    { key: 'retainerContractSigned', label: 'Commercial Retainer Contract & SLA', desc: 'Legally locks monthly billing rate, post quotas, and payment terms.' },
    { key: 'brandAssetsReceived', label: 'Brand Asset Kit & Vector Logos', desc: 'Vector SVGs, high-res photography, font licenses, and guidelines received.' },
    { key: 'socialAccessGranted', label: 'Social Media Access Delegation', desc: 'Meta Business Manager / TikTok / LinkedIn partner access verified.' },
    { key: 'primaryApproverConfirmed', label: 'Designate Primary Sign-off Stakeholder', desc: 'Appoints authoritative client reviewer with one-click portal access.' },
    { key: 'kickoffCompleted', label: 'Editorial Strategy Kick-off Workshop', desc: 'Initial campaign alignment session with Account Director and Creator.' }
  ];

  const handleToggleChecklist = (client: ClientBrand, key: keyof OnboardingChecklist) => {
    const isCurrentlyChecked = Boolean(client.onboardingChecklist?.[key]);
    updateOnboardingTask(client.id, key, !isCurrentlyChecked);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>{workspace.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Client Onboarding</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">
              {onboardingClients.length} In-Flight Onboardings
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Client Onboarding Engine & Handoff Pipeline</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Standardized 5-step intake wizard for East African enterprise accounts: contract SLAs, asset collection,
            brand tone questionnaires, and automated onboarding compliance tracking.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'pipeline'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Onboarding Pipeline</span>
            {onboardingClients.length > 0 && (
              <span className="bg-amber-950 text-amber-400 font-mono text-[10px] px-1.5 py-0.2 rounded border border-amber-800/40 ml-1">
                {onboardingClients.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('wizard');
              setWizardStep(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'wizard'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Launch Intake Wizard</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Onboarding Pipeline & Checklist Tracker */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Onboarding Brand Queue */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Brands in Pipeline ({scopedClients.length})
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {onboardingClients.length} Pending Handover
                </span>
              </div>

              <div className="space-y-2">
                {scopedClients.map(client => {
                  const isSelected = client.id === currentOnboardingClient?.id;
                  const progress = client.onboardingProgress ?? (client.status === 'active' ? 100 : 50);

                  return (
                    <div
                      key={client.id}
                      onClick={() => setSelectedOnboardingClientId(client.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all space-y-2 ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-950/20'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: client.accentColor }}
                          ></span>
                          <span className="font-bold text-xs text-white truncate max-w-[160px]">
                            {client.name}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                          client.status === 'active'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                            : 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                        }`}>
                          {client.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 truncate">{client.industry}</div>

                      {/* Onboarding Checklist progress meter */}
                      <div className="space-y-1 pt-1 border-t border-slate-800/60">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                          <span>Checklist Completion:</span>
                          <span className="text-emerald-400 font-bold">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Checklist for Selected Client */}
          {currentOnboardingClient && (
            <div className="lg:col-span-8 space-y-5">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
                {/* Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md"
                      style={{ backgroundColor: currentOnboardingClient.accentColor }}
                    >
                      {currentOnboardingClient.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{currentOnboardingClient.name}</h2>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {currentOnboardingClient.industry} · Enrolled {new Date(currentOnboardingClient.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className={`text-xs font-mono uppercase px-2.5 py-1 rounded-lg border font-bold ${
                      currentOnboardingClient.status === 'active'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                        : 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                    }`}>
                      {currentOnboardingClient.status === 'active' ? '● Live Account Active' : '● Onboarding In Progress'}
                    </span>
                    <div className="text-[11px] font-mono text-slate-400">
                      Overall Readiness: {currentOnboardingClient.onboardingProgress ?? (currentOnboardingClient.status === 'active' ? 100 : 50)}%
                    </div>
                  </div>
                </div>

                {/* Checklist Tasks */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Mandatory Onboarding Milestones (6/6)
                    </h3>
                    <span className="text-[11px] text-slate-400">Click any milestone to mark complete</span>
                  </div>

                  <div className="space-y-2.5">
                    {checklistItems.map(item => {
                      const isCompleted = Boolean(
                        currentOnboardingClient.onboardingChecklist?.[item.key] ??
                        (currentOnboardingClient.status === 'active')
                      );

                      return (
                        <div
                          key={item.key}
                          onClick={() => handleToggleChecklist(currentOnboardingClient, item.key)}
                          className={`p-3.5 rounded-lg border cursor-pointer transition-colors flex items-start gap-3.5 ${
                            isCompleted
                              ? 'bg-slate-950/80 border-emerald-800/50 hover:border-emerald-700'
                              : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-600" />
                            )}
                          </div>

                          <div className="flex-1 space-y-0.5">
                            <div className={`text-xs font-bold ${isCompleted ? 'text-slate-100 line-through decoration-emerald-500/50' : 'text-slate-200'}`}>
                              {item.label}
                            </div>
                            <div className="text-[11px] text-slate-400 leading-snug">
                              {item.desc}
                            </div>
                          </div>

                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                              : 'bg-slate-900 text-slate-500 border-slate-800'
                          }`}>
                            {isCompleted ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Handover summary */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Automated Transition Logic</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    When all 6 onboarding milestones are verified, the client's status automatically promotes to{' '}
                    <span className="text-emerald-400 font-mono font-semibold">Active</span>, unlocking content scheduling and live social distribution directly into the content editorial matrix.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Interactive 5-Step Client Intake Wizard */}
      {activeTab === 'wizard' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Wizard Step Breadcrumb Indicator */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
              {[
                { step: 1, label: 'Entity Profile' },
                { step: 2, label: 'Commercial SLA' },
                { step: 3, label: 'Brand Guidelines' },
                { step: 4, label: 'Social & Assets' },
                { step: 5, label: 'Signoff Contact' }
              ].map(st => (
                <div
                  key={st.step}
                  onClick={() => setWizardStep(st.step)}
                  className={`p-2 rounded-lg cursor-pointer transition-all ${
                    wizardStep === st.step
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : wizardStep > st.step
                      ? 'bg-slate-950 text-emerald-400 border border-slate-800'
                      : 'text-slate-500'
                  }`}
                >
                  <div className="text-[10px]">STEP {st.step}</div>
                  <div className="truncate hidden sm:block">{st.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Wizard Form Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <form onSubmit={handleNextStep} className="space-y-5">
              {/* Step 1: Entity & Corporate Details */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <span>Step 1: Entity & Corporate Profile</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Register commercial client details within {workspace.name} regional tenant.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Client Brand / Corporate Entity Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g. Mara Serena Wilderness Lodges"
                      className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Industry / Vertical Sector *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        placeholder="e.g. Eco-Tourism & Luxury Safari Hospitality"
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Corporate Website
                      </label>
                      <input
                        type="text"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://maraserenalodges.co.ke"
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">HQ City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Brand Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.accentColor}
                          onChange={(e) => handleInputChange('accentColor', e.target.value)}
                          className="w-9 h-9 rounded bg-transparent border-0 cursor-pointer"
                        />
                        <span className="text-xs font-mono text-slate-400">{formData.accentColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Commercial Retainer & SLA */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span>Step 2: Commercial Retainer & Editorial SLA</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure monthly retainer contract value in Kenyan Shillings (KES) and post quotas.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Monthly Retainer Value (KES) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-500 text-xs">
                          KSh
                        </span>
                        <input
                          type="number"
                          step="10000"
                          required
                          value={formData.retainerKES}
                          onChange={(e) => handleInputChange('retainerKES', Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-12 pr-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        Standard Agency Tier: KSh 350,000 to KSh 750,000 / month
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Contracted Monthly Post Quota *
                      </label>
                      <input
                        type="number"
                        min="4"
                        max="120"
                        required
                        value={formData.monthlyPostQuota}
                        onChange={(e) => handleInputChange('monthlyPostQuota', Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        Typically 16 to 24 multi-platform posts per month
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Billing Cycle & Settlement Method
                    </label>
                    <select
                      value={formData.billingFrequency}
                      onChange={(e) => handleInputChange('billingFrequency', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-medium"
                    >
                      <option value="monthly">Monthly Advance (M-PESA Daraja / RTGS Bank Transfer)</option>
                      <option value="quarterly">Quarterly Pre-pay (5% Retainer Discount)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Brand Identity & Guidelines */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Palette className="w-4 h-4 text-emerald-400" />
                      <span>Step 3: Creative Tone & Editorial Directives</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Train copywriters and creators on brand tone vectors, fonts, and mandatory do's/don'ts.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Tone of Voice Vectors (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.toneTags}
                      onChange={(e) => handleInputChange('toneTags', e.target.value)}
                      placeholder="e.g. Grounded Kenyan botanical wisdom, Warm Afro-modern luxury"
                      className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Display Font</label>
                      <input
                        type="text"
                        value={formData.primaryFont}
                        onChange={(e) => handleInputChange('primaryFont', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Secondary Font</label>
                      <input
                        type="text"
                        value={formData.secondaryFont}
                        onChange={(e) => handleInputChange('secondaryFont', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-emerald-400 block mb-1">
                        Mandatory Do's (one per line)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.dos}
                        onChange={(e) => handleInputChange('dos', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-red-400 block mb-1">
                        Strict Don'ts (one per line)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.donts}
                        onChange={(e) => handleInputChange('donts', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-red-500 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Social Accounts & Asset Handoff */}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-emerald-400" />
                      <span>Step 4: Social Accounts & Asset Vault Link</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Register official client handles and designate cloud asset folders for photography.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Instagram Handle</label>
                      <input
                        type="text"
                        value={formData.socialInstagram}
                        onChange={(e) => handleInputChange('socialInstagram', e.target.value)}
                        placeholder="@brandname"
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">LinkedIn URL / Handle</label>
                      <input
                        type="text"
                        value={formData.socialLinkedin}
                        onChange={(e) => handleInputChange('socialLinkedin', e.target.value)}
                        placeholder="company-name"
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Twitter / X Handle</label>
                      <input
                        type="text"
                        value={formData.socialTwitter}
                        onChange={(e) => handleInputChange('socialTwitter', e.target.value)}
                        placeholder="@BrandKE"
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">TikTok Handle</label>
                      <input
                        type="text"
                        value={formData.socialTiktok}
                        onChange={(e) => handleInputChange('socialTiktok', e.target.value)}
                        placeholder="@brandkenya"
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Brand Asset Cloud Vault (Google Drive / Dropbox)
                    </label>
                    <input
                      type="text"
                      value={formData.assetFolderUrl}
                      onChange={(e) => handleInputChange('assetFolderUrl', e.target.value)}
                      placeholder="https://drive.google.com/drive/folders/brand-kit"
                      className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Primary Stakeholder & Sign-off Contact */}
              {wizardStep === 5 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Step 5: Authoritative Sign-off Stakeholder</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Designate the client stakeholder with binding approval sign-off rights for weekly social content.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Contact Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                        placeholder="e.g. Faith Chebet"
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        placeholder="faith@brand.co.ke"
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number (M-PESA / SMS)</label>
                      <input
                        type="text"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        placeholder="+254 700 000 000"
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Role / Job Title</label>
                      <input
                        type="text"
                        value={formData.contactRole}
                        onChange={(e) => handleInputChange('contactRole', e.target.value)}
                        placeholder="Head of Marketing & Signoff"
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Button Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={wizardStep === 1}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                    wizardStep === 1
                      ? 'text-slate-600 bg-slate-950 cursor-not-allowed'
                      : 'text-slate-300 bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('pipeline')}
                    className="px-3.5 py-2 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/30"
                  >
                    <span>{wizardStep === 5 ? 'Enroll & Launch Onboarding' : 'Continue to Next Step'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
