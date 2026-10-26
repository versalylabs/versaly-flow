/**
 * PulseBrand Agency OS - Client Management Module
 * Phase 07: Client Management
 * Localized for Kenya Market (KES Currency, Kenyan Brand Guidelines & Social Integration)
 */

import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { ClientBrand, SocialAccount } from '../../types';
import {
  Building2,
  Globe,
  Plus,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Users,
  Instagram,
  Linkedin,
  Twitter,
  Share2,
  Flame,
  FileText,
  DollarSign,
  Palette,
  Type,
  ThumbsUp,
  ThumbsDown,
  Phone,
  Mail,
  Edit,
  Save,
  X,
  Radio,
  Check,
  Trash2
} from 'lucide-react';

export const ClientManagement: React.FC = () => {
  const {
    workspace,
    currentUser,
    capabilities,
    clients,
    activeClient,
    setActiveClientId,
    updateClientBrand,
    createClientBrand,
    deleteClientBrand,
    toggleSocialConnection,
    contentItems,
    addToast
  } = useAgency();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'onboarding' | 'paused'>('all');
  const [selectedClientId, setSelectedClientId] = useState<string>(
    activeClient?.id || clients.find(c => c.tenantId === workspace.id)?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'guidelines' | 'social' | 'contracts'>('overview');
  const [isCreatingModal, setIsCreatingModal] = useState(false);

  // New Client Form State
  const [newBrandName, setNewBrandName] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newAccentColor, setNewAccentColor] = useState('#10b981');
  const [newRetainerKES, setNewRetainerKES] = useState(350000);
  const [newQuota, setNewQuota] = useState(20);
  const [newToneString, setNewToneString] = useState('Authoritative, Warm Afro-modern, Terroir-focused');
  const [newSummary, setNewSummary] = useState('');

  // Scoped clients for this active agency workspace
  const scopedClients = clients.filter(c => c.tenantId === workspace.id);

  // Filtered clients
  const filteredClients = scopedClients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const currentClient = scopedClients.find(c => c.id === selectedClientId) || scopedClients[0] || null;

  // Edit Brand Guideline State for currently viewed client
  const [isEditingGuidelines, setIsEditingGuidelines] = useState(false);
  const [editedToneString, setEditedToneString] = useState('');
  const [editedSummary, setEditedSummary] = useState('');
  const [editedDos, setEditedDos] = useState('');
  const [editedDonts, setEditedDonts] = useState('');

  const startEditGuidelines = (client: ClientBrand) => {
    setEditedToneString(client.toneOfVoice.join(', '));
    setEditedSummary(client.brandGuidelinesSummary);
    setEditedDos(client.guidelineDetails?.dos?.join('\n') || '');
    setEditedDonts(client.guidelineDetails?.donts?.join('\n') || '');
    setIsEditingGuidelines(true);
  };

  const saveGuidelines = (clientId: string) => {
    const newTones = editedToneString.split(',').map(t => t.trim()).filter(Boolean);
    const newDos = editedDos.split('\n').map(d => d.trim()).filter(Boolean);
    const newDonts = editedDonts.split('\n').map(d => d.trim()).filter(Boolean);

    updateClientBrand(clientId, {
      toneOfVoice: newTones,
      brandGuidelinesSummary: editedSummary.trim(),
      guidelineDetails: {
        ...(currentClient?.guidelineDetails || {}),
        dos: newDos,
        donts: newDonts
      }
    });
    setIsEditingGuidelines(false);
  };

  const handleCreateClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim() || !newIndustry.trim()) {
      addToast('Validation Error', 'Brand name and industry are required', 'error');
      return;
    }

    const tones = newToneString.split(',').map(t => t.trim()).filter(Boolean);
    const created = createClientBrand({
      tenantId: workspace.id,
      name: newBrandName.trim(),
      industry: newIndustry.trim(),
      website: newWebsite.trim() || `https://${newBrandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.co.ke`,
      accentColor: newAccentColor,
      status: 'active',
      toneOfVoice: tones,
      brandGuidelinesSummary: newSummary.trim() || 'Modern Kenyan aesthetic with clean typography and high-converting storytelling.',
      guidelineDetails: {
        primaryFont: 'Cabinet Grotesk / Inter',
        secondaryFont: 'Editorial New / Playfair',
        colorPalette: [
          { name: 'Primary Accent', hex: newAccentColor },
          { name: 'Nairobi Slate', hex: '#0f172a' },
          { name: 'Pure White', hex: '#ffffff' }
        ],
        dos: ['Feature high-resolution photography', 'Maintain authentic local voice'],
        donts: ['Avoid generic stock images', 'Never post unreviewed captions']
      },
      contacts: [
        {
          name: `${newBrandName} Marketing Team`,
          email: `marketing@${newBrandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.co.ke`,
          roleTitle: 'Brand Signoff Lead',
          isPrimarySignoff: true
        }
      ],
      assignedManagerId: currentUser.id,
      socialAccounts: [
        {
          id: `soc_${Date.now()}_ig`,
          platform: 'instagram',
          handle: `@${newBrandName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          accountName: `${newBrandName} Official`,
          connected: false,
          followerCount: 0
        }
      ],
      retainerMonthlyValue: Number(newRetainerKES) || 300000,
      monthlyPostQuota: Number(newQuota) || 16
    });

    setSelectedClientId(created.id);
    setActiveClientId(created.id);
    setIsCreatingModal(false);
    // Reset form
    setNewBrandName('');
    setNewIndustry('');
    setNewWebsite('');
    setNewSummary('');
  };

  const clientContent = contentItems.filter(p => p.clientId === currentClient?.id);
  const publishedCount = clientContent.filter(p => p.stage === 'published').length;
  const inReviewCount = clientContent.filter(p => p.stage === 'internal_review' || p.stage === 'client_review').length;
  const quotaPacing = currentClient ? Math.round((currentClient.currentMonthPublishedCount / currentClient.monthlyPostQuota) * 100) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>{workspace.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Client Management</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">{scopedClients.length} Brands Enrolled</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Client Brands & Identity Repository</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Centralized client directory, authoritative brand guidelines, Kenyan social handle registry, and retainer SLA trackers.
          </p>
        </div>

        {/* Action Button: Onboard New Brand */}
        {capabilities.canCreateClients && (
          <button
            onClick={() => setIsCreatingModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 self-start md:self-auto shadow-md shadow-emerald-950/30"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Client Brand</span>
          </button>
        )}
      </div>

      {/* Main Two-Column Layout: Client Directory on Left, Detailed Client Dossier on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Searchable Client List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            {/* Search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brands or industries..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto pb-1">
              {(['all', 'active', 'onboarding', 'paused'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md font-mono capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Client Cards List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredClients.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No client brands match current filters.
                </div>
              ) : (
                filteredClients.map(client => {
                  const isSelected = client.id === currentClient?.id;
                  const pacing = Math.round((client.currentMonthPublishedCount / client.monthlyPostQuota) * 100);

                  return (
                    <div
                      key={client.id}
                      onClick={() => {
                        setSelectedClientId(client.id);
                        setActiveClientId(client.id);
                        setIsEditingGuidelines(false);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all space-y-2 ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-500/80 shadow-lg shadow-emerald-950/20'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: client.accentColor }}
                          ></span>
                          <span className="font-bold text-xs text-white truncate max-w-[170px]">
                            {client.name}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                          client.status === 'active'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                            : client.status === 'onboarding'
                            ? 'bg-purple-950/60 text-purple-400 border-purple-800/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {client.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 truncate">{client.industry}</div>

                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/60">
                        <span>
                          {capabilities.canViewFinancials ? (
                            <span className="text-emerald-400 font-bold">
                              KSh {(client.retainerMonthlyValue / 1000).toFixed(0)}k/mo
                            </span>
                          ) : (
                            <span className="text-slate-500">Retainer Scoped</span>
                          )}
                        </span>
                        <span>{client.currentMonthPublishedCount}/{client.monthlyPostQuota} posts ({pacing}%)</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Client Dossier & Workspace Scoping (8 cols) */}
        {currentClient ? (
          <div className="lg:col-span-8 space-y-5">
            {/* Client Banner Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md shrink-0"
                    style={{ backgroundColor: currentClient.accentColor }}
                  >
                    {currentClient.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white tracking-tight">{currentClient.name}</h2>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase">
                        {currentClient.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{currentClient.industry}</div>
                    <a
                      href={currentClient.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 text-xs font-mono flex items-center gap-1 mt-1 hover:underline"
                    >
                      <span>{currentClient.website}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Retainer & Quota Pill & Delete Action */}
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-right space-y-1 w-full sm:w-auto">
                    <div className="text-[10px] uppercase font-mono text-slate-400">Monthly Retainer</div>
                    <div className="font-mono text-sm font-bold text-emerald-400">
                      {capabilities.canViewFinancials ? (
                        `KSh ${currentClient.retainerMonthlyValue.toLocaleString()} / mo`
                      ) : (
                        <span className="text-slate-600 italic">Protected</span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Quota: {currentClient.monthlyPostQuota} Posts/Month
                    </div>
                  </div>

                  {capabilities.canCreateClients && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Permanently remove "${currentClient.name}" and cascade-delete all its dependent posts, campaigns, and contracts?`)) {
                          deleteClientBrand(currentClient.id);
                        }
                      }}
                      title="Delete client brand and cascade cleanup"
                      className="px-2.5 py-1 text-[11px] text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900/40 rounded-md transition-colors flex items-center gap-1.5 self-end"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete Brand</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-tabs for Client Dossier */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-medium">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Overview & Delivery Pacing</span>
                </button>
                <button
                  onClick={() => setActiveTab('guidelines')}
                  className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'guidelines'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Brand Guidelines & Tone</span>
                </button>
                <button
                  onClick={() => setActiveTab('social')}
                  className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'social'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Social Handles ({currentClient.socialAccounts.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('contracts')}
                  className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'contracts'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Signoff Contacts ({currentClient.contacts?.length || 1})</span>
                </button>
              </div>

              {/* Tab 1: Overview & Pacing */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                      <div className="text-[10px] text-slate-400 font-mono uppercase">Month Quota Pacing</div>
                      <div className="text-xl font-bold font-mono text-white mt-1">
                        {currentClient.currentMonthPublishedCount} / {currentClient.monthlyPostQuota}
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${Math.min(quotaPacing, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-1">{quotaPacing}% fulfilled</div>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                      <div className="text-[10px] text-slate-400 font-mono uppercase">In Review Queue</div>
                      <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                        {currentClient.pendingApprovalCount} Posts
                      </div>
                      <div className="text-[10px] text-slate-400 mt-2 font-mono">
                        Awaiting signoff gate
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                      <div className="text-[10px] text-slate-400 font-mono uppercase">Brand Signoff Lead</div>
                      <div className="text-sm font-bold text-white mt-1 truncate">
                        {currentClient.contacts?.[0]?.name || 'Brian Kiprop'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono truncate">
                        {currentClient.contacts?.[0]?.email || 'brian@keringetorganics.co.ke'}
                      </div>
                    </div>
                  </div>

                  {/* Brand Summary */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                    <div className="text-xs font-semibold text-slate-200">Executive Brand Summary</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {currentClient.brandGuidelinesSummary}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Brand Guidelines & Tone */}
              {activeTab === 'guidelines' && (
                <div className="space-y-4">
                  {isEditingGuidelines ? (
                    <div className="space-y-4 bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Tone of Voice Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={editedToneString}
                          onChange={(e) => setEditedToneString(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Guidelines Summary
                        </label>
                        <textarea
                          rows={3}
                          value={editedSummary}
                          onChange={(e) => setEditedSummary(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-3 rounded-lg focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-emerald-400 block mb-1">
                            Editorial Do's (one per line)
                          </label>
                          <textarea
                            rows={4}
                            value={editedDos}
                            onChange={(e) => setEditedDos(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-red-400 block mb-1">
                            Editorial Don'ts (one per line)
                          </label>
                          <textarea
                            rows={4}
                            value={editedDonts}
                            onChange={(e) => setEditedDonts(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-red-500 font-mono text-[11px]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setIsEditingGuidelines(false)}
                          className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveGuidelines(currentClient.id)}
                          className="px-4 py-1.5 bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-500 flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Brand Guidelines</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-white">Authoritative Brand Directives</span>
                        {capabilities.canEditClientProfiles && (
                          <button
                            onClick={() => startEditGuidelines(currentClient)}
                            className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit Guidelines</span>
                          </button>
                        )}
                      </div>

                      {/* Tone of voice tags */}
                      <div>
                        <div className="text-[11px] text-slate-400 uppercase font-mono mb-2">Tone Vectors</div>
                        <div className="flex flex-wrap gap-2">
                          {currentClient.toneOfVoice.map((tone, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs rounded-lg font-medium"
                            >
                              {tone}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Do's and Don'ts */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Mandatory Content Do's</span>
                          </div>
                          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                            {(currentClient.guidelineDetails?.dos || ['Feature authentic high-resolution imagery', 'Maintain local Kenyan voice']).map((d, i) => (
                              <li key={i} className="leading-relaxed">{d}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                          <div className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span>Strict Brand Don'ts</span>
                          </div>
                          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                            {(currentClient.guidelineDetails?.donts || ['Never use generic low-resolution stock', 'Avoid aggressive sales terminology']).map((d, i) => (
                              <li key={i} className="leading-relaxed">{d}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Color Palette & Typography */}
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-200">Typography & Color Palette</span>
                          <span className="text-[11px] font-mono text-slate-400">
                            Primary: {currentClient.guidelineDetails?.primaryFont || 'Cabinet Grotesk / Inter'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {(currentClient.guidelineDetails?.colorPalette || [
                            { name: 'Accent', hex: currentClient.accentColor },
                            { name: 'Dark', hex: '#0f172a' },
                            { name: 'Light', hex: '#f8fafc' }
                          ]).map((color, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-md border border-slate-700 shrink-0"
                                style={{ backgroundColor: color.hex }}
                              ></div>
                              <div>
                                <div className="text-[10px] text-slate-300 font-semibold">{color.name}</div>
                                <div className="text-[9px] font-mono text-slate-500">{color.hex}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Social Account Connections */}
              {activeTab === 'social' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Connected Social Endpoints & Telemetry Handlers</span>
                    <span className="font-mono text-emerald-400">OAuth 2.0 Webhooks</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentClient.socialAccounts.map(account => (
                      <div
                        key={account.id}
                        className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
                            {account.platform === 'instagram' && <Instagram className="w-4 h-4 text-pink-400" />}
                            {account.platform === 'linkedin' && <Linkedin className="w-4 h-4 text-blue-400" />}
                            {account.platform === 'twitter' && <Twitter className="w-4 h-4 text-sky-400" />}
                            {account.platform === 'tiktok' && <Share2 className="w-4 h-4 text-cyan-400" />}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-white">{account.accountName}</div>
                            <div className="text-[11px] font-mono text-emerald-400">{account.handle}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {account.followerCount.toLocaleString()} followers
                            </div>
                          </div>
                        </div>

                        {/* Connection Toggle */}
                        <div>
                          <button
                            onClick={() => toggleSocialConnection(currentClient.id, account.id)}
                            className={`px-3 py-1 text-[11px] font-mono rounded-lg border transition-colors ${
                              account.connected
                                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40 hover:bg-emerald-900/60'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                            }`}
                          >
                            {account.connected ? '● Connected' : '○ Disconnected'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Stakeholders & Contacts */}
              {activeTab === 'contracts' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-400">
                    Authorized Stakeholders with Content Approval Signoff Rights:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(currentClient.contacts || [
                      {
                        name: 'Authorized Marketing Lead',
                        email: `signoff@${currentClient.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.co.ke`,
                        roleTitle: 'Primary Approver',
                        isPrimarySignoff: true
                      }
                    ]).map((contact, idx) => (
                      <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{contact.name}</span>
                          {contact.isPrimarySignoff && (
                            <span className="text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-800/40 px-2 py-0.5 rounded">
                              Primary Signoff
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{contact.roleTitle}</div>
                        <div className="pt-2 border-t border-slate-800/60 text-xs font-mono text-slate-400 space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Mail className="w-3 h-3 text-emerald-400" />
                            <span>{contact.email}</span>
                          </div>
                          {contact.phone && (
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Phone className="w-3 h-3 text-teal-400" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-inner">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Client Brand Selected</h3>
            <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
              {scopedClients.length === 0
                ? 'Your workspace has no client brands yet. Onboard your first client brand to configure social accounts, approval workflows, brand guidelines, and retainers.'
                : 'Select a client brand from the directory on the left to inspect guidelines, manage social handles, and review delivery quotas.'}
            </p>
            {scopedClients.length === 0 && (
              <button
                type="button"
                onClick={() => setIsCreatingModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 px-5 rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard First Client Brand</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Onboard Client Modal */}
      {isCreatingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Onboard New Client Brand into {workspace.name}</span>
              </div>
              <button
                onClick={() => setIsCreatingModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleCreateClientSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="e.g. Mara Wilderness Lodges"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Industry Sector *</label>
                  <input
                    type="text"
                    required
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    placeholder="e.g. Eco-Tourism & Hospitality"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Website URL</label>
                  <input
                    type="text"
                    value={newWebsite}
                    onChange={(e) => setNewWebsite(e.target.value)}
                    placeholder="https://maralodges.co.ke"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly Retainer (KES)</label>
                  <input
                    type="number"
                    step="10000"
                    value={newRetainerKES}
                    onChange={(e) => setNewRetainerKES(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly Post Quota</label>
                  <input
                    type="number"
                    value={newQuota}
                    onChange={(e) => setNewQuota(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Brand Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newAccentColor}
                      onChange={(e) => setNewAccentColor(e.target.value)}
                      className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-400">{newAccentColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tone of Voice Vectors</label>
                <input
                  type="text"
                  value={newToneString}
                  onChange={(e) => setNewToneString(e.target.value)}
                  placeholder="e.g. Safari Luxury, Conservation Focus, Warm Swahili Hospitality"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Brand Guidelines Summary</label>
                <textarea
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Summary of creative direction and aesthetic standards..."
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-3 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingModal(false)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Enroll Brand</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
