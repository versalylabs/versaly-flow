/**
 * Versaly Flow - Workflow Automation Engine
 * Phase 23: Workflow Automation
 * Visual trigger-condition-action rule engine, automated client review reminders,
 * auto-tagging, Slack/Email webhooks dispatcher, and execution telemetry logs.
 */

import React, { useState, useMemo } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  WorkflowRule,
  WorkflowExecutionLog,
  WorkflowTriggerType,
  WorkflowActionType,
  WorkflowCondition
} from '../../types';
import {
  Zap,
  Play,
  Pause,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Send,
  Hash,
  Mail,
  MessageSquare,
  Sparkles,
  Search,
  Filter,
  Layers,
  ChevronRight,
  X,
  Check,
  Building2,
  ExternalLink,
  Shield,
  Activity
} from 'lucide-react';

const TRIGGER_META: Record<WorkflowTriggerType, { label: string; desc: string; icon: any; color: string; bg: string }> = {
  approval_delayed: {
    label: 'Approval SLA Delayed (>24h)',
    desc: 'When content review exceeds standard turnaround threshold',
    icon: Clock,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30'
  },
  post_created: {
    label: 'New Content Item Drafted',
    desc: 'When a creator saves a new post in the composer',
    icon: Sparkles,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/30'
  },
  client_approved: {
    label: 'Client Sign-off Confirmed',
    desc: 'When external brand approver signs off on draft',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30'
  },
  urgent_inbox_message: {
    label: 'Urgent Social Inquiry Received',
    desc: 'When incoming DM or comment has Urgent sentiment',
    icon: AlertTriangle,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/30'
  },
  deal_won: {
    label: 'High-Value Won CRM Deal',
    desc: 'When sales prospect deal transitions to Won status',
    icon: Building2,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/30'
  },
  retainer_warning: {
    label: 'Retainer Capacity >85% Warning',
    desc: 'When client monthly hours approach agreed cap',
    icon: Activity,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/30'
  }
};

const ACTION_META: Record<WorkflowActionType, { label: string; icon: any; color: string }> = {
  send_slack_webhook: { label: 'Dispatch Slack Webhook', icon: Send, color: 'text-pink-400' },
  send_email_reminder: { label: 'Send Email Notification', icon: Mail, color: 'text-blue-400' },
  auto_tag_post: { label: 'Inject Campaign Hashtags', icon: Hash, color: 'text-cyan-400' },
  assign_team_member: { label: 'Reassign Team Member', icon: Building2, color: 'text-indigo-400' },
  create_agency_task: { label: 'Generate Sprint Task', icon: Layers, color: 'text-emerald-400' },
  escalate_inbox_ticket: { label: 'Escalate to Urgent SLA', icon: AlertTriangle, color: 'text-rose-400' }
};

