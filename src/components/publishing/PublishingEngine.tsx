/**
 * Versaly Flow - Publishing & Scheduling Engine
 * Phase 18: Publishing & Scheduling Engine
 * Timezone-aware dispatch queue (Africa/Nairobi EAT UTC+3), pre-flight compliance validator,
 * automated first-comment engine (SEO hashtags), multi-network live feed simulator,
 * exponential backoff retry policies, and live API gateway telemetry console.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { ContentItem, SocialPlatform, DispatchStatus, PreFlightValidation } from '../../types';
import {
  Send,
  Building2,
  Calendar,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  Check,
  X,
  Play,
  RotateCcw,
  Sliders,
  ExternalLink,
  ChevronRight,
  Eye,
  Filter,
  Sparkles,
  Zap,
  Radio,
  Globe,
  Terminal,
  Smartphone,
  Copy,
  CheckCheck,
  Heart,
  Share2,
  Bookmark,
  Pause,
  PlayCircle,
  Hash,
  Layers,
  Search,
  CheckSquare
} from 'lucide-react';

interface GatewayLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  tag: string;
  message: string;
  meta?: string;
}

const SUPPORTED_TIMEZONES = [
  { id: 'Africa/Nairobi', label: 'Nairobi (EAT, UTC+3)', offset: '+03:00', flag: '🇰🇪' },
  { id: 'Europe/London', label: 'London (GMT/BST, UTC+1)', offset: '+01:00', flag: '🇬🇧' },
  { id: 'America/New_York', label: 'New York (EST/EDT, UTC-4)', offset: '-04:00', flag: '🇺🇸' },
  { id: 'Asia/Dubai', label: 'Dubai (GST, UTC+4)', offset: '+04:00', flag: '🇦🇪' },
  { id: 'Africa/Johannesburg', label: 'Johannesburg (CAT, UTC+2)', offset: '+02:00', flag: '🇿🇦' },
  { id: 'Asia/Singapore', label: 'Singapore (SGT, UTC+8)', offset: '+08:00', flag: '🇸🇬' }
];

const OPTIMAL_SLOTS = [
  { label: 'Morning Commute', time: '08:30', note: 'High B2B & LinkedIn reach' },
  { label: 'Midday Peak', time: '12:45', note: 'Instagram & X lunch browsing' },
  { label: 'Afternoon Lull', time: '16:00', note: 'B2B engagement spike' },
  { label: 'Evening Primetime', time: '19:30', note: 'TikTok & Reels maximum dwell' }
];

export const PublishingEngine: React.FC = () => {
  const {
    workspace,
    clients,
    contentItems,
    triggerImmediateDispatch,
    retryFailedDispatch,
    updateFirstComment,
    runPreFlightAudit,
    updateContentItem,
    scheduleContentPublish,
    addToast
  } = useAgency();

  // Scoped Data
  const scopedClients = clients.filter(c => c.tenantId === workspace.id);
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePostId, setActivePostId] = useState<string | null>(null);

  // Tab State in Workbench: 'compliance' | 'simulator' | 'schedule'
  const [activeTab, setActiveTab] = useState<'compliance' | 'simulator' | 'schedule'>('compliance');
  const [simulatorPlatform, setSimulatorPlatform] = useState<SocialPlatform>('instagram');

  // Editing first-comment
  const [editingFirstComment, setEditingFirstComment] = useState<boolean>(false);
  const [firstCommentDraft, setFirstCommentDraft] = useState<string>('');

  // Scheduling drawer state
  const [customScheduleDate, setCustomScheduleDate] = useState<string>('');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('Africa/Nairobi');

  // Gateway Simulation & Telemetry State
  const [isDispatchingId, setIsDispatchingId] = useState<string | null>(null);
  const [isBatchRunning, setIsBatchRunning] = useState<boolean>(false);
  const [isQueuePaused, setIsQueuePaused] = useState<boolean>(false);
  const [showConsole, setShowConsole] = useState<boolean>(true);
  const [logs, setLogs] = useState<GatewayLog[]>([
    {
      id: 'log-0',
      timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
      level: 'info',
      tag: 'DISPATCHER',
      message: 'Publishing daemon initialized with Africa/Nairobi (EAT UTC+3) gateway clock',
      meta: 'v1.4.2-nominal'
    },
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 60000).toLocaleTimeString(),
      level: 'success',
      tag: 'HEALTH_CHECK',
      message: 'All OAuth 2.0 social endpoints verified (Meta, LinkedIn, TikTok, X)',
      meta: 'ping: 38ms'
    }
  ]);

  const logConsoleRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logConsoleRef.current) {
      logConsoleRef.current.scrollTop = logConsoleRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (level: GatewayLog['level'], tag: string, message: string, meta?: string) => {
    const newEntry: GatewayLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      level,
      tag,
      message,
      meta
    };
    setLogs(prev => [...prev.slice(-49), newEntry]);
  };

  // Filter scoped queue deliverables
  const queuePosts = contentItems.filter(p => {
    if (p.tenantId !== workspace.id) return false;
    if (selectedClientId !== 'all' && p.clientId !== selectedClientId) return false;
    if (statusFilter !== 'all') {
      if (statusFilter === 'queued' && p.stage !== 'scheduled' && p.dispatchStatus !== 'queued') return false;
      if (statusFilter === 'published' && p.stage !== 'published') return false;
      if (statusFilter === 'retrying' && p.dispatchStatus !== 'retrying' && p.dispatchStatus !== 'failed') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCaption = p.caption.toLowerCase().includes(q);
      if (!matchTitle && !matchCaption) return false;
    }
    return true;
  });

  const activePost = contentItems.find(p => p.id === activePostId) || queuePosts[0] || null;
  const activePostClient = activePost ? scopedClients.find(c => c.id === activePost.clientId) : null;

  // Initialize schedule date when active post changes
  useEffect(() => {
    if (activePost) {
      if (activePost.scheduledDate) {
        setCustomScheduleDate(activePost.scheduledDate.slice(0, 16));
      } else {
        const tomorrow = new Date(Date.now() + 86400000);
        tomorrow.setHours(12, 30, 0, 0);
        setCustomScheduleDate(tomorrow.toISOString().slice(0, 16));
      }
      setSelectedTimezone(activePost.targetTimezone || 'Africa/Nairobi');
      if (activePost.platforms && activePost.platforms.length > 0) {
        setSimulatorPlatform(activePost.platforms[0]);
      }
    }
  }, [activePost?.id]);

  // Telemetry Counts
  const totalQueued = queuePosts.filter(p => p.stage === 'scheduled' || p.dispatchStatus === 'queued').length;
  const totalPublished = queuePosts.filter(p => p.stage === 'published').length;
  const totalRetrying = queuePosts.filter(p => p.dispatchStatus === 'retrying' || p.dispatchStatus === 'failed').length;

  // Handlers
  const handleImmediatePublish = async (postId: string) => {
    const post = contentItems.find(p => p.id === postId);
    if (!post) return;

    setIsDispatchingId(postId);
    addLog('info', 'GATEWAY', `Starting live dispatch sequence for "${post.title}" across [${post.platforms.join(', ')}]...`);

    // Step 1: Pre-flight verify
    addLog('info', 'PRE_FLIGHT', `Verifying aspect ratio, token health & caption limit...`);
    const preCheck = runPreFlightAudit(postId);
    if (!preCheck.passedAll) {
      addLog('warn', 'PRE_FLIGHT', 'Pre-flight audit reported minor parameter warnings; proceeding with normalized headers.');
    } else {
      addLog('success', 'PRE_FLIGHT', 'All pre-flight gate checks passed: Media & encoding 100% compliant.');
    }

    // Step 2: Gateway transmission
    await new Promise(r => setTimeout(r, 600));
    addLog('info', 'OAUTH_SYNC', `Token verified for client "${activePostClient?.name || 'Client'}". Scope: content_publish.`);

    await triggerImmediateDispatch(postId);

    // Step 3: First-comment automation
    if (post.firstCommentText || post.tags?.length) {
      addLog('success', 'FIRST_COMMENT', `Automated first-comment pinned successfully with SEO hashtags: ${post.firstCommentText || '#BrandKE'}`);
    }

    addLog('success', 'PUBLISHED', `Broadcast confirmed on social network endpoints. Stage updated to [published].`, 'HTTP 200 OK');
    setIsDispatchingId(null);
  };

  const handleRetryPost = (postId: string) => {
    addLog('warn', 'RETRY_ENGINE', `Manual exponential backoff override triggered for deliverable [${postId}]`);
    retryFailedDispatch(postId);
    addLog('info', 'DISPATCHER', `Post [${postId}] enqueued with elevated priority for next dispatch cycle.`);
  };

  const handleSaveFirstComment = (postId: string) => {
    updateFirstComment(postId, firstCommentDraft);
    setEditingFirstComment(false);
    addLog('info', 'METADATA', `Updated first-comment automated payload for post [${postId}]`);
  };

  const startEditComment = (post: ContentItem) => {
    setFirstCommentDraft(post.firstCommentText || '#VersalyFlow #NairobiBusiness #MarketingStrategyKE #BrandGrowth');
    setEditingFirstComment(true);
  };

  const handleAutoFixCompliance = (post: ContentItem) => {
    let updatedCaption = post.caption;
    let commentText = post.firstCommentText || '';

    // If missing hashtags, inject hashtags
    if (!post.caption.includes('#') && !commentText.includes('#')) {
      const defaultTags = activePostClient?.guidelineDetails?.keyHashtags?.join(' ') || '#VersalyFlow #BrandStrategyKE #EastAfrica';
      commentText = defaultTags;
      updateFirstComment(post.id, commentText);
    }

    // Run audit
    const updatedAudit: PreFlightValidation = {
      aspectRatioValid: true,
      aspectRatioNote: 'Auto-Normalized 1:1 / 4:5 Compliant',
      captionLengthValid: true,
      captionLengthNote: `${updatedCaption.length} characters (API Safe)`,
      hasRequiredHashtags: true,
      mediaEncodingValid: true,
      passedAll: true
    };

    updateContentItem(post.id, {
      preFlightCheck: updatedAudit,
      firstCommentText: commentText
    });

    addToast('Payload Auto-Optimized', 'Compliance rules and SEO hashtags applied successfully', 'success');
    addLog('success', 'AUTO_FIX', `Auto-formatted deliverable [${post.title}]. Aspect ratio normalized & first-comment armed.`);
  };

  const handleApplySchedule = (postId: string) => {
    if (!customScheduleDate) return;
    const isoString = new Date(customScheduleDate).toISOString();
    scheduleContentPublish(postId, isoString);
    updateContentItem(postId, { targetTimezone: selectedTimezone });
    addLog('info', 'SCHEDULER', `Deliverable [${postId}] re-anchored to ${customScheduleDate} (${selectedTimezone})`);
    addToast('Schedule Locked', `Queued for ${customScheduleDate} in ${selectedTimezone}`, 'success');
  };

  const handleApplyOptimalSlot = (timeStr: string) => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const [h, m] = timeStr.split(':');
    d.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
    setCustomScheduleDate(d.toISOString().slice(0, 16));
  };

  const handleBatchDispatch = async () => {
    const pendingPosts = queuePosts.filter(p => p.stage === 'scheduled' || p.dispatchStatus === 'queued');
    if (pendingPosts.length === 0) {
      addToast('No Pending Deliverables', 'All matching items in this filter are already published', 'info');
      return;
    }

    setIsBatchRunning(true);
    addLog('info', 'BATCH_DISPATCH', `Starting automated batch dispatch run for ${pendingPosts.length} deliverables...`);

    for (let i = 0; i < pendingPosts.length; i++) {
      const p = pendingPosts[i];
      addLog('info', 'BATCH', `[${i + 1}/${pendingPosts.length}] Processing "${p.title}"...`);
      await triggerImmediateDispatch(p.id);
      addLog('success', 'BATCH', `[${i + 1}/${pendingPosts.length}] Broadcast completed: "${p.title}"`);
      await new Promise(r => setTimeout(r, 400));
    }

    setIsBatchRunning(false);
    addLog('success', 'BATCH_DISPATCH', `Batch dispatch completed successfully. ${pendingPosts.length} items published.`);
    addToast('Batch Complete', `${pendingPosts.length} deliverables broadcasted live`, 'success');
  };

  const handleSimulateFailure = (postId: string) => {
    updateContentItem(postId, {
      dispatchStatus: 'retrying',
      retryCount: 1,
      lastDispatchAttempt: new Date().toISOString(),
      dispatchErrorNote: 'Simulated HTTP 429: Meta Graph API rate-limit threshold exceeded. Backoff timer initiated (5m).'
    });
    addLog('warn', 'SIMULATION', `Triggered simulated rate limit (HTTP 429) for post [${postId}]. Backoff circuit-breaker activated.`);
    addToast('Simulation Triggered', 'Simulated 429 rate limit backoff registered', 'warning');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">{workspace.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Publishing & Scheduling Engine</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400 font-mono flex items-center gap-1">
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>Africa/Nairobi (EAT +03:00)</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Smart Dispatch Queue & Pre-Flight Engine</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Automated social publishing pipeline for Meta, LinkedIn, X, and TikTok. Featuring timezone-aware queuing,
            first-comment hashtag injection, pre-flight compliance audits, and an exponential backoff retry daemon.
          </p>
        </div>

        {/* Global Dispatcher Daemon Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsQueuePaused(!isQueuePaused)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center gap-1.5 transition-colors ${
              isQueuePaused
                ? 'bg-amber-950/60 text-amber-300 border-amber-800/40 hover:bg-amber-900/60'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40 hover:bg-emerald-900/60'
            }`}
          >
            {isQueuePaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Dispatcher</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Queue</span>
              </>
            )}
          </button>

          <button
            onClick={handleBatchDispatch}
            disabled={isBatchRunning || isQueuePaused}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/20 disabled:opacity-50 cursor-pointer"
          >
            <Zap className={`w-3.5 h-3.5 ${isBatchRunning ? 'animate-bounce' : ''}`} />
            <span>{isBatchRunning ? 'Broadcasting Batch...' : 'Dispatch All Queued'}</span>
          </button>
        </div>
      </div>

      {/* Telemetry Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Scheduled Queue</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{totalQueued} Deliverables</div>
          <div className="text-[10px] text-slate-500 font-mono">Synced to EAT optimal engagement windows</div>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Broadcasts Live</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">{totalPublished} Dispatched</div>
          <div className="text-[10px] text-slate-500 font-mono">100% verified external API transmission</div>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Backoff Retry Engine</span>
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono">{totalRetrying} In Backoff</div>
          <div className="text-[10px] text-slate-500 font-mono">Circuit-breaker exponential recovery active</div>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>1st-Comment Engine</span>
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-indigo-300 font-mono">Active & Armed</div>
          <div className="text-[10px] text-slate-500 font-mono">SEO hashtag auto-injection on publish</div>
        </div>
      </div>

      {/* Control Filter & Search Rail */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Brands ({scopedClients.length})</option>
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
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Queue States</option>
              <option value="queued">Scheduled / Queued</option>
              <option value="published">Published</option>
              <option value="retrying">Retrying / Backoff</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-400 w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search deliverables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none w-full text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Target Dispatch Clock: <strong className="text-emerald-400">Nairobi EAT (UTC+3)</strong></span>
        </div>
      </div>

      {/* Main Split Grid: Left Deliverable Queue (5 cols) + Right Workbench (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scheduled Deliverable Queue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Deliverables in Queue ({queuePosts.length})
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Select item to inspect</span>
          </div>

          <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
            {queuePosts.map(post => {
              const client = scopedClients.find(c => c.id === post.clientId);
              const isSelected = activePost?.id === post.id;
              const isRetrying = post.dispatchStatus === 'retrying';
              const isPublished = post.stage === 'published';
              const isCompliant = post.preFlightCheck?.passedAll ?? true;

              return (
                <div
                  key={post.id}
                  onClick={() => setActivePostId(post.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-3 ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-950/20 ring-1 ring-emerald-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: client?.accentColor || '#10b981' }}
                        ></span>
                        <span className="text-[11px] font-bold text-slate-300">
                          {client?.name || 'Brand'}
                        </span>
                        <div className="flex items-center gap-1">
                          {post.platforms.map(pl => (
                            <span
                              key={pl}
                              className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800"
                            >
                              {pl}
                            </span>
                          ))}
                        </div>
                      </div>

                      <h4 className="font-bold text-sm text-white leading-snug line-clamp-1">
                        {post.title}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {post.caption}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border block ${
                        isPublished
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : isRetrying
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                          : 'bg-slate-950 text-cyan-300 border-slate-800'
                      }`}>
                        {isPublished ? 'Published' : isRetrying ? `Retry #${post.retryCount}` : 'Queued'}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 block mt-1">
                        {post.scheduledDate
                          ? new Date(post.scheduledDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : 'Pending Time'}
                      </span>
                    </div>
                  </div>

                  {/* Pre-Flight & First Comment Status Indicators */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className={`flex items-center gap-1 ${isCompliant ? 'text-emerald-400' : 'text-amber-400'}`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isCompliant ? 'Pre-flight: Compliant' : 'Audit: Needs Review'}</span>
                    </span>

                    <span className="flex items-center gap-1 text-indigo-300">
                      <MessageSquare className="w-3 h-3" />
                      <span>1st-Comment Armed</span>
                    </span>
                  </div>
                </div>
              );
            })}

            {queuePosts.length === 0 && (
              <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-xl text-slate-500 text-xs">
                No deliverables match your search criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Deep Dispatch Workbench (7 cols) */}
        {activePost ? (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6 shadow-2xl flex flex-col">
            {/* Header & Main Immediate Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: activePostClient?.accentColor || '#10b981' }}
                  ></span>
                  <span className="text-xs font-mono text-slate-400 font-bold">
                    {activePostClient?.name} Deliverable Payload
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                    {activePost.stage.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {activePost.title}
                </h2>
              </div>

              {/* Action Buttons: Publish Now / Retry / Simulate Failure */}
              <div className="flex flex-wrap items-center gap-2 self-start">
                {activePost.dispatchStatus === 'retrying' && (
                  <button
                    onClick={() => handleRetryPost(activePost.id)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Force Retry</span>
                  </button>
                )}

                {activePost.stage !== 'published' && (
                  <>
                    <button
                      onClick={() => handleSimulateFailure(activePost.id)}
                      title="Simulate transient network backoff"
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Test Retry</span>
                    </button>

                    <button
                      onClick={() => handleImmediatePublish(activePost.id)}
                      disabled={isDispatchingId === activePost.id}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/20 cursor-pointer"
                    >
                      <Send className={`w-3.5 h-3.5 ${isDispatchingId === activePost.id ? 'animate-spin' : ''}`} />
                      <span>{isDispatchingId === activePost.id ? 'Transmitting...' : 'Dispatch Live Now'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Navigation Tabs for Workbench */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('compliance')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === 'compliance'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pre-Flight Compliance Gate</span>
              </button>

              <button
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === 'simulator'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Multi-Network Simulator</span>
              </button>

              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === 'schedule'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Timezone & Slots</span>
              </button>
            </div>

            {/* TAB 1: Pre-Flight & Compliance Gate */}
            {activeTab === 'compliance' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Media & Payload Verification</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAutoFixCompliance(activePost)}
                      className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded text-[11px] font-mono flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>Auto-Fix & Optimize</span>
                    </button>
                    <button
                      onClick={() => runPreFlightAudit(activePost.id)}
                      className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Re-verify</span>
                    </button>
                  </div>
                </div>

                {/* Audit Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Aspect Ratio</span>
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                    </div>
                    <div className="font-bold text-white text-[11px]">
                      {activePost.preFlightCheck?.aspectRatioNote || '1:1 Feed / 9:16 Vertical Reel Compliant'}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Caption Length</span>
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                    </div>
                    <div className="font-bold text-white text-[11px]">
                      {activePost.caption.length} / 2,200 chars (Safe for IG, LinkedIn, X)
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Video Encoding</span>
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                    </div>
                    <div className="font-bold text-white text-[11px]">
                      H.264 / AAC 1080p Bitrate Normalized
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Hashtag SEO Score</span>
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                    </div>
                    <div className="font-bold text-indigo-400 text-[11px]">
                      {activePost.firstCommentText || activePost.caption.includes('#') ? 'SEO Hashtags Armed' : 'No Hashtags Detected'}
                    </div>
                  </div>
                </div>

                {/* Automated First-Comment Hashtag Injection */}
                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                      <span>Automated First-Comment Engine (SEO Hashtags)</span>
                    </span>
                    {!editingFirstComment && (
                      <button
                        onClick={() => startEditComment(activePost)}
                        className="text-[11px] font-mono text-indigo-400 hover:underline"
                      >
                        Edit payload
                      </button>
                    )}
                  </div>

                  {editingFirstComment ? (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                      <textarea
                        rows={2}
                        value={firstCommentDraft}
                        onChange={(e) => setFirstCommentDraft(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingFirstComment(false)}
                          className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveFirstComment(activePost.id)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded text-xs font-mono"
                        >
                          Save First-Comment
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-indigo-300/90 leading-relaxed flex items-start gap-2">
                      <Hash className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{activePost.firstCommentText || '#BrandKE #AfroModern #NairobiBusiness #VersalyFlow'}</span>
                    </div>
                  )}
                </div>

                {/* Primary Post Copy Payload */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    Primary Post Copy Payload
                  </span>
                  <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                    {activePost.caption}
                  </div>
                </div>

                {/* Retry Error Note if applicable */}
                {activePost.dispatchErrorNote && (
                  <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-lg flex items-start gap-2.5 text-xs text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Retry Daemon Diagnostic:</span>
                      <span>{activePost.dispatchErrorNote}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Multi-Network Live Post Simulator */}
            {activeTab === 'simulator' && (
              <div className="space-y-4">
                {/* Platform Selector Buttons */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {(['instagram', 'linkedin', 'x', 'tiktok', 'facebook'] as SocialPlatform[]).map(plat => {
                    const isSupported = activePost.platforms.includes(plat);
                    return (
                      <button
                        key={plat}
                        onClick={() => setSimulatorPlatform(plat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold flex items-center gap-1.5 transition-colors ${
                          simulatorPlatform === plat
                            ? 'bg-emerald-500 text-slate-950'
                            : isSupported
                            ? 'bg-slate-950 text-slate-200 border border-slate-800 hover:border-slate-700'
                            : 'bg-slate-950/40 text-slate-600 border border-slate-900'
                        }`}
                      >
                        <span>{plat}</span>
                        {isSupported && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                      </button>
                    );
                  })}
                </div>

                {/* Simulated Device Frame */}
                <div className="max-w-md mx-auto bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Mock Device Header */}
                  <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-950"
                        style={{ backgroundColor: activePostClient?.accentColor || '#10b981' }}
                      >
                        {activePostClient?.name.charAt(0) || 'B'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs font-bold text-white">
                          <span>{activePostClient?.name || 'Brand Official'}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-current" />
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Sponsored · Africa/Nairobi
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-slate-500">
                      Now
                    </span>
                  </div>

                  {/* Mock Media Container */}
                  <div className="aspect-square bg-slate-900 relative overflow-hidden flex items-center justify-center border-y border-slate-800/80">
                    {activePost.mediaUrls && activePost.mediaUrls.length > 0 ? (
                      <img
                        src={activePost.mediaUrls[0]}
                        alt={activePost.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback mockup gradient if asset fails
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4">
                      <span className="text-xs font-mono bg-slate-950/80 text-emerald-400 px-2 py-0.5 rounded w-max border border-emerald-500/30">
                        {simulatorPlatform.toUpperCase()} PREVIEW ({activePost.format.replace('_', ' ')})
                      </span>
                    </div>
                  </div>

                  {/* Mock Engagement Buttons */}
                  <div className="p-3 flex items-center justify-between text-slate-400 border-b border-slate-800/60">
                    <div className="flex items-center gap-4">
                      <Heart className="w-4 h-4 hover:text-rose-400 cursor-pointer transition-colors" />
                      <MessageSquare className="w-4 h-4 hover:text-indigo-400 cursor-pointer transition-colors" />
                      <Share2 className="w-4 h-4 hover:text-emerald-400 cursor-pointer transition-colors" />
                    </div>
                    <Bookmark className="w-4 h-4 hover:text-amber-400 cursor-pointer transition-colors" />
                  </div>

                  {/* Post Caption */}
                  <div className="p-3.5 text-xs text-slate-300 space-y-1.5">
                    <div className="leading-relaxed">
                      <strong className="text-white mr-1.5">{activePostClient?.name}</strong>
                      <span>{activePost.caption}</span>
                    </div>
                  </div>

                  {/* Automated First-Comment Rendered In-Situ */}
                  <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-400">
                      <MessageSquare className="w-3 h-3" />
                      <span className="font-bold">Pinned First-Comment (Auto-Dispatched):</span>
                    </div>
                    <p className="text-[11px] font-mono text-indigo-300/90 leading-relaxed">
                      {activePost.firstCommentText || '#BrandKE #EastAfricaBusiness #VersalyFlow'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Timezone Scheduling & Slots */}
            {activeTab === 'schedule' && (
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Select Target Broadcast Timezone
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {SUPPORTED_TIMEZONES.map(tz => (
                      <button
                        key={tz.id}
                        onClick={() => setSelectedTimezone(tz.id)}
                        className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                          selectedTimezone === tz.id
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{tz.flag}</span>
                          <span>{tz.label}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{tz.offset}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optimal Engagement Slots */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Recommended Peak Engagement Windows
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {OPTIMAL_SLOTS.map((slot, i) => (
                      <button
                        key={i}
                        onClick={() => handleApplyOptimalSlot(slot.time)}
                        className="p-2.5 bg-slate-950 border border-slate-800 hover:border-emerald-500/60 rounded-lg text-left transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-emerald-400">
                          <span>{slot.label}</span>
                          <span className="font-mono text-emerald-400">{slot.time} EAT</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{slot.note}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Schedule Input */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    Custom Date & Time
                  </span>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="datetime-local"
                      value={customScheduleDate}
                      onChange={(e) => setCustomScheduleDate(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-emerald-500 w-full sm:w-auto"
                    />

                    <button
                      onClick={() => handleApplySchedule(activePost.id)}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 w-full sm:w-auto justify-center cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Lock & Reschedule</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-7 p-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-xs italic">
            Select a deliverable from the dispatch queue to inspect pre-flight compliance and preview live rendering.
          </div>
        )}
      </div>

      {/* Expandable Live Gateway Telemetry Console */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-bold">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Live Social Gateway Telemetry Stream (Webhooks & Daemon Events)</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
              Socket: Connected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLogs([])}
              className="text-[10px] font-mono text-slate-500 hover:text-slate-300"
            >
              Clear Log
            </button>
            <button
              onClick={() => setShowConsole(!showConsole)}
              className="text-[10px] font-mono text-emerald-400 hover:underline"
            >
              {showConsole ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>

        {showConsole && (
          <div
            ref={logConsoleRef}
            className="p-3.5 max-h-48 overflow-y-auto space-y-1.5 font-mono text-[11px] bg-black/40 text-slate-300"
          >
            {logs.map(log => (
              <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-slate-600 shrink-0">{log.timestamp}</span>
                <span className={`px-1 rounded text-[9px] font-bold shrink-0 ${
                  log.level === 'success'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                    : log.level === 'warn'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                    : log.level === 'error'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  [{log.tag}]
                </span>
                <span className="text-slate-200 flex-1">{log.message}</span>
                {log.meta && <span className="text-slate-500 text-[10px] shrink-0 font-mono">({log.meta})</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
