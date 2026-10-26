import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { WhiteLabelConfig, DnsVerificationRecord } from '../../types';
import {
  Palette,
  Globe,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  ExternalLink,
  Lock,
  ArrowRight,
  Sliders,
  Layers,
  FileCode,
  RotateCcw
} from 'lucide-react';

export const WhiteLabelManager: React.FC = () => {
  const {
    workspace,
    activeWhiteLabelConfig,
    updateWhiteLabelConfig,
    verifyCustomDomainDns,
    resetWhiteLabelConfig,
    addToast
  } = useAgency();

  // Local draft state for editing
  const [activeTab, setActiveTab] = useState<'brand' | 'domain' | 'email' | 'preview'>('brand');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isVerifyingDns, setIsVerifyingDns] = useState<boolean>(false);
  const [copiedRecordKey, setCopiedRecordKey] = useState<string | null>(null);

  // Form field state initialized from activeWhiteLabelConfig
  const [brandName, setBrandName] = useState<string>(activeWhiteLabelConfig.agencyBrandName);
  const [tagline, setTagline] = useState<string>(activeWhiteLabelConfig.agencyTagline);
  const [logoUrl, setLogoUrl] = useState<string>(activeWhiteLabelConfig.logoUrl);
  const [faviconUrl, setFaviconUrl] = useState<string>(activeWhiteLabelConfig.faviconUrl);
  const [primaryColor, setPrimaryColor] = useState<string>(activeWhiteLabelConfig.primaryColor);
  const [accentColor, setAccentColor] = useState<string>(activeWhiteLabelConfig.accentColor);
  const [customDomain, setCustomDomain] = useState<string>(activeWhiteLabelConfig.customDomain);
  const [removePlatformBranding, setRemovePlatformBranding] = useState<boolean>(
    activeWhiteLabelConfig.removePlatformBranding
  );
  const [supportEmail, setSupportEmail] = useState<string>(activeWhiteLabelConfig.supportEmail);
  const [emailSenderName, setEmailSenderName] = useState<string>(activeWhiteLabelConfig.emailSenderName);
  const [emailSignature, setEmailSignature] = useState<string>(activeWhiteLabelConfig.emailSignatureMarkdown);
  const [welcomeMessage, setWelcomeMessage] = useState<string>(activeWhiteLabelConfig.clientPortalWelcomeMessage);
  const [enableCustomCss, setEnableCustomCss] = useState<boolean>(activeWhiteLabelConfig.enableCustomCss);
  const [customCssSnippet, setCustomCssSnippet] = useState<string>(activeWhiteLabelConfig.customCssSnippet || '');

  // Pre-configured themes
  const colorPresets = [
    { name: 'Apex Indigo', primary: '#6366f1', accent: '#10b981' },
    { name: 'Safari Emerald', primary: '#059669', accent: '#d97706' },
    { name: 'Nairobi Sunset', primary: '#ea580c', accent: '#e11d48' },
    { name: 'Kilimanjaro Violet', primary: '#8b5cf6', accent: '#06b6d4' },
    { name: 'Midnight Obsidian', primary: '#3b82f6', accent: '#f59e0b' }
  ];

  const handleApplyPreset = (preset: { primary: string; accent: string }) => {
    setPrimaryColor(preset.primary);
    setAccentColor(preset.accent);
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecordKey(key);
    addToast('Copied to Clipboard', text, 'info');
    setTimeout(() => setCopiedRecordKey(null), 2000);
  };

  const handleSaveAll = () => {
    updateWhiteLabelConfig(workspace.id, {
      agencyBrandName: brandName.trim(),
      agencyTagline: tagline.trim(),
      logoUrl: logoUrl.trim(),
      faviconUrl: faviconUrl.trim(),
      primaryColor,
      accentColor,
      customDomain: customDomain.trim().toLowerCase(),
      removePlatformBranding,
      supportEmail: supportEmail.trim(),
      emailSenderName: emailSenderName.trim(),
      emailSignatureMarkdown: emailSignature,
      clientPortalWelcomeMessage: welcomeMessage,
      enableCustomCss,
      customCssSnippet
    });
  };

  const handleVerifyDns = async () => {
    setIsVerifyingDns(true);
    setTimeout(async () => {
      await verifyCustomDomainDns(workspace.id);
      setIsVerifyingDns(false);
    }, 1200);
  };

  const handleResetToDefaults = () => {
    resetWhiteLabelConfig(workspace.id);
    setBrandName(workspace.name);
    setTagline('East Africa’s Premier Performance & Social Media Studio');
    setLogoUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80');
    setFaviconUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=32&auto=format&fit=crop&q=80');
    setPrimaryColor('#6366f1');
    setAccentColor('#10b981');
    setCustomDomain(`portal.${workspace.slug}.co.ke`);
    setRemovePlatformBranding(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden border border-indigo-700/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-3 border border-indigo-500/30">
              <Palette className="w-3.5 h-3.5 text-amber-300" />
              White-Label Customization
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5">
              <span>White-Label Agency Engine</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-medium">
                {activeWhiteLabelConfig.domainStatus === 'active' ? 'SSL Active (TLS 1.3)' : 'Setup Pending'}
              </span>
            </h1>
            <p className="text-indigo-200/80 text-sm max-w-2xl mt-1">
              Deliver a fully branded client experience with custom vanity domains, bespoke color schemes, vanity email signatures, and complete removal of platform watermarks.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/70 p-2 rounded-xl border border-indigo-500/30 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('brand')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'brand'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Branding & Colors</span>
            </button>
            <button
              onClick={() => setActiveTab('domain')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'domain'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Vanity Domain</span>
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'email'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email & Footers</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Portal Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'brand' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Agency Identity & Visual Tokens</h2>
                    <p className="text-xs text-slate-400">These assets define your client-facing portal & reports</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetToDefaults}
                  className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>

              {/* Agency Brand Name & Tagline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Agency Display Name
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Apex Media Collective Kenya"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Brand Tagline / Slogan
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. East Africa's Premier Performance Agency"
                    className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Logo & Favicon URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Agency Logo Image URL
                  </label>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Recommended: Transparent PNG or SVG (240x60px)</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Favicon URL
                  </label>
                  <input
                    type="text"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Recommended: 32x32px or 64x64px square icon</span>
                </div>
              </div>

              {/* Color Scheme Picker */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Client Portal Brand Colors
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-300 font-medium block">Primary Color</span>
                      <span className="text-[11px] text-slate-400 font-mono">{primaryColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <div
                        className="w-7 h-7 rounded-lg border border-slate-700 shadow-inner"
                        style={{ backgroundColor: primaryColor }}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-300 font-medium block">Accent Color</span>
                      <span className="text-[11px] text-slate-400 font-mono">{accentColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <div
                        className="w-7 h-7 rounded-lg border border-slate-700 shadow-inner"
                        style={{ backgroundColor: accentColor }}
                      />
                    </div>
                  </div>
                </div>

                {/* Color Presets */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-medium mr-1">Palettes:</span>
                  {colorPresets.map(preset => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Watermark Removal Toggle */}
              <div className="pt-2 border-t border-slate-800">
                <div className="bg-indigo-950/30 border border-indigo-800/40 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 mt-0.5">
                      <ShieldCheck className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Remove "Powered by Versaly Flow" Badge</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold uppercase">
                          Enterprise
                        </span>
                      </h4>
                      <p className="text-[11px] text-indigo-200/70 mt-0.5 leading-relaxed">
                        Strip all platform copyright notices, footer watermarks, and powered-by links. The portal will appear 100% proprietary to your agency.
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={removePlatformBranding}
                      onChange={(e) => setRemovePlatformBranding(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save White-Label Brand Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Visual Swatch & Brand Card Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-400" />
                Live Brand Card Preview
              </h3>

              {/* Simulated Client Portal Header Card */}
              <div
                className="rounded-2xl p-5 border text-white shadow-xl relative overflow-hidden transition-all"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}22 0%, #0f172a 100%)`,
                  borderColor: `${primaryColor}44`
                }}
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={logoUrl}
                      alt={brandName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-md"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <h4 className="text-sm font-black text-white">{brandName || 'Apex Media'}</h4>
                      <p className="text-[10px] text-slate-300">{tagline}</p>
                    </div>
                  </div>

                  <span
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Client Portal
                  </span>
                </div>

                <div className="mt-4 p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Welcome Headline</span>
                  <p className="text-xs text-slate-200 italic">
                    "{welcomeMessage || 'Karibu to your dedicated review portal.'}"
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Approve Deliverables
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700"
                    >
                      Request Edits
                    </button>
                  </div>

                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded border"
                    style={{ color: accentColor, borderColor: `${accentColor}44` }}
                  >
                    Accent Token
                  </span>
                </div>

                {/* Platform Badge Indicator */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>SSL: Encrypted (256-bit)</span>
                  {removePlatformBranding ? (
                    <span className="text-emerald-400 font-medium">100% Unbranded Agency View</span>
                  ) : (
                    <span className="text-slate-500 font-mono">Powered by Versaly Flow</span>
                  )}
                </div>
              </div>

              {/* Favicon & Web Tab Preview */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Browser Tab Title & Favicon Preview
                </span>
                <div className="bg-slate-900 border border-slate-750 px-3 py-2 rounded-lg flex items-center gap-2.5 max-w-xs shadow-inner">
                  <img
                    src={faviconUrl}
                    alt="Favicon"
                    className="w-4 h-4 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-xs font-medium text-slate-200 truncate">
                    {brandName} | Client Portal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Vanity Domain & DNS Verification */}
      {activeTab === 'domain' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  Custom Vanity Domain & SSL TLS 1.3 Routing
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct your clients to your agency's domain rather than standard platform links.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Wildcard SSL Active</span>
                </span>
                <button
                  type="button"
                  onClick={handleVerifyDns}
                  disabled={isVerifyingDns}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingDns ? 'animate-spin' : ''}`} />
                  <span>{isVerifyingDns ? 'Probing Nameservers...' : 'Verify DNS Propagation'}</span>
                </button>
              </div>
            </div>

            {/* Custom Domain Input */}
            <div className="max-w-xl">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Client Portal Domain (FQDN)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="portal.youragency.ke"
                  className="bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-3.5 py-2.5 flex-1 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
                >
                  Save Domain
                </button>
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                Point this host via CNAME to <code className="text-indigo-400 font-mono">cname.versalyflow.app</code>
              </span>
            </div>

            {/* DNS Records Table */}
            <div className="pt-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Required DNS Host Records
              </h3>

              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Host / Subdomain</th>
                      <th className="px-4 py-3">Target Value</th>
                      <th className="px-4 py-3">TTL</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                    {activeWhiteLabelConfig.dnsRecords.map((record, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-indigo-400">
                          {record.type}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-200">
                          {record.host}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-300">
                          {record.targetValue}
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono">
                          {record.ttl}s
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              record.status === 'verified'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span className="capitalize">{record.status}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleCopyText(record.targetValue, `rec_${rIdx}`)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] transition-colors"
                          >
                            {copiedRecordKey === `rec_${rIdx}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* DNS Instructions Callout */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-300">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                DNS Provider Guides for Kenyan Agencies
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Log into your domain registrar (e.g. <strong>Safaricom Domains, Truehost Kenya, Kenya Website Experts, Cloudflare, or GoDaddy</strong>). Navigate to your Zone Editor and create the CNAME record mapping your subdomain to <span className="text-indigo-400 font-mono">cname.versalyflow.app</span>. Automated SSL certificates issue within 90 seconds of first HTTP traffic.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Email Signature & Messaging */}
      {activeTab === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  White-Labeled Notification & Email Sender
                </h2>
                <p className="text-xs text-slate-400">
                  Configure outgoing sign-off notifications and client approval digest emails
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Sender Display Name
                </label>
                <input
                  type="text"
                  value={emailSenderName}
                  onChange={(e) => setEmailSenderName(e.target.value)}
                  placeholder="e.g. Apex Media Client Success Team"
                  className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Support & Reply-To Email
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="habari@apexmedia.co.ke"
                  className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Client Portal Welcome Announcement
                </label>
                <textarea
                  rows={3}
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Footer Signature (Markdown)
                </label>
                <textarea
                  rows={4}
                  value={emailSignature}
                  onChange={(e) => setEmailSignature(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 font-mono text-xs resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveAll}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save Notification & Signature Settings</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Email Render Preview */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-400" />
                Live Client Email Dispatch Preview
              </h3>

              {/* Simulated Client Email Container */}
              <div className="bg-white text-slate-900 rounded-xl p-6 shadow-xl border border-slate-200 text-xs space-y-4 font-sans">
                {/* Email Header */}
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={logoUrl}
                      alt={brandName}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">{brandName}</span>
                      <span className="text-[10px] text-slate-500">From: {emailSenderName} &lt;{supportEmail}&gt;</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">Today at 10:15 AM EAT</span>
                </div>

                {/* Email Body */}
                <div className="space-y-2.5 text-slate-700 leading-relaxed text-xs">
                  <p><strong>Dear Partner,</strong></p>
                  <p>
                    A new batch of creative deliverables has been uploaded for your upcoming social campaign. Please review the visual assets, copy hooks, and scheduling slots for approval.
                  </p>

                  <div className="my-3 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">Post Deliverable #42: Product Launch Teaser</span>
                      <span className="text-[11px] text-slate-500">Scheduled: Friday, 4:00 PM EAT</span>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded text-xs font-semibold text-white shadow-sm"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Review & Approve
                    </button>
                  </div>
                </div>

                {/* Rendered Email Footer Signature */}
                <div className="pt-4 border-t border-slate-200 text-slate-600 text-[11px] whitespace-pre-line leading-relaxed">
                  {emailSignature}
                </div>

                {/* Watermark Removal Verification */}
                <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-slate-100">
                  {removePlatformBranding ? (
                    <span className="text-slate-400 italic">© 2026 {brandName}. All rights reserved. Confidential.</span>
                  ) : (
                    <span>Powered by Versaly Flow Social Media OS</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Full Device Sandbox Preview */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          {/* Device Controls Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Client Preview Frame:</span>
              <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setDevicePreview('desktop')}
                  className={`p-1.5 rounded-lg transition-all ${
                    devicePreview === 'desktop'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Desktop (16:9 Viewport)"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDevicePreview('tablet')}
                  className={`p-1.5 rounded-lg transition-all ${
                    devicePreview === 'tablet'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tablet (iPad Viewport)"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDevicePreview('mobile')}
                  className={`p-1.5 rounded-lg transition-all ${
                    devicePreview === 'mobile'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mobile (iPhone Viewport)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>https://{customDomain}/approvals</span>
            </div>
          </div>

          {/* Sandbox Mockup Window */}
          <div className="flex justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800 overflow-hidden">
            <div
              className={`transition-all duration-300 bg-slate-950 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col ${
                devicePreview === 'desktop'
                  ? 'w-full max-w-5xl min-h-[580px]'
                  : devicePreview === 'tablet'
                  ? 'w-[768px] min-h-[520px]'
                  : 'w-[375px] min-h-[600px]'
              }`}
            >
              {/* Browser Window Header Chrome */}
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>

                <div className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-md text-[11px] text-slate-300 font-mono flex items-center gap-1.5 max-w-sm truncate">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>https://{customDomain}</span>
                </div>

                <span className="text-[10px] text-slate-500 font-mono">TLS 1.3</span>
              </div>

              {/* Portal Client Nav Bar */}
              <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <img
                    src={logoUrl}
                    alt={brandName}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-700 shadow-sm"
                  />
                  <div>
                    <h3 className="text-sm font-black text-white">{brandName}</h3>
                    <span className="text-[10px] text-slate-400">{tagline}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-300 hidden sm:inline">Signed in as <strong>client@organics.co.ke</strong></span>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-md"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Client Dashboard
                  </button>
                </div>
              </div>

              {/* Portal Body Content */}
              <div className="p-6 space-y-6 flex-1 overflow-y-auto bg-slate-950">
                {/* Welcome Hero */}
                <div
                  className="rounded-2xl p-6 border text-white shadow-lg relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}22 0%, #0b0f17 100%)`,
                    borderColor: `${primaryColor}44`
                  }}
                >
                  <h2 className="text-xl font-black text-white">Campaign Sign-Off Portal</h2>
                  <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
                    {welcomeMessage}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: accentColor, color: '#000' }}
                    >
                      3 Pending Client Sign-Offs
                    </span>
                    <span className="text-xs text-slate-400">• SLA Target: Today 5:00 PM EAT</span>
                  </div>
                </div>

                {/* Sample Deliverable Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Post #01: Purple Tea Highland Launch Teaser</span>
                    <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Awaiting Sign-off
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "Did you know that high-altitude purple tea grown on the slopes of the Mau Escarpment yields 3x more anthocyanins than conventional green tea? Formulated and packaged right here in Nairobi."
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                    <span className="text-slate-400">Scheduled: Oct 02, 2026 at 4:00 PM EAT</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Approve Post
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700"
                      >
                        Request Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portal Footer */}
              <div className="bg-slate-900 border-t border-slate-800 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
                <span>© 2026 {brandName}. All rights reserved.</span>
                {removePlatformBranding ? (
                  <span className="text-emerald-400/90 font-medium">Verified Custom Agency Domain</span>
                ) : (
                  <span>Powered by Versaly Flow</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
