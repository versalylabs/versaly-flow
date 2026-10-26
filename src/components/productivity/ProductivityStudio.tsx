import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  ContentStage,
  ContentItem,
  QuickDraftNote
} from '../../types';
import {
  Command,
  Zap,
  CheckSquare,
  Square,
  Calendar,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  Send,
  ArrowRight,
  Filter,
  Check,
  Tag,
  Clock,
  Keyboard,
  FileText,
  Search,
  CheckCircle2,
  FolderPlus
} from 'lucide-react';

export const ProductivityStudio: React.FC<{ onNavigateToComposer?: () => void }> = ({ onNavigateToComposer }) => {
  const {
    workspace,
    clients,
    contentItems,
    quickNotes,
    createQuickNote,
    updateQuickNote,
    deleteQuickNote,
    convertQuickNoteToPost,
    executeBulkPostAction,
    setIsCommandPaletteOpen,
    addToast
  } = useAgency();

  const [activeTab, setActiveTab] = useState<'bulk' | 'scratchpad' | 'shortcuts'>('bulk');

  // Bulk Operations State
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [bulkFilterStage, setBulkFilterStage] = useState<string>('all');
  const [bulkFilterClient, setBulkFilterClient] = useState<string>('all');
  const [searchPostQuery, setSearchPostQuery] = useState<string>('');

  // Bulk Action Inputs
  const [targetStage, setTargetStage] = useState<ContentStage | ''>('');
  const [rescheduleDays, setRescheduleDays] = useState<number>(0);
  const [bulkTagInput, setBulkTagInput] = useState<string>('');
  const [isExecutingBulk, setIsExecutingBulk] = useState<boolean>(false);

  // Scratchpad Form State
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteTags, setNoteTags] = useState<string>('');
  const [noteColor, setNoteColor] = useState<'amber' | 'emerald' | 'indigo' | 'rose' | 'slate'>('indigo');
  const [noteClientId, setNoteClientId] = useState<string>('');

  // Filtered deliverables for bulk actions
  const scopedPosts = contentItems.filter(p => p.tenantId === workspace.id);
  const scopedClients = clients.filter(c => c.tenantId === workspace.id);
  const scopedQuickNotes = quickNotes.filter(n => n.tenantId === workspace.id);
  const filteredPosts = scopedPosts.filter(p => {
    const matchStage = bulkFilterStage === 'all' || p.stage === bulkFilterStage;
    const matchClient = bulkFilterClient === 'all' || p.clientId === bulkFilterClient;
    const matchQuery =
      p.title.toLowerCase().includes(searchPostQuery.toLowerCase()) ||
      p.caption.toLowerCase().includes(searchPostQuery.toLowerCase());
    return matchStage && matchClient && matchQuery;
  });

  const handleToggleSelectPost = (id: string) => {
    setSelectedPostIds(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    if (selectedPostIds.length === filteredPosts.length) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(filteredPosts.map(p => p.id));
    }
  };

  const handleRunBulkAction = () => {
    if (selectedPostIds.length === 0) {
      addToast('No Deliverables Selected', 'Please select at least one post to apply bulk action.', 'warning');
      return;
    }

    if (!targetStage && rescheduleDays === 0 && !bulkTagInput.trim()) {
      addToast('No Action Configured', 'Please pick a stage transition, day shift, or tag to apply.', 'info');
      return;
    }

    setIsExecutingBulk(true);
    setTimeout(() => {
      const tagsToAdd = bulkTagInput.trim()
        ? bulkTagInput.split(',').map(t => t.trim()).filter(Boolean)
        : undefined;

      executeBulkPostAction({
        postIds: selectedPostIds,
        stage: targetStage || undefined,
        rescheduleOffsetDays: rescheduleDays !== 0 ? rescheduleDays : undefined,
        addTags: tagsToAdd
      });

      setIsExecutingBulk(false);
      setSelectedPostIds([]);
      setTargetStage('');
      setRescheduleDays(0);
      setBulkTagInput('');
    }, 800);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) {
      addToast('Missing Title', 'Please enter a title for your scratchpad note.', 'error');
      return;
    }

    const tagsArray = noteTags.split(',').map(t => t.trim()).filter(Boolean);
    createQuickNote({
      title: noteTitle.trim(),
      content: noteContent.trim(),
      tags: tagsArray,
      targetClientId: noteClientId || undefined,
      color: noteColor
    });

    setNoteTitle('');
    setNoteContent('');
    setNoteTags('');
    setNoteClientId('');
  };

  const handleConvertNote = (note: QuickDraftNote) => {
    const targetClient = scopedClients.find(c => c.id === note.targetClientId) || scopedClients[0];
    if (!targetClient) return;

    convertQuickNoteToPost(note.id, targetClient.id);
    if (onNavigateToComposer) {
      onNavigateToComposer();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden border border-indigo-700/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-3 border border-indigo-500/30">
              <Command className="w-3.5 h-3.5 text-amber-300" />
              Productivity & Quick Actions
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5">
              <span>Power Operator & Quick Actions Studio</span>
            </h1>
            <p className="text-indigo-200/80 text-sm max-w-2xl mt-1">
              Accelerate agency operations with the global Cmd+K spotlight launcher, bulk deliverable status transitions, batch date reschedulers, and quick-draft scratchpads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-slate-950/70 p-2 rounded-xl border border-indigo-500/30 backdrop-blur-md">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="px-3.5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md flex items-center gap-1.5 transition-all"
            >
              <Command className="w-3.5 h-3.5" />
              <span>Open Cmd+K</span>
            </button>

            <button
              onClick={() => setActiveTab('bulk')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'bulk'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Bulk Content Actions
            </button>
            <button
              onClick={() => setActiveTab('scratchpad')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'scratchpad'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Quick Scratchpad ({scopedQuickNotes.length})
            </button>
            <button
              onClick={() => setActiveTab('shortcuts')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'shortcuts'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Keyboard Shortcuts
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Bulk Content Actions & Batch Rescheduler */}
      {activeTab === 'bulk' && (
        <div className="space-y-6">
          {/* Top Control Bar: Filters & Selection Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search posts to bulk edit..."
                  value={searchPostQuery}
                  onChange={(e) => setSearchPostQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 w-full sm:w-64 focus:outline-none focus:border-indigo-500"
                />

                <select
                  value={bulkFilterStage}
                  onChange={(e) => setBulkFilterStage(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 capitalize"
                >
                  <option value="all">All Stages</option>
                  <option value="draft">Drafts</option>
                  <option value="internal_review">Internal Review</option>
                  <option value="client_review">Client Review</option>
                  <option value="approved">Approved</option>
                  <option value="scheduled">Scheduled</option>
                </select>

                <select
                  value={bulkFilterClient}
                  onChange={(e) => setBulkFilterClient(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Clients</option>
                  {scopedClients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSelectAllFiltered}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1.5"
                >
                  {selectedPostIds.length === filteredPosts.length && filteredPosts.length > 0 ? (
                    <>
                      <CheckSquare className="w-4 h-4" />
                      <span>Deselect All</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4" />
                      <span>Select All Filtered ({filteredPosts.length})</span>
                    </>
                  )}
                </button>

                <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-bold">
                  {selectedPostIds.length} Selected
                </span>
              </div>
            </div>

            {/* Batch Action Configuration Bar */}
            <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950/60 p-3.5 rounded-xl border">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  1. Advance Stage
                </label>
                <select
                  value={targetStage}
                  onChange={(e) => setTargetStage(e.target.value as ContentStage)}
                  className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">No Stage Change</option>
                  <option value="internal_review">Move to Internal Review</option>
                  <option value="client_review">Move to Client Sign-off</option>
                  <option value="approved">Mark as Approved</option>
                  <option value="scheduled">Ready for Dispatch</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  2. Shift Schedule Date
                </label>
                <select
                  value={rescheduleDays}
                  onChange={(e) => setRescheduleDays(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500"
                >
                  <option value={0}>Keep Existing Date</option>
                  <option value={1}>Shift +1 Day Forward</option>
                  <option value={3}>Shift +3 Days Forward</option>
                  <option value={7}>Shift +1 Week Forward</option>
                  <option value={-1}>Shift -1 Day Backward</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  3. Batch Add Campaign Tags
                </label>
                <input
                  type="text"
                  placeholder="e.g. q4-push, flash-sale"
                  value={bulkTagInput}
                  onChange={(e) => setBulkTagInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleRunBulkAction}
                  disabled={isExecutingBulk || selectedPostIds.length === 0}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold py-2 px-3 rounded-lg text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                >
                  {isExecutingBulk ? (
                    <>
                      <Zap className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating {selectedPostIds.length} Posts...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Execute on {selectedPostIds.length} Posts</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-800">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => {
                  const isChecked = selectedPostIds.includes(post.id);
                  const client = scopedClients.find(c => c.id === post.clientId);

                  return (
                    <div
                      key={post.id}
                      onClick={() => handleToggleSelectPost(post.id)}
                      className={`p-4 transition-colors flex items-center justify-between gap-4 cursor-pointer ${
                        isChecked ? 'bg-indigo-950/20' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSelectPost(post.id);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-600" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white truncate max-w-md">
                              {post.title}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-slate-950 text-slate-300 border border-slate-800">
                              {client?.name || 'Brand'}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">
                              {post.stage.replace('_', ' ')}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 truncate mt-1">
                            {post.caption}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 text-xs text-slate-400">
                        <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{post.scheduledDate ? new Date(post.scheduledDate).toLocaleDateString() : 'Unscheduled'}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {post.platforms.map(plat => (
                            <span key={plat} className="text-[10px] bg-slate-950 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800 capitalize font-mono">
                              {plat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No deliverables found matching your filter criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Quick-Draft Scratchpad & Sticky Ideas */}
      {activeTab === 'scratchpad' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Create Note Form */}
          <div className="lg:col-span-4 space-y-5">
            <form onSubmit={handleCreateNote} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-indigo-400" />
                  New Quick Draft Note
                </h3>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Auto-Saved
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Idea / Post Hook Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Purple Tea Anthocyanin Infographic"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Associated Client Brand (Optional)
                </label>
                <select
                  value={noteClientId}
                  onChange={(e) => setNoteClientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">General Agency Idea</option>
                  {scopedClients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Quick Brainstorm Content / Raw Copy
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste rough copy, bullet points, statistics, or creative angle notes..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="reel-idea, case-study, b-roll"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Color Tag Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Note Color Token
                </label>
                <div className="flex items-center gap-2">
                  {(['indigo', 'emerald', 'amber', 'rose', 'slate'] as const).map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNoteColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        noteColor === color ? 'border-white scale-110' : 'border-transparent'
                      } ${
                        color === 'indigo' ? 'bg-indigo-500' :
                        color === 'emerald' ? 'bg-emerald-500' :
                        color === 'amber' ? 'bg-amber-500' :
                        color === 'rose' ? 'bg-rose-500' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save to Scratchpad</span>
              </button>
            </form>
          </div>

          {/* Right Column: Scratchpad Sticky Grid */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Scratchpad Ideas & Unstructured Copy ({scopedQuickNotes.length})
              </h3>
              <span className="text-[11px] text-slate-400">1-Click Convert to Content Composer Draft</span>
            </div>

            {scopedQuickNotes.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white mb-1">Your scratchpad is empty</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Jot down raw campaign angles, quick copy snippets, or creative hooks on the left to easily push them to the Content Composer later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scopedQuickNotes.map((note) => {
                  const client = scopedClients.find(c => c.id === note.targetClientId);

                  return (
                    <div
                      key={note.id}
                      className={`rounded-2xl p-5 border shadow-sm transition-all flex flex-col justify-between ${
                        note.color === 'emerald' ? 'bg-emerald-950/20 border-emerald-800/40' :
                        note.color === 'amber' ? 'bg-amber-950/20 border-amber-800/40' :
                        note.color === 'rose' ? 'bg-rose-950/20 border-rose-800/40' :
                        note.color === 'indigo' ? 'bg-indigo-950/20 border-indigo-800/40' :
                        'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-950/80 text-slate-300 border border-slate-800">
                            {client ? client.name : 'General Idea'}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteQuickNote(note.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                            title="Delete Note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="text-sm font-bold text-white leading-snug">
                          {note.title}
                        </h4>

                        <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                          {note.content}
                        </p>

                        <div className="flex flex-wrap gap-1">
                          {note.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleConvertNote(note)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-sm"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send to Composer</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Keyboard Shortcuts Cheatsheet */}
      {activeTab === 'shortcuts' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-indigo-400" />
                Power Operator Keyboard Shortcuts Map
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Navigate the entire agency workspace at lightspeed without touching your mouse.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Category: Global Navigation */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Global Search & Launchers
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Command Palette</span>
                    <kbd className="bg-slate-900 border border-slate-750 px-2 py-0.5 rounded text-[11px] font-mono text-white">Cmd + K</kbd>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Quick Slash Search</span>
                    <kbd className="bg-slate-900 border border-slate-750 px-2 py-0.5 rounded text-[11px] font-mono text-white">/</kbd>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>New Content Draft</span>
                    <kbd className="bg-slate-900 border border-slate-750 px-2 py-0.5 rounded text-[11px] font-mono text-white">C</kbd>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Close Active Modal</span>
                    <kbd className="bg-slate-900 border border-slate-750 px-2 py-0.5 rounded text-[11px] font-mono text-white">ESC</kbd>
                  </div>
                </div>
              </div>

              {/* Category: Quick Jump Destinations */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Jump Navigation ("G" then...)
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Executive Dashboard</span>
                    <kbd className="bg-slate-900 border border-slate-750 px-2 py-0.5 rounded text-[11px] font-mono text-white">G then D</kbd>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Calendar Matrix</span>
                    <kbd className="bg-slate-900 border border-slate-750 px-2 py-0.5 rounded text-[11px] font-mono text-white">G then C</kbd>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Editorial Kanban</span>
                    <kbd className="bg-slate-900 border border-slate-750 px-2 py-0.5 rounded text-[11px] font-mono text-white">G then K</kbd>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Social Inbox & Triage</span>
                    <kbd className="bg-slate-900 border border-slate-750 px-2 py-0.5 rounded text-[11px] font-mono text-white">G then I</kbd>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>AI Strategy Studio</span>
                    <kbd className="bg-slate-900 border border-slate-750 px-2 py-0.5 rounded text-[11px] font-mono text-white">G then S</kbd>
                  </div>
                </div>
              </div>

              {/* Category: Workflow & Approvals */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Workflow & Bulk Operations
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Select Multiple Posts</span>
                    <kbd className="bg-slate-900 border border-slate-750 px-2 py-0.5 rounded text-[11px] font-mono text-white">Click Checkbox</kbd>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Batch Stage Transition</span>
                    <kbd className="bg-slate-900 border border-slate-750 px-2 py-0.5 rounded text-[11px] font-mono text-white">Action Menu</kbd>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Batch Date Shifter</span>
                    <kbd className="bg-slate-900 border border-slate-750 px-2 py-0.5 rounded text-[11px] font-mono text-white">+1d / +3d / +7d</kbd>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Quick Scratchpad Note</span>
                    <kbd className="bg-slate-900 border border-slate-750 px-2 py-0.5 rounded text-[11px] font-mono text-white">Cmd + N</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
