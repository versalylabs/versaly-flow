/**
 * Versaly Flow - Unified Communication & Social Inbox
 * Phase 22: Unified Communication & Inbox
 * Consolidated multi-platform social inbox, comment & DM triage,
 * internal team mention threads (@teammate), canned reply templates,
 * and AI sentiment classification.
 */

import React, { useState, useMemo } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { InboxThread, InboxMessage, ThreadStatus, MessageSentiment, SocialPlatform, CannedResponse } from '../../types';
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Users,
  Building2,
  Tag,
  AtSign,
  Zap,
  Bookmark,
  ChevronRight,
  MoreVertical,
  Check,
  X,
  Plus,
  RefreshCw,
  Archive,
  HelpCircle,
  Flame,
  ThumbsUp,
  Meh,
  ThumbsDown,
  Trash2,
  UserCheck
} from 'lucide-react';

const PLATFORM_COLORS: Record<SocialPlatform, { bg: string; text: string; label: string; border: string }> = {
  instagram: { bg: 'bg-pink-500/10', text: 'text-pink-400', label: 'Instagram', border: 'border-pink-500/30' },
  twitter: { bg: 'bg-sky-500/10', text: 'text-sky-400', label: 'Twitter / X', border: 'border-sky-500/30' },
  linkedin: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'LinkedIn', border: 'border-blue-500/30' },
  tiktok: { bg: 'bg-teal-500/10', text: 'text-teal-400', label: 'TikTok', border: 'border-teal-500/30' },
  facebook: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', label: 'Facebook', border: 'border-indigo-500/30' },
  youtube: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'YouTube', border: 'border-red-500/30' }
};

const SENTIMENT_STYLES: Record<MessageSentiment, { bg: string; text: string; border: string; label: string }> = {
  positive: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Positive' },
  neutral: { bg: 'bg-slate-700/40', text: 'text-slate-300', border: 'border-slate-600', label: 'Neutral' },
  negative: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', label: 'Negative' },
  urgent: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Urgent SLA' }
};

