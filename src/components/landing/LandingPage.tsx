import React, { useState } from 'react';
import { LiquidGlass } from '../ui/LiquidGlass';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe,
  Calendar,
  MessageSquare,
  DollarSign,
  Layers,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  Smartphone,
  ExternalLink,
  Lock,
  BarChart3,
  Sliders,
  Send,
  Building2,
  Check,
  Menu,
  X
} from 'lucide-react';

interface LandingPageProps {
  onStartFreeTrial: () => void;
  onSignIn: () => void;
  onLaunchWorkspace?: () => void;
  isAuthenticated?: boolean;
  currentUserEmail?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartFreeTrial,
  onSignIn,
  onLaunchWorkspace,
  isAuthenticated = false,
  currentUserEmail
}) => {
  // Billing cycle toggle
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Smooth scroll handler for anchor links
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  // ROI Calculator state
  const [clientCount, setClientCount] = useState<number>(15);
  const [postsPerClient, setPostsPerClient] = useState<number>(16);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Dynamic calculations for ROI calculator
  const totalPostsMonthly = clientCount * postsPerClient;
  const hoursSavedMonthly = Math.round(totalPostsMonthly * 0.75 + clientCount * 4.5);
  const costSavedDollars = Math.round(hoursSavedMonthly * 28);
  const costSavedKes = Math.round(costSavedDollars * 130);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background radial glow accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-emerald-500/10 via-emerald-600/5 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[40%] -left-40 w-[600px] h-[600px] bg-sky-500/5 blur-[140px] rounded-full" />
        <div className="absolute top-[70%] -right-40 w-[600px] h-[600px] bg-emerald-500/5 blur-[140px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-1 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Versaly Flow Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback icon if logo image fails
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">
                Versaly Flow
              </span>
              <span className="text-[10px] font-mono font-medium tracking-wide px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
                By Versaly
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, 'features')}
              className="hover:text-slate-100 transition-colors"
            >
              Features
            </a>
            <a
              href="#architecture"
              onClick={(e) => scrollToSection(e, 'architecture')}
              className="hover:text-slate-100 transition-colors"
            >
              Architecture
            </a>
            <a
              href="#calculator"
              onClick={(e) => scrollToSection(e, 'calculator')}
              className="hover:text-slate-100 transition-colors"
            >
              ROI Calculator
            </a>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, 'pricing')}
              className="hover:text-slate-100 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={(e) => scrollToSection(e, 'faq')}
              className="hover:text-slate-100 transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <button
                onClick={onLaunchWorkspace}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                <span>Go to Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={onSignIn}
                  className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-2.5 sm:px-3 py-2 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onStartFreeTrial}
                  className="flex items-center gap-1.5 sm:gap-2 bg-white hover:bg-slate-200 text-slate-950 font-semibold px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-white/10"
                >
                  <span>Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg md:hidden transition-colors border border-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl px-6 py-4 space-y-3">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, 'features')}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#architecture"
              onClick={(e) => scrollToSection(e, 'architecture')}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              Architecture
            </a>
            <a
              href="#calculator"
              onClick={(e) => scrollToSection(e, 'calculator')}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              ROI Calculator
            </a>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, 'pricing')}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={(e) => scrollToSection(e, 'faq')}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              FAQ
            </a>
          </div>
        )}
      </header>

      {/* Hero Section (Edge-to-Edge Full Page 1) */}
      <section className="relative z-10 w-full overflow-hidden border-b border-slate-900/60">
        {/* Full-bleed Background Image with Zero Margins */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <img
            src="/hero-social-managers.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center opacity-30 filter contrast-[110%] saturate-[110%]"
          />
          {/* Edge-to-edge gradient overlays to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f17]/60 via-[#0b0f17]/75 to-[#0b0f17]" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0b0f17]/50 to-[#0b0f17]/90" />
        </div>

        {/* Hero Content Container */}
        <div className="pt-20 pb-24 px-6 max-w-7xl mx-auto text-center">
          {/* Top Feature Pill */}
          <div className="inline-block mb-8">
            <LiquidGlass
              intensity="subtle"
              glowColor="emerald"
              className="!rounded-full px-4 py-1.5"
            >
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-emerald-400">Production Ready</span>
                <span className="text-slate-600">&bull;</span>
                <span>Multi-Tenant Workspaces &bull; M-Pesa Daraja Billing &bull; WCAG 2.1 AA</span>
              </div>
            </LiquidGlass>
          </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white max-w-5xl mx-auto leading-[1.08] font-heading">
          The Sovereign Operating System for{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
            Social Media Agencies
          </span>
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
          Consolidate fragmented publishing tools, client review chaos, and regional billing into one ultra-fast, multi-tenant cockpit. Engineered specifically for high-growth agency teams.
        </p>

        {/* Hero Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartFreeTrial}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3.5 rounded-2xl text-base transition-all shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start 14-Day Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={isAuthenticated ? onLaunchWorkspace : onSignIn}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold px-6 py-3.5 rounded-2xl text-base transition-all hover:border-slate-700"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{isAuthenticated ? 'Open Agency Dashboard' : 'Explore Demo Workspace'}</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>14-day full feature access</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Kenya DPA & SOC2 compliant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Sub-50ms query latency</span>
          </div>
        </div>

        {/* Glassmorphic Interactive Dashboard Preview */}
        <div id="architecture" className="mt-16 mx-auto max-w-6xl">
          <LiquidGlass
            glowColor="emerald"
            intensity="medium"
            className="p-3 sm:p-5 shadow-2xl shadow-emerald-950/20"
          >
            {/* Simulated Browser Chrome */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 px-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <span className="text-xs font-mono text-slate-500 ml-2">
                app.versalyflow.com/pulsebrand-digital/dashboard
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Workspace Scoped
            </div>
          </div>

          {/* Cockpit UI Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5 text-left">
            {/* Metric 1 */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xs font-medium text-slate-400">Agency Monthly Recurring Revenue</div>
              <div className="text-2xl font-bold font-mono text-slate-100 mt-1">KES 1,840,000</div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <span>&uarr; 24.8% vs last month</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xs font-medium text-slate-400">Client Approval Turnaround</div>
              <div className="text-2xl font-bold font-mono text-slate-100 mt-1">1.8 Hours</div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                99.4% first-round sign-off
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xs font-medium text-slate-400">Scheduled Social Posts</div>
              <div className="text-2xl font-bold font-mono text-slate-100 mt-1">348 Posts</div>
              <div className="text-[11px] text-sky-400 font-semibold mt-1">
                Across 8 Client Accounts
              </div>
            </div>

            {/* Metric 4 */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xs font-medium text-slate-400">Daraja STK Push Settlement</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">0.32s Latency</div>
              <div className="text-[11px] text-emerald-400/80 font-mono mt-1">
                100% Idempotent Delivery
              </div>
            </div>
          </div>

          {/* Workflow Snapshot Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 text-left">
            {/* Live Client Room Card */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300">Client Sign-Off Portal</span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Guest Link Active
                </span>
              </div>
              <div className="text-sm font-medium text-slate-200">
                Safaricom Safari 5G Ramadan Campaign
              </div>
              <div className="text-xs text-slate-400 mt-1">
                12 carousel assets approved with zero revision requests.
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Client Stakeholder: Sarah M.</span>
                <span className="text-emerald-400 font-semibold">✓ Instant Approved</span>
              </div>
            </div>

            {/* Multi-Channel Publishing Matrix */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300">Publishing Dispatcher</span>
                <span className="text-[11px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  Synced
                </span>
              </div>
              <div className="text-sm font-medium text-slate-200">
                Omnichannel Dispatch Queue
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Instagram Reels, TikTok Video, LinkedIn Document & X Threads scheduled.
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Next Dispatch: 18:30 EAT</span>
                <span className="text-slate-300 font-mono">100% Delivery SLA</span>
              </div>
            </div>

            {/* Automated Billing */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300">Billing Engine</span>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  M-Pesa Connected
                </span>
              </div>
              <div className="text-sm font-medium text-slate-200">
                Retainer Auto-Reconciliation
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Paybill 247247 &bull; Instant Daraja STK callback received.
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>KES 145,000 / month</span>
                <span className="text-emerald-400 font-semibold">Paid & Verified</span>
              </div>
            </div>
          </div>
          </LiquidGlass>
        </div>

        {/* Agency Proof Logos */}
        <div className="mt-20 pt-10 border-t border-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Trusted by premier social agencies & marketing holding groups
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-sm font-semibold text-slate-400">
            <span className="hover:text-slate-200 transition-colors">PulseBrand Digital</span>
            <span className="hover:text-slate-200 transition-colors">Kilima Social Studio</span>
            <span className="hover:text-slate-200 transition-colors">Safari Wave Media</span>
            <span className="hover:text-slate-200 transition-colors">Nairobi Growth Partners</span>
            <span className="hover:text-slate-200 transition-colors">Apex Horizon Global</span>
          </div>
        </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-900 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-emerald-400 block">
            Comprehensive Feature Matrix
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-white mt-3 font-heading">
            Everything your agency needs. Nothing you don&apos;t.
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Replace 6 disjointed subscriptions with a single cohesive cockpit built on pure performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Building2,
              title: 'Multi-Tenant Client Workspaces',
              desc: 'Completely segregated data boundaries for every brand account. No cross-tenant data leakage, isolated client permission sets, and customizable brand styling.'
            },
            {
              icon: CheckCircle2,
              title: 'One-Click Client Approval Portals',
              desc: 'Magic links for brand stakeholders to review, annotate, and approve draft content in seconds without forcing them to create complicated accounts.'
            },
            {
              icon: Calendar,
              title: 'Interactive Content Calendar Matrix',
              desc: 'High-density multi-account grid and calendar views. Drag, drop, reschedule, and balance your agency posting cadences effortlessly.'
            },
            {
              icon: Zap,
              title: 'AI Strategy & Copy Engine',
              desc: 'Generate localized, high-engagement captions, multi-platform adaptations, SEO hashtag taxonomies, and strategic campaign concepts.'
            },
            {
              icon: MessageSquare,
              title: 'Unified Social Inbox & Smart Triage',
              desc: 'Omnichannel routing for incoming comments and direct messages across Instagram, TikTok, LinkedIn, and Facebook with response SLAs.'
            },
            {
              icon: DollarSign,
              title: 'Native M-Pesa & Multi-Currency Billing',
              desc: 'Built-in Safaricom Daraja STK Push for instant recurring retainer payments in KES, alongside Stripe USD international invoicing.'
            },
            {
              icon: Layers,
              title: 'Digital Asset Management (DAM)',
              desc: 'High-speed cloud asset vault with dimension checking, automatic tag indexing, client watermarking, and instant social asset resizing.'
            },
            {
              icon: ShieldCheck,
              title: 'Kenya DPA 2019 & SOC2 Security',
              desc: 'Immutable audit logs, cryptographic token storage, role-based access control (RBAC), and full compliance with Kenyan data protection regulations.'
            },
            {
              icon: BarChart3,
              title: 'Executive KPI & Client Reporting',
              desc: 'Exportable presentation-grade performance reports detailing reach, engagement rates, and ROI metrics to substantiate agency retainers.'
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-300 hover:bg-slate-900/40 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-normal text-slate-100 group-hover:text-emerald-300 transition-colors font-heading">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Agency ROI Calculator */}
      <section id="calculator" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-900 relative z-10">
        <div className="rounded-3xl bg-slate-950/80 border border-slate-800/90 p-8 sm:p-12 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-xs font-mono font-medium uppercase tracking-wider text-emerald-400 block">
                  Interactive Agency Efficiency Engine
                </span>
                <h2 className="text-3xl sm:text-4xl font-normal text-white mt-2 font-heading">
                  Calculate how much time & money Versaly Flow saves your agency
                </h2>
                <p className="text-sm text-slate-400 mt-2">
                  Adjust the sliders to match your agency portfolio size.
                </p>
              </div>

              {/* Slider 1: Retainer Clients */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-200">
                    Active Client Retainer Brands
                  </label>
                  <span className="text-lg font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-0.5 rounded-lg border border-emerald-500/20">
                    {clientCount} Clients
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="50"
                  value={clientCount}
                  onChange={(e) => setClientCount(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>3 Clients</span>
                  <span>25 Clients</span>
                  <span>50 Clients</span>
                </div>
              </div>

              {/* Slider 2: Monthly Posts per Client */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-200">
                    Monthly Posts Delivered per Client
                  </label>
                  <span className="text-lg font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-0.5 rounded-lg border border-emerald-500/20">
                    {postsPerClient} Posts
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="40"
                  value={postsPerClient}
                  onChange={(e) => setPostsPerClient(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>6 Posts/mo</span>
                  <span>20 Posts/mo</span>
                  <span>40 Posts/mo</span>
                </div>
              </div>
            </div>

            {/* Right Projected Output Card */}
            <div className="lg:col-span-5">
              <LiquidGlass
                glowColor="teal"
                intensity="medium"
                className="p-8 flex flex-col justify-between space-y-6"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Projected Agency Savings
                  </span>
                  <div className="mt-3">
                    <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono">
                      {hoursSavedMonthly}{' '}
                      <span className="text-xl text-emerald-400 font-sans font-semibold">
                        hrs / month
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Saved from eliminated email back-and-forths, manual scheduling, and copy approvals.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Monthly Operational Value:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      KES {costSavedKes.toLocaleString()} (${costSavedDollars})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Capacity Expansion:</span>
                    <span className="font-semibold text-slate-200">
                      +300% More Client Bandwidth
                    </span>
                  </div>
                </div>

                <button
                  onClick={onStartFreeTrial}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  <span>Unlock These Savings Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </LiquidGlass>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Pricing Section */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-900 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-emerald-400 block">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-white mt-3 font-heading">
            Scale seamlessly as your retainer client base expands
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Every plan includes a 14-day unrestricted free trial. No credit card required.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-1.5 rounded-2xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded-full bg-slate-950 text-emerald-300">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Tier Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Tier 1: Boutique Agency */}
          <div className="p-8 rounded-3xl bg-slate-950/70 border border-slate-800/90 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-normal text-slate-100 font-heading">Boutique Agency</h3>
                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                  Emerging
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-2">
                Designed for boutique creative studios and independent social managers.
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white font-mono">
                  {billingCycle === 'annual' ? 'KES 11,600' : 'KES 14,500'}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ month</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {billingCycle === 'annual' ? '$95 USD / month billed annually' : '$119 USD billed monthly'}
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-slate-800/80 text-sm">
                {[
                  'Up to 10 Client Brands',
                  '5 Team Member Seats',
                  'Interactive Calendar Matrix',
                  'Guest Client Approval Links',
                  'Standard Asset Storage (20 GB)',
                  'M-Pesa STK Push Integration'
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onStartFreeTrial}
              className="mt-8 w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-all hover:border-slate-700"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Tier 2: Growth Agency (Featured) */}
          <div className="relative flex flex-col">
            <LiquidGlass
              glowColor="emerald"
              intensity="high"
              className="p-8 flex flex-col justify-between h-full !border-emerald-500/50 shadow-2xl shadow-emerald-500/10"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-md z-20">
                Most Popular Choice
              </div>

              <div>
                <div className="flex items-center justify-between mt-2">
                  <h3 className="text-xl font-normal text-white font-heading">Growth Agency</h3>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Fast Scaling
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  Full-power engine for mid-sized marketing firms managing high client volume.
                </p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    {billingCycle === 'annual' ? 'KES 27,900' : 'KES 34,900'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/ month</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {billingCycle === 'annual' ? '$223 USD / month billed annually' : '$279 USD billed monthly'}
                </div>

                <div className="mt-8 space-y-3 pt-6 border-t border-slate-800/80 text-sm">
                  {[
                    'Up to 35 Client Brands',
                    '15 Team Member Seats',
                    'AI Content & Strategy Engine',
                    'Unified Multi-Brand Social Inbox',
                    'Editorial Versioning & Multi-Tier Approvals',
                    'Agency CRM & Lead Deal Pipeline',
                    'M-Pesa Daraja & Stripe Billing',
                    'Priority Technical SLA'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-slate-200">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onStartFreeTrial}
                className="mt-8 w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-emerald-500/20"
              >
                Start 14-Day Free Trial
              </button>
            </LiquidGlass>
          </div>

          {/* Tier 3: Enterprise Sovereign */}
          <div className="p-8 rounded-3xl bg-slate-950/70 border border-slate-800/90 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-normal text-slate-100 font-heading">Enterprise Sovereign</h3>
                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                  Global
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-2">
                Dedicated infrastructure for holding groups and media networks.
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white font-mono">
                  {billingCycle === 'annual' ? 'KES 71,200' : 'KES 89,000'}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ month</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {billingCycle === 'annual' ? '$559 USD / month billed annually' : '$699 USD billed monthly'}
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-slate-800/80 text-sm">
                {[
                  'Unlimited Client Brands',
                  'Unlimited Team Seats',
                  'Complete White-Label Domain & Branding',
                  'Dedicated Redis Cache Instance',
                  'SOC2 & Kenya DPA Audit Exports',
                  'Custom API & Webhook Webhooks',
                  '24/7 Dedicated Account Partner'
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onStartFreeTrial}
              className="mt-8 w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-all hover:border-slate-700"
            >
              Start 14-Day Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Customer Testimonials & Social Proof */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-900 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-emerald-400 block">
            Agency Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-white mt-3 font-heading">
            Built by agency leaders, for agency leaders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                'Client approvals used to take 3 days of endless WhatsApp threads and PDF markups. With Versaly Flow magic links, our clients approve 95% of social content in under two hours.',
              author: 'Wanjiku Kamau',
              title: 'Managing Director, PulseBrand East Africa',
              rating: 5
            },
            {
              quote:
                'The Daraja M-Pesa STK push billing built directly into client retainers completely solved our accounts receivable bottlenecks. We cut overdue invoices by 80% in the first 60 days.',
              author: 'Brian Omondi',
              title: 'Head of Growth, Kilima Digital Studio',
              rating: 5
            },
            {
              quote:
                'We migrated 32 enterprise client accounts from Hootsuite and saved over $600/month while gaining client white-labeling and localized multi-tenant data isolation.',
              author: 'Farah Hussein',
              title: 'Creative Director, Apex Wave Media',
              rating: 5
            }
          ].map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-emerald-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/60">
                <div className="font-semibold text-sm text-slate-100">{t.author}</div>
                <div className="text-xs text-slate-500 mt-0.5">{t.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto border-t border-slate-900 relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-emerald-400 block">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-white mt-3 font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Everything you need to know about the Versaly Flow platform and onboarding.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'How does the 14-day free trial work?',
              a: 'You get full, unrestricted access to all agency features for 14 days without entering credit card or payment information. You can create client workspaces, test AI generation, invite team members, and connect social accounts immediately.'
            },
            {
              q: 'Can client brand stakeholders see other clients in our agency?',
              a: 'No. Versaly Flow utilizes strict multi-tenant schema partitioning. Each client brand workspace is strictly isolated. When you send approval links or invite client reviewers, they only see their specific brand assets and copy.'
            },
            {
              q: 'How does Safaricom M-Pesa Daraja STK Push work?',
              a: 'You can configure your agency Paybill or Till number in the Billing settings. When invoicing a Kenyan client, they can pay in one click via a prompt sent straight to their phone, with automatic receipt generation and status reconciliation.'
            },
            {
              q: 'Can we customize the platform with our agency branding?',
              a: 'Yes. With our White-Label features, you can set your agency logo, primary color accents, custom subdomains, and tailored client invitation emails so clients experience your proprietary agency brand.'
            },
            {
              q: 'Is our client data compliant with Kenyan and international privacy laws?',
              a: 'Yes. The system complies with the Kenya Data Protection Act 2019 (DPA) and SOC2 Type II audit trail standards. All passwords use Argon2id hashing, and all sessions feature cryptographic token validation.'
            },
            {
              q: 'Can we import existing content or migrate from our current tool?',
              a: 'Yes. You can import client lists, media assets, and existing post schedules via JSON or CSV format in seconds using the built-in Foundation Migration tools.'
            }
          ].map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-950/70 border border-slate-800/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base text-slate-200">
                    {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-400 leading-relaxed border-t border-slate-800/40">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Pre-Footer Action Banner */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <LiquidGlass
          glowColor="emerald"
          intensity="high"
          className="p-10 sm:p-16 text-center !border-emerald-500/30"
        >
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-normal text-white tracking-tight max-w-3xl mx-auto font-heading">
            Ready to upgrade your social agency operations?
          </h2>
          <p className="mt-4 text-base text-slate-400 max-w-2xl mx-auto">
            Join hundreds of forward-thinking social media agencies scaling with Versaly Flow. Start your 14-day free trial today.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartFreeTrial}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-3.5 rounded-2xl text-base transition-all shadow-xl shadow-emerald-500/20"
            >
              <span>Start Free 14-Day Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onSignIn}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-sm hover:text-white hover:border-slate-700 transition-all"
            >
              Sign In to Existing Account
            </button>
          </div>
        </LiquidGlass>
      </section>

      {/* Global Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-0.5">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-slate-300">Versaly Flow</span>
            <span>&copy; {new Date().getFullYear()} Versaly Flow Technologies Inc.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational (99.99%)
            </span>
            <span>Kenya DPA 2019 Compliant</span>
            <span>ISO/IEC 27001 Certified</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
