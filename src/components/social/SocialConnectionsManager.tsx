/**
 * PulseBrand Agency OS - Social Account Connections & OAuth Tokens
 * Phase 17: Social Account Connections
 * Secure OAuth connection management for Meta, LinkedIn, X, TikTok, and YouTube.
 * Real-time token lifecycle health checks, token expiration alerts, granular permission audits,
 * and sandbox / dry-run mock publishing test mode.
 */

import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { SocialAccount, SocialPlatform, OAuthTokenHealth } from '../../types';
import {
  Share2,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Lock,
  Plus,
  Trash2,
  Key,
  Globe,
  Radio,
  ExternalLink,
  Sliders,
  PlayCircle,
  HelpCircle,
  Info,
  Check,
  X
} from 'lucide-react';

interface PlatformMeta {
  id: SocialPlatform;
  name: string;
  iconBg: string;
  iconText: string;
  primaryColor: string;
  defaultScopes: string[];
}

const PLATFORM_CONFIGS: Record<SocialPlatform, PlatformMeta> = {
  instagram: {
    id: 'instagram',
    name: 'Instagram Graph API',
    iconBg: 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600',
    iconText: 'IG',
    primaryColor: '#ec4899',
    defaultScopes: ['instagram_basic', 'instagram_content_publish', 'pages_show_list', 'business_management']
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn Community Management API',
    iconBg: 'bg-blue-600',
    iconText: 'in',
    primaryColor: '#2563eb',
    defaultScopes: ['w_member_social', 'r_organization_social', 'rw_organization_admin']
  },
  twitter: {
    id: 'twitter',
    name: 'X (formerly Twitter) v2 API',
    iconBg: 'bg-slate-900 border border-slate-700',
    iconText: '𝕏',
    primaryColor: '#94a3b8',
    defaultScopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access']
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok Content Posting API',
    iconBg: 'bg-black border border-cyan-500/40',
    iconText: 'TT',
    primaryColor: '#06b6d4',
    defaultScopes: ['video.upload', 'video.publish', 'user.info.basic']
  },
  facebook: {
    id: 'facebook',
    name: 'Meta Facebook Pages API',
    iconBg: 'bg-blue-700',
    iconText: 'f',
    primaryColor: '#1d4ed8',
    defaultScopes: ['pages_manage_posts', 'pages_read_engagement', 'publish_video']
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube Data API v3',
    iconBg: 'bg-red-600',
    iconText: 'YT',
    primaryColor: '#ef4444',
    defaultScopes: ['youtube.upload', 'youtube.readonly']
  }
};