export const WorkflowAutomationManager: React.FC = () => {
  const {
    workspace,
    currentUser,
    workflowRules,
    workflowLogs,
    createWorkflowRule,
    updateWorkflowRule,
    deleteWorkflowRule,
    toggleWorkflowRule,
    runWorkflowRuleManualTest,
    addToast
  } = useAgency();

  // Active Tab: 'rules' | 'logs'
  const [activeTab, setActiveTab] = useState<'rules' | 'logs'>('rules');
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerFilter, setTriggerFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State: Create Rule
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [newRuleTrigger, setNewRuleTrigger] = useState<WorkflowTriggerType>('post_created');
  const [newRuleField, setNewRuleField] = useState<WorkflowCondition['field']>('captionText');
  const [newRuleOperator, setNewRuleOperator] = useState<WorkflowCondition['operator']>('contains');
  const [newRuleValue, setNewRuleValue] = useState('organic');
  const [newRuleActionType, setNewRuleActionType] = useState<WorkflowActionType>('auto_tag_post');
  const [newRuleChannel, setNewRuleChannel] = useState('#agency-alerts');
  const [newRuleWebhook, setNewRuleWebhook] = useState('https://hooks.slack.com/services/T01/B02/VERSALY');
  const [newRuleTags, setNewRuleTags] = useState('sustainable_ke, east_africa_agro');

  // Scoped Data by active workspace
  const scopedRules = useMemo(() => workflowRules.filter(r => r.tenantId === workspace.id), [workflowRules, workspace.id]);
  const scopedLogs = useMemo(() => workflowLogs.filter(l => l.tenantId === workspace.id), [workflowLogs, workspace.id]);

  // Filtered Rules
  const filteredRules = useMemo(() => {
    return scopedRules.filter(r => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTrigger = triggerFilter === 'all' || r.trigger === triggerFilter;
      return matchesSearch && matchesTrigger;
    });
  }, [scopedRules, searchQuery, triggerFilter]);

  // Statistics
  const stats = useMemo(() => {
    const activeCount = scopedRules.filter(r => r.isActive).length;
    const totalRuns = scopedRules.reduce((sum, r) => sum + r.executionCount, 0);
    const successLogs = scopedLogs.filter(l => l.status === 'success').length;
    const hoursSaved = Math.round(totalRuns * 0.4); // approx 24 mins saved per automation

    return { activeCount, totalRuns, successLogs, hoursSaved };
  }, [scopedRules, scopedLogs]);

  // Handle Form Submit
  const handleCreateRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) {
      addToast('Validation', 'Please provide a rule name', 'error');
      return;
    }

    const tagsArray = newRuleTags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    createWorkflowRule({
      tenantId: workspace.id,
      name: newRuleName.trim(),
      description: newRuleDesc.trim() || 'Custom automated trigger-condition-action workflow.',
      isActive: true,
      trigger: newRuleTrigger,
      conditions: [
        {
          id: `cond_${Date.now()}`,
          field: newRuleField,
          operator: newRuleOperator,
          value: newRuleValue
        }
      ],
      actions: [
        {
          id: `act_${Date.now()}`,
          type: newRuleActionType,
          parameters: {
            channelName: newRuleChannel,
            webhookUrl: newRuleWebhook,
            tagsToApply: tagsArray,
            messageTemplate: `Automated alert triggered from Versaly Flow: ${newRuleName}`
          }
        }
      ]
    });

    setShowCreateModal(false);
    setNewRuleName('');
    setNewRuleDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-violet-500/20 to-indigo-500/20 border border-violet-500/30 text-violet-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Workflow Automation</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  Operational
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Visual trigger-condition-action rule engine, automated client review reminders, auto-tagging, and Slack webhooks.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-violet-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Automation Rule</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm hover:border-violet-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Rules</span>
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats.activeCount} <span className="text-xs font-normal text-slate-400">/ {workflowRules.length} armed</span>
          </div>
          <div className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> 100% Sentinel Health
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Trigger Runs</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats.totalRuns.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>Logged across all events</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Successful Actions</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">
            {stats.successLogs} <span className="text-xs font-normal text-slate-400">audit logs</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>Slack & Webhook Dispatches</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Estimated Time Saved</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400 tracking-tight">
            ~{stats.hoursSaved} hrs <span className="text-xs font-normal text-slate-400">this month</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>Automated manual review triage</span>
          </div>
        </div>
      </div>

      {/* Sub-view Navigation Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center space-x-2 py-3 px-5 border-b-2 font-medium text-sm transition-all ${
            activeTab === 'rules'
              ? 'border-violet-500 text-violet-400 bg-violet-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Automation Rules ({workflowRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center space-x-2 py-3 px-5 border-b-2 font-medium text-sm transition-all ${
            activeTab === 'logs'
              ? 'border-violet-500 text-violet-400 bg-violet-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Execution Telemetry Logs ({scopedLogs.length})</span>
        </button>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search rule names, webhooks, tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          {activeTab === 'rules' && (
            <select
              value={triggerFilter}
              onChange={e => setTriggerFilter(e.target.value)}
              className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-violet-500 capitalize"
            >
              <option value="all">All Triggers</option>
              <option value="approval_delayed">Approval SLA Delay</option>
              <option value="post_created">Post Created</option>
              <option value="client_approved">Client Approved</option>
              <option value="urgent_inbox_message">Urgent Inbox SLA</option>
              <option value="deal_won">Won CRM Deal</option>
            </select>
          )}
        </div>

        <div className="text-xs text-slate-400">
          Showing {activeTab === 'rules' ? filteredRules.length : scopedLogs.length} items
        </div>
      </div>

      {/* TAB 1: AUTOMATION RULES LIST */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRules.map(rule => {
            const trig = TRIGGER_META[rule.trigger];
            const TrigIcon = trig?.icon || Zap;

            return (
              <div
                key={rule.id}
                className={`rounded-2xl border p-5 transition-all shadow-sm flex flex-col justify-between ${
                  rule.isActive
                    ? 'bg-slate-900/80 border-slate-800 hover:border-violet-500/40'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-75'
                }`}
              >
                <div>
                  {/* Top Bar: Trigger Tag & Toggle Switch */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${trig?.bg} ${trig?.color}`}>
                      <TrigIcon className="w-3.5 h-3.5" />
                      <span>{trig?.label}</span>
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleWorkflowRule(rule.id)}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          rule.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                        }`}
                      >
                        {rule.isActive ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                        <span>{rule.isActive ? 'Active' : 'Paused'}</span>
                      </button>

                      <button
                        onClick={() => deleteWorkflowRule(rule.id)}
                        title="Delete Rule"
                        className="p-1 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-white text-base tracking-tight mb-1">{rule.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{rule.description}</p>

                  {/* Visual If-This-Then-That Flow Matrix */}
                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-2 mb-4 text-xs font-mono">
                    {/* Condition */}
                    {rule.conditions.map(cond => (
                      <div key={cond.id} className="flex items-center space-x-2 text-slate-300">
                        <span className="text-violet-400 font-bold">IF</span>
                        <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">{cond.field}</span>
                        <span className="text-slate-500">{cond.operator.replace('_', ' ')}</span>
                        <span className="text-emerald-400 font-bold">"{cond.value}"</span>
                      </div>
                    ))}

                    {/* Actions */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
                      {rule.actions.map(act => {
                        const actMeta = ACTION_META[act.type];
                        const ActIcon = actMeta?.icon || ArrowRight;

                        return (
                          <div key={act.id} className="flex items-center space-x-2 text-slate-300">
                            <span className="text-cyan-400 font-bold">THEN</span>
                            <span className="flex items-center space-x-1 text-slate-200">
                              <ActIcon className={`w-3.5 h-3.5 ${actMeta?.color || 'text-cyan-400'}`} />
                              <span>{actMeta?.label}</span>
                            </span>
                            {act.parameters.channelName && (
                              <span className="text-pink-400 text-[11px] font-sans">({act.parameters.channelName})</span>
                            )}
                            {act.parameters.tagsToApply && (
                              <span className="text-emerald-400 text-[11px] font-sans">
                                +{act.parameters.tagsToApply.length} tags
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Telemetry & Manual Test Trigger */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-3">
                    <span>Fired: <strong className="text-white">{rule.executionCount}x</strong></span>
                    {rule.lastExecutedAt && (
                      <span>Last: <span className="text-slate-300">{new Date(rule.lastExecutedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span>
                    )}
                  </div>

                  <button
                    onClick={() => runWorkflowRuleManualTest(rule.id)}
                    className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold transition"
                  >
                    <Play className="w-3 h-3 text-violet-400" />
                    <span>Simulate Run</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: EXECUTION TELEMETRY LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Rule Name</th>
                  <th className="py-3 px-4">Trigger</th>
                  <th className="py-3 px-4">Target Entity / Context</th>
                  <th className="py-3 px-4">Action Details</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {scopedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No automation logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  scopedLogs.map(log => {
                    const trig = TRIGGER_META[log.trigger];

                    return (
                      <tr key={log.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">
                          {log.ruleName}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${trig?.bg} ${trig?.color}`}>
                            {trig?.label || log.trigger}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {log.targetEntityName}
                        </td>
                        <td className="py-3 px-4 text-slate-400 max-w-sm">
                          {log.details}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Check className="w-3 h-3 mr-1" /> Success
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
      )}

      {/* MODAL: CREATE WORKFLOW AUTOMATION RULE */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-800/40">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">New Workflow Automation Rule</h3>
                  <p className="text-xs text-slate-400">Configure trigger-condition-action logic with webhooks & tags</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRuleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Rule Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Notify Slack on Client Review SLA Overrun"
                  value={newRuleName}
                  onChange={e => setNewRuleName(e.target.value)}
                  className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Brief summary of what this automation enforces..."
                  value={newRuleDesc}
                  onChange={e => setNewRuleDesc(e.target.value)}
                  className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* STEP 1: WHEN (Trigger) */}
              <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-2">
                <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider block">
                  1. When Event Occurs (Trigger)
                </span>
                <select
                  value={newRuleTrigger}
                  onChange={e => setNewRuleTrigger(e.target.value as WorkflowTriggerType)}
                  className="w-full text-xs bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="post_created">When a new content item is drafted</option>
                  <option value="approval_delayed">When client review delayed &gt; 24 hours</option>
                  <option value="client_approved">When client sign-off is confirmed</option>
                  <option value="urgent_inbox_message">When an urgent social inquiry arrives</option>
                  <option value="deal_won">When a CRM prospect deal is marked Won</option>
                  <option value="retainer_warning">When client monthly retainer approaches cap</option>
                </select>
              </div>

              {/* STEP 2: IF (Condition) */}
              <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-2">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                  2. If Condition Matches
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={newRuleField}
                    onChange={e => setNewRuleField(e.target.value as any)}
                    className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="captionText">Caption Text</option>
                    <option value="pendingHours">Pending Hours</option>
                    <option value="dealValue">Deal Value</option>
                    <option value="sentiment">Sentiment</option>
                    <option value="platform">Platform</option>
                  </select>

                  <select
                    value={newRuleOperator}
                    onChange={e => setNewRuleOperator(e.target.value as any)}
                    className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="contains">contains</option>
                    <option value="equals">equals</option>
                    <option value="greater_than">greater than</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Value..."
                    value={newRuleValue}
                    onChange={e => setNewRuleValue(e.target.value)}
                    className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* STEP 3: THEN (Action) */}
              <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-2">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  3. Then Perform Action
                </span>
                <select
                  value={newRuleActionType}
                  onChange={e => setNewRuleActionType(e.target.value as WorkflowActionType)}
                  className="w-full text-xs bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="send_slack_webhook">Dispatch Slack Webhook Alert</option>
                  <option value="auto_tag_post">Auto-Inject Campaign Hashtags</option>
                  <option value="send_email_reminder">Send Automated Email Reminder</option>
                  <option value="create_agency_task">Create Agency Sprint Task</option>
                  <option value="escalate_inbox_ticket">Escalate to Urgent SLA Sentinel</option>
                </select>

                {newRuleActionType === 'send_slack_webhook' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Slack Channel (#alerts)"
                      value={newRuleChannel}
                      onChange={e => setNewRuleChannel(e.target.value)}
                      className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Webhook URL..."
                      value={newRuleWebhook}
                      onChange={e => setNewRuleWebhook(e.target.value)}
                      className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                {newRuleActionType === 'auto_tag_post' && (
                  <div className="pt-1">
                    <input
                      type="text"
                      placeholder="Comma-separated tags (e.g. coffee, kenya_coffee)"
                      value={newRuleTags}
                      onChange={e => setNewRuleTags(e.target.value)}
                      className="w-full text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-violet-500/20 transition"
                >
                  Create & Activate Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
