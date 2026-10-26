/**
 * PulseBrand Agency OS - Editorial Workflow & Versioning
 * Phase 13: Editorial Workflow & Versioning
 * Visual Kanban workflow stages (Draft, Internal Review, Client Review, Revision Requested, Approved, Scheduled),
 * post version comparison & 1-click rollback, internal team comments thread, and stage advancement triggers.
 */

import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { ContentItem, ContentStage, ContentVersion, InternalComment } from '../../types';
import {
  Kanban,
  Building2,
  Filter,
  ArrowRight,
  History,
  RotateCcw,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Share2,
  Calendar,
  Layers,
  ChevronRight,
  Eye,
  Plus,
  GitBranch,
  Sparkles,
  User,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';

interface KanbanColumn {
  id: ContentStage;
  label: string;
  badgeColor: string;
  description: string;
}

const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: 'draft',
    label: 'Creator Drafts',
    badgeColor: 'border-slate-700 bg-slate-900/60 text-slate-300',
    description: 'Work in progress by creative team'
  },
  {
    id: 'internal_review',
    label: 'Internal Review',
    badgeColor: 'border-indigo-800/60 bg-indigo-950/40 text-indigo-300',
    description: 'Copy lead & account manager verification'
  },
  {
    id: 'client_review',
    label: 'Client Sign-off Gate',
    badgeColor: 'border-amber-800/60 bg-amber-950/40 text-amber-300',
    description: 'Awaiting primary client approver review'
  },
  {
    id: 'revision_requested',
    label: 'Revision Requested',
    badgeColor: 'border-red-800/60 bg-red-950/40 text-red-300',
    description: 'Returned with line-item amendments'
  },
  {
    id: 'approved',
    label: 'Approved & Ready',
    badgeColor: 'border-emerald-800/60 bg-emerald-950/40 text-emerald-300',
    description: 'Signed off and ready to lock slot'
  },
  {
    id: 'scheduled',
    label: 'Scheduled for Dispatch',
    badgeColor: 'border-cyan-800/60 bg-cyan-950/40 text-cyan-300',
    description: 'Automated publishing queue active'
  }
];

