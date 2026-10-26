/**
 * Versaly Flow - Agency CRM & Leads Pipeline
 * Phase 20: Agency CRM & Leads Pipeline
 * Sales pipeline Kanban (Lead, Discovery, Proposal, Negotiation, Won),
 * weighted deal forecasting, prospect contact cards, timeline activity logger,
 * and 1-click won deal conversion into active client brand.
 */

import React, { useState, useMemo } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { CrmDeal, DealStage, DealActivity } from '../../types';
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  ExternalLink,
  MessageSquare,
  FileText,
  Phone,
  Mail,
  UserCheck,
  Briefcase,
  Layers,
  Sparkles,
  ChevronRight,
  MoreVertical,
  Check,
  X,
  Target,
  Award
} from 'lucide-react';

const STAGES: { id: DealStage; label: string; prob: number; color: string; bg: string }[] = [
  { id: 'lead', label: 'Lead / Inbound', prob: 20, color: 'text-slate-300', bg: 'bg-slate-800/80 border-slate-700' },
  { id: 'discovery', label: 'Discovery & Audit', prob: 40, color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-800/40' },
  { id: 'proposal', label: 'Proposal & Pitch', prob: 65, color: 'text-indigo-400', bg: 'bg-indigo-950/40 border-indigo-800/40' },
  { id: 'negotiation', label: 'Negotiation & SLA', prob: 80, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-800/40' },
  { id: 'won', label: 'Won & Retainer', prob: 100, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800/40' }
];

export const CrmPipelineManager: React.FC = () => {
  const {
    workspace,
    users,
    deals,
    createDeal,
    updateDeal,
    deleteDeal,
    transitionDealStage,
    addDealActivity,
    convertDealToClient,
    currentUser,
    addToast
  } = useAgency();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('all');
  const [activeDealId, setActiveDealId] = useState<string | null>(null);

  // New Deal Modal
  const [isNewDealModalOpen, setIsNewDealModalOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactTitle, setNewContactTitle] = useState('Marketing Director');
  const [newDealValue, setNewDealValue] = useState('450000');
  const [newContractMonths, setNewContractMonths] = useState(12);
  const [newStage, setNewStage] = useState<DealStage>('lead');
  const [newAssignedUser, setNewAssignedUser] = useState(currentUser.id);
  const [newNotes, setNewNotes] = useState('');

  // Activity Log in Inspector
  const [newActivityNote, setNewActivityNote] = useState('');
  const [newActivityType, setNewActivityType] = useState<DealActivity['type']>('note');

  // Filtered Deals
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      if (deal.tenantId !== workspace.id) return false;
      if (selectedUserFilter !== 'all' && deal.assignedUserId !== selectedUserFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCompany = deal.companyName.toLowerCase().includes(q);
        const matchContact = deal.contactName.toLowerCase().includes(q);
        const matchIndustry = deal.industry.toLowerCase().includes(q);
        if (!matchCompany && !matchContact && !matchIndustry) return false;
      }
      return true;
    });
  }, [deals, workspace.id, selectedUserFilter, searchQuery]);

  // Aggregate Financial Telemetry
  const pipelineMetrics = useMemo(() => {
    let grossValue = 0;
    let weightedValue = 0;
    let wonAnnualRunRate = 0;
    let activeDealsCount = 0;

    filteredDeals.forEach(deal => {
      if (deal.stage !== 'lost') {
        grossValue += deal.dealValueMonthly;
        weightedValue += deal.dealValueMonthly * (deal.probabilityPercent / 100);
        if (deal.stage !== 'won') {
          activeDealsCount++;
        }
      }
      if (deal.stage === 'won') {
        wonAnnualRunRate += deal.dealValueMonthly * 12;
      }
    });

    const avgProb = activeDealsCount > 0
      ? Math.round(filteredDeals.filter(d => d.stage !== 'won' && d.stage !== 'lost').reduce((acc, d) => acc + d.probabilityPercent, 0) / activeDealsCount)
      : 0;

    return {
      grossValue,
      weightedValue: Math.round(weightedValue),
      wonAnnualRunRate,
      activeDealsCount,
      avgProb
    };
  }, [filteredDeals]);

  const activeDeal = deals.find(d => d.id === activeDealId) || null;
  const currencySymbol = workspace.currency ? workspace.currency.split(' ')[0] : 'KSh';

  // Handlers
  const handleCreateDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim() || !newContactName.trim()) {
      addToast('Missing Details', 'Company and Contact name are required', 'warning');
      return;
    }

    const assigned = users.find(u => u.id === newAssignedUser);

    createDeal({
      tenantId: workspace.id,
      companyName: newCompanyName.trim(),
      industry: newIndustry.trim() || 'General Business',
      website: newWebsite.trim() || undefined,
      contactName: newContactName.trim(),
      contactEmail: newContactEmail.trim() || 'contact@prospect.co.ke',
      contactPhone: newContactPhone.trim() || undefined,
      contactTitle: newContactTitle.trim() || 'Marketing Lead',
      dealValueMonthly: parseInt(newDealValue, 10) || 350000,
      contractMonths: newContractMonths,
      stage: newStage,
      probabilityPercent: STAGES.find(s => s.id === newStage)?.prob || 20,
      assignedUserId: newAssignedUser,
      assignedUserName: assigned?.name || currentUser.name,
      expectedCloseDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      notes: newNotes.trim() || undefined
    });

    setIsNewDealModalOpen(false);
    // Reset Form
    setNewCompanyName('');
    setNewIndustry('');
    setNewWebsite('');
    setNewContactName('');
    setNewContactEmail('');
    setNewContactPhone('');
    setNewNotes('');
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDeal || !newActivityNote.trim()) return;
    addDealActivity(activeDeal.id, newActivityNote.trim(), newActivityType);
    setNewActivityNote('');
  };

  const handleConvertDeal = (dealId: string) => {
    const client = convertDealToClient(dealId);
    if (client) {
      setActiveDealId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">{workspace.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Agency CRM & Leads Pipeline</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400 font-mono">Commercial Retainer Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Agency CRM & Deals Pipeline</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Manage high-value agency retainer deals from initial discovery audit to contract negotiation.
            Track weighted revenue pipeline, log client meetings, and convert won deals into active onboarding brands in 1 click.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsNewDealModalOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New Prospect Deal</span>
          </button>
        </div>
      </div>

      {/* Pipeline Telemetry Pulse Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Pipeline MRR */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Pipeline Gross MRR</span>
            <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {currencySymbol} {pipelineMetrics.grossValue.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ mo</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {pipelineMetrics.activeDealsCount} active prospects in negotiation
          </div>
        </div>

        {/* Weighted Pipeline Revenue */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Weighted Forecast MRR</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">
            {currencySymbol} {pipelineMetrics.weightedValue.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ mo</span>
          </div>
          <div className="text-[10px] text-emerald-400/80 font-mono">
            Probability weighted by stage health ({pipelineMetrics.avgProb}% avg)
          </div>
        </div>

        {/* Won Retainers ARR */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Won Contracts ARR</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono">
            {currencySymbol} {pipelineMetrics.wonAnnualRunRate.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ yr</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Closed retainer commitments locked in
          </div>
        </div>

        {/* Conversion Velocity */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Average Close Cycle</span>
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-indigo-300 font-mono">
            21.4 Days
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            From initial audit to signed retainer SLA
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Assigned AE Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedUserFilter}
              onChange={(e) => setSelectedUserFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Sales Owners</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role.replace('_', ' ')})</option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-400 w-56 sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search company, contact, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none w-full text-xs"
            />
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Showing <strong className="text-white">{filteredDeals.length}</strong> active deals in commercial pipeline
        </div>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
        {STAGES.map(col => {
          const colDeals = filteredDeals.filter(d => d.stage === col.id);
          const colSum = colDeals.reduce((sum, d) => sum + d.dealValueMonthly, 0);

          return (
            <div
              key={col.id}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-3 flex flex-col min-h-[580px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold font-mono uppercase ${col.color}`}>
                      {col.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      ({colDeals.length})
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {currencySymbol} {colSum.toLocaleString()}
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${col.bg} ${col.color} font-bold`}>
                  {col.prob}%
                </span>
              </div>

              {/* Deal Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                {colDeals.map(deal => {
                  const isWon = deal.stage === 'won';
                  const isConverted = Boolean(deal.convertedClientId);

                  return (
                    <div
                      key={deal.id}
                      onClick={() => setActiveDealId(deal.id)}
                      className={`p-3.5 bg-slate-950 border rounded-xl space-y-3 cursor-pointer transition-all hover:border-slate-600 hover:shadow-lg ${
                        activeDealId === deal.id
                          ? 'border-emerald-500 ring-1 ring-emerald-500/50 shadow-emerald-950/20'
                          : 'border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase block truncate">
                            {deal.industry}
                          </span>
                          <h4 className="font-bold text-xs text-white leading-snug line-clamp-2">
                            {deal.companyName}
                          </h4>
                        </div>

                        <span className="text-xs font-bold font-mono text-emerald-400 shrink-0">
                          {currencySymbol} {(deal.dealValueMonthly / 1000).toFixed(0)}k<span className="text-[9px] text-slate-500">/mo</span>
                        </span>
                      </div>

                      {/* Primary Contact Line */}
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
                        <Users className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{deal.contactName} · {deal.contactTitle}</span>
                      </div>

                      {/* Expected Close & AE Avatar */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Close: {deal.expectedCloseDate}</span>
                        </span>
                        <span className="text-slate-400 truncate max-w-[80px]">
                          {deal.assignedUserName ? deal.assignedUserName.split(' ')[0] : 'Lead'}
                        </span>
                      </div>

                      {/* Action Bar: Stage Switchers or Won Convert */}
                      <div className="flex items-center justify-between gap-1 pt-1">
                        {/* Move Back */}
                        {col.id !== 'lead' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentIndex = STAGES.findIndex(s => s.id === col.id);
                              if (currentIndex > 0) {
                                transitionDealStage(deal.id, STAGES[currentIndex - 1].id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Rewind Stage"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Special Won Action: 1-Click Client Onboarding */}
                        {isWon && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isConverted) {
                                handleConvertDeal(deal.id);
                              }
                            }}
                            disabled={isConverted}
                            className={`w-full py-1 px-2 rounded text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-colors ${
                              isConverted
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 cursor-default'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 cursor-pointer shadow-md'
                            }`}
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>{isConverted ? 'Converted Client ✓' : 'Convert to Client 🚀'}</span>
                          </button>
                        )}

                        {/* Move Forward */}
                        {col.id !== 'won' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentIndex = STAGES.findIndex(s => s.id === col.id);
                              if (currentIndex < STAGES.length - 1) {
                                transitionDealStage(deal.id, STAGES[currentIndex + 1].id);
                              }
                            }}
                            className="ml-auto px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-mono flex items-center gap-1 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                          >
                            <span>Next</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {colDeals.length === 0 && (
                  <div className="p-6 text-center text-slate-600 text-[11px] font-mono italic border border-dashed border-slate-800/60 rounded-xl">
                    No deals in {col.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deal Inspector Slide-Over / Modal */}
      {activeDeal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-end p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full sm:max-w-xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl overflow-y-auto p-6 space-y-6 shadow-2xl text-slate-100 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      {activeDeal.industry}
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/40 font-bold">
                      {activeDeal.stage.toUpperCase()} ({activeDeal.probabilityPercent}%)
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {activeDeal.companyName}
                  </h2>
                </div>

                <button
                  onClick={() => setActiveDealId(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Deal Financial Overview Strip */}
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Monthly Retainer</span>
                  <span className="text-base font-bold text-emerald-400">
                    {currencySymbol} {activeDeal.dealValueMonthly.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Term Duration</span>
                  <span className="text-base font-bold text-white">
                    {activeDeal.contractMonths} Months
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Total Contract Value</span>
                  <span className="text-base font-bold text-amber-300">
                    {currencySymbol} {(activeDeal.dealValueMonthly * activeDeal.contractMonths).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase font-bold text-slate-400">
                  Primary Decision Maker
                </span>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{activeDeal.contactName}</span>
                    <span className="text-slate-400">{activeDeal.contactTitle}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-slate-400 text-[11px] font-mono">
                    <a href={`mailto:${activeDeal.contactEmail}`} className="flex items-center gap-1.5 text-emerald-400 hover:underline">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{activeDeal.contactEmail}</span>
                    </a>
                    {activeDeal.contactPhone && (
                      <a href={`tel:${activeDeal.contactPhone}`} className="flex items-center gap-1.5 text-cyan-400 hover:underline">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{activeDeal.contactPhone}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Pitch Notes & Pitch Deck Attachment */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase font-bold text-slate-400">
                  Strategy Pitch Deck & Scope Notes
                </span>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <p className="text-slate-300 leading-relaxed">
                    {activeDeal.notes || 'No pitch notes added yet.'}
                  </p>
                  {activeDeal.pitchDeckUrl && (
                    <a
                      href={activeDeal.pitchDeckUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-mono underline"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Open Strategic Pitch Deck</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Timeline & Activities Log */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase font-bold text-slate-400">
                  Deal Activity Timeline ({activeDeal.activities?.length || 0})
                </span>

                {/* New Activity Input */}
                <form onSubmit={handleAddActivity} className="space-y-2">
                  <div className="flex gap-2">
                    <select
                      value={newActivityType}
                      onChange={(e) => setNewActivityType(e.target.value as DealActivity['type'])}
                      className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:border-emerald-500"
                    >
                      <option value="note">Note</option>
                      <option value="call">Call</option>
                      <option value="meeting">Meeting</option>
                      <option value="email">Email</option>
                      <option value="proposal_sent">Proposal Sent</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Log call takeaway, next steps or proposal notes..."
                      value={newActivityNote}
                      onChange={(e) => setNewActivityNote(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />

                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-mono rounded-lg transition-colors cursor-pointer"
                    >
                      Log
                    </button>
                  </div>
                </form>

                {/* History Stream */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeDeal.activities && activeDeal.activities.length > 0 ? (
                    activeDeal.activities.map(act => (
                      <div key={act.id} className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <span className="text-emerald-400 uppercase font-bold">[{act.type.replace('_', ' ')}] · {act.authorName}</span>
                          <span>{new Date(act.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{act.notes}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-600 text-xs font-mono italic p-3 text-center">
                      No historical events recorded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  deleteDeal(activeDeal.id);
                  setActiveDealId(null);
                }}
                className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 font-mono hover:bg-rose-950/40 rounded transition-colors"
              >
                Delete Deal
              </button>

              <div className="flex items-center gap-2">
                {activeDeal.stage !== 'won' && (
                  <button
                    onClick={() => {
                      transitionDealStage(activeDeal.id, 'won');
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Mark as Won
                  </button>
                )}

                {activeDeal.stage === 'won' && !activeDeal.convertedClientId && (
                  <button
                    onClick={() => handleConvertDeal(activeDeal.id)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/20 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Convert to Active Client 🚀</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Deal Creation Modal */}
      {isNewDealModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Create New Prospect Deal</h2>
              </div>
              <button
                onClick={() => setIsNewDealModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDealSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-mono text-[11px] uppercase block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nairobi Fintech Labs"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono text-[11px] uppercase block mb-1">Industry Sector</label>
                  <input
                    type="text"
                    placeholder="e.g. Clean Energy / SaaS"
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-mono text-[11px] uppercase block mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grace Njeri"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono text-[11px] uppercase block mb-1">Contact Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Head of Marketing"
                    value={newContactTitle}
                    onChange={(e) => setNewContactTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono text-[11px] uppercase block mb-1">Contact Email</label>
                  <input
                    type="email"
                    placeholder="grace@company.co.ke"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-mono text-[11px] uppercase block mb-1">Monthly Retainer ({currencySymbol})</label>
                  <input
                    type="number"
                    value={newDealValue}
                    onChange={(e) => setNewDealValue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono text-[11px] uppercase block mb-1">Contract Duration</label>
                  <select
                    value={newContractMonths}
                    onChange={(e) => setNewContractMonths(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option value={3}>3 Months Trial</option>
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months Annual Retainer</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-mono text-[11px] uppercase block mb-1">Pipeline Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as DealStage)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500 capitalize"
                  >
                    {STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.label} ({s.prob}%)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-mono text-[11px] uppercase block mb-1">Assigned Account Executive</label>
                <select
                  value={newAssignedUser}
                  onChange={(e) => setNewAssignedUser(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role.replace('_', ' ')})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-mono text-[11px] uppercase block mb-1">Pitch Deck / Discovery Notes</label>
                <textarea
                  rows={3}
                  placeholder="Key deliverables discussed, channels interested, client goals..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewDealModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-mono rounded-lg transition-colors cursor-pointer"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
