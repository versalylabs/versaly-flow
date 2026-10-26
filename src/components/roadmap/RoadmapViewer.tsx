import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { DevelopmentPhaseCategory, DevelopmentPhase } from '../../types';
import {
  Layers,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Shield,
  Filter,
  Check,
  ChevronRight,
  Cpu
} from 'lucide-react';

interface RoadmapViewerProps {
  setCurrentView?: (view: string) => void;
}

const PHASE_VIEW_MAP: Record<number, string> = {
  1: 'foundation',
  2: 'architecture',
  3: 'auth',
  4: 'tenancy',
  5: 'rbac',
  6: 'dashboard',
  7: 'clients',
  8: 'onboarding',
  9: 'team',
  10: 'composer',
  11: 'calendar',
  12: 'workflow',
  13: 'approvals',
  14: 'dam',
  15: 'campaigns',
  16: 'tasks',
  17: 'social_accounts',
  18: 'publishing',
  19: 'analytics',
  20: 'crm',
  21: 'billing',
  22: 'inbox',
  23: 'automation',
  24: 'ai_strategy',
  25: 'whitelabel',
  26: 'subscription',
  27: 'productivity',
  28: 'security',
  29: 'performance',
  30: 'testing',
  31: 'infrastructure',
  32: 'observability',
  33: 'documentation'
};

export const RoadmapViewer: React.FC<RoadmapViewerProps> = ({ setCurrentView }) => {
  const { roadmapPhases, updatePhaseStatus, addToast } = useAgency();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPhase, setExpandedPhase] = useState<number | null>(30);

  const categories: (string | DevelopmentPhaseCategory)[] = [
    'All',
    'Core Architecture',
    'Identity & Access',
    'Client Operations',
    'Content Lifecycle',
    'Execution & Delivery',
    'Business & CRM',
    'Intelligence & Scale',
    'Hardening & Launch'
  ];

  const filteredPhases = roadmapPhases.filter(phase => {
    const matchesCategory = selectedCategory === 'All' || phase.category === selectedCategory;
    const matchesSearch =
      phase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phase.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phase.phaseNumber.toString().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const completedCount = roadmapPhases.filter(p => p.status === 'completed').length;
  const inProgressCount = roadmapPhases.filter(p => p.status === 'in_progress').length;
  const plannedCount = roadmapPhases.filter(p => p.status === 'planned').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Versaly Flow</span>
            <span aria-hidden="true">·</span>
            <span>Agency Management Blueprint</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-400">36 Architecture Milestones (Phase 01–34 Complete)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Versaly Flow Development Roadmap</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            A comprehensive, phased engineering roadmap scaling from foundational design tokens and strict multi-tenant schemas
            to enterprise content pipelines, client approval portals, and multi-network publishing.
          </p>
        </div>

        {/* Telemetry Status Bar */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shrink-0">
          <div className="px-3 border-r border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Completed</div>
            <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
              {completedCount} <span className="text-xs text-slate-500 font-normal">/ 36</span>
            </div>
          </div>
          <div className="px-3 border-r border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Active</div>
            <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">
              {inProgressCount}
            </div>
          </div>
          <div className="px-3">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Planned</div>
            <div className="text-lg font-bold font-mono text-slate-400 tabular-nums">
              {plannedCount}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-900/80 border border-slate-800/80 rounded-lg shrink-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search milestone or deliverable..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Phase Cards Grid */}
      <div className="space-y-3">
        {filteredPhases.map(phase => {
          const isExpanded = expandedPhase === phase.phaseNumber;
          const isPhase1 = phase.phaseNumber === 1;

          return (
            <div
              key={phase.phaseNumber}
              className={`border rounded-lg transition-all ${
                isPhase1
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                  : phase.status === 'in_progress'
                  ? 'bg-slate-900/70 border-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              {/* Header row */}
              <div
                onClick={() => setExpandedPhase(isExpanded ? null : phase.phaseNumber)}
                className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 select-none"
              >
                <div className="flex items-start md:items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      phase.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : phase.status === 'in_progress'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    P{phase.phaseNumber.toString().padStart(2, '0')}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-white tracking-tight">
                        {phase.title}
                      </h3>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-slate-400">{phase.category}</span>
                      {isPhase1 && (
                        <>
                          <span className="text-xs text-slate-500">·</span>
                          <span className="text-xs font-semibold text-emerald-400">Current Focus</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {phase.summary}
                    </p>
                  </div>
                </div>

                {/* Right Status & Expand */}
                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
                  {setCurrentView && PHASE_VIEW_MAP[phase.phaseNumber] && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentView(PHASE_VIEW_MAP[phase.phaseNumber]);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/60 flex items-center gap-1 transition-colors"
                      title={`Launch Phase ${phase.phaseNumber} Module`}
                    >
                      <span>Open Module</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded border text-[11px] ${
                      phase.status === 'completed'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                        : phase.status === 'in_progress'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    {phase.status === 'completed' && '✓ Completed'}
                    {phase.status === 'in_progress' && '⏳ In Progress'}
                    {phase.status === 'planned' && '○ Planned'}
                  </span>

                  <ChevronRight
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isExpanded ? 'rotate-90 text-slate-300' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 mt-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Key Technical Deliverables
                      </div>
                      <ul className="space-y-1.5">
                        {phase.keyDeliverables.map((del, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-emerald-400 text-xs mt-0.5">▪</span>
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col justify-between space-y-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                      <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Milestone Governance & Controls
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Update the execution state of this milestone or trigger simulated audit validation.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                        <button
                          onClick={() => updatePhaseStatus(phase.phaseNumber, 'completed')}
                          className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                            phase.status === 'completed'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => updatePhaseStatus(phase.phaseNumber, 'in_progress')}
                          className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                            phase.status === 'in_progress'
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          Set In Progress
                        </button>
                        <button
                          onClick={() => updatePhaseStatus(phase.phaseNumber, 'planned')}
                          className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                            phase.status === 'planned'
                              ? 'bg-slate-700 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          Reset to Planned
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
