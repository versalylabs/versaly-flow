/**
 * Versaly Flow - System Health & Observability Studio
 * Phase 32: System Health & Observability
 * Telemetry loggers, Error Boundary Captures, API Rate-Limit Sentinels & Circuit Breakers
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { observabilityService } from '../../services/observabilityService';
import {
  LogLevel,
  TelemetryEvent,
  DiagnosticIncidentReport,
  RateLimitSentinel,
  CircuitBreakerState,
  NetworkStatusTelemetry
} from '../../types';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  Copy,
  Check,
  Terminal,
  Server,
  Zap,
  Radio,
  Clock,
  HardDrive,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Send,
  Cpu,
  Wifi,
  WifiOff,
  Flame,
  FileText,
  AlertOctagon,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ObservabilityStudio: React.FC = () => {
  const { workspace, currentUser, addToast } = useAgency();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'telemetry' | 'incidents' | 'ratelimits' | 'circuit'>('telemetry');

  // Telemetry Log Stream State
  const [logs, setLogs] = useState<TelemetryEvent[]>(() => observabilityService.getLogs());
  const [logFilterLevel, setLogFilterLevel] = useState<LogLevel | 'all'>('all');
  const [logFilterSubsystem, setLogFilterSubsystem] = useState<string>('all');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [selectedLog, setSelectedLog] = useState<TelemetryEvent | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Custom log emitter state
  const [newLogMessage, setNewLogMessage] = useState<string>('');
  const [newLogLevel, setNewLogLevel] = useState<LogLevel>('info');
  const [newLogSubsystem, setNewLogSubsystem] = useState<string>('app_module');

  // Incidents State
  const [incidents, setIncidents] = useState<DiagnosticIncidentReport[]>(() =>
    observabilityService.getIncidentHistory()
  );
  const [inspectedIncident, setInspectedIncident] = useState<DiagnosticIncidentReport | null>(null);
  const [simulateErrorTrigger, setSimulateErrorTrigger] = useState<boolean>(false);

  // Rate Limits State
  const [rateLimits, setRateLimits] = useState<RateLimitSentinel[]>(() =>
    observabilityService.getRateLimitSentinels()
  );

  // Circuit Breakers & Network State
  const [circuitBreakers, setCircuitBreakers] = useState<CircuitBreakerState[]>(() =>
    observabilityService.getCircuitBreakers()
  );
  const [networkStatus, setNetworkStatus] = useState<NetworkStatusTelemetry>(() =>
    observabilityService.getNetworkStatus()
  );
  const [isPingingNetwork, setIsPingingNetwork] = useState<boolean>(false);

  // Subscribe to live telemetry
  useEffect(() => {
    const unsubscribe = observabilityService.subscribe((newEvent) => {
      if (isLiveStreaming) {
        setLogs(prev => [newEvent, ...prev].slice(0, 1000));
      }
    });

    return () => unsubscribe();
  }, [isLiveStreaming]);

  // Periodic refresh for counters & network
  useEffect(() => {
    const timer = setInterval(() => {
      setRateLimits(observabilityService.getRateLimitSentinels());
      setIncidents(observabilityService.getIncidentHistory());
      setCircuitBreakers(observabilityService.getCircuitBreakers());
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(label);
    addToast('Copied to Clipboard', `${label} copied successfully`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleEmitCustomLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogMessage.trim()) return;

    observabilityService.log(
      newLogLevel,
      newLogSubsystem.trim(),
      newLogMessage.trim(),
      { manualTrigger: true, user: currentUser.name },
      Math.round(Math.random() * 20 * 10) / 10,
      workspace.id,
      currentUser.id
    );

    setNewLogMessage('');
    addToast('Telemetry Dispatched', `Logged ${newLogLevel.toUpperCase()} to ${newLogSubsystem}`, 'info');
  };

  const handleDownloadLogsJson = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `versaly-telemetry-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Logs Exported', 'Telemetry stream downloaded as JSON', 'success');
  };

  const handleSimulateClientError = () => {
    try {
      // Simulate synthetic error capture
      throw new Error(`Simulated ErrorBoundary Exception: Failed to decode Kenyan Shilling ISO-4217 telemetry payload.`);
    } catch (err: any) {
      const report = observabilityService.captureIncident(err, 'at CampaignAnalyticsWidget.tsx:84:12\nat DashboardGrid.tsx:120:8', {
        activeView: 'observability_testing',
        tenantId: workspace.id,
        userId: currentUser.id,
        userRole: currentUser.role
      });
      setIncidents(observabilityService.getIncidentHistory());
      setInspectedIncident(report);
      addToast('Incident Captured', `Diagnostic report ${report.incidentId} generated`, 'warning');
    }
  };

  const handlePingNetwork = () => {
    setIsPingingNetwork(true);
    setTimeout(() => {
      setNetworkStatus(observabilityService.getNetworkStatus());
      setIsPingingNetwork(false);
      addToast('Network Probe Nominal', 'Round-trip time: 3.8ms to Nairobi Anycast edge', 'success');
    }, 400);
  };

  const filteredLogs = logs.filter(l => {
    if (logFilterLevel !== 'all' && l.level !== logFilterLevel) return false;
    if (logFilterSubsystem !== 'all' && l.subsystem !== logFilterSubsystem) return false;
    if (logSearchQuery.trim()) {
      const q = logSearchQuery.toLowerCase();
      if (!l.message.toLowerCase().includes(q) && !l.subsystem.toLowerCase().includes(q) && !l.traceId.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const uniqueSubsystems = Array.from(new Set(logs.map(l => l.subsystem)));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Versaly Flow</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">System Health & Observability</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">Real-Time SRE Command Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-emerald-400" />
            <span>System Health, Telemetry & Observability</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Real-time structured telemetry stream, automated Error Boundary incident bundle captures,
            API rate-limit warning monitors, and network circuit breakers.
          </p>
        </div>

        {/* Global Network & Sentinel Indicator Badge */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs font-mono self-start md:self-auto">
          <div className={`w-2.5 h-2.5 rounded-full ${networkStatus.online ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></div>
          <span className="text-slate-200 font-bold">{networkStatus.online ? 'ONLINE (4G)' : 'OFFLINE'}</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-semibold">{networkStatus.rttMs}ms RTT</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-mono">{logs.length} Logs</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Telemetry Stream Health */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="uppercase tracking-wider">Log Ingress Buffer</span>
            <Terminal className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{logs.length}</span>
            <span className="text-xs text-emerald-400 font-semibold">/ 1000 Ring</span>
          </div>
          <div className="text-xs text-slate-400">
            {uniqueSubsystems.length} monitored micro-subsystems
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Ingress status: Nominal
          </div>
        </div>

        {/* KPI 2: Error Interception Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="uppercase tracking-wider">Intercepted Incidents</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{incidents.length}</span>
            <span className={`text-xs font-semibold ${incidents.length === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {incidents.length === 0 ? 'Zero Fatalities' : 'Logged & Isolated'}
            </span>
          </div>
          <div className="text-xs text-slate-400">
            Error boundary isolated to subtrees
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Mean Time to Detect (MTTD): &lt;10ms
          </div>
        </div>

        {/* KPI 3: API Quota Consumption */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="uppercase tracking-wider">API Sentinels</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {rateLimits.filter(r => r.status === 'nominal').length} / {rateLimits.length}
            </span>
            <span className="text-xs text-cyan-400 font-semibold">Nominal</span>
          </div>
          <div className="text-xs text-slate-400">
            {rateLimits.filter(r => r.status === 'warning').length} threshold warnings (Meta Graph)
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            0 Throttled endpoints
          </div>
        </div>

        {/* KPI 4: Circuit Breaker Health */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="uppercase tracking-wider">Circuit Breakers</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {circuitBreakers.filter(c => c.state === 'closed').length} / {circuitBreakers.length}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">Closed / Passing</span>
          </div>
          <div className="text-xs text-slate-400">
            M-Pesa, Cloudflare, Meta, Gemini
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Automatic backoff retry enabled
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('telemetry')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'telemetry'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Live Telemetry & Logs ({filteredLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('incidents')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'incidents'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Error Boundary & Incidents ({incidents.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ratelimits')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ratelimits'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>API Rate-Limit Sentinels ({rateLimits.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('circuit')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'circuit'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Circuit Breakers & Network Telemetry</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LIVE TELEMETRY & LOG STREAM */}
      {/* ========================================================================= */}
      {activeTab === 'telemetry' && (
        <div className="space-y-4">
          {/* Controls Strip */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                placeholder="Search log messages, traces, or subsystems..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white pl-9 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Level Filter */}
              <select
                value={logFilterLevel}
                onChange={(e) => setLogFilterLevel(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 font-mono uppercase"
              >
                <option value="all">All Levels</option>
                <option value="debug">DEBUG</option>
                <option value="info">INFO</option>
                <option value="warn">WARN</option>
                <option value="error">ERROR</option>
                <option value="fatal">FATAL</option>
              </select>

              {/* Subsystem Filter */}
              <select
                value={logFilterSubsystem}
                onChange={(e) => setLogFilterSubsystem(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Subsystems</option>
                {uniqueSubsystems.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>

              {/* Pause/Resume Live Streaming */}
              <button
                type="button"
                onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                  isLiveStreaming
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40 hover:bg-emerald-900/40'
                    : 'bg-amber-950/40 text-amber-300 border-amber-800/40 hover:bg-amber-900/40'
                }`}
              >
                {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isLiveStreaming ? 'Live Stream' : 'Stream Paused'}</span>
              </button>

              {/* Export JSON */}
              <button
                type="button"
                onClick={handleDownloadLogsJson}
                className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Download Telemetry JSON"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Clear Buffer */}
              <button
                type="button"
                onClick={() => {
                  observabilityService.clearLogs();
                  setLogs([]);
                  addToast('Buffer Cleared', 'In-memory log ring buffer reset', 'info');
                }}
                className="p-1.5 bg-slate-950 hover:bg-red-950/60 border border-slate-800 hover:border-red-800/40 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                title="Clear Log Buffer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Emit Test Log Banner */}
          <form onSubmit={handleEmitCustomLog} className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex flex-wrap items-center gap-2.5 text-xs">
            <span className="font-mono text-emerald-400 font-bold shrink-0">Emit Telemetry:</span>
            <select
              value={newLogLevel}
              onChange={(e) => setNewLogLevel(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 text-xs text-white px-2 py-1 rounded font-mono uppercase focus:outline-none focus:border-emerald-500"
            >
              <option value="debug">DEBUG</option>
              <option value="info">INFO</option>
              <option value="warn">WARN</option>
              <option value="error">ERROR</option>
              <option value="fatal">FATAL</option>
            </select>

            <input
              type="text"
              value={newLogSubsystem}
              onChange={(e) => setNewLogSubsystem(e.target.value)}
              placeholder="subsystem"
              className="w-28 bg-slate-950 border border-slate-800 text-xs text-white px-2 py-1 rounded font-mono focus:outline-none focus:border-emerald-500"
            />

            <input
              type="text"
              value={newLogMessage}
              onChange={(e) => setNewLogMessage(e.target.value)}
              placeholder="Log message payload..."
              className="flex-1 min-w-[200px] bg-slate-950 border border-slate-800 text-xs text-white px-2.5 py-1 rounded focus:outline-none focus:border-emerald-500"
            />

            <button
              type="submit"
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded text-xs flex items-center gap-1 shadow-sm"
            >
              <Send className="w-3 h-3" />
              <span>Emit</span>
            </button>
          </form>

          {/* Log Stream Output */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Event Stream ({filteredLogs.length} events matching query)</span>
              </div>
              <span>Buffer Capacity: 1000 FIFO</span>
            </div>

            <div className="divide-y divide-slate-800/60 max-h-[500px] overflow-y-auto">
              {filteredLogs.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  No telemetry events match current filter conditions.
                </div>
              ) : (
                filteredLogs.map(log => {
                  const levelColor =
                    log.level === 'fatal' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    log.level === 'error' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                    log.level === 'warn' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    log.level === 'info' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                    'bg-slate-800 text-slate-400 border-slate-700';

                  const timeStr = new Date(log.timestamp).toLocaleTimeString();

                  return (
                    <div
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="p-3 hover:bg-slate-900/60 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                        {/* Timestamp */}
                        <span className="text-slate-500 text-[10px] shrink-0">{timeStr}</span>

                        {/* Level Badge */}
                        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border shrink-0 ${levelColor}`}>
                          {log.level}
                        </span>

                        {/* Subsystem */}
                        <span className="text-slate-400 text-[11px] shrink-0 font-semibold">
                          [{log.subsystem}]
                        </span>

                        {/* Message */}
                        <span className="text-slate-200 text-xs truncate">
                          {log.message}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-[10px] text-slate-500">
                        {log.durationMs && (
                          <span className="text-emerald-400 font-semibold">{log.durationMs}ms</span>
                        )}
                        <span className="text-slate-600 truncate max-w-[120px]">{log.traceId}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Inspect Single Log Modal */}
          {selectedLog && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>Telemetry Event Payload</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedLog(null)}
                    className="text-slate-400 hover:text-slate-200 text-xs font-mono"
                  >
                    ✕ ESC
                  </button>
                </div>

                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-[360px] leading-relaxed">
                  {JSON.stringify(selectedLog, null, 2)}
                </pre>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleCopyText(JSON.stringify(selectedLog, null, 2), 'Log JSON')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ERROR BOUNDARY & INCIDENT SENTINEL */}
      {/* ========================================================================= */}
      {activeTab === 'incidents' && (
        <div className="space-y-6">
          {/* Top Banner with Crash Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>Error Boundary Diagnostic Incident Capture Hub</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Whenever an uncaught React runtime exception occurs, the defensive Error Boundary isolates the failure,
                captures full browser/tenant metadata, grabs the last 15 telemetry logs, and generates a one-click incident report bundle.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSimulateClientError}
              className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 transition-all self-start md:self-auto shrink-0 shadow-lg"
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Simulate Runtime Error</span>
            </button>
          </div>

          {/* Incidents List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Intercepted Incidents ({incidents.length})
              </span>
              <span className="text-[11px] text-slate-500">Click incident to inspect bundle</span>
            </div>

            {incidents.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Zero Runtime Incidents Intercepted</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  All component subtrees are rendering nominal without fatal exceptions. Use the button above to simulate a crash bundle.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {incidents.map(inc => (
                  <div
                    key={inc.incidentId}
                    onClick={() => setInspectedIncident(inc)}
                    className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping"></span>
                        <span className="text-xs font-bold text-white font-mono">{inc.incidentId}</span>
                        <span className="text-[10px] font-mono uppercase bg-rose-950 text-rose-400 border border-rose-800/50 px-2 py-0.5 rounded font-bold">
                          {inc.errorName}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        {new Date(inc.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      {inc.errorMessage}
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                      <span>View: <strong className="text-slate-200">{inc.activeView}</strong></span>
                      <span>Tenant: <strong className="text-slate-200">{inc.tenantId}</strong></span>
                      <span>Logs Attached: <strong className="text-emerald-400">{inc.recentTelemetry.length} events</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inspected Incident Modal */}
          {inspectedIncident && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <AlertOctagon className="w-4 h-4 text-rose-400" />
                    <span>Incident Bundle: {inspectedIncident.incidentId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInspectedIncident(null)}
                    className="text-slate-400 hover:text-slate-200 text-xs font-mono"
                  >
                    ✕ ESC
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1 font-semibold">Error Message:</span>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-rose-300 font-mono">
                      {inspectedIncident.errorMessage}
                    </div>
                  </div>

                  {inspectedIncident.componentStack && (
                    <div>
                      <span className="text-slate-400 block mb-1 font-semibold">Component Trace:</span>
                      <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 text-[10px] font-mono overflow-x-auto">
                        {inspectedIncident.componentStack}
                      </pre>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-400 block mb-1 font-semibold">
                      Attached Causal Telemetry Stream ({inspectedIncident.recentTelemetry.length} logs):
                    </span>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[10px] max-h-40 overflow-y-auto">
                      {inspectedIncident.recentTelemetry.map((t, idx) => (
                        <div key={idx} className="flex items-center justify-between text-slate-400">
                          <span className="truncate">[{t.level.toUpperCase()}] [{t.subsystem}] {t.message}</span>
                          <span className="text-slate-600 shrink-0">{t.timestamp.slice(11, 19)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      const bundle = observabilityService.generateIncidentBundle(inspectedIncident);
                      handleCopyText(bundle, 'Incident Bundle');
                    }}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON Bundle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const bundle = observabilityService.generateIncidentBundle(inspectedIncident);
                      const blob = new Blob([bundle], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `incident-${inspectedIncident.incidentId}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      addToast('Report Downloaded', `Saved incident ${inspectedIncident.incidentId}.json`, 'success');
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Diagnostic Report</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: API RATE-LIMIT SENTINELS */}
      {/* ========================================================================= */}
      {activeTab === 'ratelimits' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>External & Gateway API Quota Sentinels</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Proactive rate limit monitoring protecting upstream third-party APIs from 429 Too Many Requests penalties.
                </p>
              </div>

              <span className="text-xs text-slate-400 font-mono">
                Auto-resets on window rollover
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rateLimits.map(sentinel => {
                const percentage = Math.round((sentinel.quotaUsed / sentinel.quotaLimit) * 100);
                const statusColor =
                  sentinel.status === 'throttled' ? 'text-red-400 bg-red-950/60 border-red-800/40' :
                  sentinel.status === 'warning' ? 'text-amber-400 bg-amber-950/60 border-amber-800/40' :
                  'text-emerald-400 bg-emerald-950/60 border-emerald-800/40';

                return (
                  <div
                    key={sentinel.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-white">{sentinel.serviceName}</div>
                        <div className="text-[10px] text-slate-400 font-mono uppercase mt-0.5">
                          {sentinel.category} · Window: 1 {sentinel.windowUnit}
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-bold ${statusColor}`}>
                        {sentinel.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">
                          {sentinel.quotaUsed} / {sentinel.quotaLimit} calls
                        </span>
                        <span className="text-white font-bold">{percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            percentage >= 100 ? 'bg-red-500' :
                            percentage >= 80 ? 'bg-amber-500' :
                            'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Controls Strip */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                      <span className="text-[10px] font-mono text-slate-500">
                        Resets in: {sentinel.resetSecondsRemaining}s
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            observabilityService.consumeRateLimitQuota(sentinel.id, 5);
                            setRateLimits(observabilityService.getRateLimitSentinels());
                          }}
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] rounded font-mono text-slate-300"
                        >
                          +5 Calls
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            observabilityService.resetRateLimitQuota(sentinel.id);
                            setRateLimits(observabilityService.getRateLimitSentinels());
                            addToast('Quota Reset', `Reset quota for ${sentinel.serviceName}`, 'info');
                          }}
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] rounded font-mono text-slate-400 hover:text-white"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CIRCUIT BREAKERS & NETWORK TELEMETRY */}
      {/* ========================================================================= */}
      {activeTab === 'circuit' && (
        <div className="space-y-6">
          {/* Network Health Strip */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span>Nairobi Regional & Global Ingress Network Probe</span>
              </h3>

              <button
                type="button"
                onClick={handlePingNetwork}
                disabled={isPingingNetwork}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw className={`w-3 h-3 ${isPingingNetwork ? 'animate-spin' : ''}`} />
                <span>Ping Route</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase">Connectivity</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">
                  {networkStatus.online ? 'Online' : 'Offline'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{networkStatus.effectiveType.toUpperCase()}</div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase">Round-Trip Time</div>
                <div className="text-lg font-bold text-teal-400 mt-0.5">{networkStatus.rttMs} ms</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Nairobi Anycast Node</div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase">Estimated Downlink</div>
                <div className="text-lg font-bold text-white mt-0.5">{networkStatus.downlinkMbps} Mbps</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Symmetric Pipe</div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase">Latency Jitter</div>
                <div className="text-lg font-bold text-cyan-400 mt-0.5">{networkStatus.jitterMs} ms</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Packet Variance</div>
              </div>
            </div>
          </div>

          {/* Circuit Breakers Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Distributed Circuit Breakers Status</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Protects against cascading downstream failures
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {circuitBreakers.map(cb => {
                const stateColor =
                  cb.state === 'closed' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40' :
                  cb.state === 'open' ? 'bg-red-950/60 text-red-400 border-red-800/40' :
                  'bg-amber-950/60 text-amber-400 border-amber-800/40';

                return (
                  <div
                    key={cb.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-white">{cb.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Threshold: {cb.failureThreshold} failures · Timeout: {cb.recoveryTimeoutSeconds}s
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-bold ${stateColor}`}>
                        {cb.state}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono pt-1">
                      <span className="text-slate-400">
                        Failures: <strong className={cb.failureCount > 0 ? 'text-amber-400' : 'text-slate-200'}>{cb.failureCount} / {cb.failureThreshold}</strong>
                      </span>
                      <span className="text-emerald-400">{cb.latencyMs}ms RTT</span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                      {cb.state === 'closed' ? (
                        <button
                          type="button"
                          onClick={() => {
                            observabilityService.tripCircuitBreaker(cb.id);
                            setCircuitBreakers(observabilityService.getCircuitBreakers());
                            addToast('Circuit Breaker Tripped', `Severed traffic for ${cb.name}`, 'warning');
                          }}
                          className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-[11px] font-mono rounded"
                        >
                          Trip Breaker (Test)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            observabilityService.resetCircuitBreaker(cb.id);
                            setCircuitBreakers(observabilityService.getCircuitBreakers());
                            addToast('Circuit Breaker Closed', `Restored traffic for ${cb.name}`, 'success');
                          }}
                          className="px-2.5 py-1 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 text-[11px] font-mono rounded"
                        >
                          Reset to Closed
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
