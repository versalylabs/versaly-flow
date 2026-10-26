import React, { useState, useEffect } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  LayoutDashboard,
  Building2,
  UserPlus,
  Users,
  PenTool,
  Kanban,
  Calendar,
  CheckCircle,
  FolderOpen,
  Target,
  CheckSquare,
  Share2,
  Send,
  BarChart3,
  ShieldCheck,
  Globe,
  Activity,
  Briefcase,
  DollarSign,
  MessageSquare,
  Zap,
  Sparkles,
  Palette,
  CreditCard,
  Command,
  Lock,
  Gauge,
  TestTube,
  ChevronDown,
  ChevronRight,
  LogOut,
  Compass,
  FolderCheck,
  Cpu,
  Server,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
}

interface NavCategory {
  id: string;
  heading: string;
  icon: React.ComponentType<{ className?: string }>;
  superAdminOnly?: boolean;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  mobileOpen = false,
  onCloseMobile
}) => {
  const {
    workspace,
    clients,
    contentItems,
    digitalAssets,
    campaigns,
    tasks,
    users,
    currentUser,
    capabilities,
    deals,
    invoices,
    inboxThreads,
    workflowRules,
    aiBriefs,
    logout
  } = useAgency();

  const isSuperAdmin = currentUser?.role === 'super_admin';

  const scopedClients = clients.filter(c => c.tenantId === workspace.id);
  const scopedClientsCount = scopedClients.length;
  const scopedUsersCount = users.filter(u => u.tenantId === workspace.id).length;
  const scopedContentCount = contentItems.filter(p => p.tenantId === workspace.id).length;
  const scopedDealsCount = (deals || []).filter(d => d.tenantId === workspace.id && d.stage !== 'lost').length;
  const scopedInvoices = (invoices || []).filter(i => i.tenantId === workspace.id);
  const overdueCount = scopedInvoices.filter(i => i.status === 'overdue').length;
  const scopedThreads = (inboxThreads || []).filter(t => t.tenantId === workspace.id);
  const openInboxCount = scopedThreads.filter(t => t.status === 'open' || t.status === 'pending').length;
  const urgentInboxCount = scopedThreads.filter(t => t.sentiment === 'urgent' && t.status !== 'resolved').length;
  const activeRulesCount = (workflowRules || []).filter(r => r.tenantId === workspace.id && r.isActive).length;

  const categories: NavCategory[] = [
    {
      id: 'overview',
      heading: 'Command & Telemetry',
      icon: Compass,
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: 'Live' },
        { id: 'landing', label: 'Public Website', icon: Globe, badge: 'Live' },
        { id: 'documentation', label: 'Docs & SOP Library', icon: BookOpen, badge: 'SOP' },
        { id: 'productivity', label: 'Productivity & Cmd+K', icon: Command, badge: 'Cmd+K' },
        { id: 'performance', label: 'Speed & Optimization', icon: Gauge, badge: '60 FPS' },
        ...(!capabilities.isClientRestrictedView ? [
          { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3, badge: 'Telemetry' }
        ] : []),
      ]
    },
    {
      id: 'content',
      heading: 'Content & Publishing',
      icon: PenTool,
      items: [
        { id: 'composer', label: 'Content Composer', icon: PenTool, badge: 'New' },
        { id: 'workflow', label: 'Editorial Kanban', icon: Kanban, count: scopedContentCount, badge: 'Workflow' },
        { id: 'calendar', label: 'Calendar Matrix', icon: Calendar, badge: 'Matrix' },
        {
          id: 'approvals',
          label: 'Approvals Portal',
          icon: CheckCircle,
          badge: capabilities.isClientRestrictedView ? 'Client View' : 'Sign-off',
          count: contentItems.filter(p => p.tenantId === workspace.id && (p.stage === 'client_review' || p.stage === 'internal_review')).length
        },
        {
          id: 'publishing',
          label: 'Dispatch Queue',
          icon: Send,
          badge: 'EAT Clock',
          count: contentItems.filter(p => p.tenantId === workspace.id && (p.stage === 'scheduled' || p.dispatchStatus === 'queued' || p.dispatchStatus === 'retrying')).length
        },
        {
          id: 'dam',
          label: 'Brand Media Vault',
          icon: FolderOpen,
          badge: 'DAM',
          count: digitalAssets.filter(a => a.tenantId === workspace.id).length
        },
      ]
    },
    {
      id: 'clients',
      heading: 'Clients & Accounts',
      icon: Building2,
      items: [
        { id: 'clients', label: 'Clients & Brands', icon: Building2, count: scopedClientsCount },
        { id: 'onboarding', label: 'Client Onboarding', icon: UserPlus, count: scopedClients.filter(c => c.status === 'onboarding').length },
        {
          id: 'social_accounts',
          label: 'Social Connections',
          icon: Share2,
          badge: 'OAuth 2.0',
          count: scopedClients.reduce((acc, c) => acc + (c.socialAccounts?.length || 0), 0)
        },
        {
          id: 'campaigns',
          label: 'Campaign Strategy',
          icon: Target,
          badge: 'KES',
          count: campaigns.filter(c => c.tenantId === workspace.id).length
        },
        {
          id: 'inbox',
          label: 'Social Inbox & Triage',
          icon: MessageSquare,
          count: openInboxCount,
          badge: urgentInboxCount > 0 ? `${urgentInboxCount} Urgent` : undefined
        },
      ]
    },
    {
      id: 'operations',
      heading: 'Operations & AI',
      icon: Cpu,
      items: [
        {
          id: 'tasks',
          label: 'Sprint Tasks & SLA',
          icon: CheckSquare,
          badge: 'Sprint',
          count: tasks.filter(t => t.tenantId === workspace.id && t.status !== 'done').length
        },
        ...(!capabilities.isClientRestrictedView ? [
          { id: 'team', label: 'Team Allocation', icon: Users, count: scopedUsersCount },
          { id: 'ai_strategy', label: 'AI Strategy Studio', icon: Sparkles, badge: 'Gemini', count: (aiBriefs || []).length },
          { id: 'automation', label: 'Workflow Automation', icon: Zap, count: activeRulesCount, badge: 'IFTTT' }
        ] : []),
      ]
    },
    {
      id: 'financials',
      heading: 'Financials & Commercials',
      icon: DollarSign,
      items: [
        ...(!capabilities.isClientRestrictedView ? [
          { id: 'billing', label: 'Billing & Retainers', icon: DollarSign, count: scopedInvoices.length, badge: overdueCount > 0 ? `${overdueCount} Due` : 'KES' },
          { id: 'crm', label: 'CRM & Deals Pipeline', icon: Briefcase, count: scopedDealsCount, badge: 'Deals' },
          { id: 'subscription', label: 'Plan & Usage Limits', icon: CreditCard, badge: workspace.tier || 'Boutique' },
          { id: 'whitelabel', label: 'White-Label Branding', icon: Palette, badge: 'Custom' },
        ] : []),
      ]
    },
    // Platform Administration - RESTRICTED TO SUPER ADMIN (versalylabs@gmail.com)
    ...(isSuperAdmin ? [
      {
        id: 'platform_admin',
        heading: 'Platform Super Admin',
        icon: ShieldCheck,
        superAdminOnly: true,
        items: [
          { id: 'observability', label: 'Health & Observability', icon: Activity, badge: 'Live' },
          { id: 'infrastructure', label: 'Cloud & Infrastructure', icon: Server, badge: 'Cloud' },
          { id: 'accessibility', label: 'Design & Accessibility', icon: Sparkles, badge: 'WCAG AA' },
          { id: 'testing', label: 'Testing & Verification', icon: TestTube, badge: '60/60 Pass' },
          { id: 'security', label: 'Security & Compliance', icon: Lock, badge: 'SOC2 / DPA' },
          { id: 'rbac', label: 'Role Permissions & RBAC', icon: ShieldCheck, badge: 'Matrix' },
          { id: 'tenancy', label: 'Multi-Tenant Hub', icon: Globe, badge: 'Global' },
        ]
      }
    ] : [])
  ];

  // Accordion state: by default, auto-expand overview and the category containing currentView
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    return {
      overview: true,
      content: true,
      clients: false,
      operations: false,
      financials: false,
      platform_admin: true
    };
  });

  // Automatically expand category if currentView changes to an item inside it
  useEffect(() => {
    for (const cat of categories) {
      if (cat.items.some(item => item.id === currentView)) {
        setExpandedCategories(prev => ({
          ...prev,
          [cat.id]: true
        }));
        break;
      }
    }
  }, [currentView]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-800 bg-slate-950 flex flex-col shrink-0 select-none transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Workspace Identifier Header */}
        <div
          onClick={() => {
            if (isSuperAdmin) {
              setCurrentView('tenancy');
            } else {
              setCurrentView('dashboard');
            }
            if (onCloseMobile) onCloseMobile();
          }}
          className="p-3.5 border-b border-slate-800/80 hover:bg-slate-900/40 cursor-pointer transition-colors group"
          title={isSuperAdmin ? "Manage or switch tenant workspaces" : "Your active agency workspace"}
        >
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Versaly Flow"
            className="w-9 h-9 rounded-lg object-contain bg-emerald-500/10 border border-emerald-500/30 shrink-0 p-0.5 shadow-sm shadow-emerald-500/10"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-0.5">
              <span className="uppercase tracking-wider font-semibold text-[9px] flex items-center gap-1 group-hover:text-emerald-400 transition-colors">
                <span>{workspace.city || 'Nairobi'}</span>
              </span>
              <span className="font-mono text-[9px] text-amber-400 uppercase bg-amber-950/60 px-1 py-0.2 rounded border border-amber-800/40">
                {workspace.tier}
              </span>
            </div>
            <div className="font-semibold text-slate-100 text-xs truncate group-hover:text-white">
              {workspace.name}
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between mt-0.5">
              <span className="truncate">{workspace.slug}</span>
              <span className="text-emerald-400/80 font-bold ml-1 shrink-0">
                {workspace.currency?.split(' ')[0] || 'KES'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categorized Accordion Navigation */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {categories.map(category => {
          const isExpanded = !!expandedCategories[category.id];
          const hasActiveChild = category.items.some(i => i.id === currentView);
          const CatIcon = category.icon;

          return (
            <div key={category.id} className="rounded-lg overflow-hidden border border-slate-800/40 bg-slate-900/20">
              {/* Category Dropdown Header */}
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 text-left transition-colors ${
                  category.superAdminOnly
                    ? 'bg-amber-950/20 hover:bg-amber-950/30 text-amber-300'
                    : hasActiveChild
                    ? 'bg-slate-800/40 text-slate-200'
                    : 'hover:bg-slate-900/60 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <CatIcon className={`w-3.5 h-3.5 shrink-0 ${category.superAdminOnly ? 'text-amber-400' : hasActiveChild ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="text-[11px] font-semibold tracking-wide uppercase truncate">
                    {category.heading}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {category.superAdminOnly && (
                    <span className="text-[9px] font-mono uppercase bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded border border-amber-500/30">
                      Admin
                    </span>
                  )}
                  <span className="text-slate-500 group-hover:text-slate-300">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </span>
                </div>
              </button>

              {/* Collapsible Dropdown Items */}
              {isExpanded && (
                <div className="p-1 space-y-0.5 border-t border-slate-800/40 bg-slate-950/40">
                  {category.items.map(item => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentView(item.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`w-full flex items-center justify-between pl-3 pr-2 py-1.5 rounded-md text-xs transition-colors ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          {item.badge && (
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded capitalize ${
                              item.badge.includes('Pass')
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                                : 'bg-slate-800 text-slate-300'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                          {item.count !== undefined && (
                            <span className="text-[9px] font-mono bg-slate-800/80 text-emerald-400 px-1.5 py-0.2 rounded">
                              {item.count}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User Identity & Sign Out Footer */}
      <div className="p-2.5 border-t border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center font-bold text-xs text-amber-400 border border-slate-700 shrink-0">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">
                {currentUser?.name}
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isSuperAdmin ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span className="capitalize">{currentUser?.role?.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign out of active session"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-md transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* System Gateway Status */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 mt-2">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-300">Nairobi Gateway Live</span>
          </div>
          <span className="font-mono text-slate-500">v0.5.2</span>
        </div>
      </div>
    </aside>
    </>
  );
};
