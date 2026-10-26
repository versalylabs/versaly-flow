/**
 * PulseBrand Agency OS - Multi-Tenancy & Workspace Management View
 * Phase 04: Multi-Tenancy
 * Localized for Kenya Market (KES Currency, Nairobi EAT Timezone, M-PESA & PesaPal)
 */

import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { TenantWorkspace } from '../../types';
import {
  Building2,
  Globe,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Server,
  Layers,
  MapPin,
  Coins,
  Clock,
  Sparkles,
  ExternalLink,
  Laptop,
  Check,
  CreditCard,
  Lock
} from 'lucide-react';

export const MultiTenancyManager: React.FC = () => {
  const {
    workspace,
    workspaces,
    switchWorkspace,
    createWorkspace,
    mapCustomDomain,
    clients,
    contentItems,
    addToast
  } = useAgency();

  const [activeTab, setActiveTab] = useState<'switcher' | 'create' | 'domain' | 'isolation'>('switcher');

  // New Workspace form state
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newTier, setNewTier] = useState<TenantWorkspace['tier']>('boutique');
  const [newCity, setNewCity] = useState('Nairobi');
  const [newCurrency, setNewCurrency] = useState('KES (KSh)');
  const [newBilling, setNewBilling] = useState<TenantWorkspace['billingProvider']>('mpesa_daraja');

  // Custom Domain form state
  const [domainInput, setDomainInput] = useState(workspace.customDomain || `${workspace.slug}.agency.ke`);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSlug.trim()) {
      addToast('Validation Error', 'Agency workspace name and vanity slug are required', 'error');
      return;
    }

    const created = createWorkspace({
      name: newName.trim(),
      slug: newSlug.trim().toLowerCase(),
      tier: newTier,
      timezone: 'Africa/Nairobi (EAT)',
      currency: newCurrency,
      city: newCity,
      country: 'Kenya',
      billingProvider: newBilling,
      customDomain: `${newSlug.trim().toLowerCase()}.agency.ke`
    });

    setNewName('');
    setNewSlug('');
    setActiveTab('switcher');
  };

  const handleDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;
    mapCustomDomain(workspace.id, domainInput.trim());
  };

  // Filter scoped data for active workspace
  const scopedClients = clients.filter(c => c.tenantId === workspace.id);
  const scopedContent = contentItems.filter(p => p.tenantId === workspace.id);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>PulseBrand Architecture</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Multi-Tenancy</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">Kenyan Market Optimized (KES / EAT)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Agency Multi-Tenancy & Workspace Scoping</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Strict tenant isolation, rapid workspace switching between agencies and regional hubs, custom vanity domain mapping,
            and data containment ensuring client assets and retainers never leak across agency boundaries.
          </p>
        </div>

        {/* Current Active Tenant Pill */}
        <div className="flex items-center gap-2">
          <div className="bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-semibold text-white truncate max-w-[200px]">{workspace.name}</div>
              <div className="text-[10px] text-emerald-400/80 font-mono">
                {workspace.city || 'Nairobi'}, Kenya · {workspace.currency}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('switcher')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'switcher'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Workspaces Directory ({workspaces.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'create'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Provision New Agency Workspace</span>
        </button>
        <button
          onClick={() => setActiveTab('domain')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'domain'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Vanity & Custom Domains</span>
        </button>
        <button
          onClick={() => setActiveTab('isolation')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'isolation'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Tenant Data Isolation Inspector</span>
        </button>
      </div>

      {/* Tab 1: Workspaces Directory & Switcher */}
      {activeTab === 'switcher' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workspaces.map(ws => {
              const isActive = ws.id === workspace.id;
              const clientCount = clients.filter(c => c.tenantId === ws.id).length;
              const contentCount = contentItems.filter(p => p.tenantId === ws.id).length;

              return (
                <div
                  key={ws.id}
                  className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-slate-900 border-emerald-500/60 shadow-xl shadow-emerald-950/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-emerald-400 uppercase bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        {ws.tier}
                      </span>
                      {isActive ? (
                        <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active Scope
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-500">
                          {ws.city || 'Kenya'}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">{ws.name}</h3>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">slug: {ws.slug}</div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                      <div className="flex justify-between">
                        <span>Regional HQ:</span>
                        <span className="text-slate-200 font-medium">{ws.city || 'Nairobi'}, {ws.country || 'Kenya'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Currency / Billing:</span>
                        <span className="text-emerald-400 font-mono font-semibold">{ws.currency} · M-PESA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scoped Brands:</span>
                        <span className="text-slate-200 font-mono font-medium">{clientCount} brands</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Content Pipeline:</span>
                        <span className="text-slate-200 font-mono font-medium">{contentCount} posts</span>
                      </div>
                      {ws.customDomain && (
                        <div className="flex justify-between">
                          <span>Vanity Domain:</span>
                          <span className="text-teal-400 font-mono text-[11px]">https://{ws.customDomain}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-800/60">
                    {isActive ? (
                      <div className="w-full py-2 bg-emerald-950/30 text-emerald-400 border border-emerald-800/40 rounded-lg text-xs font-semibold text-center">
                        ✓ Current Operating Workspace
                      </div>
                    ) : (
                      <button
                        onClick={() => switchWorkspace(ws.id)}
                        className="w-full py-2 bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Switch into Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Provision New Workspace */}
      {activeTab === 'create' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-base font-bold text-white mb-1">Provision New Agency Workspace</h2>
          <p className="text-xs text-slate-400 mb-5">
            Spin up a fully isolated tenant instance with its own clients, content calendar, retainer billing currency, and custom domain.
          </p>

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Agency Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    if (!newSlug) {
                      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                    }
                  }}
                  placeholder="e.g. Mara Creative Studio"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Vanity Slug (Subdomain)</label>
                <input
                  type="text"
                  required
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="mara-creative"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tier Plan</label>
                <select
                  value={newTier}
                  onChange={(e) => setNewTier(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="freelancer">Freelancer (1-3 clients)</option>
                  <option value="boutique">Boutique Agency (4-15 clients)</option>
                  <option value="enterprise">Global Enterprise (Unlimited)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">City / Region</label>
                <select
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="Nairobi">Nairobi (Westlands / Kilimani)</option>
                  <option value="Mombasa">Mombasa (Nyali / CBD)</option>
                  <option value="Kisumu">Kisumu</option>
                  <option value="Nakuru">Nakuru</option>
                  <option value="Eldoret">Eldoret</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Billing Provider</label>
                <select
                  value={newBilling}
                  onChange={(e) => setNewBilling(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="mpesa_daraja">M-PESA Daraja 2.0 (STK Push)</option>
                  <option value="pesapal">PesaPal Payments</option>
                  <option value="stripe">Stripe Global USD</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Provision Isolated Workspace</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Custom Domains */}
      {activeTab === 'domain' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-white mb-1">White-Label Vanity Domain Mapping</h2>
            <p className="text-xs text-slate-400">
              Point your agency's domain (e.g., <code className="text-emerald-400 font-mono">portal.apexmedia.co.ke</code>)
              to this workspace for a seamless branded client experience.
            </p>
          </div>

          <form onSubmit={handleDomainSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Custom Domain (FQDN)
              </label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="portal.youragency.co.ke"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-400">
              <div className="text-slate-300 font-semibold mb-1">DNS Configuration Instructions:</div>
              <div className="flex justify-between">
                <span>Record Type:</span>
                <span className="text-emerald-400 font-bold">CNAME</span>
              </div>
              <div className="flex justify-between">
                <span>Host:</span>
                <span className="text-slate-200">portal</span>
              </div>
              <div className="flex justify-between">
                <span>Target:</span>
                <span className="text-slate-200">cname.pulsebrand.app</span>
              </div>
              <div className="flex justify-between">
                <span>SSL / TLS:</span>
                <span className="text-emerald-400">Automatic Let's Encrypt Certificate</span>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Map Custom Domain</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Tenant Data Isolation Inspector */}
      {activeTab === 'isolation' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Active Tenant Scoping Inspection: {workspace.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verifying that entities queried in the current workspace context strictly match <code className="text-emerald-400 font-mono">tenantId === "{workspace.id}"</code>.
                </p>
              </div>

              <div className="bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Cross-Tenant Leaks</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Scoped Clients Card */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-xs text-white">Scoped Clients ({scopedClients.length})</span>
                  <span className="font-mono text-[10px] text-emerald-400">tenantId: {workspace.id}</span>
                </div>
                <div className="space-y-1.5">
                  {scopedClients.length === 0 ? (
                    <div className="text-xs text-slate-500 py-4 text-center">No brands registered in this workspace yet.</div>
                  ) : (
                    scopedClients.map(c => (
                      <div key={c.id} className="p-2.5 bg-slate-900/60 rounded border border-slate-800 text-xs flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-200">{c.name}</div>
                          <div className="text-[11px] text-slate-500">{c.industry}</div>
                        </div>
                        <div className="text-[11px] font-mono text-emerald-400 font-bold">
                          KSh {c.retainerMonthlyValue.toLocaleString()} / mo
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Scoped Content Pipeline Card */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-xs text-white">Scoped Content Pipeline ({scopedContent.length})</span>
                  <span className="font-mono text-[10px] text-emerald-400">tenantId: {workspace.id}</span>
                </div>
                <div className="space-y-1.5">
                  {scopedContent.length === 0 ? (
                    <div className="text-xs text-slate-500 py-4 text-center">No content items in this workspace yet.</div>
                  ) : (
                    scopedContent.map(post => (
                      <div key={post.id} className="p-2.5 bg-slate-900/60 rounded border border-slate-800 text-xs flex items-center justify-between">
                        <div className="truncate mr-2">
                          <div className="font-semibold text-slate-200 truncate">{post.title}</div>
                          <div className="text-[11px] text-slate-500 font-mono">Stage: {post.stage}</div>
                        </div>
                        <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded shrink-0">
                          {post.platforms.join(', ')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
