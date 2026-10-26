/**
 * PulseBrand Agency OS - Executive Dashboard Command Center
 * Phase 06: Executive Dashboard
 * Localized for Kenya Digital Agency Ecosystem (KES / EAT / Nairobi HQ)
 */

import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { ContentItem } from '../../types';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Layers,
  Send,
  Calendar,
  Building2,
  DollarSign,
  MessageSquare,
  ShieldCheck,
  Eye,
  Check,
  RotateCcw,
  Activity,
  Flame,
  ChevronRight,
  Filter,
  CheckCircle
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const {
    workspace,
    currentUser,
    capabilities,
    clients,
    contentItems,
    campaigns,
    tasks,
    auditLogs,
    quickApproveContent,
    quickRequestRevision,
    scheduleContentPublish,
    addToast
  } = useAgency();

  const [revisionModalPostId, setRevisionModalPostId] = useState<string | null>(null);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');

  // Filter scoped data to active workspace
  const scopedClients = clients.filter(c => c.tenantId === workspace.id);
  const scopedContent = contentItems.filter(p => p.tenantId === workspace.id);
  const scopedCampaigns = campaigns.filter(c => c.tenantId === workspace.id);
  const scopedTasks = tasks.filter(t => t.tenantId === workspace.id);

  // Filtered by brand selector if active
  const displayedContent = selectedBrandFilter === 'all'
    ? scopedContent
    : scopedContent.filter(p => p.clientId === selectedBrandFilter);

  // Executive KPI calculations
  const totalMonthlyRetainerKES = scopedClients.reduce((sum, c) => sum + c.retainerMonthlyValue, 0);
  const totalQuotaPosts = scopedClients.reduce((sum, c) => sum + c.monthlyPostQuota, 0);
  const totalPublishedPosts = scopedClients.reduce((sum, c) => sum + c.currentMonthPublishedCount, 0);
  const overallPacingPercent = totalQuotaPosts > 0 ? Math.round((totalPublishedPosts / totalQuotaPosts) * 100) : 0;

  // Urgent review queue (posts awaiting internal approval or client review)
  const pendingReviewQueue = displayedContent.filter(p =>
    p.stage === 'internal_review' || p.stage === 'client_review'
  );

  // Scheduled queue
  const scheduledQueue = displayedContent.filter(p => p.stage === 'scheduled' || p.stage === 'approved');

  // Recent system audits
  const recentAudits = auditLogs.filter(a => a.tenantId === workspace.id).slice(0, 6);

  const handleApprove = (post: ContentItem) => {
    quickApproveContent(post.id);
  };

  const handleOpenRevision = (post: ContentItem) => {
    setRevisionModalPostId(post.id);
    setRevisionNotes('');
  };

  const handleConfirmRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionModalPostId || !revisionNotes.trim()) return;
    quickRequestRevision(revisionModalPostId, revisionNotes.trim());
    setRevisionModalPostId(null);
    setRevisionNotes('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Executive Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>{workspace.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Executive Command Center</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">EAT (UTC+3) Nairobi</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Executive Operations & Delivery Dashboard</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Real-time retainer pacing, urgent approval queues, client brand health SLA metrics, and editorial pipeline throughput.
          </p>
        </div>

        {/* Global SLA Status Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg flex items-center gap-2.5 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">SLA Health:</span>
            <span className="text-emerald-400 font-mono font-bold">100% On-Time</span>
          </div>

          <div className="bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-xs px-3.5 py-2 rounded-lg flex items-center gap-2 font-mono">
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pacing: {overallPacingPercent}%</span>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Retainer ARR / MRR (Masked if role cannot view financials) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Monthly Retainer MRR</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            {capabilities.canViewFinancials ? (
              <div className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
                KSh {totalMonthlyRetainerKES.toLocaleString()}
              </div>
            ) : (
              <div className="text-lg font-bold font-mono text-slate-500 italic">
                Confidential (Masked)
              </div>
            )}
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-800/60">
            <span>Active Client Retainers:</span>
            <span className="text-slate-200 font-mono font-medium">{scopedClients.length} brands</span>
          </div>
        </div>

        {/* Content Delivery Velocity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Publishing Pacing</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
              {totalPublishedPosts} <span className="text-sm font-normal text-slate-400">/ {totalQuotaPosts}</span>
            </div>
            <span className="text-[11px] font-mono text-teal-400">
              {overallPacingPercent}% Quota
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(overallPacingPercent, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Urgent Approval Gate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Approval Gate Queue</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums tracking-tight">
              {pendingReviewQueue.length} <span className="text-sm font-normal text-slate-400">pending</span>
            </div>
            <span className="text-[11px] font-mono text-amber-400/90 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
              Action Required
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-800/60">
            <span>Avg Sign-off Velocity:</span>
            <span className="text-slate-200 font-mono font-medium">3.8 hrs</span>
          </div>
        </div>

        {/* Scheduled Posts in Buffer */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Live Scheduled Buffer</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums tracking-tight">
              {scheduledQueue.length} <span className="text-sm font-normal text-slate-400">ready</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400/90">
              Buffer Safe
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-800/60">
            <span>Active Campaigns:</span>
            <span className="text-slate-200 font-mono font-medium">{scopedCampaigns.length} active</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Approval Quick-Action Rail & Client Health Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent Approval Quick-Action Rail */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Urgent Approval Queue ({pendingReviewQueue.length})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Posts awaiting internal compliance check or external brand sign-off before social scheduling.
                </p>
              </div>

              {/* Brand Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedBrandFilter}
                  onChange={(e) => setSelectedBrandFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="all">All Scoped Brands ({scopedClients.length})</option>
                  {scopedClients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* List of pending posts */}
            {pendingReviewQueue.length === 0 ? (
              <div className="py-12 text-center bg-slate-950/60 rounded-lg border border-slate-800/60 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-80" />
                <div className="text-sm font-semibold text-white">All Clear! No Pending Reviews</div>
                <div className="text-xs text-slate-400 max-w-sm mx-auto">
                  Every drafted post has been approved or scheduled. Your editorial queue is fully in sync with SLA timelines.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReviewQueue.map(post => {
                  const client = scopedClients.find(c => c.id === post.clientId);
                  const isClientReviewStage = post.stage === 'client_review';

                  return (
                    <div
                      key={post.id}
                      className="p-4 bg-slate-950 border border-slate-800/90 rounded-lg hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: client?.accentColor || '#10b981' }}
                          ></span>
                          <span className="font-semibold text-xs text-white">
                            {client?.name || 'Assigned Brand'}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                            isClientReviewStage
                              ? 'bg-purple-950/60 text-purple-300 border-purple-800/50'
                              : 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                          }`}>
                            {isClientReviewStage ? 'Awaiting Client Sign-off' : 'Internal Account Review'}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            Format: {post.format.replace('_', ' ')}
                          </span>
                        </div>

                        <h3 className="text-sm font-semibold text-slate-100 leading-snug">
                          {post.title}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {post.caption}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400 font-mono">
                          <span>Target: {post.platforms.join(', ')}</span>
                          <span>·</span>
                          <span>Target Slot: {post.scheduledDate ? new Date(post.scheduledDate).toLocaleString() : 'TBD'}</span>
                        </div>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        <button
                          onClick={() => handleApprove(post)}
                          className="w-full px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/30"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Post</span>
                        </button>
                        <button
                          onClick={() => handleOpenRevision(post)}
                          className="w-full px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 hover:border-amber-800/60 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Request Edits</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Client Delivery SLA Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Client Delivery SLA & Health Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Real-time audit of monthly post quotas, published pacing, and pending approvals per active client retainer.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-2.5 font-semibold text-slate-300">Client Brand</th>
                    <th className="pb-2.5 font-semibold text-slate-300">Retainer (KES)</th>
                    <th className="pb-2.5 text-center">Quota Progress</th>
                    <th className="pb-2.5 text-center">In Review</th>
                    <th className="pb-2.5 text-right">Delivery Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {scopedClients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <Building2 className="w-6 h-6 text-slate-600" />
                          <span className="font-semibold text-slate-400">No client brands onboarded yet</span>
                          <span className="text-[11px] text-slate-500">Add clients in Client Dossiers to track retainers and quota pacing.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    scopedClients.map(client => {
                      const clientProgress = Math.round((client.currentMonthPublishedCount / client.monthlyPostQuota) * 100);
                      const healthStatus = clientProgress >= 60 ? 'Optimal' : clientProgress >= 40 ? 'On Track' : 'Attention';
                      const healthColor = clientProgress >= 60
                        ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40'
                        : clientProgress >= 40
                        ? 'text-teal-400 bg-teal-950/60 border-teal-800/40'
                        : 'text-amber-400 bg-amber-950/60 border-amber-800/40';

                      return (
                        <tr key={client.id} className="hover:bg-slate-950/40 transition-colors">
                          <td className="py-3">
                            <div className="font-semibold text-white flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: client.accentColor }}
                              ></span>
                              <span>{client.name}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono truncate max-w-xs">{client.industry}</div>
                          </td>
                          <td className="py-3 font-mono text-emerald-400 font-semibold tabular-nums">
                            {capabilities.canViewFinancials ? (
                              `KSh ${client.retainerMonthlyValue.toLocaleString()}`
                            ) : (
                              <span className="text-slate-600 italic">Masked</span>
                            )}
                          </td>
                          <td className="py-3 text-center">
                            <div className="font-mono text-xs text-slate-200">
                              {client.currentMonthPublishedCount} / {client.monthlyPostQuota}
                            </div>
                            <div className="w-24 bg-slate-800 h-1 rounded-full mx-auto mt-1 overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{ width: `${Math.min(clientProgress, 100)}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="py-3 text-center font-mono">
                            {client.pendingApprovalCount > 0 ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800/40">
                                {client.pendingApprovalCount} pending
                              </span>
                            ) : (
                              <span className="text-slate-600">0</span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${healthColor}`}>
                              {healthStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Audit Feed & Urgent Tasks */}
        <div className="space-y-6">
          {/* Urgent Action Tasks */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Agency Operational Tasks ({scopedTasks.length})</span>
            </h2>
            <p className="text-xs text-slate-400 mb-3">Priority action items assigned to creators and managers.</p>

            <div className="space-y-2.5">
              {scopedTasks.length === 0 ? (
                <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-lg text-center text-slate-500 text-xs">
                  No active operational tasks pending.
                </div>
              ) : (
                scopedTasks.map(t => (
                  <div key={t.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 leading-snug">{t.title}</span>
                      <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        t.priority === 'high' ? 'bg-red-950 text-red-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {t.priority}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{t.description}</div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                      <span>Due: {new Date(t.dueDate).toLocaleDateString()}</span>
                      <span className="text-emerald-400 uppercase">{t.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Real-Time Immutable Audit Stream */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Audit & Telemetry Log</span>
            </h2>
            <p className="text-xs text-slate-400 mb-3">Live cryptographic trail of system and editorial dispatches.</p>

            <div className="space-y-3 font-sans">
              {recentAudits.map(log => (
                <div key={log.id} className="text-xs flex items-start gap-2.5 border-b border-slate-800/60 pb-2.5 last:border-0 last:pb-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
                  <div>
                    <div className="font-semibold text-slate-200">{log.action}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{log.details}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1 flex items-center gap-2">
                      <span>{log.userName}</span>
                      <span>·</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()} EAT</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revision Request Modal Dialog */}
      {revisionModalPostId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Request Revision from Creator</span>
              </div>
              <button
                onClick={() => setRevisionModalPostId(null)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleConfirmRevision} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Amendment Instructions & Feedback
                </label>
                <textarea
                  required
                  rows={4}
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="Specify required alterations (e.g. 'Align carousel color gradient with Keringet herbal palette and adjust Swahili phrasing in slide 3')..."
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-3 rounded-lg focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRevisionModalPostId(null)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Feedback to Creator</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
