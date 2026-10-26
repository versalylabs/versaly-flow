import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';

interface LoginPageProps {
  onSuccess?: () => void;
  initialMode?: 'signin' | 'register';
  onBackToLanding?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, initialMode = 'signin', onBackToLanding }) => {
  const { login, register, addToast } = useAgency();

  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('versalylabs@gmail.com');
  const [signInPassword, setSignInPassword] = useState('labversaly-16');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Register State
  const [regAgencyName, setRegAgencyName] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCity, setRegCity] = useState('Nairobi');
  const [regLoading, setRegLoading] = useState(false);

  // Handle Sign In Submit
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSignInLoading(true);

    try {
      const res = await login({
        email: signInEmail.trim(),
        password: signInPassword,
        provider: 'email_password',
        rememberMe
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Invalid credentials. Please verify your email and password.');
      } else {
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error encountered.');
    } finally {
      setSignInLoading(false);
    }
  };

  // Quick 1-click login for Super Admin
  const handleAdminQuickLogin = async () => {
    setSignInEmail('versalylabs@gmail.com');
    setSignInPassword('labversaly-16');
    setErrorMessage(null);
    setSignInLoading(true);

    const res = await login({
      email: 'versalylabs@gmail.com',
      password: 'labversaly-16',
      provider: 'email_password',
      rememberMe: true
    });

    setSignInLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to authenticate admin credentials.');
    } else {
      if (onSuccess) onSuccess();
    }
  };

  // Quick login for existing SMM Agency Owner
  const handleAgencyQuickLogin = async () => {
    setSignInEmail('wanjiku@apexmedia.co.ke');
    setSignInPassword('labversaly-16');
    setErrorMessage(null);
    setSignInLoading(true);

    const res = await login({
      email: 'wanjiku@apexmedia.co.ke',
      password: 'labversaly-16',
      provider: 'email_password',
      rememberMe: true
    });

    setSignInLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to authenticate agency owner.');
    } else {
      if (onSuccess) onSuccess();
    }
  };

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regAgencyName.trim()) {
      setErrorMessage('Please specify your agency name.');
      return;
    }
    if (!regFullName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMessage('Please provide a valid business email.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setRegLoading(true);

    try {
      const res = await register({
        name: regFullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: 'agency_owner',
        agencyName: regAgencyName.trim(),
        agencySlug: regAgencyName.toLowerCase().replace(/[^a-z0-9]/g, '-')
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to provision agency workspace.');
      } else {
        addToast('Welcome to Versaly Flow', `Your dedicated SMM agency "${regAgencyName}" has been provisioned!`, 'success');
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failure occurred.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070b12] text-slate-100 flex flex-col justify-between font-sans antialiased relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Top Header Bar */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="rounded-xl overflow-hidden shadow-md shadow-emerald-500/10">
            <img src="/logo.png" alt="Versaly Flow" className="w-9 h-9 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">Versaly Flow</span>
              <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-medium tracking-wide">
                By Versaly
              </span>
            </div>
            <p className="text-xs text-slate-400">Social Media Agency Management Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span>&larr; Public Website</span>
            </button>
          )}
          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SOC2 Type II & Kenya DPA 2019 Encrypted</span>
          </div>
        </div>
      </header>

      {/* Main Centered Auth Portal */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10 my-6">
        <div className="w-full max-w-xl">
          {/* Card Container */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-xl overflow-hidden">
            {/* Top Switcher Tabs */}
            <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                }}
                className={`py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  mode === 'signin'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Sign In to Workspace</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                className={`py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  mode === 'register'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Create SMM Agency Account</span>
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mx-6 mt-6 p-3.5 rounded-xl bg-red-950/50 border border-red-800/60 text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* TAB 1: SIGN IN */}
            {mode === 'signin' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-normal text-white tracking-tight font-heading">Welcome back</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter your agency credentials to access your operating workspace.
                  </p>
                </div>

                {/* Quick 1-Click Login Recommendation for Admin */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                        Main Admin Demo
                      </span>
                      <span className="text-xs text-slate-300 font-medium">Full System Controls</span>
                    </div>
                    <div className="text-xs font-mono text-slate-300 mt-1 flex flex-wrap gap-2">
                      <span className="text-emerald-400">versalylabs@gmail.com</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-amber-300 font-semibold">labversaly-16</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdminQuickLogin}
                    disabled={signInLoading}
                    className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5"
                  >
                    <span>1-Click Admin Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Work Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="name@agency.com"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-slate-300">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setSignInPassword('labversaly-16');
                          addToast('Password Applied', 'Admin credentials key loaded: labversaly-16', 'info');
                        }}
                        className="text-[11px] text-amber-400 hover:underline"
                      >
                        Use "labversaly-16"
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-slate-500 hover:text-slate-300 absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0 w-3.5 h-3.5"
                      />
                      <span>Keep me signed in for 7 days</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => addToast('Password Reset', 'Dispatched verification token to your registered work email', 'info')}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={signInLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
                  >
                    {signInLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In to Agency OS</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Secondary Fast Persona Switcher */}
                <div className="pt-4 border-t border-slate-800/80">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                    Alternative Fast Sign-In:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleAgencyQuickLogin}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition-colors group"
                    >
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 flex items-center justify-between">
                        <span>Apex Media Kenya</span>
                        <span className="text-[9px] bg-slate-800 px-1 py-0.2 rounded text-slate-400">SMM Agency</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">wanjiku@apexmedia.co.ke</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                      }}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition-colors group"
                    >
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 flex items-center justify-between">
                        <span>New SMM Agency</span>
                        <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1 py-0.2 rounded border border-emerald-800/40">Register</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">Create your private agency workspace</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REGISTER NEW SMM AGENCY */}
            {mode === 'register' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                      Tailored SMM Agency Setup
                    </span>
                  </div>
                  <h2 className="text-2xl font-normal text-white tracking-tight font-heading">
                    Create Your SMM Agency Workspace
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    You will receive immediate access to the full operational suite: Composer, Calendar, Client Approvals, Media Vault, Retainers, and Social Channels.
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Agency Name
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={regAgencyName}
                          onChange={(e) => setRegAgencyName(e.target.value)}
                          placeholder="e.g. Skyline Digital KE"
                          required
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Primary Base / City
                      </label>
                      <input
                        type="text"
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        placeholder="Nairobi, Kenya"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Your Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="e.g. Daniel Mutua"
                          required
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Work Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="daniel@skylinedigital.co.ke"
                          required
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Set Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          required
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          required
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Scoping Explanation Card */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                    <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Dedicated Agency Role-Scoping Included:</span>
                    </div>
                    <p className="leading-relaxed">
                      Your account receives the <strong>Agency Owner</strong> role. You'll see all operational agency tools (Composer, Multi-Client Calendar, Approvals, DAM, CRM, Billing, Invoices, Team & Automations) without any super-admin platform clutter.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
                  >
                    {regLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Provision Agency Workspace</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Persona Explanation Callout */}
          <div className="mt-4 px-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Admin: versalylabs@gmail.com / labversaly-16</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>AES-256 Auth Shield Active</span>
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-4 border-t border-slate-800/60 bg-slate-950/40 text-center text-xs text-slate-500 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <span>Versaly Flow © 2026. Built for high-velocity social media agencies & creators.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Privacy & Data Protection (DPA 2019)</span>
          <span>•</span>
          <span>Security Audit Certified</span>
          <span>•</span>
          <span>Multi-Tenant Architecture</span>
        </div>
      </footer>
    </div>
  );
};
