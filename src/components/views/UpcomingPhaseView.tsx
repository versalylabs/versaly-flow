import React from 'react';
import { useAgency } from '../../context/AgencyContext';
import { Sparkles, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';

interface UpcomingPhaseViewProps {
  viewId: string;
  setCurrentView: (v: string) => void;
}

export const UpcomingPhaseView: React.FC<UpcomingPhaseViewProps> = ({ viewId, setCurrentView }) => {
  const { clients, contentItems, workspace } = useAgency();

  const phaseMap: Record<string, { phaseNum: number; title: string; desc: string; previewComponent: React.ReactNode }> = {
    clients_preview: {
      phaseNum: 7,
      title: 'Clients & Brand Guidelines',
      desc: 'Centralized client directory, multi-brand asset kits, voice/tone definitions, and retainer limits.',
      previewComponent: (
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Foundation Brands Ready ({clients.length})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {clients.map(c => (
              <div key={c.id} className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-white">{c.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase border bg-emerald-950/60 text-emerald-300 border-emerald-800/40">
                    {c.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mb-2">{c.industry}</div>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-2">
                  <span>KSh {c.retainerMonthlyValue.toLocaleString()} / mo</span>
                  <span>·</span>
                  <span>{c.monthlyPostQuota} posts/mo</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    content_preview: {
      phaseNum: 10,
      title: 'Content Pipeline & Post Composer',
      desc: 'Multi-network composer with character guards, platform previews, and editorial stage kanban.',
      previewComponent: (
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Foundation Posts Ready in Pipeline ({contentItems.length})
          </div>
          <div className="space-y-2.5">
            {contentItems.map(item => (
              <div key={item.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white">{item.title}</div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase border bg-slate-800 text-slate-300 border-slate-700">
                    {item.stage.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] line-clamp-2">{item.caption}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                  <span>Platforms: {item.platforms.join(', ')}</span>
                  <span>·</span>
                  <span>Format: {item.format}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    calendar_preview: {
      phaseNum: 11,
      title: 'Interactive Content Calendar',
      desc: 'Editorial scheduling matrix with drag-and-drop slots, time-zone alignment, and cadence health.',
      previewComponent: (
        <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-lg text-center">
          <div className="text-sm font-semibold text-slate-300">Interactive Calendar Matrix Engine</div>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Will feature month, week, and day grid views with drag-and-drop rescheduling across all active client accounts.
          </p>
        </div>
      )
    },
    approvals_preview: {
      phaseNum: 13,
      title: 'Client Approvals Portal',
      desc: 'One-click sign-off links, feedback annotations, and immutable approval audit timestamps.',
      previewComponent: (
        <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-lg text-center">
          <div className="text-sm font-semibold text-slate-300">Guest Stakeholder Approval Portal</div>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Zero-friction stakeholder portals allowing clients like Lumina and Apex Robotics to review and sign off on posts in seconds.
          </p>
        </div>
      )
    },
    analytics_preview: {
      phaseNum: 19,
      title: 'Analytics & Performance Reporting',
      desc: 'Cross-network aggregation, engagement velocity charts, and white-label PDF/CSV reports.',
      previewComponent: (
        <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-lg text-center">
          <div className="text-sm font-semibold text-slate-300">Advanced Analytics Telemetry Engine</div>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            High-density tabular figures, follower growth curves, and exportable executive retainer summaries.
          </p>
        </div>
      )
    }
  };

  const current = phaseMap[viewId] || phaseMap.clients_preview;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-mono text-emerald-400 font-semibold">Feature Module Preview</span>
            <span aria-hidden="true">·</span>
            <span>Planned Next in Pipeline</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{current.title}</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">{current.desc}</p>
        </div>

        <button
          onClick={() => setCurrentView('roadmap')}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>View Architecture Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {current.previewComponent}
    </div>
  );
};
