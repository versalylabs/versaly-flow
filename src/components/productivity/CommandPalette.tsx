import React, { useState, useEffect, useRef } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Search,
  Command,
  ArrowRight,
  FileText,
  Calendar,
  Kanban,
  LayoutDashboard,
  MessageSquare,
  DollarSign,
  Palette,
  CreditCard,
  Building2,
  Sparkles,
  Send,
  Zap,
  Users,
  CheckCircle,
  HelpCircle,
  FolderOpen,
  Lock,
  Gauge,
  TestTube,
  Globe
} from 'lucide-react';

interface CommandPaletteProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

interface PaletteAction {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Quick Actions' | 'Clients' | 'Deliverables';
  icon: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ currentView, setCurrentView }) => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    clients,
    contentItems,
    quickNotes,
    addToast,
    simulateMpesaSubscriptionRenewal,
    exportDatabaseJson
  } = useAgency();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Listener: Cmd+K / Ctrl+K or '/' to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger '/' if user is typing in an input or textarea
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      } else if (e.key === '/' && !isInput && !isCommandPaletteOpen) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Build searchable action items
  const actions: PaletteAction[] = [
    // Navigation
    {
      id: 'nav_productivity',
      title: 'Go to Productivity & Quick Actions',
      subtitle: 'Bulk operations, scratchpad & shortcuts',
      category: 'Navigation',
      icon: <Command className="w-4 h-4 text-emerald-400" />,
      shortcut: 'G P',
      onSelect: () => { setCurrentView('productivity'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav_dashboard',
      title: 'Go to Executive Dashboard',
      subtitle: 'Agency overview, MRR and top KPIs',
      category: 'Navigation',
      icon: <LayoutDashboard className="w-4 h-4 text-indigo-400" />,
      shortcut: 'G D',
      onSelect: () => { setCurrentView('dashboard'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav_composer',
      title: 'Go to Content Composer',
      subtitle: 'Draft new multi-channel post',
      category: 'Navigation',
      icon: <FileText className="w-4 h-4 text-teal-400" />,
      shortcut: 'C',
      onSelect: () => { setCurrentView('composer'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav_calendar',
      title: 'Go to Calendar Matrix',
      subtitle: 'Interactive publishing grid',
      category: 'Navigation',
      icon: <Calendar className="w-4 h-4 text-amber-400" />,
      shortcut: 'G C',
      onSelect: () => { setCurrentView('calendar'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav_workflow',
      title: 'Go to Editorial Kanban',
      subtitle: 'Multi-stage approval pipeline',
      category: 'Navigation',
      icon: <Kanban className="w-4 h-4 text-rose-400" />,
      shortcut: 'G K',
      onSelect: () => { setCurrentView('workflow'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav_inbox',
      title: 'Go to Social Inbox & Triage',
      subtitle: 'Unified client conversations & DMs',
      category: 'Navigation',
      icon: <MessageSquare className="w-4 h-4 text-sky-400" />,
      shortcut: 'G I',
      onSelect: () => { setCurrentView('inbox'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav_ai_strategy',
      title: 'Go to AI Strategy Studio',
      subtitle: 'Gemini viral hooks & competitor angles',
      category: 'Navigation',
      icon: <Sparkles className="w-4 h-4 text-violet-400" />,
      shortcut: 'G S',
      onSelect: () => { setCurrentView('ai_strategy'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav_billing',
      title: 'Go to Billing & Retainers',
      subtitle: 'Invoicing, VAT & retainer meters',
      category: 'Navigation',
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
      shortcut: 'G B',
      onSelect: () => { setCurrentView('billing'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav_subscription',
      title: 'Go to Plan & Usage Limits',
      subtitle: 'SaaS tier quotas & M-Pesa renewal',
      category: 'Navigation',
      icon: <CreditCard className="w-4 h-4 text-amber-400" />,
      onSelect: () => { setCurrentView('subscription'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav_whitelabel',
      title: 'Go to White-Label Customization',
      subtitle: 'Branded portal, colors & custom domain',
      category: 'Navigation',
      icon: <Palette className="w-4 h-4 text-indigo-400" />,
      onSelect: () => { setCurrentView('whitelabel'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav_security',
      title: 'Go to Security & Compliance',
      subtitle: 'SOC2 audit trail, API keys & Kenya DPA 2019',
      category: 'Navigation',
      icon: <Lock className="w-4 h-4 text-emerald-400" />,
      shortcut: 'G X',
      onSelect: () => { setCurrentView('security'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav_performance',
      title: 'Go to Speed & Performance Studio',
      subtitle: 'Virtualization, LRU query cache & 60 FPS metrics',
      category: 'Navigation',
      icon: <Gauge className="w-4 h-4 text-sky-400" />,
      shortcut: 'G P',
      onSelect: () => { setCurrentView('performance'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav_accessibility',
      title: 'Go to Design Polish & Accessibility',
      subtitle: 'WCAG 2.1 AA audit, contrast ratios & audio feedback',
      category: 'Navigation',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      shortcut: 'G A',
      onSelect: () => { setCurrentView('accessibility'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav_landing',
      title: 'View Public Website & Pricing',
      subtitle: 'Public landing page, interactive ROI calculator & features',
      category: 'Navigation',
      icon: <Globe className="w-4 h-4 text-emerald-400" />,
      shortcut: 'G W',
      onSelect: () => { setCurrentView('landing'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'nav_testing',
      title: 'Go to Automated Testing & Verification',
      subtitle: '34 contract test suites & E2E smoke runner',
      category: 'Navigation',
      icon: <TestTube className="w-4 h-4 text-emerald-400" />,
      shortcut: 'G T',
      onSelect: () => { setCurrentView('testing'); setIsCommandPaletteOpen(false); }
    },

    // Quick Actions
    {
      id: 'act_new_post',
      title: 'Draft New Campaign Post',
      subtitle: 'Open blank composer workspace',
      category: 'Quick Actions',
      icon: <Send className="w-4 h-4 text-emerald-400" />,
      onSelect: () => { setCurrentView('composer'); setIsCommandPaletteOpen(false); }
    },
    {
      id: 'act_mpesa_probe',
      title: 'Simulate M-Pesa Daraja STK Push',
      subtitle: 'Test recurring subscription settlement',
      category: 'Quick Actions',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      onSelect: () => {
        simulateMpesaSubscriptionRenewal();
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'act_export_json',
      title: 'Export Agency Database JSON',
      subtitle: 'Save complete workspace state file',
      category: 'Quick Actions',
      icon: <FolderOpen className="w-4 h-4 text-indigo-400" />,
      onSelect: () => {
        const jsonStr = exportDatabaseJson();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `versaly_backup_${Date.now()}.json`;
        a.click();
        addToast('Database Exported', 'Full JSON backup downloaded successfully.', 'success');
        setIsCommandPaletteOpen(false);
      }
    },

    // Client Brands
    ...clients.map(client => ({
      id: `client_${client.id}`,
      title: `Filter Client: ${client.name}`,
      subtitle: `${client.industry} • ${client.website}`,
      category: 'Clients' as const,
      icon: <Building2 className="w-4 h-4 text-emerald-400" />,
      onSelect: () => {
        setCurrentView('clients');
        setIsCommandPaletteOpen(false);
        addToast('Client Selected', `Focused scope on ${client.name}`, 'info');
      }
    })),

    // Content Deliverables
    ...contentItems.slice(0, 10).map(post => ({
      id: `post_${post.id}`,
      title: post.title,
      subtitle: `Stage: ${post.stage.replace('_', ' ')} • ${post.platforms.join(', ')}`,
      category: 'Deliverables' as const,
      icon: <FileText className="w-4 h-4 text-slate-400" />,
      onSelect: () => {
        setCurrentView('workflow');
        setIsCommandPaletteOpen(false);
      }
    }))
  ];

  // Filter actions based on query
  const filteredActions = actions.filter(action => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      action.title.toLowerCase().includes(q) ||
      action.subtitle?.toLowerCase().includes(q) ||
      action.category.toLowerCase().includes(q)
    );
  });

  // Handle keyboard navigation inside the palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredActions.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredActions.length) % (filteredActions.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredActions[selectedIndex]) {
        filteredActions[selectedIndex].onSelect();
      }
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full shadow-2xl shadow-black/80 overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Bar Input */}
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <img
            src="/logo.png"
            alt="Versaly Flow"
            className="w-6 h-6 rounded-md object-contain bg-emerald-500/10 border border-emerald-500/30 shrink-0 shadow-sm p-0.5"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, destination, client, or action..."
            className="w-full bg-transparent text-sm focus:outline-none text-white placeholder-slate-500"
          />
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
              ESC
            </span>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredActions.length > 0 ? (
            filteredActions.map((action, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={action.id}
                  onClick={action.onSelect}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3.5 py-2.5 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-500/10 text-white border border-emerald-500/30 rounded-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 shrink-0 text-slate-300">
                      {action.icon}
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold truncate text-white">
                          {action.title}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/50 uppercase font-mono">
                          {action.category}
                        </span>
                      </div>
                      {action.subtitle && (
                        <p className="text-[11px] truncate mt-0.5 text-slate-400">
                          {action.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {action.shortcut && (
                      <span className="text-[10px] font-mono text-slate-300 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded">
                        {action.shortcut}
                      </span>
                    )}
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center text-xs text-slate-500">
              No matching commands or destinations found for "{query}"
            </div>
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-300">↑</kbd>
              <kbd className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-300">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-300">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="font-mono font-medium text-emerald-400">Cmd+K Spotlight</span>
        </div>
      </div>
    </div>
  );
};
