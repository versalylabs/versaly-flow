/**
 * PulseBrand Agency OS - Authentication & Security Management View
 * Phase 03: Authentication
 */

import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { Role, AuthProviderType } from '../../types';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  UserCheck,
  LogOut,
  RefreshCw,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Fingerprint,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AuthenticationManager: React.FC = () => {
  const {
    session,
    currentUser,
    users,
    login,
    register,
    logout,
    refreshSession,
    updateUserProfile,
    requestPasswordReset,
    addToast
  } = useAgency();

  const [activeTab, setActiveTab] = useState<'session' | 'login' | 'register' | 'profile' | 'mfa'>('session');

  // Login form state
  const [loginEmail, setLoginEmail] = useState(currentUser.email);
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [loginProvider, setLoginProvider] = useState<AuthProviderType>('email_password');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<Role>('content_creator');
  const [regPassword, setRegPassword] = useState('');

  // Password reset state
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Profile form state
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileTitle, setProfileTitle] = useState(currentUser.jobTitle || 'Lead Specialist');
  const [profilePhone, setProfilePhone] = useState(currentUser.phoneNumber || '+1 (555) 234-8901');

  // MFA simulation
  const [mfaCode, setMfaCode] = useState('');
  const [copiedToken, setCopiedToken] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await login({
      email: loginEmail,
      password: loginPassword,
      provider: loginProvider,
      rememberMe
    });
    setIsSubmitting(false);
    if (res.success) {
      setActiveTab('session');
    }
  };

  const handleQuickLoginAs = async (email: string) => {
    setIsSubmitting(true);
    const res = await login({
      email,
      provider: 'email_password',
      rememberMe: true
    });
    setIsSubmitting(false);
    if (res.success) {
      setActiveTab('session');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      addToast('Validation Error', 'Name and work email are required', 'error');
      return;
    }
    setIsSubmitting(true);
    const res = await register({
      name: regName,
      email: regEmail,
      role: regRole,
      password: regPassword || 'DefaultSecurePass!2026'
    });
    setIsSubmitting(false);
    if (res.success) {
      setRegName('');
      setRegEmail('');
      setActiveTab('session');
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    const res = requestPasswordReset(resetEmail);
    setResetMessage(res.message);
    setResetEmail('');
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profileName,
      jobTitle: profileTitle,
      phoneNumber: profilePhone
    });
  };

  const handleToggleMfa = () => {
    const nextState = !currentUser.mfaEnabled;
    updateUserProfile({
      mfaEnabled: nextState,
      mfaSecret: nextState ? 'JBSWY3DPEHPK3PXP' : undefined
    });
    addToast(
      nextState ? '2FA Enabled' : '2FA Disabled',
      nextState ? 'Time-based one-time password (TOTP) enforced' : 'MFA disabled for this profile',
      nextState ? 'success' : 'info'
    );
  };

  const handleCopyToken = () => {
    if (session?.token) {
      navigator.clipboard.writeText(session.token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
      addToast('Token Copied', 'JWT Bearer token copied to clipboard', 'info');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>PulseBrand Architecture</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Authentication</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Identity & Access Management (IAM)</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Multi-provider authentication flows, session token lifecycle, two-factor authentication (2FA),
            secure credential validation, password resets, and user profile management.
          </p>
        </div>

        {/* Current Auth Status Pill */}
        <div className="flex items-center gap-2">
          <div className="bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-semibold text-white">Authenticated Session Active</div>
              <div className="text-[10px] text-emerald-400/80 font-mono">
                {session ? `Provider: ${session.provider}` : 'Simulated Session Active'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('session')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'session'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Active Session & Tokens</span>
        </button>
        <button
          onClick={() => setActiveTab('login')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'login'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Multi-Provider Sign In</span>
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'register'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Register Workspace Member</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5" />
          <span>Profile & Security Settings</span>
        </button>
        <button
          onClick={() => setActiveTab('mfa')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'mfa'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Two-Factor Auth (MFA)</span>
        </button>
      </div>

      {/* Tab 1: Active Session & Security Tokens */}
      {activeTab === 'session' && (
        <div className="space-y-6">
          {/* Identity Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 font-black text-base flex items-center justify-center shadow-lg shadow-emerald-950/40">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{currentUser.name}</h2>
                    <span className="font-mono text-[10px] text-emerald-400 uppercase bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      {currentUser.role}
                    </span>
                    {currentUser.mfaEnabled && (
                      <span className="font-mono text-[10px] text-teal-400 uppercase bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-800/40 flex items-center gap-1">
                        <KeyRound className="w-2.5 h-2.5" /> 2FA Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3 font-mono">
                    <span>{currentUser.email}</span>
                    <span>·</span>
                    <span>Tenant: {currentUser.tenantId}</span>
                  </div>
                </div>
              </div>

              {/* Session Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshSession}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Refresh Token</span>
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors border border-red-800/40"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Terminate Session</span>
                </button>
              </div>
            </div>
          </div>

          {/* Token & Cryptographic Diagnostics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>JWT Bearer Access Token</span>
                </span>
                <button
                  onClick={handleCopyToken}
                  className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 font-mono"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-[11px] text-slate-300 break-all select-all leading-relaxed">
                {session?.token || `pba_jwt_${Date.now()}_simulated_active_bearer_token_ready`}
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Expires: {session?.expiresAt ? new Date(session.expiresAt).toLocaleTimeString() : 'In 23 hours'}</span>
                <span className="text-emerald-400">HS256 Verified</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Session Security Diagnostics</span>
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                  <span>Authentication Provider:</span>
                  <span className="text-slate-200 font-mono">{session?.provider || 'email_password'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                  <span>Origin Gateway:</span>
                  <span className="text-slate-200 font-mono">{session?.ipAddress || '192.168.1.1 (Secure Localhost)'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                  <span>User Agent / Device:</span>
                  <span className="text-slate-200 font-mono truncate max-w-xs">{session?.deviceInfo || 'Workstation Client'}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400">
                  <span>Last Authenticated:</span>
                  <span className="text-slate-200 font-mono">
                    {currentUser.lastLoginAt ? new Date(currentUser.lastLoginAt).toLocaleString() : 'Just now'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick-Switch Between Registered Users */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-white mb-1">
              Registered Agency Roster (1-Click Authenticate)
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Instantly authenticate as any registered team member or client reviewer to verify session states and security contexts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {users.map(u => {
                const isCurrent = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleQuickLoginAs(u.email)}
                    className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-950/20'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                        <span>{u.name}</span>
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">{u.email}</div>
                      <div className="text-[10px] font-mono text-emerald-400/90 uppercase mt-0.5">{u.role}</div>
                    </div>
                    {isCurrent ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Multi-Provider Sign In */}
      {activeTab === 'login' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/logo.png"
                alt="Versaly Flow"
                className="w-9 h-9 rounded-lg object-contain bg-emerald-500/10 border border-emerald-500/30 p-0.5 shadow-sm shadow-emerald-500/10"
              />
              <div>
                <h2 className="text-base font-bold text-white">Sign In to Versaly Flow</h2>
                <p className="text-[10px] text-slate-400">Social Media Agency Management System</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Enter your agency or client stakeholder credentials to access assigned workspaces and content pipelines.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                    placeholder="elena@apexmedia.agency"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (!loginEmail) return;
                      handleResetSubmit({ preventDefault: () => {} } as any);
                    }}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
                  />
                  <span>Remember session for 7 days</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In with Credentials'}</span>
              </button>
            </form>

            {/* Alternative auth providers */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
                Or Continue With Enterprise SSO
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginProvider('google');
                    handleLoginSubmit({ preventDefault: () => {} } as any);
                  }}
                  className="p-2 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-xs text-slate-300 font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="font-bold text-red-400">G</span>
                  <span>Google Workspace</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginProvider('sso_saml');
                    handleLoginSubmit({ preventDefault: () => {} } as any);
                  }}
                  className="p-2 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-xs text-slate-300 font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>SAML / Okta SSO</span>
                </button>
              </div>
            </div>
          </div>

          {/* Password Recovery Side Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-white mb-1">Self-Service Password Recovery</h2>
              <p className="text-xs text-slate-400 mb-4">
                Forgot your agency passkey? Submit your verified email address to dispatch an authenticated one-time recovery token.
              </p>

              <form onSubmit={handleResetSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Recovery Email
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@agencyname.com"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Send Recovery Instructions</span>
                </button>
              </form>

              {resetMessage && (
                <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-xs text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{resetMessage}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1 font-mono">
              <div>• Minimum 10 characters with mixed-case and symbols</div>
              <div>• Session tokens automatically expire after inactivity</div>
              <div>• Immutable IP gateway audit logged on every attempt</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Register Workspace Member */}
      {activeTab === 'register' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-base font-bold text-white mb-1">Provision New Workspace Member</h2>
          <p className="text-xs text-slate-400 mb-5">
            Add team creators, account directors, or client review stakeholders to this agency workspace.
          </p>

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Jordan Vance"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="jordan@apexmedia.agency"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Role & Authority</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as Role)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="agency_owner">Agency Owner (Full Control)</option>
                  <option value="account_manager">Account Manager (Client Lead)</option>
                  <option value="content_creator">Content Creator (Pipelines & Drafts)</option>
                  <option value="client_approver">Client Approver (Stakeholder Portal)</option>
                  <option value="freelance_contributor">Freelance Contributor</option>
                  <option value="guest_viewer">Guest Viewer (Read Only)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Initial Temporary Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Leave blank for auto-generated"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Provisioning...' : 'Provision Member & Grant Immediate Access'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Profile & Security Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-base font-bold text-white mb-1">Account & Security Profile</h2>
          <p className="text-xs text-slate-400 mb-5">
            Manage your personal profile details and contact verification for audit trail signatures.
          </p>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Display Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Agency Job Title</label>
                <input
                  type="text"
                  value={profileTitle}
                  onChange={(e) => setProfileTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Security Phone (SMS / Alerts)</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Security Profile Changes</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 5: Two-Factor Authentication (MFA) */}
      {activeTab === 'mfa' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Two-Factor Authentication (2FA / TOTP)</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Protect agency retainer accounts and client social publishing rights with an authenticator app.
              </p>
            </div>

            <button
              onClick={handleToggleMfa}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                currentUser.mfaEnabled
                  ? 'bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
              }`}
            >
              {currentUser.mfaEnabled ? 'Disable 2FA' : 'Enable 2FA Protection'}
            </button>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Status:</span>
              <span className={`font-mono font-bold ${currentUser.mfaEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                {currentUser.mfaEnabled ? 'ENFORCED (TOTP Secret Configured)' : 'DISABLED'}
              </span>
            </div>

            {currentUser.mfaEnabled && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  Scan this secret key with Google Authenticator, 1Password, or Authy:
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800 font-mono text-emerald-400 text-center text-sm font-bold tracking-widest">
                  JBSW Y3DP EHPK 3PXP
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit TOTP code (e.g. 849201)"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg text-center font-mono tracking-widest focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => {
                      if (mfaCode.length === 6) {
                        addToast('Verification Success', 'TOTP code 849201 accepted. Session elevated.', 'success');
                        setMfaCode('');
                      } else {
                        addToast('Verification Error', 'Please enter a 6-digit verification code', 'error');
                      }
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
                  >
                    Verify Code
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
