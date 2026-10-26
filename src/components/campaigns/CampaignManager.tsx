/**
 * PulseBrand Agency OS - Campaign Strategy & Management
 * Phase 15: Campaign Strategy & Management
 * Thematic multi-channel campaign groups, budget expenditure tracking vs planned retainer in KES,
 * post bundling & deliverable progress, target KPI monitors, and milestone progress checklist.
 */

import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { Campaign, CampaignKPI, CampaignMilestone } from '../../types';
import {
  Target,
  Building2,
  Calendar,
  Coins,
  TrendingUp,
  CheckCircle2,
  Clock,
  Plus,
  Layers,
  FileText,
  AlertCircle,
  BarChart3,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  ChevronRight,
  Hash,
  Users,
  Flag,
  Trash2,
  X
} from 'lucide-react';

export const CampaignManager: React.FC = () => {
  const {
    workspace,
    currentUser,
    clients,
    campaigns,
    contentItems,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    toggleMilestone,
    addToast
  } = useAgency();

  // Filters & State
  const scopedClients = clients.filter(c => c.tenantId === workspace.id);
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Form State for New Campaign
  const [newName, setNewName] = useState<string>('');
  const [newClientId, setNewClientId] = useState<string>(scopedClients[0]?.id || '');
  const [newObjective, setNewObjective] = useState<Campaign['objective']>('product_launch');
  const [newBudget, setNewBudget] = useState<number>(300000);
  const [newStartDate, setNewStartDate] = useState<string>('2026-10-01');
  const [newEndDate, setNewEndDate] = useState<string>('2026-10-31');
  const [newTargetPosts, setNewTargetPosts] = useState<number>(10);
  const [newDescription, setNewDescription] = useState<string>('');
  const [newAudience, setNewAudience] = useState<string>('');
  const [newHashtag, setNewHashtag] = useState<string>('');

  // Scoped Campaigns
  const filteredCampaigns = campaigns.filter(camp => {
    if (camp.tenantId !== workspace.id) return false;
    if (selectedClientId !== 'all' && camp.clientId !== selectedClientId) return false;
    if (statusFilter !== 'all' && camp.status !== statusFilter) return false;
    return true;
  });

  // Active / Selected Campaign
  const activeCampaign = campaigns.find(c => c.id === selectedCampaignId) || filteredCampaigns[0] || null;
  const activeClient = activeCampaign ? scopedClients.find(c => c.id === activeCampaign.clientId) : null;

  // Posts attached to this campaign
  const campaignPosts = activeCampaign
    ? contentItems.filter(p => p.campaignId === activeCampaign.id || (p.clientId === activeCampaign.clientId && p.tags.some(t => activeCampaign.primaryHashtag?.toLowerCase().includes(t.toLowerCase()))))
    : [];

  // Summary Metrics across Scoped Campaigns
  const totalAllocatedBudget = filteredCampaigns.reduce((acc, c) => acc + (c.budgetAllocated || 0), 0);
  const totalSpentBudget = filteredCampaigns.reduce((acc, c) => acc + (c.budgetSpent || 0), 0);
  const budgetUtilization = totalAllocatedBudget > 0 ? Math.round((totalSpentBudget / totalAllocatedBudget) * 100) : 0;

  // Format KES currency
  const formatKES = (amount: number) => {
    return `KES ${amount.toLocaleString('en-KE')}`;
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      addToast('Validation Error', 'Campaign name is required', 'error');
      return;
    }

    createCampaign({
      tenantId: workspace.id,
      clientId: newClientId || scopedClients[0]?.id || 'client_01',
      name: newName.trim(),
      objective: newObjective,
      startDate: newStartDate,
      endDate: newEndDate,
      budgetAllocated: Number(newBudget),
      budgetSpent: 0,
      status: 'in_progress',
      targetPostCount: Number(newTargetPosts),
      description: newDescription.trim() || undefined,
      targetAudience: newAudience.trim() || undefined,
      primaryHashtag: newHashtag.trim() || undefined,
      milestones: [
        { id: `m_${Date.now()}_1`, title: 'Creative Brief & Storyboard Sign-off', targetDate: newStartDate, completed: true, assignedRole: 'Creative Director' },
        { id: `m_${Date.now()}_2`, title: 'Mid-Flight Performance Evaluation', targetDate: newEndDate, completed: false, assignedRole: 'Account Manager' }
      ],
      kpis: [
        { metric: 'Audience Reach', target: 100000, current: 0, unit: 'accounts' },
        { metric: 'Total Engagements', target: 5000, current: 0, unit: 'interactions' }
      ]
    });

    setIsCreateModalOpen(false);
    setNewName('');
    setNewDescription('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>{workspace.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Campaign Strategy & Management</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">{filteredCampaigns.length} Active Initiatives</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Thematic Campaign Strategy & KPI Delivery</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Multi-channel campaign bundling across Kenyan client brands, spend expenditure tracking in KES,
            deliverable post quotas, target KPI monitoring, and strategic milestone execution.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/30"
          >
            <Plus className="w-4 h-4" />
            <span>Launch New Campaign</span>
          </button>
        </div>
      </div>

      {/* High-Level Budget & Execution Pulse Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Total Campaign Budgets</span>
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{formatKES(totalAllocatedBudget)}</div>
          <div className="text-[10px] text-slate-500">Across {filteredCampaigns.length} scoped client initiatives</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Expenditure (Burn Rate)</span>
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-indigo-300 font-mono">{formatKES(totalSpentBudget)}</div>
          <div className="text-[10px] text-slate-500">{budgetUtilization}% budget utilized to date</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Deliverable Posts</span>
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {filteredCampaigns.reduce((acc, c) => acc + (c.publishedPostCount || 0), 0)} / {filteredCampaigns.reduce((acc, c) => acc + (c.targetPostCount || 0), 0)}
          </div>
          <div className="text-[10px] text-slate-500">Published vs target creative quota</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Milestone Health</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">92.4% On-Track</div>
          <div className="text-[10px] text-slate-500">Zero overdue SLA gate violations</div>
        </div>
      </div>

      {/* Filter Strip: Brand Selector & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2">
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Brands Combined ({scopedClients.length})</option>
              {scopedClients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer capitalize"
            >
              <option value="all">All Statuses</option>
              <option value="in_progress">In Progress</option>
              <option value="planning">Planning</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Currency: <strong className="text-emerald-400">KES (Kenyan Shilling)</strong>
        </div>
      </div>

      {/* Main Split Layout: Left Column Campaign Selector (5 cols) + Right Column Deep Dive (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Campaigns List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Campaigns ({filteredCampaigns.length})
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Select to inspect dossier</span>
          </div>

          <div className="space-y-3">
            {filteredCampaigns.length === 0 ? (
              <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-xl text-center space-y-2">
                <Target className="w-8 h-8 text-slate-600 mx-auto" />
                <div className="text-xs font-bold text-white">No campaigns found</div>
                <p className="text-[11px] text-slate-400">Launch a strategic campaign to flight multi-channel deliverables.</p>
              </div>
            ) : (
              filteredCampaigns.map(camp => {
              const client = scopedClients.find(c => c.id === camp.clientId);
              const isSelected = activeCampaign?.id === camp.id;
              const spendPercentage = camp.budgetAllocated > 0 ? Math.round(((camp.budgetSpent || 0) / camp.budgetAllocated) * 100) : 0;
              const postProgress = camp.targetPostCount > 0 ? Math.round(((camp.publishedPostCount || 0) / camp.targetPostCount) * 100) : 0;

              return (
                <div
                  key={camp.id}
                  onClick={() => setSelectedCampaignId(camp.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-3 ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: client?.accentColor || '#10b981' }}
                        ></span>
                        <span className="text-[11px] font-bold text-slate-300">
                          {client?.name || 'Brand'}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                          {camp.objective.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white leading-snug">
                        {camp.name}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold block">
                        {formatKES(camp.budgetAllocated)}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        {camp.startDate.slice(5)} to {camp.endDate.slice(5)}
                      </span>
                    </div>
                  </div>

                  {/* Dual Progress Bars: Budget Spend & Post Output */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-800/80 text-[11px] font-mono">
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                        <span>Budget Spent: {formatKES(camp.budgetSpent || 0)}</span>
                        <span>{spendPercentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all"
                          style={{ width: `${Math.min(spendPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                        <span>Creative Deliverables: {camp.publishedPostCount} / {camp.targetPostCount} posts</span>
                        <span>{postProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${Math.min(postProgress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>

        {/* Right Column: Active Campaign Deep Dive (7 cols) */}
        {activeCampaign ? (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6 shadow-2xl">
            {/* Header with Client Info & Action */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: activeClient?.accentColor || '#10b981' }}
                  ></span>
                  <span className="text-xs font-mono text-slate-400 font-bold">
                    {activeClient?.name} Retainer Initiative
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                    {activeCampaign.status.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {activeCampaign.name}
                </h2>
                {activeCampaign.description && (
                  <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                    {activeCampaign.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 self-start">
                <button
                  onClick={() => deleteCampaign(activeCampaign.id)}
                  className="p-1.5 bg-slate-950 hover:bg-red-950/60 border border-slate-800 hover:border-red-800/40 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                  title="Archive Campaign"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Campaign Core Meta Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="text-[10px] text-slate-500 uppercase">Allocated Budget</div>
                <div className="font-bold text-emerald-400 text-sm mt-0.5">{formatKES(activeCampaign.budgetAllocated)}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Spent: {formatKES(activeCampaign.budgetSpent || 0)}</div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="text-[10px] text-slate-500 uppercase">Timeline Flight</div>
                <div className="font-bold text-white text-xs mt-0.5">{activeCampaign.startDate}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Until {activeCampaign.endDate}</div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="text-[10px] text-slate-500 uppercase">Primary Tag</div>
                <div className="font-bold text-cyan-400 text-xs mt-0.5">{activeCampaign.primaryHashtag || '#BrandKE'}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Objective: {activeCampaign.objective}</div>
              </div>
            </div>

            {/* Target Audience Profile */}
            {activeCampaign.targetAudience && (
              <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg flex items-center gap-3 text-xs">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Target Audience Demographics:</span>
                  <span className="text-slate-200">{activeCampaign.targetAudience}</span>
                </div>
              </div>
            )}

            {/* Target KPIs Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Strategic KPI Tracker</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">Real-time Performance</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeCampaign.kpis?.map((kpi, idx) => {
                  const pct = Math.round((kpi.current / kpi.target) * 100);
                  return (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                      <div className="text-[10px] font-mono text-slate-400 truncate">{kpi.metric}</div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-bold text-white font-mono">{kpi.current.toLocaleString()}</span>
                        <span className="text-[10px] font-mono text-slate-500">/ {kpi.target.toLocaleString()} {kpi.unit}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Milestones & Deliverable Gates */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Campaign Milestone Gates</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">1-Click Checklist</span>
              </div>

              <div className="space-y-2">
                {activeCampaign.milestones?.map(m => (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(activeCampaign.id, m.id)}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      m.completed
                        ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                        : 'bg-slate-950 border-slate-800 hover:border-indigo-500 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        m.completed ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600'
                      }`}>
                        {m.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={m.completed ? 'line-through text-slate-500' : 'font-semibold'}>
                        {m.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[10px]">
                      <span className="text-slate-500">{m.assignedRole}</span>
                      <span className="text-emerald-400">{m.targetDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bundled Creative Posts under Campaign */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Bundled Creative Deliverables ({campaignPosts.length} posts linked)</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">Content Pipeline</span>
              </div>

              {campaignPosts.length === 0 ? (
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-500 italic text-center">
                  No post drafts explicitly linked yet. Tag posts with #{activeCampaign.primaryHashtag?.replace('#', '')} or assign campaign ID.
                </div>
              ) : (
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg bg-slate-950 overflow-hidden">
                  {campaignPosts.map(post => (
                    <div key={post.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-white line-clamp-1">{post.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono capitalize">
                          {post.platforms.join(', ')} · {post.format.replace('_', ' ')}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-[10px]">
                        <span className="px-2 py-0.5 rounded border uppercase bg-slate-900 border-slate-700 text-slate-300">
                          {post.stage.replace('_', ' ')}
                        </span>
                        <span className="text-emerald-400">
                          {post.scheduledDate ? new Date(post.scheduledDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Unscheduled'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 p-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-xs italic">
            Select a campaign to inspect its deliverable flight and budget expenditure.
          </div>
        )}
      </div>

      {/* Launch New Campaign Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Launch Strategic Client Campaign</span>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Q4 Black Friday & Jamhuri Day Flash Promo"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Client Brand *</label>
                  <select
                    value={newClientId}
                    onChange={(e) => setNewClientId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {scopedClients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Strategic Objective</label>
                  <select
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value as Campaign['objective'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 capitalize"
                  >
                    <option value="brand_awareness">Brand Awareness</option>
                    <option value="lead_generation">Lead Generation</option>
                    <option value="product_launch">Product Launch</option>
                    <option value="community_growth">Community Growth</option>
                    <option value="event_promo">Event Promotion</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Allocated Budget (KES)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Target Post Quota</label>
                  <input
                    type="number"
                    value={newTargetPosts}
                    onChange={(e) => setNewTargetPosts(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Flight Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Flight End Date</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Primary Campaign Hashtag</label>
                <input
                  type="text"
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  placeholder="e.g. #CleanBeautyKE"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Strategy Narrative & Scope</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Summary of promotional angle, channel mix, and expected outcomes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Activate Campaign</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
