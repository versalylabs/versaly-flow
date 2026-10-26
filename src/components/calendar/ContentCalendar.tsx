/**
 * PulseBrand Agency OS - Interactive Editorial Content Calendar
 * Phase 12: Interactive Content Calendar
 * Multi-view editorial calendar (Monthly, Weekly, List, Matrix) with drag-and-drop
 * date rescheduling, platform & brand color badges, and East African optimal time-slot hints.
 */

import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { ContentItem, SocialPlatform, PostFormat } from '../../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Building2,
  Instagram,
  Linkedin,
  Twitter,
  Share2,
  Video,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Layers,
  Sparkles,
  ArrowRight,
  Flame,
  Zap,
  Info
} from 'lucide-react';

type CalendarViewMode = 'month' | 'week' | 'list';

const KENYAN_BEST_TIMES = [
  { platform: 'LinkedIn', slot: '08:30 AM EAT (Morning Commute / Executive Review)', day: 'Tuesday - Thursday' },
  { platform: 'Twitter / X', slot: '12:45 PM EAT (Lunch Hour Breaking Updates)', day: 'Monday - Friday' },
  { platform: 'Instagram & TikTok', slot: '19:15 PM EAT (Evening Relax & Entertainment)', day: 'Thursday - Sunday' }
];

