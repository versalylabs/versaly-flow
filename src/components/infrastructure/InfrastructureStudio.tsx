/**
 * Versaly Flow - Infrastructure & Cloud Configuration Studio
 * Phase 31: Infrastructure & Cloud Configuration
 * Production Container Specs, Environment Variable Validation, Edge Caching & Health Probes
 */

import React, { useState, useEffect } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { infrastructureService } from '../../services/infrastructureService';
import {
  EnvironmentTier,
  EnvVarDefinition,
  EnvAuditReport,
  EdgeCacheRule,
  HealthProbeReport
} from '../../types';
import {
  Server,
  ShieldCheck,
  Cpu,
  Activity,
  Terminal,
  Layers,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  Download,
  Lock,
  ExternalLink,
  Flame,
  Zap,
  Globe,
  HardDrive,
  FileCode,
  Gauge,
  Sliders,
  Radio,
  ArrowRight
} from 'lucide-react';

export const InfrastructureStudio: React.FC = () => {
  const { workspace, addToast } = useAgency();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'env' | 'docker' | 'edge' | 'health'>('env');

  // Environment Audit State
  const [selectedEnvTier, setSelectedEnvTier] = useState<EnvironmentTier>('production');
  const [envFilterCategory, setEnvFilterCategory] = useState<string>('all');
  const [showSecretMap, setShowSecretMap] = useState<Record<string, boolean>>({});
  const [auditReport, setAuditReport] = useState<EnvAuditReport>(() =>
    infrastructureService.auditEnvironment('production')
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Health Probe State
  const [healthReport, setHealthReport] = useState<HealthProbeReport | null>(null);
  const [isProbing, setIsProbing] = useState<boolean>(false);
  const [simulatedFailureId, setSimulatedFailureId] = useState<string>('');

  // Edge & Compression Simulator State
  const [samplePayloadKb, setSamplePayloadKb] = useState<number>(350);

  // Re-run audit when tier changes
  useEffect(() => {
    const report = infrastructureService.auditEnvironment(selectedEnvTier);
    setAuditReport(report);
  }, [selectedEnvTier]);

  // Initial health probe sweep
  useEffect(() => {
    runProbes();
  }, []);

  const runProbes = async (failId?: string) => {
    setIsProbing(true);
    try {
      const rep = await infrastructureService.runHealthProbes(failId);
      setHealthReport(rep);
    } finally {
      setTimeout(() => setIsProbing(false), 300);
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(label);
    addToast('Copied to Clipboard', `${label} copied successfully`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleShowSecret = (key: string) => {
    setShowSecretMap(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredEnvVars = auditReport.variables.filter(v => {
    if (envFilterCategory !== 'all' && v.category !== envFilterCategory) return false;
    return true;
  });

  const edgeRules = infrastructureService.getEdgeCacheRules();
  const containerSpec = infrastructureService.getContainerSpec();
  const dockerfileText = infrastructureService.getDockerfileContent();
  const dockerComposeText = infrastructureService.getDockerComposeContent();
  const nginxText = infrastructureService.getNginxConfigContent();

  // Compression calculations
  const gzipEstimateKb = Math.round(samplePayloadKb * 0.28);
  const brotliEstimateKb = Math.round(samplePayloadKb * 0.21);
  const savingsPercent = Math.round(((samplePayloadKb - brotliEstimateKb) / samplePayloadKb) * 100);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Versaly Flow</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Infrastructure & Cloud Configuration</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">Port 3000 Containerized SRE Studio</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Server className="w-6 h-6 text-emerald-400" />
            <span>Cloud Infrastructure & Production Sentinel</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Multi-stage Docker container specifications, strict production environment variable validation,
            Brotli/Gzip edge caching rules, and automated container healthcheck probes.
          </p>
        </div>

        {/* Global Infrastructure Telemetry Badge */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs font-mono self-start md:self-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-slate-300 font-bold">PORT 3000</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-semibold">Node 22-Alpine</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 uppercase">{selectedEnvTier}</span>
        </div>
      </div>

      {/* Primary KPI Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Env Security Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="uppercase tracking-wider">Env Safety Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{auditReport.safetyScore}%</span>
            <span className="text-xs text-emerald-400 font-semibold">Hardened</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                auditReport.safetyScore >= 90 ? 'bg-emerald-500' : auditReport.safetyScore >= 70 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${auditReport.safetyScore}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {auditReport.validCount} valid · {auditReport.missingCount} missing · {auditReport.insecureDefaultCount} warnings
          </div>
        </div>

        {/* KPI 2: Container Image Profile */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="uppercase tracking-wider">Container Footprint</span>
            <Cpu className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">~128 MB</span>
            <span className="text-xs text-teal-400 font-semibold">-89% vs Full</span>
          </div>
          <div className="text-xs text-slate-400">
            Multi-stage Alpine base stripped of devDependencies
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Limit: 512MB RAM · 1.0 vCPU
          </div>
        </div>

        {/* KPI 3: Edge Cache Efficiency */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="uppercase tracking-wider">Edge Compression</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{savingsPercent}%</span>
            <span className="text-xs text-amber-400 font-semibold">Brotli (br)</span>
          </div>
          <div className="text-xs text-slate-400">
            Immutable asset chunks cached for 365 days
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            stale-while-revalidate enabled
          </div>
        </div>

        {/* KPI 4: Probe Uptime & Liveness */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="uppercase tracking-wider">Cluster Liveness</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {healthReport ? `${healthReport.latencyMs}ms` : '1.2ms'}
            </span>
            <span className="text-xs text-emerald-400 font-semibold capitalize">
              {healthReport?.status || 'Healthy'}
            </span>
          </div>
          <div className="text-xs text-slate-400">
            /healthz HTTP probe on 0.0.0.0:3000
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Uptime: {healthReport ? `${Math.floor(healthReport.uptimeSeconds / 60)}m ${healthReport.uptimeSeconds % 60}s` : 'Active'}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('env')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'env'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Environment & Secrets Sentinel ({auditReport.totalVars})</span>
        </button>

        <button
          onClick={() => setActiveTab('docker')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'docker'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Container & Dockerfile Specifications</span>
        </button>

        <button
          onClick={() => setActiveTab('edge')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'edge'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Edge Caching & Nginx Proxy</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'health'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Health Probes & Liveness Sentinel</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ENVIRONMENT & SECRETS SENTINEL */}
      {/* ========================================================================= */}
      {activeTab === 'env' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
            {/* Tier Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">Environment Tier:</span>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
                {(['development', 'staging', 'production'] as EnvironmentTier[]).map(tier => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setSelectedEnvTier(tier)}
                    className={`px-3 py-1 rounded-md font-mono text-[11px] capitalize transition-all ${
                      selectedEnvTier === tier
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter & Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={envFilterCategory}
                onChange={(e) => setEnvFilterCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="core">Core Server & Network</option>
                <option value="database">Database & Cache</option>
                <option value="security">Security & Cryptography</option>
                <option value="integrations">Integrations (M-Pesa)</option>
                <option value="storage">Storage & DAM</option>
                <option value="ai">AI Strategy Engine</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  const rep = infrastructureService.auditEnvironment(selectedEnvTier);
                  setAuditReport(rep);
                  addToast('Environment Audit Complete', `Audited ${rep.totalVars} variables for ${selectedEnvTier}`, 'success');
                }}
                className="bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Re-Audit</span>
              </button>

              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .env</span>
              </button>
            </div>
          </div>

          {/* Variables Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/60">
                    <th className="py-3 px-4 font-semibold text-slate-300">Variable Key</th>
                    <th className="py-3 px-4 font-semibold text-slate-300">Category</th>
                    <th className="py-3 px-4 font-semibold text-slate-300">Status</th>
                    <th className="py-3 px-4 font-semibold text-slate-300">Value (Masked)</th>
                    <th className="py-3 px-4 font-semibold text-slate-300">Validation Specification</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredEnvVars.map(item => {
                    const isVisible = showSecretMap[item.key] || !item.isSecret;
                    const displayVal = isVisible ? (item.currentValue || item.defaultValue || '—') : infrastructureService.maskSecret(item.currentValue || item.defaultValue);

                    return (
                      <tr key={item.key} className="hover:bg-slate-950/40 transition-colors">
                        {/* Key & Required Badge */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white text-xs">{item.key}</span>
                            {item.required ? (
                              <span className="text-[9px] font-mono text-rose-400 bg-rose-950/50 border border-rose-800/40 px-1.5 py-0.2 rounded uppercase">
                                Req
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1 rounded">
                                Opt
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 max-w-sm leading-snug">
                            {item.description}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-mono uppercase bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                            {item.category}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          {item.status === 'valid' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded text-emerald-400 bg-emerald-950/60 border border-emerald-800/40">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Valid</span>
                            </span>
                          )}
                          {item.status === 'missing' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded text-rose-400 bg-rose-950/60 border border-rose-800/40">
                              <AlertTriangle className="w-3 h-3 text-rose-400" />
                              <span>Missing</span>
                            </span>
                          )}
                          {item.status === 'insecure_default' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded text-amber-400 bg-amber-950/60 border border-amber-800/40">
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                              <span>Insecure Default</span>
                            </span>
                          )}
                          {item.status === 'invalid_format' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded text-red-400 bg-red-950/60 border border-red-800/40">
                              <AlertTriangle className="w-3 h-3 text-red-400" />
                              <span>Format Error</span>
                            </span>
                          )}
                          {item.errorMessage && (
                            <div className="text-[10px] text-rose-300 mt-1 font-mono">
                              {item.errorMessage}
                            </div>
                          )}
                        </td>

                        {/* Masked Value */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 max-w-xs">
                            <code className="text-xs font-mono text-slate-300 truncate bg-slate-950 px-2 py-1 rounded border border-slate-800 block">
                              {displayVal}
                            </code>
                            {item.isSecret && (
                              <button
                                type="button"
                                onClick={() => toggleShowSecret(item.key)}
                                className="text-slate-500 hover:text-slate-300 p-1"
                                title={isVisible ? 'Hide Secret' : 'Reveal Secret'}
                              >
                                {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Validation Rule */}
                        <td className="py-3 px-4 text-[11px] text-slate-400 font-mono">
                          {item.validationRule || 'Standard format'}
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleCopyText(`${item.key}="${item.currentValue || item.defaultValue}"`, item.key)}
                            className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                            title="Copy Variable Assignment"
                          >
                            {copiedKey === item.key ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CONTAINER & DOCKER ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'docker' && (
        <div className="space-y-6">
          {/* Architecture Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="uppercase">Container Archetype</span>
                <HardDrive className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-sm font-bold text-white font-mono">{containerSpec.baseImage}</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Alpine Linux footprint with zero bloat. Strips all compiler tools post-build for minimal attack surface.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="uppercase">Port 3000 Daemon</span>
                <Radio className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-sm font-bold text-white font-mono">0.0.0.0:{containerSpec.targetPort}</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Matches the running background dev server and cloud container ingress ingress controller specs.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="uppercase">Process Supervisor</span>
                <Terminal className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-sm font-bold text-white font-mono">dumb-init / Non-Root node</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Handles kernel SIGTERM / SIGINT forward signals cleanly to avoid zombie orphan processes.
              </p>
            </div>
          </div>

          {/* Dockerfile & Docker-Compose Viewers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Dockerfile */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white font-mono">Dockerfile (Multi-Stage Production)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(dockerfileText, 'Dockerfile')}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs px-2.5 py-1 rounded-lg text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'Dockerfile' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Dockerfile</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[460px] leading-relaxed">
                {dockerfileText}
              </pre>
            </div>

            {/* Right: docker-compose.yml */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white font-mono">docker-compose.yml (App + Cache + Proxy)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(dockerComposeText, 'docker-compose.yml')}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs px-2.5 py-1 rounded-lg text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'docker-compose.yml' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Compose</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[460px] leading-relaxed">
                {dockerComposeText}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: EDGE CACHING & NGINX PROXY */}
      {/* ========================================================================= */}
      {activeTab === 'edge' && (
        <div className="space-y-6">
          {/* Interactive Compression Benchmark Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Brotli & Gzip Payload Edge Compression Simulator</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculate real-world bandwidth reductions for East African mobile audiences on 3G/4G/5G connections.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Simulate Asset Size:</span>
                <input
                  type="number"
                  min={50}
                  max={5000}
                  step={50}
                  value={samplePayloadKb}
                  onChange={(e) => setSamplePayloadKb(Math.max(1, Number(e.target.value)))}
                  className="w-24 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white px-2 py-1 text-center font-mono focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-400 font-mono">KB</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Uncompressed Wire Transfer</div>
                <div className="text-xl font-bold font-mono text-slate-300">{samplePayloadKb} KB</div>
                <div className="text-[11px] text-slate-500">100% baseline payload</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Gzip (gzip -6)</div>
                <div className="text-xl font-bold font-mono text-teal-400">{gzipEstimateKb} KB</div>
                <div className="text-[11px] text-teal-400 font-semibold">-72% Bandwidth saved</div>
              </div>

              <div className="p-4 bg-slate-950 border border-emerald-800/40 bg-emerald-950/10 rounded-xl text-center space-y-1">
                <div className="text-[10px] text-emerald-400 uppercase font-mono font-bold">Brotli Edge (br -11)</div>
                <div className="text-xl font-bold font-mono text-emerald-300">{brotliEstimateKb} KB</div>
                <div className="text-[11px] text-emerald-400 font-semibold">-{savingsPercent}% Ultra-compact wire size</div>
              </div>
            </div>
          </div>

          {/* Edge Cache Rules Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Edge Cache-Control Header Directives Matrix</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                CDN: Cloudflare / Fastly / AWS CloudFront
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/60">
                    <th className="py-2.5 px-3">Path Pattern</th>
                    <th className="py-2.5 px-3">Directives</th>
                    <th className="py-2.5 px-3 text-center">Browser TTL</th>
                    <th className="py-2.5 px-3 text-center">CDN Edge TTL</th>
                    <th className="py-2.5 px-3">Compression</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {edgeRules.map(rule => (
                    <tr key={rule.id} className="hover:bg-slate-950/40">
                      <td className="py-3 px-3 font-bold text-white">
                        <div>{rule.pathPattern}</div>
                        <div className="text-[11px] font-sans text-slate-400 font-normal mt-0.5">{rule.description}</div>
                      </td>
                      <td className="py-3 px-3">
                        <code className="text-[11px] text-emerald-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                          {rule.cacheControl}
                        </code>
                      </td>
                      <td className="py-3 px-3 text-center text-slate-300">
                        {rule.browserTtlSeconds > 0 ? `${rule.browserTtlSeconds / 86400}d` : '0s'}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-300">
                        {rule.cdnTtlSeconds > 0 ? `${rule.cdnTtlSeconds / 86400}d` : '0s'}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1">
                          {rule.compression.map(c => (
                            <span key={c} className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Nginx Hardened Configuration */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white font-mono">nginx.conf (Hardened Reverse Proxy)</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(nginxText, 'nginx.conf')}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs px-2.5 py-1 rounded-lg text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                {copiedKey === 'nginx.conf' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy Nginx Config</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[360px] leading-relaxed">
              {nginxText}
            </pre>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: HEALTH PROBES & LIVENESS SENTINEL */}
      {/* ========================================================================= */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          {/* Probe Control Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Container Liveness & Readiness Probes Engine</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Periodic heartbeat monitors polling HTTP port 3000, in-memory caches, and East African edge routing.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => runProbes(simulatedFailureId || undefined)}
                disabled={isProbing}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProbing ? 'animate-spin' : ''}`} />
                <span>Run Probe Sweep</span>
              </button>

              <select
                value={simulatedFailureId}
                onChange={(e) => {
                  setSimulatedFailureId(e.target.value);
                  runProbes(e.target.value || undefined);
                }}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
              >
                <option value="">Simulate: Normal (100% Pass)</option>
                <option value="chk_http_listener">Simulate: Port 3000 Timeout</option>
                <option value="chk_storage_engine">Simulate: Storage Lock</option>
                <option value="chk_session_auth">Simulate: Auth Registry Error</option>
                <option value="chk_edge_dns">Simulate: Edge BGP Failure</option>
              </select>
            </div>
          </div>

          {/* Active Probe Checks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthReport?.checks.map(chk => (
              <div
                key={chk.id}
                className={`p-4 rounded-xl border transition-all space-y-2 ${
                  chk.ok
                    ? 'bg-slate-900/80 border-slate-800'
                    : 'bg-rose-950/20 border-rose-800/60 ring-1 ring-rose-500/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${chk.ok ? 'bg-emerald-400' : 'bg-rose-400 animate-ping'}`} />
                    <span className="text-xs font-bold text-white font-mono">{chk.name}</span>
                  </div>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                    chk.ok
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                      : 'bg-rose-950/80 text-rose-300 border-rose-800/60 font-bold'
                  }`}>
                    {chk.ok ? 'Passing' : 'Failed'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 leading-snug">
                  {chk.message}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/60">
                  <span>Target: {chk.target}</span>
                  <span className={chk.ok ? 'text-emerald-400' : 'text-rose-400'}>{chk.latencyMs}ms RTT</span>
                </div>
              </div>
            ))}
          </div>

          {/* Memory Heap & Process Telemetry */}
          {healthReport && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-teal-400" />
                <span>Node.js Process Memory Allocation Telemetry</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Resident Set Size (RSS)</div>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">{healthReport.memory.rssMb} MB</div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">V8 Heap Total</div>
                  <div className="text-lg font-bold font-mono text-teal-400 mt-0.5">{healthReport.memory.heapTotalMb} MB</div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">V8 Heap Used</div>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">{healthReport.memory.heapUsedMb} MB</div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">External C++ Buffers</div>
                  <div className="text-lg font-bold font-mono text-indigo-400 mt-0.5">{healthReport.memory.externalMb} MB</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export .env Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Configuration: .env.{selectedEnvTier}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕ ESC
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Download or copy the generated environment specification. In production, ensure sensitive database and payment tokens are stored in your cloud secret manager (e.g. AWS Secrets Manager or HashiCorp Vault).
            </p>

            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[380px] leading-relaxed">
              {infrastructureService.generateEnvFileContent(selectedEnvTier)}
            </pre>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleCopyText(infrastructureService.generateEnvFileContent(selectedEnvTier), `.env.${selectedEnvTier}`);
                  setShowExportModal(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy to Clipboard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
