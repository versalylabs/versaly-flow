import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { documentationService } from '../../services/documentationService';
import {
  AgencySopItem,
  UserGuideArticle,
  ClientApprovalCheatSheet,
  ApiDocEndpoint,
  SopCategory
} from '../../types';
import {
  BookOpen,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Zap,
  Clock,
  Layers,
  HelpCircle,
  Code2,
  Server,
  FileCheck,
  Send,
  Eye,
  ArrowRight,
  Tag,
  Check,
  Bookmark,
  Share2
} from 'lucide-react';

export const DocumentationStudio: React.FC = () => {
  const { currentUser, addToast } = useAgency();
  const [activeTab, setActiveTab] = useState<'sops' | 'guides' | 'cheat_sheet' | 'api_reference'>('sops');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSopCategory, setSelectedSopCategory] = useState<SopCategory | 'all'>('all');
  const [selectedGuideCategory, setSelectedGuideCategory] = useState<string>('all');
  const [selectedApiCategory, setSelectedApiCategory] = useState<string>('all');

  // Detailed view modal/drawer state
  const [activeSopDetail, setActiveSopDetail] = useState<AgencySopItem | null>(null);
  const [activeGuideDetail, setActiveGuideDetail] = useState<UserGuideArticle | null>(null);
  const [activeEndpointDetail, setActiveEndpointDetail] = useState<ApiDocEndpoint | null>(null);

  // Data queries
  const sops = documentationService.getSops({
    category: selectedSopCategory,
    search: searchQuery
  });

  const guides = documentationService.getUserGuides({
    category: selectedGuideCategory,
    search: searchQuery
  });

  const cheatSheets = documentationService.getClientCheatSheets();

  const apiEndpoints = documentationService.getApiEndpoints({
    category: selectedApiCategory,
    search: searchQuery
  });

  const architecture = documentationService.getArchitectureOverview();

  // Helper copy action
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    addToast(`${label} copied to clipboard!`, 'success');
  };

  // Helper download markdown action
  const handleDownloadSop = (sop: AgencySopItem) => {
    const md = documentationService.exportSopAsMarkdown(sop);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${sop.id}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast(`Exported ${sop.title} as Markdown (.md)`, 'success');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                Documentation & Knowledge Base
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                  v1.0 Production Guide
                </span>
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Agency Standard Operating Procedures (SOPs), Interactive User Guides, Client Stakeholder Cheat-Sheet & REST API Reference
              </p>
            </div>
          </div>
        </div>

        {/* Global Stats Badges */}
        <div className="flex items-center gap-2.5 text-xs text-slate-400 flex-wrap">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>6 Agency SOPs</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>6 User Manuals</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span>6 REST Endpoints</span>
          </div>
        </div>
      </div>

      {/* Tabs Bar & Global Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => setActiveTab('sops')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'sops'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Agency SOP Library</span>
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'guides'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>User Manual & Guides</span>
          </button>
          <button
            onClick={() => setActiveTab('cheat_sheet')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'cheat_sheet'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Client Sign-Off Cheat-Sheet</span>
          </button>
          <button
            onClick={() => setActiveTab('api_reference')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'api_reference'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>API Docs & Architecture</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search guides, SOPs, APIs, parameters..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* TAB 1: AGENCY SOP LIBRARY */}
      {activeTab === 'sops' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-medium mr-1">Category:</span>
            {[
              { id: 'all', label: 'All SOPs' },
              { id: 'crisis_management', label: 'Crisis & PR' },
              { id: 'content_publishing', label: 'Content Turnaround SLA' },
              { id: 'client_onboarding', label: 'Client Onboarding' },
              { id: 'paid_media', label: 'Paid Ad Governance' },
              { id: 'community_management', label: 'Community Moderation' },
              { id: 'compliance', label: 'Kenya DPA 2019' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedSopCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors whitespace-nowrap ${
                  selectedSopCategory === cat.id
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* SOP Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sops.map(sop => (
              <div
                key={sop.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Category & SLA Tag */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {sop.category.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {sop.turnaroundSla}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                      {sop.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {sop.summary}
                    </p>
                  </div>

                  {/* Metadata & Tags */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/60 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Department:</span>
                      <span className="text-slate-200 font-medium">{sop.department}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Owner Role:</span>
                      <span className="text-blue-400 font-mono text-[11px]">{sop.ownerRole}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {sop.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => setActiveSopDetail(sop)}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    <span>View Operational Steps</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyText(documentationService.exportSopAsMarkdown(sop), 'SOP Markdown')}
                      title="Copy Markdown"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDownloadSop(sop)}
                      title="Download Markdown (.md)"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: USER MANUAL & GUIDES */}
      {activeTab === 'guides' && (
        <div className="space-y-6">
          {/* Guide Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-medium mr-1">Topic:</span>
            {[
              { id: 'all', label: 'All Manuals' },
              { id: 'getting_started', label: 'Getting Started' },
              { id: 'content_workflow', label: 'Editorial Kanban' },
              { id: 'publishing', label: 'Approvals & Dispatch' },
              { id: 'billing_financials', label: 'M-Pesa Billing' },
              { id: 'automation_ai', label: 'Gemini AI Strategy' },
              { id: 'administration', label: 'System Health' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedGuideCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors whitespace-nowrap ${
                  selectedGuideCategory === cat.id
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Guide Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map(guide => (
              <div
                key={guide.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {guide.category.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {guide.readTimeMinutes} min read
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-100">{guide.title}</h3>
                  </div>

                  <button
                    onClick={() => setActiveGuideDetail(guide)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-slate-400">{guide.summary}</p>

                {/* Key Features Bullet List */}
                <div className="space-y-1.5 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Core Capabilities Covered:
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {guide.keyFeatures.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setActiveGuideDetail(guide)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-xl text-xs font-medium transition-colors text-center"
                >
                  Read Full Walkthrough & Pro Tips
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CLIENT SIGN-OFF CHEAT-SHEET */}
      {activeTab === 'cheat_sheet' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-blue-900/20 via-indigo-900/10 to-slate-900 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">
                  Brand Stakeholder Approval Manual & Cheat-Sheet
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Share this friction-free reference sheet with external client marketing directors, CMOs, and brand approvers to ensure seamless, legally accountable sign-offs.
                </p>
              </div>
              <button
                onClick={() => handleCopyText(JSON.stringify(cheatSheets, null, 2), 'Client Cheat-Sheet JSON')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all shrink-0"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Export Stakeholder Kit</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cheatSheets.map(cs => (
              <div
                key={cs.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {cs.section.toUpperCase()}
                    </span>
                    <span className="text-xs text-blue-400 font-medium">{cs.slaExpectation}</span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-100">{cs.title}</h3>
                  <p className="text-xs text-slate-400">{cs.headline}</p>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-semibold text-slate-300">Instruction Protocol:</div>
                    <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                      {cs.keyInstructions.map((inst, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {inst}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Do's and Don'ts */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
                  <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 space-y-1.5">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Best Practice
                    </span>
                    <ul className="text-[11px] text-slate-300 space-y-1">
                      {cs.doAndDont.do.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-3 space-y-1.5">
                    <span className="font-semibold text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Avoid
                    </span>
                    <ul className="text-[11px] text-slate-300 space-y-1">
                      {cs.doAndDont.dont.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: API REFERENCE & ARCHITECTURE */}
      {activeTab === 'api_reference' && (
        <div className="space-y-8">
          {/* Architecture Summary Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="text-base font-semibold text-slate-100">
                    {architecture.systemName}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {architecture.runtime} | {architecture.version}
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Container Topology Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div className="text-slate-500">Ingress Gateway</div>
                <div className="text-slate-200 font-mono font-medium mt-1">Port 3000 Ingress</div>
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div className="text-slate-500">Multi-Tenancy Scoping</div>
                <div className="text-slate-200 font-mono font-medium mt-1">TenantId Partitioning</div>
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div className="text-slate-500">Security Standard</div>
                <div className="text-slate-200 font-mono font-medium mt-1">SOC2 Type II / Kenya DPA</div>
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div className="text-slate-500">Active Core Modules</div>
                <div className="text-emerald-400 font-mono font-medium mt-1">33 Functional Modules</div>
              </div>
            </div>
          </div>

          {/* Endpoints List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-200">REST API Specification (OpenAPI 3.1)</h3>
              <span className="text-xs text-slate-500">Base URL: https://app.versalyflow.com</span>
            </div>

            <div className="space-y-3">
              {apiEndpoints.map(endpoint => (
                <div
                  key={endpoint.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-1 rounded ${
                          endpoint.method === 'GET'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : endpoint.method === 'POST'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <span className="font-mono text-sm font-semibold text-slate-100">
                        {endpoint.path}
                      </span>
                      <span className="text-xs text-slate-400 hidden sm:inline">— {endpoint.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyText(endpoint.curlSnippet, 'cURL command')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
                      >
                        <Terminal className="w-3 h-3 text-slate-400" />
                        <span>Copy cURL</span>
                      </button>
                      <button
                        onClick={() => setActiveEndpointDetail(endpoint)}
                        className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <span>Inspect Schema</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{endpoint.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SOP DETAIL MODAL */}
      {activeSopDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 space-y-6 animate-scaleUp">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {activeSopDetail.category.replace('_', ' ').toUpperCase()}
                </span>
                <h2 className="text-xl font-bold text-slate-100 mt-2">{activeSopDetail.title}</h2>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                  <span>Turnaround SLA: <strong className="text-amber-400">{activeSopDetail.turnaroundSla}</strong></span>
                  <span>Owner: <strong className="text-slate-200">{activeSopDetail.ownerRole}</strong></span>
                </div>
              </div>
              <button
                onClick={() => setActiveSopDetail(null)}
                className="text-slate-400 hover:text-slate-200 text-lg p-2 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 text-sm">
              <div>
                <h4 className="font-semibold text-slate-300 text-xs uppercase tracking-wider mb-1">
                  Escalation Hierarchy:
                </h4>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-blue-400">
                  {activeSopDetail.escalationPath}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-slate-300 text-xs uppercase tracking-wider">
                  Mandatory Execution Steps:
                </h4>
                {activeSopDetail.steps.map(step => (
                  <div key={step.stepNumber} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold flex items-center justify-center">
                        {step.stepNumber}
                      </span>
                      <span className="font-semibold text-slate-200">{step.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-8">{step.instruction}</p>
                    {step.checklist && (
                      <div className="pl-8 pt-1 space-y-1">
                        {step.checklist.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleCopyText(documentationService.exportSopAsMarkdown(activeSopDetail), 'SOP')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Full SOP</span>
              </button>
              <button
                onClick={() => handleDownloadSop(activeSopDetail)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .md</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER GUIDE DETAIL MODAL */}
      {activeGuideDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 space-y-6 animate-scaleUp">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {activeGuideDetail.category.replace('_', ' ').toUpperCase()}
                </span>
                <h2 className="text-xl font-bold text-slate-100 mt-2">{activeGuideDetail.title}</h2>
                <div className="text-xs text-slate-400 mt-1">{activeGuideDetail.summary}</div>
              </div>
              <button
                onClick={() => setActiveGuideDetail(null)}
                className="text-slate-400 hover:text-slate-200 text-lg p-2 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-slate-300 text-xs uppercase tracking-wider">
                Step-by-Step Instructions:
              </h4>
              {activeGuideDetail.stepByStep.map((step, idx) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-1.5">
                  <div className="text-sm font-semibold text-blue-400">{step.heading}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.detail}</p>
                </div>
              ))}

              <div className="p-4 bg-amber-950/20 border border-amber-500/20 rounded-xl space-y-2">
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Pro Tips from Senior Agency Operators
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {activeGuideDetail.proTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveGuideDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium"
              >
                Close Walkthrough
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API ENDPOINT DETAIL MODAL */}
      {activeEndpointDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 space-y-6 animate-scaleUp">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                    {activeEndpointDetail.method}
                  </span>
                  <span className="text-base font-mono font-bold text-slate-100">
                    {activeEndpointDetail.path}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-300 mt-1">{activeEndpointDetail.title}</h3>
              </div>
              <button
                onClick={() => setActiveEndpointDetail(null)}
                className="text-slate-400 hover:text-slate-200 text-lg p-2 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {activeEndpointDetail.requestBodySample && (
                <div className="space-y-1.5">
                  <div className="text-slate-400 font-sans font-semibold">Request Body (JSON):</div>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 overflow-x-auto text-[11px]">
                    {activeEndpointDetail.requestBodySample}
                  </pre>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="text-slate-400 font-sans font-semibold">Response Body (JSON):</div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-cyan-400 overflow-x-auto text-[11px]">
                  {activeEndpointDetail.responseBodySample}
                </pre>
              </div>

              <div className="space-y-1.5">
                <div className="text-slate-400 font-sans font-semibold">Interactive cURL:</div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 overflow-x-auto text-[11px]">
                  {activeEndpointDetail.curlSnippet}
                </pre>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleCopyText(activeEndpointDetail.curlSnippet, 'cURL command')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy cURL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