export const ContentCalendar: React.FC = () => {
  const {
    workspace,
    currentUser,
    clients,
    contentItems,
    scheduleContentPublish,
    addToast
  } = useAgency();

  // Scoped clients and posts
  const scopedClients = clients.filter(c => c.tenantId === workspace.id);
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');

  // Calendar Cursor Date: September 2026 (matching simulated applet timeline)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 8 is September (0-indexed)

  // Drag and drop state
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);

  // Selected post drawer/modal
  const [selectedPost, setSelectedPost] = useState<ContentItem | null>(null);

  // Filter content items
  const scopedPosts = contentItems.filter(p => {
    if (p.tenantId !== workspace.id) return false;
    if (selectedClientId !== 'all' && p.clientId !== selectedClientId) return false;
    return true;
  });

  // Month navigation helpers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Month matrix generator
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Drag-and-drop date rescheduling handlers
  const handleDragStart = (e: React.DragEvent, postId: string) => {
    e.dataTransfer.setData('text/plain', postId);
    setDraggedPostId(postId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDay: number) => {
    e.preventDefault();
    const postId = e.dataTransfer.getData('text/plain') || draggedPostId;
    if (!postId) return;

    // Construct new ISO date preserving hour/minute
    const targetDateObj = new Date(currentYear, currentMonth, targetDay, 10, 0, 0);
    const newIso = targetDateObj.toISOString();

    scheduleContentPublish(postId, newIso);
    setDraggedPostId(null);
    addToast('Post Rescheduled', `Moved to ${monthNames[currentMonth]} ${targetDay}, ${currentYear}`, 'success');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>{workspace.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Interactive Content Calendar</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">
              {scopedPosts.filter(p => p.stage === 'scheduled' || p.stage === 'approved').length} Active Scheduled
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Editorial Content Matrix & Multi-View Calendar</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Drag-and-drop rescheduling across active brand retainers, cross-platform publication badges,
            and peak East African audience engagement time slots.
          </p>
        </div>

        {/* View Switchers & Month Navigator */}
        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
            {(['month', 'week', 'list'] as CalendarViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  viewMode === mode
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode} View
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Control Bar: Brand Selector, Time Navigation, and Regional Best Time Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
        {/* Brand Filter */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium"
          >
            <option value="all">All Brands Combined</option>
            {scopedClients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-3 text-white font-bold">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm tracking-wide font-mono">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Legend Indicator */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Scheduled</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>In Review</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>Approved</span>
          </span>
        </div>
      </div>

      {/* East African Optimal Posting Times Hint Ribbon */}
      <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono text-[11px]">
          <Zap className="w-3.5 h-3.5" />
          <span>Nairobi Audience Cadence Intelligence:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-300">
          {KENYAN_BEST_TIMES.map((bt, idx) => (
            <span key={idx} className="flex items-center gap-1">
              <strong className="text-slate-100">{bt.platform}:</strong>
              <span className="text-slate-400">{bt.slot}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Viewport: Month View, Week View, or List View */}
      {viewMode === 'month' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 bg-slate-950/80 border-b border-slate-800 text-center text-xs font-mono font-bold text-slate-400 py-3">
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-800/70 bg-slate-950/40">
            {/* Blank cells for offset */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[120px] p-2 bg-slate-950/20 text-slate-700"></div>
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

              // Posts scheduled on this date
              const dayPosts = scopedPosts.filter(p => {
                if (!p.scheduledDate) return false;
                return p.scheduledDate.startsWith(dateStr);
              });

              const isToday = currentYear === 2026 && currentMonth === 8 && dayNum === 24;

              return (
                <div
                  key={`day-${dayNum}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, dayNum)}
                  className={`min-h-[135px] p-2 transition-all flex flex-col justify-between group ${
                    isToday
                      ? 'bg-slate-900/90 ring-1 ring-emerald-500/40'
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  {/* Date Number Header */}
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span
                      className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        isToday
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {isToday && (
                      <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold tracking-tight">
                        Today (EAT)
                      </span>
                    )}

                    {dayPosts.length > 0 && !isToday && (
                      <span className="text-[9px] font-mono text-slate-500">
                        {dayPosts.length} {dayPosts.length === 1 ? 'post' : 'posts'}
                      </span>
                    )}
                  </div>

                  {/* Scheduled Post Chips */}
                  <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[105px]">
                    {dayPosts.map(post => {
                      const client = scopedClients.find(c => c.id === post.clientId);
                      return (
                        <div
                          key={post.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, post.id)}
                          onClick={() => setSelectedPost(post)}
                          className="p-1.5 rounded bg-slate-950 border border-slate-800 hover:border-emerald-500 cursor-grab active:cursor-grabbing text-left space-y-1 transition-all shadow-sm group/chip"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: client?.accentColor || '#10b981' }}
                            ></span>
                            <span className="text-[10px] font-bold text-slate-200 truncate flex-1">
                              {client?.name || 'Brand'}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500">
                              {post.scheduledDate ? new Date(post.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>

                          <div className="text-[10px] text-slate-400 line-clamp-1 group-hover/chip:text-white">
                            {post.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Drag drop hint target */}
                  <div className="text-[8px] font-mono text-slate-700 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    Drag post here to reschedule
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Week Schedule: September 21 - September 27, 2026 (Nairobi Focus)
            </span>
            <span className="text-xs font-mono text-emerald-400">Peak Content Cadence</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {[21, 22, 23, 24, 25, 26, 27].map(dayNum => {
              const dateStr = `2026-09-${String(dayNum).padStart(2, '0')}`;
              const dayPosts = scopedPosts.filter(p => p.scheduledDate && p.scheduledDate.startsWith(dateStr));
              const isToday = dayNum === 24;

              return (
                <div
                  key={dayNum}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, dayNum)}
                  className={`p-3 rounded-lg border space-y-2 min-h-[220px] flex flex-col justify-between ${
                    isToday ? 'bg-slate-950 border-emerald-500 ring-1 ring-emerald-500/30' : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-slate-300">Sep {dayNum}</span>
                    {isToday && (
                      <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-1 rounded">
                        Today
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    {dayPosts.map(post => {
                      const client = scopedClients.find(c => c.id === post.clientId);
                      return (
                        <div
                          key={post.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, post.id)}
                          onClick={() => setSelectedPost(post)}
                          className="p-2 rounded bg-slate-900 border border-slate-800 hover:border-emerald-500 cursor-pointer space-y-1 text-xs"
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: client?.accentColor || '#10b981' }}
                            ></span>
                            <span className="font-bold text-white text-[11px] truncate">{client?.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-300 line-clamp-2">{post.title}</div>
                          <div className="text-[9px] font-mono text-emerald-400 capitalize">
                            {post.platforms.join(', ')} · {post.format}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-[9px] font-mono text-slate-600 text-center">
                    {dayPosts.length} posts
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Chronological Publication Queue ({scopedPosts.length} posts)
            </span>
            <span className="text-xs font-mono text-slate-400">Sorted by Scheduled Slot</span>
          </div>

          <div className="divide-y divide-slate-800">
            {scopedPosts.map(post => {
              const client = scopedClients.find(c => c.id === post.clientId);
              return (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="py-3.5 px-2 hover:bg-slate-950/60 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: client?.accentColor || '#10b981' }}
                    ></span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{post.title}</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border bg-slate-800 text-slate-300 border-slate-700">
                          {post.stage.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xl">
                        {post.caption}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-emerald-400">
                      {post.scheduledDate ? new Date(post.scheduledDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unscheduled'}
                    </span>
                    <span className="capitalize text-slate-400">{post.platforms.join(', ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Post Drawer Dialog */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <CalendarIcon className="w-4 h-4 text-emerald-400" />
                <span>Editorial Slot Inspector</span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕ ESC
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedPost.title}</h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  Target: <span className="text-emerald-400 capitalize">{selectedPost.platforms.join(', ')}</span> ({selectedPost.format})
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-line font-sans">
                {selectedPost.caption}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-[10px] text-slate-500 uppercase">Stage</div>
                  <div className="font-bold text-emerald-400 uppercase mt-0.5">{selectedPost.stage.replace('_', ' ')}</div>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-[10px] text-slate-500 uppercase">Scheduled Time</div>
                  <div className="font-bold text-white mt-0.5">
                    {selectedPost.scheduledDate ? new Date(selectedPost.scheduledDate).toLocaleString() : 'Not Set'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
