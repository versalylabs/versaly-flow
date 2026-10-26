/**
 * PulseBrand Agency OS - Team & Resource Allocation Center
 * Phase 09: Team & Resource Allocation
 * Localized for East African Creative Agency Roster & Workload Governance (Nairobi HQ)
 */

import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { User, Role } from '../../types';
import {
  Users,
  UserPlus,
  Shield,
  Clock,
  Briefcase,
  Layers,
  Sparkles,
  Search,
  SlidersHorizontal,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Plus,
  Trash2,
  Send,
  Zap,
  Tag,
  Flame,
  Check,
  Award
} from 'lucide-react';

export const TeamAllocation: React.FC = () => {
  const {
    workspace,
    currentUser,
    capabilities,
    users,
    clients,
    contentItems,
    tasks,
    assignClientToUser,
    unassignClientFromUser,
    inviteTeamMember,
    updateUserCapacity,
    addToast
  } = useAgency();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser.id);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Invite Form State
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('content_creator');
  const [inviteJobTitle, setInviteJobTitle] = useState('');
  const [inviteSkills, setInviteSkills] = useState('Short-form Video, Swahili Copy, Carousel Design');

  // Scoped users for active agency workspace
  const scopedUsers = users.filter(u => u.tenantId === workspace.id);
  const scopedClients = clients.filter(c => c.tenantId === workspace.id);

  // Filtering users
  const filteredUsers = scopedUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.jobTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.skills || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const selectedUser = scopedUsers.find(u => u.id === selectedUserId) || scopedUsers[0] || currentUser;

  // Selected User's assigned clients
  const userAssignedClients = scopedClients.filter(c => (selectedUser.assignedClientIds || []).includes(c.id));
  const unassignedClientsForUser = scopedClients.filter(c => !(selectedUser.assignedClientIds || []).includes(c.id));

  // Selected User's assigned tasks
  const userTasks = tasks.filter(t => t.assignedToUserId === selectedUser.id);

  // Capacity calculations
  const totalWorkspaceCapacity = scopedUsers.reduce((sum, u) => sum + (u.maxWeeklyCapacityHours || 40), 0);
  const totalWorkspaceAllocated = scopedUsers.reduce((sum, u) => sum + (u.currentAllocatedHours || 0), 0);
  const workspaceCapacityPercent = totalWorkspaceCapacity > 0 ? Math.round((totalWorkspaceAllocated / totalWorkspaceCapacity) * 100) : 0;

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      addToast('Validation Error', 'Name and email are required', 'error');
      return;
    }

    const skills = inviteSkills.split(',').map(s => s.trim()).filter(Boolean);
    inviteTeamMember({
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      jobTitle: inviteJobTitle.trim() || undefined,
      skills
    });

    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInviteJobTitle('');
  };

  const handleCapacitySliderChange = (userId: string, newAllocated: number) => {
    const targetUser = scopedUsers.find(u => u.id === userId);
    if (!targetUser) return;
    updateUserCapacity(userId, targetUser.maxWeeklyCapacityHours || 40, newAllocated);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>{workspace.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Team & Capacity Allocation</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">{scopedUsers.length} Team Members</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Team Roster, Workload & Client Assignments</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Capacity management, skill matrix tagging, workload balancing across creative leads, and instantaneous brand account reassignments.
          </p>
        </div>

        {/* Global Capacity Meter & Action Button */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs space-y-1">
            <div className="flex justify-between items-center gap-4">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Roster Bandwidth</span>
              <span className="font-mono text-emerald-400 font-bold">{workspaceCapacityPercent}% Booked</span>
            </div>
            <div className="w-28 bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  workspaceCapacityPercent > 90 ? 'bg-red-500' : workspaceCapacityPercent > 75 ? 'bg-amber-400' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(workspaceCapacityPercent, 100)}%` }}
              ></div>
            </div>
          </div>

          {capabilities.canInviteMembers && (
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/30"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Team Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Team Directory (5 cols) & Member Workload Dossier (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Team Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, role, or skill tag..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Role Filter Chips */}
            <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All Roles' },
                { id: 'agency_owner', label: 'Owners' },
                { id: 'account_manager', label: 'Managers' },
                { id: 'content_creator', label: 'Creators' },
                { id: 'client_approver', label: 'Clients' }
              ].map(rf => (
                <button
                  key={rf.id}
                  onClick={() => setRoleFilter(rf.id)}
                  className={`px-2.5 py-1 rounded-md font-mono transition-colors whitespace-nowrap ${
                    roleFilter === rf.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
                  }`}
                >
                  {rf.label}
                </button>
              ))}
            </div>

            {/* Team Roster List */}
            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No team members match your criteria.
                </div>
              ) : (
                filteredUsers.map(member => {
                  const isSelected = member.id === selectedUser.id;
                  const maxH = member.maxWeeklyCapacityHours || 40;
                  const allocH = member.currentAllocatedHours || 0;
                  const loadPercent = Math.round((allocH / maxH) * 100);
                  const isOverloaded = loadPercent >= 90;

                  return (
                    <div
                      key={member.id}
                      onClick={() => setSelectedUserId(member.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all space-y-2.5 ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-950/20'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400">
                            {member.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-white truncate max-w-[170px]">
                              {member.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                              {member.jobTitle || member.role.replace('_', ' ').toUpperCase()}
                            </div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                          member.role === 'agency_owner'
                            ? 'bg-purple-950/60 text-purple-300 border-purple-800/40'
                            : member.role === 'account_manager'
                            ? 'bg-blue-950/60 text-blue-300 border-blue-800/40'
                            : member.role === 'content_creator'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {member.role.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Skills Chips */}
                      {member.skills && member.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {member.skills.slice(0, 3).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {member.skills.length > 3 && (
                            <span className="text-[9px] font-mono text-slate-500">
                              +{member.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Workload Capacity Bar */}
                      <div className="space-y-1 pt-1.5 border-t border-slate-800/60">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-400">Weekly Workload:</span>
                          <span className={isOverloaded ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                            {allocH} / {maxH} hrs ({loadPercent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isOverloaded ? 'bg-red-500' : loadPercent > 70 ? 'bg-amber-400' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(loadPercent, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Member Workload Dossier & Account Assignor (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {selectedUser && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
              {/* Member Profile Banner */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-base shrink-0">
                    {selectedUser.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">{selectedUser.name}</h2>
                      <span className="text-[10px] font-mono uppercase bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
                        {selectedUser.role.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{selectedUser.jobTitle || 'Team Member'}</div>
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-2">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Mail className="w-3 h-3 text-emerald-400" />
                        <span>{selectedUser.email}</span>
                      </span>
                      {selectedUser.phoneNumber && (
                        <span className="flex items-center gap-1 text-slate-300">
                          <Phone className="w-3 h-3 text-teal-400" />
                          <span>{selectedUser.phoneNumber}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-right space-y-1">
                  <div className="text-[10px] uppercase font-mono text-slate-400">Assigned Clients</div>
                  <div className="text-xl font-bold font-mono text-white">
                    {userAssignedClients.length} <span className="text-xs text-slate-400">brands</span>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400">
                    {userTasks.length} Active Tasks
                  </div>
                </div>
              </div>

              {/* Workload Capacity Calibration Slider */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Weekly Capacity Allocation Calibration</span>
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {selectedUser.currentAllocatedHours || 0} / {selectedUser.maxWeeklyCapacityHours || 40} Hours
                  </span>
                </div>

                <div className="space-y-1.5">
                  <input
                    type="range"
                    min="0"
                    max={selectedUser.maxWeeklyCapacityHours || 40}
                    value={selectedUser.currentAllocatedHours || 0}
                    onChange={(e) => handleCapacitySliderChange(selectedUser.id, Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>0h (Completely Free)</span>
                    <span>20h (Half Load)</span>
                    <span>{selectedUser.maxWeeklyCapacityHours || 40}h (Full Maximum Capacity)</span>
                  </div>
                </div>
              </div>

              {/* Skills & Domain Specialization */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Skill Tags & Specializations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedUser.skills || ['Brand Strategy', 'Visual Copy']).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-emerald-300 text-xs rounded-lg font-mono flex items-center gap-1.5"
                    >
                      <Award className="w-3 h-3 text-emerald-400" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* One-Click Client Brand Assignments */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Assigned Client Retainers ({userAssignedClients.length})</span>
                  </span>
                  <span className="text-[11px] text-slate-400">One-click reassignments</span>
                </div>

                {/* Currently Assigned */}
                <div className="space-y-2">
                  {userAssignedClients.length === 0 ? (
                    <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center text-xs text-slate-500">
                      No client brands assigned yet. Assign a brand below to route approval pipelines.
                    </div>
                  ) : (
                    userAssignedClients.map(client => (
                      <div
                        key={client.id}
                        className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: client.accentColor }}
                          ></span>
                          <div>
                            <div className="font-bold text-xs text-white">{client.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {client.monthlyPostQuota} Posts/Mo · KSh {(client.retainerMonthlyValue / 1000).toFixed(0)}k Retainer
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => unassignClientFromUser(selectedUser.id, client.id)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-800/40 text-xs rounded transition-colors"
                        >
                          Unassign
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Available for Assignment */}
                {unassignedClientsForUser.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <span className="text-[11px] text-slate-400 font-mono">
                      + Available Brands in {workspace.name} to Assign:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {unassignedClientsForUser.map(client => (
                        <button
                          key={client.id}
                          onClick={() => assignClientToUser(selectedUser.id, client.id)}
                          className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-lg text-left transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: client.accentColor }}
                            ></span>
                            <span className="text-xs font-semibold text-slate-200 truncate group-hover:text-emerald-400">
                              {client.name}
                            </span>
                          </div>
                          <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invite Member Modal Dialog */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Invite Team Member to {workspace.name}</span>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Brenda Wambui"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="brenda@apexmedia.co.ke"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Role Permission *</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as Role)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="content_creator">Content Creator</option>
                    <option value="account_manager">Account Manager</option>
                    <option value="agency_owner">Agency Owner</option>
                    <option value="client_approver">Client Approver</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Job Title</label>
                  <input
                    type="text"
                    value={inviteJobTitle}
                    onChange={(e) => setInviteJobTitle(e.target.value)}
                    placeholder="e.g. Lead Motion Editor"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Skills & Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={inviteSkills}
                  onChange={(e) => setInviteSkills(e.target.value)}
                  placeholder="e.g. Swahili Copy, Premiere Pro, TikTok Strategy"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Onboarding Invite</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