export const EditorialWorkflow: React.FC = () => {
  const {
    workspace,
    currentUser,
    clients,
    contentItems,
    transitionContentStage,
    rollbackContentVersion,
    addInternalComment,
    addToast
  } = useAgency();

  // Filters & State
  const scopedClients = clients.filter(c => c.tenantId === workspace.id);
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [comparingVersionNum, setComparingVersionNum] = useState<number | null>(null);
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);

  // Filter scoped posts
  const filteredPosts = contentItems.filter(p => {
    if (p.tenantId !== workspace.id) return false;
    if (selectedClientId !== 'all' && p.clientId !== selectedClientId) return false;
    return true;
  });

  const activePost = contentItems.find(p => p.id === activePostId) || null;
  const activePostClient = activePost ? scopedClients.find(c => c.id === activePost.clientId) : null;

  // Drag and Drop Kanban Handlers
  const handleDragStart = (e: React.DragEvent, postId: string) => {
    e.dataTransfer.setData('text/plain', postId);
    setDraggedPostId(postId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: ContentStage) => {
    e.preventDefault();
    const postId = e.dataTransfer.getData('text/plain') || draggedPostId;
    if (!postId) return;

    const item = contentItems.find(p => p.id === postId);
    if (!item || item.stage === targetStage) return;

    transitionContentStage(postId, targetStage, `Moved card from ${item.stage.replace('_', ' ')} to ${targetStage.replace('_', ' ')} via Kanban Board`);
    setDraggedPostId(null);
  };

  // Submit comment handler
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePost || !newCommentText.trim()) return;
    addInternalComment(activePost.id, newCommentText.trim());
    setNewCommentText('');
  };

  // Rollback version handler
  const handleRollback = (versionNum: number) => {
    if (!activePost) return;
    rollbackContentVersion(activePost.id, versionNum);
    setComparingVersionNum(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>{workspace.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Editorial Workflow & Versioning</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">Visual Kanban & Rollback Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Editorial Workflow Kanban & Version History</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Drag-and-drop workflow stages across internal review and client gates, compare caption diffs,
            execute 1-click version rollbacks, and coordinate with internal team feedback notes.
          </p>
        </div>

        {/* Brand Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl self-start md:self-auto text-xs">
          <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-400">Brand:</span>
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
      </div>

      {/* Visual Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1280px]">
          {KANBAN_COLUMNS.map(column => {
            const columnPosts = filteredPosts.filter(p => p.stage === column.id);

            return (
              <div
                key={column.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
                className="flex-1 min-w-[210px] bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-3"
              >
                {/* Column Header */}
                <div className="space-y-1 pb-2 border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white tracking-wide">
                      {column.label}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${column.badgeColor}`}>
                      {columnPosts.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {column.description}
                  </p>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 flex-1 min-h-[420px] overflow-y-auto max-h-[580px] pr-0.5">
                  {columnPosts.length === 0 ? (
                    <div className="h-full flex items-center justify-center p-4 border border-dashed border-slate-800/80 rounded-lg text-slate-600 text-[11px] text-center italic">
                      Drag posts here
                    </div>
                  ) : (
                    columnPosts.map(post => {
                      const client = scopedClients.find(c => c.id === post.clientId);
                      const isSelected = post.id === activePostId;

                      return (
                        <div
                          key={post.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, post.id)}
                          onClick={() => setActivePostId(post.id)}
                          className={`p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all space-y-2 text-xs ${
                            isSelected
                              ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-950/20'
                              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {/* Client tag & platform */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: client?.accentColor || '#10b981' }}
                              ></span>
                              <span className="font-bold text-[11px] text-white truncate max-w-[110px]">
                                {client?.name || 'Brand'}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono text-slate-500 uppercase">
                              {post.format.replace('_', ' ')}
                            </span>
                          </div>

                          {/* Post Title */}
                          <div className="font-semibold text-slate-200 line-clamp-2 leading-snug">
                            {post.title}
                          </div>

                          {/* Caption Snippet */}
                          <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {post.caption}
                          </div>

                          {/* Footer with versions count & comments badge */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-500">
                            <span className="flex items-center gap-1">
                              <GitBranch className="w-3 h-3 text-emerald-400" />
                              <span>v{(post.versions?.length || 1)}</span>
                            </span>

                            {post.internalComments && post.internalComments.length > 0 && (
                              <span className="flex items-center gap-1 text-slate-400">
                                <MessageSquare className="w-3 h-3 text-indigo-400" />
                                <span>{post.internalComments.length}</span>
                              </span>
                            )}

                            <span className="capitalize">{post.platforms[0]}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Drop Zone Footer Label */}
                <div className="text-[9px] font-mono text-slate-600 text-center py-1 bg-slate-950/40 rounded border border-slate-800/40">
                  Drop to change stage
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Card Deep Dive: Version History Diff & Internal Team Comments Drawer */}
      {activePost && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6 shadow-2xl">
          {/* Active Post Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0"
                style={{ backgroundColor: activePostClient?.accentColor || '#10b981' }}
              >
                {(activePostClient?.name || 'PB').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{activePost.title}</h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border bg-slate-800 text-emerald-300 border-emerald-800/30">
                    {activePost.stage.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Client: {activePostClient?.name} · Target Networks: <span className="font-mono text-emerald-400 capitalize">{activePost.platforms.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Quick Stage Advancement Triggers */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Move to:</span>
              <select
                value={activePost.stage}
                onChange={(e) => transitionContentStage(activePost.id, e.target.value as ContentStage, `Stage advanced to ${e.target.value}`)}
                className="bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-semibold px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {KANBAN_COLUMNS.map(col => (
                  <option key={col.id} value={col.id}>{col.label}</option>
                ))}
              </select>
              <button
                onClick={() => setActivePostId(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Two Columns: Version Diff & Rollback (7 cols) + Internal Comments (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Version History & Comparison Engine (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Version History & Snapshot Diff</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {(activePost.versions?.length || 1)} recorded iterations
                </span>
              </div>

              {/* Version History List */}
              <div className="space-y-2">
                {(activePost.versions && activePost.versions.length > 0) ? (
                  activePost.versions.map((ver) => {
                    const isComparing = comparingVersionNum === ver.versionNumber;
                    return (
                      <div
                        key={ver.versionNumber}
                        className={`p-3 rounded-lg border text-xs transition-all space-y-2 ${
                          isComparing
                            ? 'bg-slate-950 border-emerald-500/80 shadow-md shadow-emerald-950/20'
                            : 'bg-slate-950/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white font-mono">Version #{ver.versionNumber}</span>
                            <span className="text-[10px] text-slate-400">by {ver.modifiedByName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-500">
                              {new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EAT
                            </span>
                            <button
                              onClick={() => setComparingVersionNum(isComparing ? null : ver.versionNumber)}
                              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px]"
                            >
                              {isComparing ? 'Close Diff' : 'Compare'}
                            </button>
                            <button
                              onClick={() => handleRollback(ver.versionNumber)}
                              className="px-2 py-0.5 rounded bg-emerald-600/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Rollback</span>
                            </button>
                          </div>
                        </div>

                        {ver.changeSummary && (
                          <div className="text-[11px] text-slate-400 italic">
                            Summary: {ver.changeSummary}
                          </div>
                        )}

                        {/* If comparing, show side-by-side text diff */}
                        {isComparing && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
                            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 space-y-1">
                              <div className="text-[10px] font-mono font-bold text-slate-400">Version #{ver.versionNumber} Snapshot</div>
                              <div className="text-[11px] text-slate-300 whitespace-pre-line leading-relaxed">
                                {ver.caption}
                              </div>
                            </div>
                            <div className="p-2.5 bg-slate-900 rounded border border-emerald-800/40 space-y-1">
                              <div className="text-[10px] font-mono font-bold text-emerald-400">Current Live State</div>
                              <div className="text-[11px] text-white whitespace-pre-line leading-relaxed">
                                {activePost.caption}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-500 italic">
                    Single version active. Changes will automatically append version snapshots to this audit thread.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Internal Team Feedback & Collaboration (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Internal Team Feedback</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Agency Confidential
                </span>
              </div>

              {/* Comments Thread */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-3 min-h-[220px] max-h-[320px] overflow-y-auto">
                {(!activePost.internalComments || activePost.internalComments.length === 0) ? (
                  <div className="text-center py-8 text-xs text-slate-500 italic">
                    No internal feedback notes yet. Leave a note below for the creative team.
                  </div>
                ) : (
                  activePost.internalComments.map((comm) => (
                    <div key={comm.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">
                          {comm.userName} ({comm.userRole.replace('_', ' ')})
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(comm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EAT
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{comm.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Input Form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Add internal feedback note for copywriter..."
                  className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 font-sans"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-md shadow-indigo-950/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
