import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Copy, Check, Download, ShieldCheck, Home } from 'lucide-react';
import { observabilityService } from '../../services/observabilityService';
import { DiagnosticIncidentReport } from '../../types';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  onNavigateToDashboard?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
  incidentReport: DiagnosticIncidentReport | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
    incidentReport: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error, errorInfo: null, copied: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    try {
      const incident = observabilityService.captureIncident(
        error,
        errorInfo.componentStack || undefined,
        {
          activeView: typeof window !== 'undefined' ? window.location.pathname : 'dashboard',
          userRole: 'authenticated_user'
        }
      );
      this.setState({ error, errorInfo, incidentReport: incident });
    } catch (e) {
      this.setState({ error, errorInfo });
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, copied: false, incidentReport: null });
  };

  private handleCopyDetails = () => {
    if (this.state.incidentReport) {
      const bundle = observabilityService.generateIncidentBundle(this.state.incidentReport);
      navigator.clipboard.writeText(bundle);
    } else {
      const errorDetails = `Error: ${this.state.error?.message || 'Unknown'}\nStack: ${this.state.error?.stack || ''}\nComponentStack: ${this.state.errorInfo?.componentStack || ''}`;
      navigator.clipboard.writeText(errorDetails);
    }
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 3000);
  };

  private handleDownloadIncident = () => {
    if (!this.state.incidentReport) return;
    const bundle = observabilityService.generateIncidentBundle(this.state.incidentReport);
    const blob = new Blob([bundle], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-${this.state.incidentReport.incidentId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-2xl mx-auto my-12 bg-[#ffffff] border border-[#e7000b]/40 rounded-[24px] shadow-[0_0_0_1px_rgba(23,23,23,0.05),0_4px_12px_rgba(0,0,0,0.06)] text-[#0a0a0a] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e5e5e5]">
            <div className="flex items-center gap-3 text-[#e7000b]">
              <div className="p-2 rounded-[10px] bg-red-50 border border-[#e7000b]/30">
                <AlertTriangle className="w-5 h-5 text-[#e7000b]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0a0a0a]">
                  {this.props.fallbackTitle || 'Runtime Module Exception Intercepted'}
                </h2>
                <div className="text-xs text-[#e7000b] font-mono">
                  Defensive Boundary Activated · Incident Logged
                </div>
              </div>
            </div>

            {this.state.incidentReport && (
              <span className="text-[10px] font-mono bg-[#f5f5f5] text-[#737373] border border-[#e5e5e5] px-2 py-0.5 rounded-[18px]">
                ID: {this.state.incidentReport.incidentId}
              </span>
            )}
          </div>

          <p className="text-xs text-[#737373] leading-relaxed">
            {this.props.fallbackSubtitle ||
              'A non-fatal rendering error occurred in this view. The rest of the Agency OS remains operational. A full diagnostic telemetry bundle has been captured.'}
          </p>

          {this.state.error && (
            <div className="bg-[#fafafa] p-3.5 rounded-[18px] border border-[#e5e5e5] font-mono text-[11px] text-[#e7000b] overflow-x-auto max-h-48 space-y-1">
              <div className="font-bold text-[#e7000b]">{this.state.error.name}: {this.state.error.message}</div>
              {this.state.error.stack && (
                <div className="text-[#737373] text-[10px] leading-tight pt-1 whitespace-pre-wrap">
                  {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e5e5e5]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-3.5 py-1.5 bg-[#0a0a0a] hover:bg-[#171717] text-[#fafafa] font-medium text-xs rounded-[18px] flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry View</span>
              </button>

              {this.props.onNavigateToDashboard && (
                <button
                  type="button"
                  onClick={() => {
                    this.handleReset();
                    this.props.onNavigateToDashboard?.();
                  }}
                  className="px-3 py-1.5 bg-[#f5f5f5] hover:bg-[#ebebeb] text-[#0a0a0a] text-xs rounded-[18px] flex items-center gap-1.5 transition-colors border border-[#e5e5e5]"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Return to Dashboard</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {this.state.incidentReport && (
                <button
                  type="button"
                  onClick={this.handleDownloadIncident}
                  className="px-3 py-1.5 bg-[#f5f5f5] hover:bg-[#ebebeb] text-[#0a0a0a] text-xs rounded-[18px] flex items-center gap-1.5 transition-colors border border-[#e5e5e5]"
                  title="Download full incident bundle as JSON"
                >
                  <Download className="w-3.5 h-3.5 text-[#0a0a0a]" />
                  <span>Download Incident JSON</span>
                </button>
              )}

              <button
                type="button"
                onClick={this.handleCopyDetails}
                className="px-3 py-1.5 bg-[#f5f5f5] hover:bg-[#ebebeb] text-[#0a0a0a] text-xs rounded-[18px] flex items-center gap-1.5 transition-colors border border-[#e5e5e5]"
              >
                {this.state.copied ? <Check className="w-3.5 h-3.5 text-[#0a0a0a]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{this.state.copied ? 'Copied Bundle' : 'Copy Diagnostics'}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

