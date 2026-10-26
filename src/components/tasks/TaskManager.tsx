/**
 * PulseBrand Agency OS - Task & Project Management
 * Phase 16: Task & Project Management
 * Agency task boards with sprint swimlanes (Todo, In Progress, In Review, Done),
 * checklist items with sub-task progress, urgent SLA countdown badges,
 * direct links between tasks and post drafts, and assigned staff workload indicators.
 */

import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { AgencyTask, TaskSubItem } from '../../types';
import {
  CheckSquare,
  Building2,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Filter,
  User,
  Layers,
  ArrowRight,
  ExternalLink,
  Flame,
  Check,
  Trash2,
  Edit2,
  ChevronRight,
  FileText,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface SprintColumn {
  id: AgencyTask['status'];
  label: string;
  badgeColor: string;
  description: string;
}

const SPRINT_COLUMNS: SprintColumn[] = [
  {
    id: 'todo',
    label: 'Backlog & Ready',
    badgeColor: 'border-slate-700 bg-slate-900/80 text-slate-300',
    description: 'Sprint items queued for pickup'
  },
  {
    id: 'in_progress',
    label: 'Active Sprint Execution',
    badgeColor: 'border-indigo-800/60 bg-indigo-950/40 text-indigo-300',
    description: 'Currently on creative workbench'
  },
  {
    id: 'in_review',
    label: 'Internal QA & Proofing',
    badgeColor: 'border-amber-800/60 bg-amber-950/40 text-amber-300',
    description: 'Lead review before client lock'
  },
  {
    id: 'done',
    label: 'Completed & Verified',
    badgeColor: 'border-emerald-800/60 bg-emerald-950/40 text-emerald-300',
    description: 'Delivered and audit approved'
  }
];

export const TaskManager: React.FC = () => {
  const {
    workspace,
    currentUser,
    clients,
    tasks,
    contentItems,
    campaigns,
    users,
    createAgencyTask,
    updateAgencyTask,
    deleteAgencyTask,
    toggleTaskSubItem,
    transitionTaskStatus,
    addToast
  } = useAgency();

  // Filters & State
  const scopedClients = clients.filter(c => c.tenantId === workspace.id);
  const scopedUsers = users.filter(u => u.tenantId === workspace.id);
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // New Task Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newClientId, setNewClientId] = useState<string>(scopedClients[0]?.id || '');
  const [newAssignedUserId, setNewAssignedUserId] = useState<string>(scopedUsers[0]?.id || currentUser.id);
  const [newPriority, setNewPriority] = useState<AgencyTask['priority']>('medium');
  const [newCategory, setNewCategory] = useState<AgencyTask['category']>('creative_production');
  const [newDueDate, setNewDueDate] = useState<string>('2026-09-28T18:00:00Z');
  const [newEstimatedHours, setNewEstimatedHours] = useState<number>(4);
  const [newChecklistText, setNewChecklistText] = useState<string>('Review brand tone guidelines, Export assets in target ratio');

  // Filter scoped tasks
  const filteredTasks = tasks.filter(t => {
    if (t.tenantId !== workspace.id) return false;
    if (selectedClientId !== 'all' && t.clientId !== selectedClientId) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (assigneeFilter !== 'all' && t.assignedToUserId !== assigneeFilter) return false;
    return true;
  });

  const activeTask = tasks.find(t => t.id === activeTaskId) || null;
  const activeTaskClient = activeTask ? scopedClients.find(c => c.id === activeTask.clientId) : null;
  const activeTaskContent = activeTask?.contentId ? contentItems.find(p => p.id === activeTask.contentId) : null;

  // SLA Calculation Helper
  const getSlaStatus = (dueDateStr: string) => {
    const dueTime = new Date(dueDateStr).getTime();
    const now = new Date('2026-09-24T12:00:00Z').getTime(); // Current simulation anchor
    const diffHours = (dueTime - now) / (1000 * 60 * 60);

    if (diffHours < 0) {
      return { label: 'SLA Overdue', color: 'bg-red-500/20 text-red-400 border-red-500/40', isUrgent: true };
    } else if (diffHours <= 24) {
      return { label: `${Math.round(diffHours)}h SLA Gate`, color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', isUrgent: true };
    } else {
      return { label: `${Math.round(diffHours / 24)}d Remaining`, color: 'bg-slate-800 text-slate-400 border-slate-700', isUrgent: false };
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: AgencyTask['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId) return;

    const item = tasks.find(t => t.id === taskId);
    if (!item || item.status === targetStatus) return;

    transitionTaskStatus(taskId, targetStatus);
    setDraggedTaskId(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      addToast('Validation Error', 'Task title is required', 'error');
      return;
    }

    const assignedUser = scopedUsers.find(u => u.id === newAssignedUserId) || currentUser;

    createAgencyTask({
      tenantId: workspace.id,
      clientId: newClientId || scopedClients[0]?.id || 'client_01',
      assignedToUserId: assignedUser.id,
      assignedToUserName: assignedUser.name,
      assignedToUserRole: assignedUser.role.replace('_', ' '),
      title: newTitle.trim(),
      description: newDescription.trim() || 'No detailed scope provided.',
      priority: newPriority,
      status: 'todo',
      dueDate: newDueDate,
      category: newCategory,
      estimatedHours: Number(newEstimatedHours),
      actualHours: 0,
      checklist: newChecklistText.split(',').map((item, idx) => ({
        id: `chk_${Date.now()}_${idx}`,
        title: item.trim(),
        completed: false
      })).filter(i => Boolean(i.title))
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>{workspace.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Task & Project Management</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">{filteredTasks.length} Active Sprint Tickets</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Agency Sprint Kanban & SLA Enforcement</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Multi-stage agency task management across copy, design, video editing, and client approvals.
            Track granular sub-task checklists, internal proofing deadlines, and direct links to post deliverables.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/30"
          >
            <Plus className="w-4 h-4" />
            <span>Create Sprint Task</span>
          </button>
        </div>
      </div>

      {/* SLA Metric Pulse Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Total Sprint Backlog</span>
            <Layers className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{filteredTasks.length} Tasks</div>
          <div className="text-[10px] text-slate-500">{filteredTasks.filter(t => t.status === 'done').length} verified completed</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Critical SLA Deadlines</span>
            <Flame className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-xl font-bold text-red-400 font-mono">
            {filteredTasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length} Urgent Gates
          </div>
          <div className="text-[10px] text-slate-500">Under 24 hours to client sign-off lock</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Proofing & QA Queue</span>
            <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono">
            {filteredTasks.filter(t => t.status === 'in_review').length} In QA Review
          </div>
          <div className="text-[10px] text-slate-500">Awaiting internal sign-off approval</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Capacity Utilization</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">
            {filteredTasks.reduce((acc, t) => acc + (t.actualHours || 0), 0).toFixed(1)} / {filteredTasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0)} hrs
          </div>
          <div className="text-[10px] text-slate-500">Tracked creative team sprint hours</div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
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

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer capitalize"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Staff Assignee Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Team Members ({scopedUsers.length})</option>
              {scopedUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role.replace('_', ' ')})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Sprint Mode: <strong className="text-white">Active (Nairobi EAT)</strong>
        </div>
      </div>

      {/* Visual Sprint Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1100px]">
          {SPRINT_COLUMNS.map(column => {
            const columnTasks = filteredTasks.filter(t => t.status === column.id);

            return (
              <div
                key={column.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
                className="flex-1 min-w-[260px] bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-3"
              >
                {/* Column Header */}
                <div className="space-y-1 pb-2 border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white tracking-wide">
                      {column.label}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${column.badgeColor}`}>
                      {columnTasks.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {column.description}
                  </p>
                </div>

                {/* Tasks Container */}
                <div className="space-y-2.5 flex-1 min-h-[440px] overflow-y-auto max-h-[600px] pr-0.5">
                  {columnTasks.length === 0 ? (
                    <div className="h-full flex items-center justify-center p-6 border border-dashed border-slate-800/80 rounded-lg text-slate-600 text-[11px] text-center italic">
                      Drag tickets here
                    </div>
                  ) : (
                    columnTasks.map(task => {
                      const client = scopedClients.find(c => c.id === task.clientId);
                      const sla = getSlaStatus(task.dueDate);
                      const isSelected = task.id === activeTaskId;
                      const completedCount = task.checklist?.filter(i => i.completed).length || 0;
                      const totalChecklist = task.checklist?.length || 0;

                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onClick={() => setActiveTaskId(task.id)}
                          className={`p-3.5 rounded-xl border cursor-grab active:cursor-grabbing transition-all space-y-2.5 text-xs shadow-md ${
                            isSelected
                              ? 'bg-slate-800 border-emerald-500 shadow-emerald-950/20 ring-1 ring-emerald-500/40'
                              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {/* Priority & SLA Badges */}
                          <div className="flex items-center justify-between gap-1.5">
                            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold border ${
                              task.priority === 'urgent'
                                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                                : task.priority === 'high'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}>
                              {task.priority}
                            </span>

                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${sla.color}`}>
                              {sla.label}
                            </span>
                          </div>

                          {/* Client Tag */}
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: client?.accentColor || '#10b981' }}
                            ></span>
                            <span className="font-bold text-[10px] text-slate-400 truncate">
                              {client?.name || 'Brand'}
                            </span>
                          </div>

                          {/* Task Title */}
                          <h4 className="font-bold text-white leading-snug line-clamp-2">
                            {task.title}
                          </h4>

                          {/* Checklist Progress Snippet */}
                          {totalChecklist > 0 && (
                            <div className="space-y-1 pt-1">
                              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                                <span>Checklist</span>
                                <span>{completedCount}/{totalChecklist} done</span>
                              </div>
                              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${(completedCount / totalChecklist) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Footer with Assignee and Hours */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                            <span className="flex items-center gap-1 truncate max-w-[130px]">
                              <User className="w-3 h-3 text-indigo-400 shrink-0" />
                              <span className="truncate">{task.assignedToUserName || 'Assignee'}</span>
                            </span>

                            <span>{task.estimatedHours}h est</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Drop Zone Footer Label */}
                <div className="text-[9px] font-mono text-slate-600 text-center py-1 bg-slate-950/40 rounded border border-slate-800/40">
                  Drop to change sprint status
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Task Deep Dive Drawer */}
      {activeTask && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6 shadow-2xl">
          {/* Active Task Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: activeTaskClient?.accentColor || '#10b981' }}
                ></span>
                <span className="text-xs font-mono text-slate-400 font-bold">
                  {activeTaskClient?.name} Task Ticket
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border bg-slate-800 text-emerald-300 border-emerald-800/30">
                  {activeTask.status.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {activeTask.title}
              </h2>
            </div>

            {/* Quick Status Advancement & Actions */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Move Status:</span>
              <select
                value={activeTask.status}
                onChange={(e) => transitionTaskStatus(activeTask.id, e.target.value as AgencyTask['status'])}
                className="bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-semibold px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {SPRINT_COLUMNS.map(col => (
                  <option key={col.id} value={col.id}>{col.label}</option>
                ))}
              </select>

              <button
                onClick={() => deleteAgencyTask(activeTask.id)}
                className="p-1.5 bg-slate-950 hover:bg-red-950/60 border border-slate-800 hover:border-red-800/40 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                title="Archive Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTaskId(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Two-Column Detail View: Left Meta & Subtasks (7 cols) + Right Linked Deliverable (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Task Specs & Sub-task Checklist (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Description */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Task Scope & Instructions</span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeTask.description}</p>
              </div>

              {/* Subtask Interactive Checklist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sub-task Deliverables Checklist</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {activeTask.checklist?.filter(i => i.completed).length} / {activeTask.checklist?.length || 0} completed
                  </span>
                </div>

                <div className="space-y-1.5">
                  {activeTask.checklist?.map(item => (
                    <div
                      key={item.id}
                      onClick={() => toggleTaskSubItem(activeTask.id, item.id)}
                      className={`p-2.5 rounded-lg border text-xs flex items-center gap-3 cursor-pointer transition-colors ${
                        item.completed
                          ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                          : 'bg-slate-950 border-slate-800 hover:border-emerald-500/50 text-slate-200'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        item.completed ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600'
                      }`}>
                        {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={item.completed ? 'line-through text-slate-500' : 'font-medium'}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Assigned Staff, Hours & Linked Post Draft (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Assignee & Capacity Card */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                <span className="text-[10px] text-slate-500 uppercase block">Ticket Assignment</span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-300 font-bold">
                      {activeTask.assignedToUserName?.substring(0, 2).toUpperCase() || 'PB'}
                    </div>
                    <div>
                      <div className="font-bold text-white font-sans">{activeTask.assignedToUserName}</div>
                      <div className="text-[10px] text-slate-400">{activeTask.assignedToUserRole}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold block">{activeTask.estimatedHours} Hours</span>
                    <span className="text-[10px] text-slate-500">{activeTask.actualHours || 0}h logged</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Deadline:</span>
                  <span className="text-white font-bold">{new Date(activeTask.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} EAT</span>
                </div>
              </div>

              {/* Linked Post Deliverable Card */}
              {activeTaskContent ? (
                <div className="p-3.5 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-emerald-400 uppercase font-bold flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>Linked Content Item</span>
                    </span>
                    <span className="text-slate-400 uppercase">{activeTaskContent.stage.replace('_', ' ')}</span>
                  </div>

                  <h4 className="font-bold text-white text-xs line-clamp-1">{activeTaskContent.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">{activeTaskContent.caption}</p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="capitalize">{activeTaskContent.platforms.join(', ')}</span>
                    <span className="text-slate-400">ID: {activeTaskContent.id}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-500 italic text-center">
                  Independent administrative task (no post draft bound).
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Sprint Task Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>Create Agency Sprint Ticket</span>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Color Grade Video Reel for Karura Forest Meetup"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Client Brand *</label>
                  <select
                    value={newClientId}
                    onChange={(e) => setNewClientId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {scopedClients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Assignee</label>
                  <select
                    value={newAssignedUserId}
                    onChange={(e) => setNewAssignedUserId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {scopedUsers.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role.replace('_', ' ')})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as AgencyTask['priority'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 capitalize"
                  >
                    <option value="urgent">Urgent (24h SLA)</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    value={newEstimatedHours}
                    onChange={(e) => setNewEstimatedHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Scope & Instructions</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Specific creative requirements, line item proofing guidelines, etc."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Checklist Items (Comma-separated)</label>
                <input
                  type="text"
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  placeholder="Step 1, Step 2, Step 3"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Queue Task Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
