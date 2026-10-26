import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  SubscriptionTierId,
  BillingInterval,
  SubscriptionPlan
} from '../../types';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Users,
  Building2,
  Send,
  Lock,
  ArrowRight,
  Check,
  PhoneCall,
  DollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const SubscriptionTierManager: React.FC = () => {
  const {
    workspace,
    saasPlans,
    workspaceSubscription,
    upgradeSubscriptionTier,
    downgradeSubscriptionTier,
    toggleAutoRenewSubscription,
    simulateMpesaSubscriptionRenewal,
    addToast
  } = useAgency();

  const [billingInterval, setBillingInterval] = useState<BillingInterval>(
    workspaceSubscription.billingInterval || 'monthly'
  );
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<SubscriptionPlan | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState<boolean>(false);
  const [downgradeTargetPlan, setDowngradeTargetPlan] = useState<SubscriptionPlan | null>(null);
  const [downgradeError, setDowngradeError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('0712345678');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  const currentPlan = saasPlans.find(p => p.id === workspaceSubscription.currentTier) || saasPlans[1];
  const usage = workspaceSubscription.usageMetrics;

  // Percentage calculations
  const clientQuota = currentPlan.quotas.maxClients;
  const clientPercent = clientQuota === -1 ? 15 : Math.min(100, Math.round((usage.clientCount / clientQuota) * 100));

  const seatQuota = currentPlan.quotas.maxTeamSeats;
  const seatPercent = seatQuota === -1 ? 20 : Math.min(100, Math.round((usage.teamSeatCount / seatQuota) * 100));

  const postQuota = currentPlan.quotas.maxMonthlyPosts;
  const postPercent = postQuota === -1 ? 10 : Math.min(100, Math.round((usage.postsScheduledThisMonth / postQuota) * 100));

  const aiQuota = currentPlan.quotas.maxAiTokens;
  const aiPercent = Math.min(100, Math.round((usage.aiTokensUsedThisMonth / aiQuota) * 100));

  const handleOpenUpgrade = (plan: SubscriptionPlan) => {
    setSelectedPlanForUpgrade(plan);
    setShowUpgradeModal(true);
  };

  const handleConfirmUpgrade = () => {
    if (!selectedPlanForUpgrade) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      upgradeSubscriptionTier(selectedPlanForUpgrade.id, billingInterval);
      setIsProcessingPayment(false);
      setShowUpgradeModal(false);
    }, 1500);
  };

  const handleOpenDowngrade = (plan: SubscriptionPlan) => {
    setDowngradeTargetPlan(plan);
    setDowngradeError(null);

    // Pre-check guardrails
    if (plan.quotas.maxClients !== -1 && usage.clientCount > plan.quotas.maxClients) {
      setDowngradeError(
        `Active client count (${usage.clientCount}) exceeds ${plan.name} allowance of ${plan.quotas.maxClients}. You must offboard or pause ${usage.clientCount - plan.quotas.maxClients} clients before downgrading.`
      );
    } else if (plan.quotas.maxTeamSeats !== -1 && usage.teamSeatCount > plan.quotas.maxTeamSeats) {
      setDowngradeError(
        `Team members (${usage.teamSeatCount}) exceed ${plan.name} allowance of ${plan.quotas.maxTeamSeats}. You must remove ${usage.teamSeatCount - plan.quotas.maxTeamSeats} members first.`
      );
    }

    setShowDowngradeModal(true);
  };

  const handleConfirmDowngrade = () => {
    if (!downgradeTargetPlan) return;
    const result = downgradeSubscriptionTier(downgradeTargetPlan.id);
    if (result.allowed) {
      setShowDowngradeModal(false);
    } else {
      setDowngradeError(result.reason || 'Downgrade conditions not met.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden border border-emerald-700/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide uppercase mb-3 border border-emerald-500/30">
              <CreditCard className="w-3.5 h-3.5 text-amber-300" />
              SaaS Subscription & Tier Management
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5">
              <span>Agency Plan & Quota Sentinel</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold uppercase">
                {currentPlan.name} • Active
              </span>
            </h1>
            <p className="text-emerald-200/80 text-sm max-w-2xl mt-1">
              Monitor monthly resource quotas, scale agency seat licenses, and manage M-Pesa automated Daraja settlements with built-in downgrade guardrails.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={simulateMpesaSubscriptionRenewal}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Simulate M-Pesa STK Push</span>
            </button>
          </div>
        </div>
      </div>

      {/* Usage Sentinel Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Client Brands Meter */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Client Brands
            </span>
            <span className="font-mono text-white font-bold">
              {usage.clientCount} / {clientQuota === -1 ? '∞' : clientQuota}
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                clientPercent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${clientPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{clientPercent}% allocated</span>
            {clientQuota !== -1 && usage.clientCount >= clientQuota && (
              <span className="text-amber-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Max reached
              </span>
            )}
          </div>
        </div>

        {/* Team Seats Meter */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" />
              Team Member Seats
            </span>
            <span className="font-mono text-white font-bold">
              {usage.teamSeatCount} / {seatQuota === -1 ? '∞' : seatQuota}
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                seatPercent > 80 ? 'bg-amber-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${seatPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{seatPercent}% capacity used</span>
            <span className="text-slate-400 font-mono">
              {seatQuota === -1 ? 'Unlimited' : `${seatQuota - usage.teamSeatCount} seats left`}
            </span>
          </div>
        </div>

        {/* Monthly Posts Dispatched */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Send className="w-4 h-4 text-violet-400" />
              Post Dispatches
            </span>
            <span className="font-mono text-white font-bold">
              {usage.postsScheduledThisMonth} / {postQuota === -1 ? '∞' : postQuota}
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-500"
              style={{ width: `${postPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{postPercent}% of monthly quota</span>
            <span className="text-slate-400">Resets Oct 01</span>
          </div>
        </div>

        {/* Gemini AI Strategy Tokens */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              AI Strategy Tokens
            </span>
            <span className="font-mono text-white font-bold">
              {(usage.aiTokensUsedThisMonth / 1000).toFixed(1)}k / {(aiQuota / 1000).toFixed(0)}k
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${aiPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{aiPercent}% consumed</span>
            <span className="text-amber-400 font-mono">Gemini 1.5 Pro</span>
          </div>
        </div>
      </div>

      {/* Interval Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div>
          <h2 className="text-lg font-bold text-white">Select Agency SaaS Tier</h2>
          <p className="text-xs text-slate-400">Pick the capacity tier that matches your agency headcount and client roster</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl flex items-center gap-2">
          <button
            type="button"
            onClick={() => setBillingInterval('monthly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              billingInterval === 'monthly'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingInterval('annual')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              billingInterval === 'annual'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-1.5 py-0.2 rounded font-bold">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* SaaS Tier Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {saasPlans.map((plan) => {
          const isCurrent = plan.id === workspaceSubscription.currentTier;
          const isHigher =
            (plan.id === 'enterprise' && workspaceSubscription.currentTier !== 'enterprise') ||
            (plan.id === 'boutique' && workspaceSubscription.currentTier === 'freelancer');

          const priceKes = billingInterval === 'annual' ? plan.annualPriceKesMonthlyEquivalent : plan.monthlyPriceKes;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between p-6 relative ${
                isCurrent
                  ? 'bg-slate-900/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl'
                  : plan.id === 'boutique'
                  ? 'bg-slate-900 border-indigo-500/60 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl md:text-3xl font-black text-white">
                      KSh {priceKes.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {billingInterval === 'annual' ? 'Billed annually (KSh ' + (priceKes * 12).toLocaleString() + '/yr)' : `or $${plan.monthlyPriceUsd} USD`}
                  </span>
                </div>

                {/* Quota Highlights */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Client Brand Limit:</span>
                    <strong className="text-white font-mono">{plan.quotas.maxClients === -1 ? 'Unlimited' : `${plan.quotas.maxClients} Brands`}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Team Member Seats:</span>
                    <strong className="text-white font-mono">{plan.quotas.maxTeamSeats === -1 ? 'Unlimited' : `${plan.quotas.maxTeamSeats} Seats`}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Monthly Posts:</span>
                    <strong className="text-white font-mono">{plan.quotas.maxMonthlyPosts === -1 ? 'Unlimited' : `${plan.quotas.maxMonthlyPosts} Posts`}</strong>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2 pt-2 text-xs">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                {isCurrent ? (
                  <button
                    type="button"
                    disabled
                    className="w-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-default"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Current Active Plan</span>
                  </button>
                ) : isHigher ? (
                  <button
                    type="button"
                    onClick={() => handleOpenUpgrade(plan)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Upgrade to {plan.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenDowngrade(plan)}
                    className="w-full bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold py-2.5 px-4 rounded-xl text-xs border border-slate-700 transition-colors"
                  >
                    <span>Downgrade to {plan.name}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscription Settlement & Auto-Renew Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              M-Pesa Daraja Payment & Auto-Renew Settings
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct billing via Safaricom M-Pesa Express Daraja API Paybill 890123
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Auto-Debit on Expiry:</span>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={workspaceSubscription.autoRenew}
                onChange={toggleAutoRenewSubscription}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Billing Period</span>
            <strong className="text-slate-200">
              {new Date(workspaceSubscription.currentPeriodStart).toLocaleDateString()} — {new Date(workspaceSubscription.currentPeriodEnd).toLocaleDateString()}
            </strong>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Last Payment Reference</span>
            <strong className="text-emerald-400 font-mono">
              {workspaceSubscription.lastPaymentRef || 'MPESA-QRT892K11'}
            </strong>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Next Scheduled Settlement</span>
            <strong className="text-slate-200">
              KSh {(workspaceSubscription.lastPaymentAmountKes || currentPlan.monthlyPriceKes).toLocaleString()} on {new Date(workspaceSubscription.currentPeriodEnd).toLocaleDateString()}
            </strong>
          </div>
        </div>
      </div>

      {/* Upgrade M-Pesa STK Modal */}
      {showUpgradeModal && selectedPlanForUpgrade && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Upgrade to {selectedPlanForUpgrade.name}
              </h3>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Selected Plan:</span>
                <strong className="text-white">{selectedPlanForUpgrade.name}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Interval:</span>
                <strong className="text-white capitalize">{billingInterval}</strong>
              </div>
              <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800">
                <span>Total Amount Due:</span>
                <strong className="text-emerald-400 font-mono text-sm">
                  KSh {(billingInterval === 'annual' ? selectedPlanForUpgrade.annualPriceKesMonthlyEquivalent * 12 : selectedPlanForUpgrade.monthlyPriceKes).toLocaleString()}
                </strong>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                M-Pesa Mobile Number (Safaricom)
              </label>
              <div className="flex items-center gap-2">
                <div className="bg-slate-950 border border-slate-800 text-slate-400 text-xs px-3 py-2.5 rounded-xl font-mono">
                  +254
                </div>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="712345678"
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">An STK push PIN prompt will appear instantly on your handset.</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUpgrade}
                disabled={isProcessingPayment}
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Daraja STK...</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-4 h-4" />
                    <span>Authorize M-Pesa Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Downgrade Guardrail Modal */}
      {showDowngradeModal && downgradeTargetPlan && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Downgrade to {downgradeTargetPlan.name}
              </h3>
              <button
                type="button"
                onClick={() => setShowDowngradeModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {downgradeError ? (
              <div className="bg-rose-950/30 border border-rose-800/50 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                  <XCircle className="w-4 h-4" />
                  <span>Quota Guardrail Sentinel Triggered</span>
                </div>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  {downgradeError}
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  Are you sure you want to downgrade to <strong>{downgradeTargetPlan.name}</strong>?
                </p>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span>New Client Limit:</span>
                    <strong className="text-white">{downgradeTargetPlan.quotas.maxClients} brands</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>New Team Limit:</span>
                    <strong className="text-white">{downgradeTargetPlan.quotas.maxTeamSeats} members</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>White-Label Branding:</span>
                    <strong className={downgradeTargetPlan.quotas.allowWhiteLabel ? 'text-emerald-400' : 'text-slate-500'}>
                      {downgradeTargetPlan.quotas.allowWhiteLabel ? 'Enabled' : 'Disabled (Versaly badge restored)'}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDowngradeModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                {downgradeError ? 'Close' : 'Cancel'}
              </button>

              {!downgradeError && (
                <button
                  type="button"
                  onClick={handleConfirmDowngrade}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all"
                >
                  Confirm Downgrade
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