export const UnifiedInboxManager: React.FC = () => {
  const {
    workspace,
    currentUser,
    users,
    clients,
    inboxThreads,
    cannedResponses,
    addMessageToThread,
    updateThreadStatus,
    assignThreadUser,
    updateThreadSentiment,
    createCannedResponse,
    deleteCannedResponse,
    addToast
  } = useAgency();

  // Active Selected Thread
  const [selectedThreadId, setSelectedThreadId] = useState<string>(inboxThreads[0]?.id || '');

  // Filters
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Composer State
  const [replyText, setReplyText] = useState('');
  const [composerMode, setComposerMode] = useState<'public' | 'internal'>('public');
  const [showCannedModal, setShowCannedModal] = useState(false);
  const [showNewCannedModal, setShowNewCannedModal] = useState(false);

  // New Canned Response Form State
  const [newCannedTitle, setNewCannedTitle] = useState('');
  const [newCannedCategory, setNewCannedCategory] = useState('Support');
  const [newCannedShortcut, setNewCannedShortcut] = useState('');
  const [newCannedContent, setNewCannedContent] = useState('');

  // Scoped Data for active workspace
  const scopedThreads = useMemo(() => inboxThreads.filter(t => t.tenantId === workspace.id), [inboxThreads, workspace.id]);
  const scopedClients = useMemo(() => clients.filter(c => c.tenantId === workspace.id), [clients, workspace.id]);
  const scopedCanned = useMemo(() => cannedResponses.filter(c => c.tenantId === workspace.id), [cannedResponses, workspace.id]);

  // Filtered Threads
  const filteredThreads = useMemo(() => {
    return scopedThreads.filter(thread => {
      const matchesPlatform = platformFilter === 'all' || thread.platform === platformFilter;
      const matchesStatus = statusFilter === 'all' || thread.status === statusFilter;
      const matchesSentiment = sentimentFilter === 'all' || thread.sentiment === sentimentFilter;
      const matchesClient = clientFilter === 'all' || thread.clientId === clientFilter;
      const matchesSearch =
        thread.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.customerHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (thread.tags && thread.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesPlatform && matchesStatus && matchesSentiment && matchesClient && matchesSearch;
    });
  }, [scopedThreads, platformFilter, statusFilter, sentimentFilter, clientFilter, searchQuery]);

  // Active Thread Object
  const activeThread = useMemo(() => {
    return scopedThreads.find(t => t.id === selectedThreadId) || filteredThreads[0] || null;
  }, [scopedThreads, selectedThreadId, filteredThreads]);

  // Target Client for active thread
  const activeClient = useMemo(() => {
    if (!activeThread) return null;
    return scopedClients.find(c => c.id === activeThread.clientId) || null;
  }, [scopedClients, activeThread]);

  // Statistics
  const stats = useMemo(() => {
    const totalOpen = scopedThreads.filter(t => t.status === 'open').length;
    const totalUrgent = scopedThreads.filter(t => t.sentiment === 'urgent' && t.status !== 'resolved').length;
    const totalResolved = scopedThreads.filter(t => t.status === 'resolved').length;
    const positiveCount = scopedThreads.filter(t => t.sentiment === 'positive').length;
    const sentimentHealth = scopedThreads.length > 0 ? Math.round((positiveCount / scopedThreads.length) * 100) : 100;

    return { totalOpen, totalUrgent, totalResolved, sentimentHealth };
  }, [scopedThreads]);

  // Dispatch reply
  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeThread || !replyText.trim()) return;

    // Detect internal @ mentions
    const mentions: string[] = [];
    users.forEach(u => {
      if (replyText.includes(`@${u.id}`) || replyText.includes(`@${u.name.toLowerCase()}`)) {
        mentions.push(u.id);
      }
    });

    addMessageToThread(activeThread.id, replyText.trim(), composerMode === 'internal', mentions);
    setReplyText('');
  };

  // Insert canned template
  const handleInsertCanned = (canned: CannedResponse) => {
    setReplyText(prev => (prev ? `${prev} ${canned.content}` : canned.content));
    setShowCannedModal(false);
    addToast('Template Inserted', `Inserted canned response: ${canned.shortcut}`, 'info');
  };

  // Create new canned response submit
  const handleCreateCannedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCannedTitle.trim() || !newCannedContent.trim()) {
      addToast('Validation', 'Please provide a title and response text', 'error');
      return;
    }

    createCannedResponse({
      tenantId: workspace.id,
      title: newCannedTitle.trim(),
      category: newCannedCategory,
      shortcut: newCannedShortcut.startsWith('/') ? newCannedShortcut : `/${newCannedShortcut}`,
      content: newCannedContent.trim()
    });

    setShowNewCannedModal(false);
    setNewCannedTitle('');
    setNewCannedShortcut('');
    setNewCannedContent('');
  };

  return (
    <div className="space-y-5">
      {/* Header & Telemetry Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Unified Social Inbox</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Operational
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Consolidated cross-platform social interactions, comments, DMs, @teammate internal threads & sentiment triage.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCannedModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-700 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Canned Replies ({scopedCanned.length})</span>
          </button>
          <button
            onClick={() => setShowNewCannedModal(true)}
            className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* KPI Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Open Inquiries</span>
            <div className="text-xl font-bold text-white mt-0.5">{stats.totalOpen}</div>
          </div>
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Urgent SLA Items</span>
            <div className="text-xl font-bold text-amber-400 mt-0.5">{stats.totalUrgent}</div>
          </div>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Resolved Threads</span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">{stats.totalResolved}</div>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Positive Sentiment</span>
            <div className="text-xl font-bold text-white mt-0.5">{stats.sentimentHealth}%</div>
          </div>
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <ThumbsUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Inbox Workspace (Split View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-290px)] min-h-[550px]">
        {/* Left Column: Thread List & Filters (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          {/* Filter Bar */}
          <div className="p-3 border-b border-slate-800 space-y-2.5 bg-slate-900/40">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search handles, comments, keywords..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <select
                value={platformFilter}
                onChange={e => setPlatformFilter(e.target.value)}
                className="text-[11px] bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-slate-300 focus:outline-none focus:border-cyan-500 capitalize"
              >
                <option value="all">All Channels</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter / X</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
                <option value="facebook">Facebook</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-[11px] bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-slate-300 focus:outline-none focus:border-cyan-500 capitalize"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={sentimentFilter}
                onChange={e => setSentimentFilter(e.target.value)}
                className="text-[11px] bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-slate-300 focus:outline-none focus:border-cyan-500 capitalize"
              >
                <option value="all">All Sentiment</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Thread List Feed */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No conversation threads matching your criteria.
              </div>
            ) : (
              filteredThreads.map(thread => {
                const isSelected = activeThread?.id === thread.id;
                const lastMsg = thread.messages[thread.messages.length - 1];
                const plat = PLATFORM_COLORS[thread.platform];
                const sent = SENTIMENT_STYLES[thread.sentiment];
                const client = clients.find(c => c.id === thread.clientId);

                return (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800/80 border-l-4 border-cyan-400'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center space-x-2 min-w-0">
                        {thread.customerAvatar ? (
                          <img
                            src={thread.customerAvatar}
                            alt={thread.customerName}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-700"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {thread.customerName[0]}
                          </div>
                        )}
                        <div className="truncate">
                          <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                            <span>{thread.customerName}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${plat.bg} ${plat.text}`}>
                              {plat.label}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {thread.customerHandle} • {client?.name}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border ${sent.bg} ${sent.text} ${sent.border}`}>
                          {sent.label}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {lastMsg?.isInternalNote ? (
                        <span className="text-amber-400 font-medium">[Internal Note] </span>
                      ) : null}
                      {lastMsg ? lastMsg.content : 'No messages yet'}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/40 text-[10px] text-slate-500">
                      <span className="capitalize">{thread.type.replace('_', ' ')}</span>
                      <span>{new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation Stream & Composer (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          {activeThread ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  {activeThread.customerAvatar ? (
                    <img
                      src={activeThread.customerAvatar}
                      alt={activeThread.customerName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {activeThread.customerName[0]}
                    </div>
                  )}

                  <div className="truncate">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white text-sm truncate">{activeThread.customerName}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${PLATFORM_COLORS[activeThread.platform].bg} ${PLATFORM_COLORS[activeThread.platform].text} ${PLATFORM_COLORS[activeThread.platform].border}`}>
                        {PLATFORM_COLORS[activeThread.platform].label}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 truncate">
                      {activeThread.customerHandle} • Account: <strong className="text-slate-200">{activeClient?.name}</strong>
                    </div>
                  </div>
                </div>

                {/* Status & Assignment Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  {/* Status Toggle */}
                  <select
                    value={activeThread.status}
                    onChange={e => updateThreadStatus(activeThread.id, e.target.value as ThreadStatus)}
                    className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500 capitalize"
                  >
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="archived">Archived</option>
                  </select>

                  {/* Sentiment Switcher */}
                  <select
                    value={activeThread.sentiment}
                    onChange={e => updateThreadSentiment(activeThread.id, e.target.value as MessageSentiment)}
                    className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-cyan-500 capitalize"
                  >
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                    <option value="urgent">Urgent SLA</option>
                  </select>
                </div>
              </div>

              {/* External Context Anchor if attached to post */}
              {activeThread.externalPostTitle && (
                <div className="px-4 py-2 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-2 truncate">
                    <Tag className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">Attached Post: <strong className="text-white">{activeThread.externalPostTitle}</strong></span>
                  </div>
                </div>
              )}

              {/* Message Timeline */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {activeThread.messages.map(msg => {
                  const isCustomer = msg.senderType === 'customer';
                  const isInternal = msg.isInternalNote;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isCustomer ? 'items-start' : isInternal ? 'items-center my-3' : 'items-end'
                      }`}
                    >
                      {/* Sender Meta */}
                      <div className="flex items-center space-x-2 mb-1 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-300">{msg.senderName}</span>
                        {isInternal && (
                          <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-semibold text-[10px] border border-amber-500/30 flex items-center gap-1">
                            <AtSign className="w-2.5 h-2.5" /> Internal Team Note
                          </span>
                        )}
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-sm ${
                          isInternal
                            ? 'bg-amber-950/40 border border-amber-700/40 text-amber-200 rounded-xl w-full'
                            : isCustomer
                            ? 'bg-slate-800 text-slate-100 rounded-tl-sm border border-slate-700/60'
                            : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Composer Dock */}
              <div className="p-3.5 border-t border-slate-800 bg-slate-900/90 space-y-2">
                {/* Mode Selector & Quick Replies */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setComposerMode('public')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                        composerMode === 'public'
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Public Reply
                    </button>
                    <button
                      type="button"
                      onClick={() => setComposerMode('internal')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition flex items-center space-x-1 ${
                        composerMode === 'internal'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <AtSign className="w-3 h-3" />
                      <span>Internal Note</span>
                    </button>
                  </div>

                  {/* Canned Quick Trigger */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowCannedModal(true)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-lg transition"
                    >
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Quick Canned</span>
                    </button>
                  </div>
                </div>

                {/* Textarea & Submit */}
                <form onSubmit={handleSendReply} className="relative">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                    placeholder={
                      composerMode === 'internal'
                        ? 'Type private internal note... (Use @user_02 or @name to mention colleagues)'
                        : `Reply publicly to ${activeThread.customerHandle} via ${activeThread.platform.toUpperCase()}...`
                    }
                    className={`w-full text-xs rounded-xl p-3 pr-24 border text-white placeholder-slate-500 focus:outline-none resize-none ${
                      composerMode === 'internal'
                        ? 'bg-amber-950/20 border-amber-800/60 focus:border-amber-500'
                        : 'bg-slate-800 border-slate-700 focus:border-cyan-500'
                    }`}
                  />

                  <div className="absolute right-2.5 bottom-3.5 flex items-center space-x-1.5">
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed ${
                        composerMode === 'internal'
                          ? 'bg-amber-600 hover:bg-amber-500 text-white'
                          : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                      }`}
                    >
                      <span>Send</span>
                      <Send className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              Select an inquiry thread from the left list to review and reply.
            </div>
          )}
        </div>
      </div>

      {/* MODAL: CANNED RESPONSES PICKER */}
      {showCannedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/40">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-white text-sm">Canned Response Templates</h3>
              </div>
              <button
                onClick={() => setShowCannedModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-2.5 max-h-96 overflow-y-auto divide-y divide-slate-800/60">
              {cannedResponses.map(canned => (
                <div
                  key={canned.id}
                  className="pt-2.5 first:pt-0 flex items-start justify-between gap-3 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white text-xs">{canned.title}</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                        {canned.shortcut}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                        {canned.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {canned.content}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleInsertCanned(canned)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition"
                    >
                      Insert
                    </button>
                    <button
                      onClick={() => deleteCannedResponse(canned.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW CANNED TEMPLATE */}
      {showNewCannedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/40">
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-white text-sm">Create Canned Reply Template</h3>
              </div>
              <button
                onClick={() => setShowNewCannedModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCannedSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nairobi Same-Day Delivery Rates"
                  value={newCannedTitle}
                  onChange={e => setNewCannedTitle(e.target.value)}
                  className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Shortcut *</label>
                  <input
                    type="text"
                    required
                    placeholder="/rates"
                    value={newCannedShortcut}
                    onChange={e => setNewCannedShortcut(e.target.value)}
                    className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={newCannedCategory}
                    onChange={e => setNewCannedCategory(e.target.value)}
                    className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Logistics">Logistics</option>
                    <option value="Sales">Sales</option>
                    <option value="Product">Product</option>
                    <option value="Partnerships">Partnerships</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Reply Template Text *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Habari! We offer same-day dispatch..."
                  value={newCannedContent}
                  onChange={e => setNewCannedContent(e.target.value)}
                  className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCannedModal(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-md transition"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
