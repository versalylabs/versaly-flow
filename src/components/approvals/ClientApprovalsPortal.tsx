/**
 * PulseBrand Agency OS - Client Approvals & Stakeholder Portal
 * Phase 11: Content Approvals & Client Portal
 * Frictionless guest sign-off, WhatsApp/email magic link simulator,
 * line-item annotation requests, and immutable timestamped audit sign-off signatures.
 */

import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { ContentItem, ContentStage, ContentApprovalLog } from '../../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Share2,
  Send,
  Eye,
  Smartphone,
  ShieldCheck,
  Building2,
  Copy,
  ExternalLink,
  Sparkles,
  Calendar,
  AlertTriangle,
  History,
  FileCheck,
  User,
  Filter,
  Check,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export const ClientApprovalsPortal: React.FC = () => {
  const {
    workspace,
    currentUser,
    capabilities,
    clients,
    activeClient,
    contentItems,
    quickApproveContent,
    quickRequestRevision,
    scheduleContentPublish,
    addToast
  } = useAgency();

  // Scoped clients and content for the current workspace
  const scopedClients = clients.filter(c => c.tenantId === workspace.id);
  const defaultSelectedClient = activeClient?.id || 'all';

  const [clientFilter, setClientFilter] = useState<string>(defaultSelectedClient);
  const [stageFilter, setStageFilter] = useState<string>('pending');
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [revisionNotes, setRevisionNotes] = useState<string>('');
  const [approvalNotes, setApprovalNotes] = useState<string>('Approved for publishing as per regional brand guidelines.');
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [guestPortalMode, setGuestPortalMode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Filter content items
  const filteredPosts = contentItems.filter(item => {
    if (item.tenantId !== workspace.id) return false;
    if (clientFilter !== 'all' && item.clientId !== clientFilter) return false;

    if (stageFilter === 'pending') {
      return item.stage === 'client_review' || item.stage === 'internal_review';
    }
    if (stageFilter === 'approved') {
      return item.stage === 'approved' || item.stage === 'scheduled' || item.stage === 'published';
    }
    if (stageFilter === 'revision_requested') {
      return item.stage === 'revision_requested';
    }
    return true;
  });

  const activePost = filteredPosts.find(p => p.id === selectedPostId)
    || filteredPosts[0]
    || contentItems.find(p => p.tenantId === workspace.id)
    || null;

  const postClient = activePost ? scopedClients.find(c => c.id === activePost.clientId) : null;

  // Review & Approval Handlers
  const handleApprove = (post: ContentItem) => {
    quickApproveContent(post.id, approvalNotes);
    addToast('Post Approved', `Signed off by ${currentUser.name} (${currentUser.role.replace('_', ' ')})`, 'success');
  };

  const handleRequestRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePost || !revisionNotes.trim()) {
      addToast('Validation Error', 'Please write specific amendment notes', 'error');
      return;
    }
    quickRequestRevision(activePost.id, revisionNotes.trim());
    setIsRevisionModalOpen(false);
    setRevisionNotes('');
  };

  const handleGenerateMagicLink = () => {
    const magicUrl = `https://portal.pulsebrand.agency/review/${workspace.id}/${activePost?.id || 'post'}?auth=magic_token_254`;
    navigator.clipboard?.writeText(magicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
    addToast('Magic Review Link Copied', 'Shareable client link ready for WhatsApp or Email dispatch', 'info');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>{workspace.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Content Approvals & Client Portal</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">
              {filteredPosts.filter(p => p.stage === 'client_review' || p.stage === 'internal_review').length} Awaiting Sign-off
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Client Approvals & Sign-off Portal</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Frictionless client review workflows, one-click WhatsApp/email magic link sharing,
            instant annotation requests, and tamper-evident audit timestamps.
          </p>
        </div>

        {/* Guest Portal Preview Switcher & Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setGuestPortalMode(!guestPortalMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-2 ${
              guestPortalMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-950/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>{guestPortalMode ? 'Exit Client View Mode' : 'Simulate Client View'}</span>
          </button>

          {activePost && (
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/30"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Magic Link</span>
            </button>
          )}
        </div>
      </div>

      {/* Guest Mode Indicator Banner */}
      {guestPortalMode && (
        <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span>
              <strong>Simulated Client Guest Mode:</strong> Previewing the clean, zero-login sign-off portal sent to brand executives (e.g. Brian Kiprop / Faith Chebet).
            </span>
          </div>
          <button
            onClick={() => setGuestPortalMode(false)}
            className="text-amber-400 hover:text-white underline font-mono text-[11px]"
          >
            Switch back to Agency Lead view
          </button>
        </div>
      )}

      {/* Filter and Switcher Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* Client Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">All Client Brands</option>
              {scopedClients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Stage Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg text-xs">
            {[
              { id: 'pending', label: 'Pending Sign-off', count: contentItems.filter(p => p.tenantId === workspace.id && (p.stage === 'client_review' || p.stage === 'internal_review')).length },
              { id: 'revision_requested', label: 'Changes Requested', count: contentItems.filter(p => p.tenantId === workspace.id && p.stage === 'revision_requested').length },
              { id: 'approved', label: 'Signed Off & Scheduled', count: contentItems.filter(p => p.tenantId === workspace.id && (p.stage === 'approved' || p.stage === 'scheduled')).length },
              { id: 'all', label: 'All Posts', count: contentItems.filter(p => p.tenantId === workspace.id).length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStageFilter(tab.id)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  stageFilter === tab.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Viewing {filteredPosts.length} posts
        </div>
      </div>

      {/* Main Grid: Post Queue (4 cols) & Approval Detail View (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Post Queue List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Editorial Review Queue ({filteredPosts.length})
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                Select to Review
              </span>
            </div>

            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredPosts.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-lg border border-slate-800 text-slate-500 text-xs">
                  No content posts match current filter criteria.
                </div>
              ) : (
                filteredPosts.map(post => {
                  const client = scopedClients.find(c => c.id === post.clientId);
                  const isSelected = post.id === (activePost?.id || '');

                  return (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPostId(post.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all space-y-2 ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-950/20'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: client?.accentColor || '#10b981' }}
                          ></span>
                          <span className="font-bold text-xs text-white truncate max-w-[160px]">
                            {client?.name || 'Brand'}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                          post.stage === 'approved' || post.stage === 'scheduled'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                            : post.stage === 'revision_requested'
                            ? 'bg-red-950/60 text-red-300 border-red-800/40'
                            : 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                        }`}>
                          {post.stage.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                        {post.title}
                      </div>

                      <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {post.caption}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-500">
                        <span className="capitalize">{post.platforms.join(', ')}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Approval Dossier & Device Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {activePost ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
              {/* Header with Client Info & Decision Bar */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-md shrink-0"
                    style={{ backgroundColor: postClient?.accentColor || '#10b981' }}
                  >
                    {(postClient?.name || 'PB').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-white">{activePost.title}</h2>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        activePost.stage === 'approved' || activePost.stage === 'scheduled'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                          : activePost.stage === 'revision_requested'
                          ? 'bg-red-950/60 text-red-300 border-red-800/40'
                          : 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                      }`}>
                        {activePost.stage.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {postClient?.name} · Target Networks: <span className="font-mono text-emerald-400 capitalize">{activePost.platforms.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Approval / Revision Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRevisionModalOpen(true)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-800/40 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                    <span>Request Revision</span>
                  </button>

                  <button
                    onClick={() => handleApprove(activePost)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/30"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>One-Click Sign-off</span>
                  </button>
                </div>
              </div>

              {/* Two Sub-Columns: Content Breakdown (7 cols) + Mobile Preview (5 cols) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Content Copy & Guidelines Compliance (7 cols) */}
                <div className="md:col-span-7 space-y-4">
                  {/* Caption Text Box */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Social Caption & Copy
                    </label>
                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                      {activePost.caption}
                    </div>
                  </div>

                  {/* Scheduled Slot */}
                  {activePost.scheduledDate && (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Scheduled Dispatch Slot (EAT):</span>
                      </div>
                      <span className="text-emerald-400 font-bold">
                        {new Date(activePost.scheduledDate).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Client Brand Guidelines Check */}
                  {postClient?.guidelineDetails && (
                    <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2 text-xs">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Brand Compliance Directives</span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-400">
                        <div>
                          <strong className="text-emerald-400">Mandatory Dos:</strong> {postClient.guidelineDetails.dos[0]}
                        </div>
                        <div>
                          <strong className="text-red-400">Strict Donts:</strong> {postClient.guidelineDetails.donts[0]}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Immutable Approval & Review Audit Log */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Audit Sign-off Trail ({activePost.approvalHistory.length})</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">Tamper-evident log</span>
                    </div>

                    <div className="space-y-1.5">
                      {activePost.approvalHistory.length === 0 ? (
                        <div className="text-[11px] text-slate-500 italic">
                          No approval entries logged yet.
                        </div>
                      ) : (
                        activePost.approvalHistory.map((log, idx) => (
                          <div
                            key={log.id || idx}
                            className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-200">
                                {log.userName} ({log.userRole.replace('_', ' ')})
                              </span>
                              <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                                log.action === 'approved'
                                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800/40'
                                  : log.action === 'rejected'
                                  ? 'bg-red-950 text-red-400 border-red-800/40'
                                  : 'bg-slate-900 text-slate-400 border-slate-800'
                              }`}>
                                {log.action}
                              </span>
                            </div>
                            {log.notes && (
                              <p className="text-[11px] text-slate-400 leading-snug">{log.notes}</p>
                            )}
                            <div className="text-[10px] font-mono text-slate-500">
                              {new Date(log.timestamp).toLocaleString()} EAT
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Mockup Preview (5 cols) */}
                <div className="md:col-span-5">
                  <div className="bg-slate-950 border-2 border-slate-800 rounded-[24px] p-3 text-slate-200 font-sans shadow-xl space-y-2.5">
                    {/* Device Header */}
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono px-1">
                      <span>09:41</span>
                      <span>5G ⚡️</span>
                    </div>

                    <div className="flex items-center gap-2 px-1">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] text-white"
                        style={{ backgroundColor: postClient?.accentColor || '#10b981' }}
                      >
                        {(postClient?.name || 'PB').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white leading-tight">
                          {postClient?.name || 'Client Brand'}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          {activePost.platforms[0]} · Official
                        </div>
                      </div>
                    </div>

                    {/* Creative Visual Asset Mockup */}
                    <div className="w-full aspect-square rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center relative">
                      <img
                        src={activePost.mediaUrls[0] || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1080&auto=format&fit=crop'}
                        alt="Creative Asset"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1080&auto=format&fit=crop';
                        }}
                      />
                      <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-mono text-emerald-400">
                        {activePost.format.toUpperCase()}
                      </div>
                    </div>

                    {/* Compact Caption */}
                    <div className="px-1 text-[11px] leading-relaxed line-clamp-4 text-slate-300">
                      <span className="font-bold text-white mr-1">{postClient?.name}</span>
                      {activePost.caption}
                    </div>

                    <div className="text-[9px] font-mono text-slate-500 px-1 pt-1 border-t border-slate-800">
                      Authorized by PulseBrand Governance
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-sm font-bold text-white">All Clear! No Pending Reviews</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No items are currently awaiting client or internal sign-off in this category.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Revision Request Modal Dialog */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>Request Revision from Creator</span>
              </div>
              <button
                onClick={() => setIsRevisionModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleRequestRevisionSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Specific Amendment Instructions *
                </label>
                <textarea
                  rows={4}
                  required
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="e.g. Please update caption hook: replace commercial solar stat with EPRA certified Nakuru figure. Adjust carousel slide 3 color to #3b82f6."
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-3 rounded-lg focus:outline-none focus:border-red-500 leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Revision Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Magic Link Modal Dialog */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold">
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>Instant Sign-off Magic Link</span>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕ ESC
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Send this zero-friction sign-off link directly to the primary client contact via <strong>WhatsApp</strong> or <strong>Corporate Email</strong>. No login or password is required.
              </p>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-emerald-400 truncate">
                  https://portal.pulsebrand.agency/review/{workspace.id}/{activePost?.id}?auth=magic_token_254
                </span>
                <button
                  onClick={handleGenerateMagicLink}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-md transition-colors flex items-center gap-1 shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-1 text-[11px] text-slate-400">
                <div className="font-bold text-slate-200">Designated Approver:</div>
                <div>{postClient?.contacts?.[0]?.name || 'Primary Signoff Lead'} ({postClient?.contacts?.[0]?.email || 'client@brand.co.ke'})</div>
                <div>M-PESA / Phone: {postClient?.contacts?.[0]?.phone || '+254 700 000 000'}</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
