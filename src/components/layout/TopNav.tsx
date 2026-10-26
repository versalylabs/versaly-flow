import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { Role } from '../../types';
import {
  Bell,
  Download,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  Layers,
  Sparkles,
  LogOut,
  Globe,
  Menu
} from 'lucide-react';

interface TopNavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onToggleMobileSidebar?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  setCurrentView,
  onToggleMobileSidebar
}) => {
  const {
    workspace,
    currentUser,
    switchUserRole,
    notifications,
    markNotificationAsRead,
    exportDatabaseJson,
    resetToSeedData,
    addToast,
    logout
  } = useAgency();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const rolesList: { role: Role; label: string; desc: string }[] = [
    { role: 'agency_owner', label: 'Agency Owner', desc: 'Full agency workspace authority' },
    { role: 'account_manager', label: 'Account Manager', desc: 'Client relations & approvals dispatch' },
    { role: 'content_creator', label: 'Content Creator', desc: 'Post drafts, asset uploads & copy' },
    { role: 'client_approver', label: 'Client Approver', desc: 'External stakeholder review portal' },
    { role: 'super_admin', label: 'Super Admin', desc: 'Global platform & system controls' },
  ];

  const handleExport = () => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulsebrand_foundation_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Database Exported', 'Full Foundation schema & entities saved as JSON', 'success');
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-5 flex items-center justify-between z-20 shrink-0 sticky top-0">
      {/* Zone 1: Single element brand wordmark */}
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 lg:hidden transition-colors"
            aria-label="Open Navigation Menu"
            title="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <a
          href="#"
          onClick={(e) => { e.preventDefault(); setCurrentView('roadmap'); }}
          className="text-base font-bold tracking-tight flex items-center gap-2.5 hover:opacity-90 transition-opacity text-white"
        >
          <img
            src="/logo.png"
            alt="Versaly Flow"
            className="w-7 h-7 rounded-md object-contain border border-emerald-500/30 bg-emerald-500/10 shadow-sm p-0.5"
          />
          <span className="font-semibold tracking-tight text-slate-100">
            Versaly Flow
          </span>
          <span className="text-xs text-emerald-400 font-medium tracking-normal border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Operational
          </span>
        </a>
      </div>

      {/* Zone 2: Contextual Breadcrumb */}
      <div className="hidden sm:flex items-center gap-2 text-xs">
        <span className="font-medium truncate max-w-[150px] lg:max-w-none text-slate-500">
          {workspace.name}
        </span>
        <span className="text-slate-600">/</span>
        <span className="font-medium text-slate-400">
          {currentView === 'testing' ? 'Quality & Tests' :
           currentView === 'performance' ? 'Performance & Speed' :
           currentView === 'security' ? 'Security & Vault' :
           currentView === 'productivity' ? 'Power Tools' :
           currentView === 'subscription' ? 'Licensing' :
           currentView === 'whitelabel' ? 'Branding' :
           currentView === 'ai_strategy' ? 'AI Studio' :
           currentView === 'automation' ? 'Automation' :
           currentView === 'inbox' ? 'Communication' :
           currentView === 'billing' ? 'Financials' :
           currentView === 'crm' ? 'Growth' :
           currentView === 'analytics' ? 'Insights' :
           currentView === 'publishing' ? 'Execution' :
           currentView === 'dashboard' ? 'Overview' :
           currentView === 'approvals' ? 'Client Portal' :
           currentView === 'composer' ? 'Studio' :
           currentView === 'calendar' ? 'Planning' :
           currentView === 'workflow' ? 'Pipeline' :
           currentView === 'dam' ? 'Assets' :
           currentView === 'campaigns' ? 'Campaigns' :
           currentView === 'tasks' ? 'Tasks' :
           currentView === 'social_accounts' ? 'Channels' :
           currentView === 'clients' ? 'Accounts' :
           currentView === 'team' ? 'Organization' :
           currentView === 'documentation' ? 'Knowledge' :
           currentView === 'accessibility' ? 'Ergonomics' :
           currentView === 'observability' ? 'Telemetry' :
           currentView === 'roadmap' ? 'Engine' : 'System'}
        </span>
        <span className="text-slate-600">/</span>
        <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 capitalize">
          {currentView === 'testing' ? 'Automated Testing & Verification' :
           currentView === 'performance' ? 'Performance Optimization' :
           currentView === 'security' ? 'Security & Compliance' :
           currentView === 'productivity' ? 'Productivity & Cmd+K' :
           currentView === 'subscription' ? 'Plan & Usage Limits' :
           currentView === 'whitelabel' ? 'White-Label Branding' :
           currentView === 'ai_strategy' ? 'AI Strategy Studio' :
           currentView === 'automation' ? 'Workflow Automation' :
           currentView === 'inbox' ? 'Social Inbox & Triage' :
           currentView === 'billing' ? 'Billing & Retainers' :
           currentView === 'crm' ? 'CRM & Deals Pipeline' :
           currentView === 'documentation' ? 'Docs & SOP Library' :
           currentView === 'accessibility' ? 'Design Polish & Accessibility' :
           currentView === 'observability' ? 'Health & Observability' :
           currentView.replace('_', ' ')}
        </span>
      </div>

      {/* Zone 3: Actions & Identity Switcher */}
      <div className="flex items-center gap-2">
        {/* Role Simulator Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-2.5 py-1.5 rounded-md transition-colors"
            title="Simulate different role contexts"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[11px] text-slate-400">{currentUser.role}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-1.5 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-xl shadow-black/50 py-1.5 z-50">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider border-b text-slate-400 border-slate-800/80">
                Simulate Role Identity
              </div>
              <div className="mt-1 space-y-0.5">
                {rolesList.map(r => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchUserRole(r.role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      currentUser.role === r.role ? 'bg-slate-800/60 text-emerald-400 font-medium rounded-md' : 'text-slate-300 hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-200">{r.label}</div>
                      <div className="text-[11px] leading-tight text-slate-500">{r.desc}</div>
                    </div>
                    {currentUser.role === r.role && (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 ml-2 text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Public Website Preview */}
        <button
          onClick={() => setCurrentView('landing')}
          title="View public website & landing page"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-md border border-slate-800 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Website</span>
        </button>

        {/* Export State JSON */}
        <button
          onClick={handleExport}
          title="Export system state JSON"
          className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 rounded-md border border-slate-800 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        {/* Reset System State */}
        <button
          onClick={() => {
            if (window.confirm('Reset all workspace data to default pristine state?')) {
              resetToSeedData();
            }
          }}
          title="Reset to initial seed"
          className="p-2 text-slate-400 hover:text-amber-400 bg-slate-900 hover:bg-slate-800 rounded-md border border-slate-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 rounded-md border border-slate-800 transition-colors relative"
            title="System notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-1.5 w-72 bg-slate-900 border border-slate-800 rounded-lg shadow-xl shadow-black/50 py-1.5 z-50">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider border-b flex items-center justify-between text-slate-400 border-slate-800/80">
                <span>Notifications</span>
                <span className="text-[10px] font-mono text-slate-500">{notifications.length} total</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y mt-1 divide-slate-800/50">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={`p-3 text-xs cursor-pointer transition-colors ${
                      !n.read ? 'bg-slate-800/40 hover:bg-slate-800/60' : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between font-medium text-slate-200">
                      <span>{n.title}</span>
                      {!n.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      )}
                    </div>
                    <p className="text-[11px] mt-1 line-clamp-2 text-slate-400">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] hidden sm:block bg-slate-800"></div>

        {/* Quick Sign Out Action */}
        <button
          onClick={logout}
          title="Sign out of current workspace"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-900 border border-slate-800 hover:border-red-500/40 hover:text-red-400 text-slate-400 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};