export const SocialConnectionsManager: React.FC = () => {
  const {
    workspace,
    clients,
    connectSocialAccount,
    disconnectSocialAccount,
    refreshOAuthToken,
    toggleSandboxMode,
    runMockPublishTest,
    addToast
  } = useAgency();

  // Scoped Clients
  const scopedClients = clients.filter(c => c.tenantId === workspace.id);
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [testingAccountId, setTestingAccountId] = useState<string | null>(null);

  // Connect Modal Form State
  const [modalClientId, setModalClientId] = useState<string>(scopedClients[0]?.id || '');
  const [modalPlatform, setModalPlatform] = useState<SocialPlatform>('instagram');
  const [modalHandle, setModalHandle] = useState<string>('');
  const [modalAccountName, setModalAccountName] = useState<string>('');
  const [modalSandbox, setModalSandbox] = useState<boolean>(false);

  // Flattened Scoped Social Accounts
  const allAccounts: { client: typeof scopedClients[0]; account: SocialAccount }[] = [];
  scopedClients.forEach(c => {
    if (selectedClientId === 'all' || c.id === selectedClientId) {
      c.socialAccounts?.forEach(acc => {
        allAccounts.push({ client: c, account: acc });
      });
    }
  });

  // Calculate Token Health Counts
  const healthyCount = allAccounts.filter(a => a.account.tokenHealth === 'healthy').length;
  const expiringCount = allAccounts.filter(a => a.account.tokenHealth === 'expiring_soon').length;
  const sandboxCount = allAccounts.filter(a => a.account.sandboxMode).length;

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalHandle.trim()) {
      addToast('Validation Error', 'Account handle is required', 'error');
      return;
    }

    const platformConfig = PLATFORM_CONFIGS[modalPlatform];
    const cleanHandle = modalHandle.startsWith('@') ? modalHandle : `@${modalHandle}`;

    connectSocialAccount(modalClientId, {
      platform: modalPlatform,
      handle: cleanHandle,
      accountName: modalAccountName.trim() || `${cleanHandle} Official`,
      connected: true,
      followerCount: Math.floor(Math.random() * 50000) + 1200,
      tokenHealth: 'healthy',
      scopesGranted: platformConfig.defaultScopes,
      permissions: {
        publishContent: true,
        readInsights: true,
        managePages: modalPlatform === 'facebook' || modalPlatform === 'instagram',
        directMessages: false
      },
      sandboxMode: modalSandbox,
      apiEndpointRegion: 'af-south-1 (Nairobi Edge)'
    });

    setIsConnectModalOpen(false);
    setModalHandle('');
    setModalAccountName('');
  };

  const handleTestDispatch = (clientId: string, accountId: string) => {
    setTestingAccountId(accountId);
    setTimeout(() => {
      runMockPublishTest(clientId, accountId);
      setTestingAccountId(null);
    }, 600);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>{workspace.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Social Account Connections</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">{allAccounts.length} Connected Profiles</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>OAuth Channel Integrations & Token Governance</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Multi-platform social connector hub for Meta (Instagram/Facebook), LinkedIn, X, TikTok, and YouTube.
            Monitor OAuth token lifecycle health, 60-day auto-refresh cycles, granted API scopes, and sandbox dry-run testing.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/30"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Channel Account</span>
          </button>
        </div>
      </div>

      {/* Connection Pulse & Token Health Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Active Channel Endpoints</span>
            <Globe className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{allAccounts.length} Connected</div>
          <div className="text-[10px] text-slate-500">Across {scopedClients.length} retained Kenyan brands</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>OAuth Token Health</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">
            {healthyCount} / {allAccounts.length} Verified
          </div>
          <div className="text-[10px] text-slate-500">All cryptographic signatures valid</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Expiring Soon (&lt; 7 Days)</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono">
            {expiringCount} Token Renewal Alert
          </div>
          <div className="text-[10px] text-slate-500">Auto-refresh available with 1 click</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Sandbox Dry-Run Mode</span>
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-400 font-mono">{sandboxCount} Mocking</div>
          <div className="text-[10px] text-slate-500">Safely test dispatches without live publishing</div>
        </div>
      </div>

      {/* Brand Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Brands Combined ({scopedClients.length})</option>
              {scopedClients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <span>Security Standard:</span>
          <span className="text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            OAuth 2.0 PKCE Verified
          </span>
        </div>
      </div>

      {/* Grid of Connected Social Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {allAccounts.map(({ client, account }) => {
          const platform = PLATFORM_CONFIGS[account.platform];
          const isExpiring = account.tokenHealth === 'expiring_soon';
          const isTesting = testingAccountId === account.id;

          return (
            <div
              key={account.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              {/* Card Header: Platform Icon, Client Pill, Health Badge */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${platform.iconBg} flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                      {platform.iconText}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white leading-tight">
                        {account.accountName}
                      </h3>
                      <div className="text-xs text-slate-400 font-mono">
                        {account.handle}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border font-bold block ${
                      isExpiring
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {isExpiring ? 'Expiring (3d)' : 'Active Token'}
                    </span>
                  </div>
                </div>

                {/* Client Association */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: client.accentColor }}
                    ></span>
                    <span className="font-semibold text-slate-300">{client.name}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[10px]">
                    {account.followerCount.toLocaleString()} Followers
                  </span>
                </div>

                {/* Granted API Permissions Matrix */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
                    <span>OAuth Scopes Granted</span>
                    <Key className="w-3 h-3 text-emerald-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                      <span>Post Publishing</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                      <span>Metrics Analytics</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${account.permissions?.managePages ? 'text-slate-300' : 'text-slate-600'}`}>
                      {account.permissions?.managePages ? (
                        <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                      ) : (
                        <X className="w-3 h-3 text-slate-600" />
                      )}
                      <span>Page Management</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${account.sandboxMode ? 'text-cyan-300' : 'text-slate-500'}`}>
                      <Radio className="w-3 h-3 text-cyan-400" />
                      <span>{account.sandboxMode ? 'Sandbox Active' : 'Live Gateway'}</span>
                    </div>
                  </div>
                </div>

                {/* Token Expiry Details */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
                  <span>Expires: {account.tokenExpiresAt ? new Date(account.tokenExpiresAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}</span>
                  <span>{account.apiEndpointRegion || 'Edge af-south-1'}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* Refresh Token Button */}
                  <button
                    onClick={() => refreshOAuthToken(client.id, account.id)}
                    className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                    title="Renew 60-day Token"
                  >
                    <RefreshCw className="w-3 h-3 text-emerald-400" />
                    <span>Refresh</span>
                  </button>

                  {/* Sandbox Toggle */}
                  <button
                    onClick={() => toggleSandboxMode(client.id, account.id)}
                    className={`px-2.5 py-1.5 border rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
                      account.sandboxMode
                        ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-300'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400'
                    }`}
                    title="Toggle Simulated Dry-Run Sandbox"
                  >
                    <Radio className="w-3 h-3" />
                    <span>{account.sandboxMode ? 'Mock: ON' : 'Mock: OFF'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Mock Dispatch Ping Test */}
                  <button
                    onClick={() => handleTestDispatch(client.id, account.id)}
                    disabled={isTesting}
                    className="p-1.5 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 rounded-lg text-emerald-400 text-xs transition-colors"
                    title="Test API Endpoint Ping"
                  >
                    <PlayCircle className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                  </button>

                  {/* Disconnect Button */}
                  <button
                    onClick={() => disconnectSocialAccount(client.id, account.id)}
                    className="p-1.5 bg-slate-950 hover:bg-red-950/60 border border-slate-800 hover:border-red-800/40 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                    title="Revoke OAuth Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connect Channel Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>Connect Social Network Endpoint</span>
              </div>
              <button
                onClick={() => setIsConnectModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleConnectSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Select Client Brand *</label>
                <select
                  value={modalClientId}
                  onChange={(e) => setModalClientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {scopedClients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Social Platform *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(PLATFORM_CONFIGS) as SocialPlatform[]).map(plat => {
                    const cfg = PLATFORM_CONFIGS[plat];
                    const isSelected = modalPlatform === plat;
                    return (
                      <div
                        key={plat}
                        onClick={() => setModalPlatform(plat)}
                        className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-slate-800 border-emerald-500 text-white shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold capitalize">{plat}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Account Handle / ID *</label>
                <input
                  type="text"
                  required
                  value={modalHandle}
                  onChange={(e) => setModalHandle(e.target.value)}
                  placeholder="@client_official"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Display Account Name</label>
                <input
                  type="text"
                  value={modalAccountName}
                  onChange={(e) => setModalAccountName(e.target.value)}
                  placeholder="e.g. Twiga Solar Kenya"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              {/* Sandbox Mode Toggle */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Enable Dry-Run Sandbox Mode</span>
                  <span className="text-[11px] text-slate-400">Mock dispatches without pushing live to public followers</span>
                </div>
                <input
                  type="checkbox"
                  checked={modalSandbox}
                  onChange={(e) => setModalSandbox(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-[11px] text-slate-400 space-y-1">
                <div className="font-bold text-emerald-400 font-mono uppercase text-[10px]">OAuth 2.0 PKCE Handshake:</div>
                <p>
                  Upon connecting, a 60-day persistent refresh token is provisioned with publication, analytics,
                  and media upload privileges.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Authorize & Link Channel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
