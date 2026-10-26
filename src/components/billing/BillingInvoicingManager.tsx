/**
 * Versaly Flow - Billing, Retainers & Invoicing Engine
 * Phase 21: Billing, Retainers & Invoicing
 * Monthly retainer tracking with overage alerts, dynamic invoice generator,
 * Stripe & M-Pesa settlement simulator, billable timecards, and agency MRR analytics.
 */

import React, { useState, useMemo } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { AgencyInvoice, RetainerPlan, BillableTimeEntry, InvoiceStatus, PaymentGateway } from '../../types';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Clock,
  Plus,
  Search,
  Filter,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Send,
  Printer,
  X,
  Check,
  Building2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Receipt,
  Download,
  ShieldCheck,
  Layers,
  ChevronRight,
  Trash2
} from 'lucide-react';

export const BillingInvoicingManager: React.FC = () => {
  const {
    workspace,
    currentUser,
    clients,
    invoices,
    retainers,
    timeEntries,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    recordInvoicePayment,
    updateRetainer,
    logBillableTime,
    deleteBillableTime,
    addToast
  } = useAgency();

  // Active view tab: 'invoices' | 'retainers' | 'time_logs'
  const [activeTab, setActiveTab] = useState<'invoices' | 'retainers' | 'time_logs'>('invoices');

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showLogTimeModal, setShowLogTimeModal] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<AgencyInvoice | null>(null);
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState<AgencyInvoice | null>(null);

  // Currency helper
  const currencySymbol = useMemo(() => {
    return workspace.currency?.split(' ')[0] || 'KES';
  }, [workspace.currency]);

  // Scoped Data by active workspace
  const scopedClients = useMemo(() => clients.filter(c => c.tenantId === workspace.id), [clients, workspace.id]);
  const scopedRetainers = useMemo(() => retainers.filter(r => r.tenantId === workspace.id), [retainers, workspace.id]);
  const scopedInvoices = useMemo(() => invoices.filter(i => i.tenantId === workspace.id), [invoices, workspace.id]);
  const scopedTimeEntries = useMemo(() => timeEntries.filter(t => t.tenantId === workspace.id), [timeEntries, workspace.id]);

  // Financial Metrics
  const metrics = useMemo(() => {
    const totalMRR = scopedRetainers
      .filter(r => r.status !== 'paused')
      .reduce((sum, r) => sum + r.monthlyFee, 0);

    const totalARR = totalMRR * 12;

    const paidInvoices = scopedInvoices.filter(inv => inv.status === 'paid');
    const totalCollected = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    const pendingInvoices = scopedInvoices.filter(inv => inv.status === 'sent');
    const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    const overdueInvoices = scopedInvoices.filter(inv => inv.status === 'overdue');
    const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    // Retainer utilization
    const totalAllocatedHours = scopedRetainers.reduce((sum, r) => sum + r.allocatedHours, 0);
    const totalUsedHours = scopedRetainers.reduce((sum, r) => sum + r.usedHours, 0);
    const avgUtilization = totalAllocatedHours > 0 ? Math.round((totalUsedHours / totalAllocatedHours) * 100) : 0;

    return {
      totalMRR,
      totalARR,
      totalCollected,
      totalPending,
      totalOverdue,
      totalAllocatedHours,
      totalUsedHours,
      avgUtilization,
      activeRetainersCount: scopedRetainers.length,
      overdueCount: overdueInvoices.length
    };
  }, [scopedRetainers, scopedInvoices]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return scopedInvoices.filter(inv => {
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
      const matchesClient = clientFilter === 'all' || inv.clientId === clientFilter;
      const matchesSearch =
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.notes && inv.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesClient && matchesSearch;
    });
  }, [scopedInvoices, statusFilter, clientFilter, searchQuery]);

  // Filtered Time Entries
  const filteredTimeEntries = useMemo(() => {
    return scopedTimeEntries.filter(t => {
      const matchesClient = clientFilter === 'all' || t.clientId === clientFilter;
      const matchesSearch =
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesClient && matchesSearch;
    });
  }, [scopedTimeEntries, clientFilter, searchQuery]);

  // Form State: Create Invoice
  const [newInvClientId, setNewInvClientId] = useState(scopedClients[0]?.id || '');
  const [newInvIssueDate, setNewInvIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [newInvDueDate, setNewInvDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [newInvNotes, setNewInvNotes] = useState('');
  const [newInvItems, setNewInvItems] = useState<{ description: string; quantity: number; rate: number }[]>([
    { description: 'Social Media Management Retainer', quantity: 1, rate: 250000 }
  ]);

  // Form State: Log Billable Time
  const [timeClientId, setTimeClientId] = useState(clients[0]?.id || '');
  const [timeCategory, setTimeCategory] = useState<BillableTimeEntry['category']>('content_creation');
  const [timeHours, setTimeHours] = useState('2.5');
  const [timeDescription, setTimeDescription] = useState('');
  const [timeHourlyRate, setTimeHourlyRate] = useState('4500');

  // Payment Settlement Form State
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>('mpesa');
  const [paymentReference, setPaymentReference] = useState('');

  // Handle Create Invoice Submission
  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClient = clients.find(c => c.id === newInvClientId);
    if (!targetClient) {
      addToast('Validation Error', 'Please select a valid client', 'error');
      return;
    }

    const calculatedItems = newInvItems.map((item, idx) => ({
      id: `item_${Date.now()}_${idx}`,
      description: item.description,
      quantity: Number(item.quantity) || 1,
      rate: Number(item.rate) || 0,
      amount: (Number(item.quantity) || 1) * (Number(item.rate) || 0)
    }));

    const subtotal = calculatedItems.reduce((sum, item) => sum + item.amount, 0);
    const taxRatePercent = 16; // Standard 16% VAT
    const taxAmount = Math.round(subtotal * 0.16);
    const totalAmount = subtotal + taxAmount;

    const nextInvoiceNumber = `INV-2026-0${invoices.length + 90}`;

    createInvoice({
      invoiceNumber: nextInvoiceNumber,
      tenantId: workspace.id,
      clientId: targetClient.id,
      clientName: targetClient.name,
      clientEmail: targetClient.contacts?.[0]?.email || 'billing@client.com',
      clientAddress: `${targetClient.name} Corporate HQ, Nairobi`,
      currency: 'KES',
      issueDate: newInvIssueDate,
      dueDate: newInvDueDate,
      items: calculatedItems,
      subtotal,
      taxRatePercent,
      taxAmount,
      totalAmount,
      status: 'draft',
      notes: newInvNotes || 'Standard agency 14-day payment settlement terms.'
    });

    setShowCreateInvoiceModal(false);
    // Reset form
    setNewInvItems([{ description: 'Social Media Management Retainer', quantity: 1, rate: 250000 }]);
    setNewInvNotes('');
  };

  // Handle Log Time Submission
  const handleLogTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hoursNum = parseFloat(timeHours);
    if (isNaN(hoursNum) || hoursNum <= 0) {
      addToast('Validation Error', 'Please specify valid hours', 'error');
      return;
    }

    const clientRetainer = retainers.find(r => r.clientId === timeClientId);

    logBillableTime({
      tenantId: workspace.id,
      clientId: timeClientId,
      retainerId: clientRetainer ? clientRetainer.id : undefined,
      userId: currentUser.id,
      userName: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      durationMinutes: Math.round(hoursNum * 60),
      category: timeCategory,
      description: timeDescription || `${timeCategory.replace('_', ' ')} work session`,
      isBillable: true,
      hourlyRate: parseFloat(timeHourlyRate) || 4500,
      invoiced: false
    });

    setShowLogTimeModal(false);
    setTimeDescription('');
    setTimeHours('2.0');
  };

  // Handle Payment Settlement
  const handlePaymentSettleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment) return;

    recordInvoicePayment(
      selectedInvoiceForPayment.id,
      paymentGateway,
      paymentReference || `${paymentGateway.toUpperCase()}-CONF-${Math.floor(100000 + Math.random() * 900000)}`
    );

    setSelectedInvoiceForPayment(null);
    setPaymentReference('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Billing, Retainers & Invoicing</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Operational
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Monthly retainer utilization gauges, dynamic VAT invoice generator, M-Pesa & Stripe settlements, and billable timecards.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLogTimeModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition border border-slate-700 shadow-sm"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Log Billable Hours</span>
          </button>
          <button
            onClick={() => setShowCreateInvoiceModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* Financial Telemetry Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR Card */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Agency MRR</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {currencySymbol} {metrics.totalMRR.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>{metrics.activeRetainersCount} Active Retainers</span>
            <span className="text-emerald-400 font-medium">ARR: {currencySymbol} {(metrics.totalARR / 1000000).toFixed(1)}M</span>
          </div>
        </div>

        {/* Collected Card */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Settled & Collected</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {currencySymbol} {metrics.totalCollected.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>Cleared via M-Pesa & Bank Wire</span>
            <span className="text-teal-400 font-medium">100% Tax Compliant</span>
          </div>
        </div>

        {/* Pending & Overdue Card */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Receivables & Overdue</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {currencySymbol} {(metrics.totalPending + metrics.totalOverdue).toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>Pending: {currencySymbol} {metrics.totalPending.toLocaleString()}</span>
            {metrics.totalOverdue > 0 ? (
              <span className="text-rose-400 font-semibold">{metrics.overdueCount} Overdue ({currencySymbol} {metrics.totalOverdue.toLocaleString()})</span>
            ) : (
              <span className="text-emerald-400 font-medium">Zero Overdue</span>
            )}
          </div>
        </div>

        {/* Hours Utilization Card */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Retainer Capacity Burn</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {metrics.avgUtilization}% <span className="text-xs font-normal text-slate-400">of quota burned</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>{metrics.totalUsedHours}h / {metrics.totalAllocatedHours}h Logged</span>
            <span className={metrics.avgUtilization > 90 ? 'text-amber-400 font-semibold' : 'text-indigo-400 font-medium'}>
              {metrics.avgUtilization > 90 ? 'Nearing Cap' : 'Optimal Pace'}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-view Navigation Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center space-x-2 py-3 px-5 border-b-2 font-medium text-sm transition-all ${
            activeTab === 'invoices'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Invoices Directory ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('retainers')}
          className={`flex items-center space-x-2 py-3 px-5 border-b-2 font-medium text-sm transition-all ${
            activeTab === 'retainers'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Client Retainer Meters ({retainers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('time_logs')}
          className={`flex items-center space-x-2 py-3 px-5 border-b-2 font-medium text-sm transition-all ${
            activeTab === 'time_logs'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Billable Time Logs ({timeEntries.length})</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search invoices, clients, entries..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {activeTab === 'invoices' && (
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid / Settled</option>
              <option value="sent">Sent / Pending</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Drafts</option>
            </select>
          )}

          <select
            value={clientFilter}
            onChange={e => setClientFilter(e.target.value)}
            className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Clients</option>
            {scopedClients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-400">
          Showing {activeTab === 'invoices' ? filteredInvoices.length : activeTab === 'retainers' ? scopedRetainers.length : filteredTimeEntries.length} records
        </div>
      </div>

      {/* TAB 1: INVOICES DIRECTORY */}
      {activeTab === 'invoices' && (
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client Brand</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                  <th className="py-3 px-4 text-right">16% VAT</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      No invoices found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map(inv => {
                    const isOverdue = inv.status === 'overdue';
                    const isPaid = inv.status === 'paid';
                    const isDraft = inv.status === 'draft';
                    const isSent = inv.status === 'sent';

                    return (
                      <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-mono font-medium text-emerald-400">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-white">
                          <div className="flex flex-col">
                            <span>{inv.clientName}</span>
                            <span className="text-[11px] text-slate-500 font-normal">{inv.clientEmail}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {inv.issueDate}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-400'}>
                            {inv.dueDate}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-400">
                          {currencySymbol} {inv.subtotal.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-500">
                          {currencySymbol} {inv.taxAmount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-white">
                          {currencySymbol} {inv.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isPaid && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <Check className="w-3 h-3 mr-1" /> Paid
                            </span>
                          )}
                          {isSent && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              <Send className="w-3 h-3 mr-1" /> Sent
                            </span>
                          )}
                          {isOverdue && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              <AlertTriangle className="w-3 h-3 mr-1" /> Overdue
                            </span>
                          )}
                          {isDraft && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-700 text-slate-300 border border-slate-600">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {/* View / Print Preview */}
                            <button
                              onClick={() => setSelectedInvoiceForPreview(inv)}
                              title="View & Print White-Label Invoice"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            {/* Mark Paid Simulator */}
                            {!isPaid && (
                              <button
                                onClick={() => {
                                  setSelectedInvoiceForPayment(inv);
                                  setPaymentGateway('mpesa');
                                }}
                                title="Settle Invoice (M-Pesa / Stripe / Wire)"
                                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Settle</span>
                              </button>
                            )}

                            {/* Mark Sent if Draft */}
                            {isDraft && (
                              <button
                                onClick={() => {
                                  updateInvoice(inv.id, { status: 'sent' });
                                  addToast('Invoice Dispatched', `Invoice ${inv.invoiceNumber} dispatched to ${inv.clientEmail}`, 'success');
                                }}
                                title="Send to Client"
                                className="p-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 transition"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => deleteInvoice(inv.id)}
                              title="Delete Invoice"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CLIENT RETAINER METERS */}
      {activeTab === 'retainers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scopedRetainers.length === 0 ? (
            <div className="col-span-full bg-slate-900/60 rounded-xl border border-slate-800 p-12 text-center text-slate-500">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <div className="font-semibold text-white">No Active Retainer Plans</div>
              <div className="text-xs text-slate-400 mt-1">Retainer allocations appear automatically when client contracts are configured.</div>
            </div>
          ) : (
            scopedRetainers.map(ret => {
              const utilizationPercent = Math.min(100, Math.round((ret.usedHours / ret.allocatedHours) * 100));
              const isOverage = ret.usedHours > ret.allocatedHours;
              const overageHours = isOverage ? Math.round((ret.usedHours - ret.allocatedHours) * 10) / 10 : 0;
              const overageAmount = overageHours * ret.hourlyOverageRate;

            return (
              <div
                key={ret.id}
                className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 shadow-sm hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white text-base">{ret.clientName}</h3>
                      <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {ret.tierName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Cycle: 1st of month • Billing Day {ret.billingCycleDay}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold text-emerald-400">
                      {ret.currency} {ret.monthlyFee.toLocaleString()}<span className="text-xs font-normal text-slate-400">/mo</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${
                      ret.status === 'exhausted'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : ret.status === 'warning'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {ret.status === 'exhausted' ? 'Overage Triggered' : ret.status === 'warning' ? 'Capacity Warning' : 'Active Quota'}
                    </span>
                  </div>
                </div>

                {/* Progress Gauge */}
                <div className="space-y-1.5 my-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Logged Hours Burn</span>
                    <span className="font-semibold text-slate-200">
                      {ret.usedHours} hrs / {ret.allocatedHours} hrs ({utilizationPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverage
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                          : ret.usedHours >= ret.allocatedHours * 0.85
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      }`}
                      style={{ width: `${utilizationPercent}%` }}
                    />
                  </div>
                </div>

                {/* Overage Alert Box */}
                {isOverage && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>
                        Retainer exceeded by <strong>{overageHours} hrs</strong>
                      </span>
                    </div>
                    <span className="font-semibold text-white">
                      +{ret.currency} {overageAmount.toLocaleString()} billable
                    </span>
                  </div>
                )}

                {/* Deliverable Quota Grid */}
                <div className="grid grid-cols-4 gap-2 text-center pt-3 border-t border-slate-800">
                  <div className="p-2 rounded-lg bg-slate-800/40">
                    <div className="text-xs text-slate-400">Posts/Mo</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{ret.deliverableQuota.postsPerMonth}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/40">
                    <div className="text-xs text-slate-400">Reels/Mo</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{ret.deliverableQuota.reelsPerMonth}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/40">
                    <div className="text-xs text-slate-400">Ad Sprints</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{ret.deliverableQuota.paidAdsCampaigns}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/40">
                    <div className="text-xs text-slate-400">Strategy Calls</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{ret.deliverableQuota.strategyCalls}</div>
                  </div>
                </div>
              </div>
            );
          }))}
        </div>
      )}

      {/* TAB 3: BILLABLE TIME LOGS */}
      {activeTab === 'time_logs' && (
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Team Member</th>
                  <th className="py-3 px-4">Client Brand</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Duration</th>
                  <th className="py-3 px-4 text-right">Billable Rate</th>
                  <th className="py-3 px-4 text-right">Calculated Fee</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredTimeEntries.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      No time logs found matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTimeEntries.map(entry => {
                    const hours = entry.durationMinutes / 60;
                    const calculatedFee = hours * entry.hourlyRate;
                    const client = clients.find(c => c.id === entry.clientId);

                    return (
                      <tr key={entry.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 text-slate-400 font-mono">
                          {entry.date}
                        </td>
                        <td className="py-3 px-4 font-medium text-white">
                          {entry.userName}
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-medium">
                          {client?.name || entry.clientId}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 capitalize border border-slate-700">
                            {entry.category.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 max-w-xs truncate" title={entry.description}>
                          {entry.description}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-white">
                          {hours.toFixed(1)} hrs
                        </td>
                        <td className="py-3 px-4 text-right text-slate-400">
                          {currencySymbol} {entry.hourlyRate.toLocaleString()}/hr
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-emerald-400">
                          {currencySymbol} {Math.round(calculatedFee).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => deleteBillableTime(entry.id)}
                            title="Remove Timecard"
                            className="p-1 rounded bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CREATE INVOICE */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-800/40">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Generate Agency Invoice</h3>
                  <p className="text-xs text-slate-400">Create itemized client invoice with automatic 16% VAT computation</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateInvoiceModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Target Client *</label>
                  <select
                    value={newInvClientId}
                    onChange={e => setNewInvClientId(e.target.value)}
                    className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {scopedClients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={newInvIssueDate}
                    onChange={e => setNewInvIssueDate(e.target.value)}
                    className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newInvDueDate}
                    onChange={e => setNewInvDueDate(e.target.value)}
                    className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Invoice Line Items</label>
                  <button
                    type="button"
                    onClick={() => setNewInvItems([...newInvItems, { description: '', quantity: 1, rate: 0 }])}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3 h-3" /> Add Line
                  </button>
                </div>

                {newInvItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Service / Deliverable description"
                      value={item.description}
                      onChange={e => {
                        const copy = [...newInvItems];
                        copy[idx].description = e.target.value;
                        setNewInvItems(copy);
                      }}
                      className="flex-1 text-xs bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={e => {
                        const copy = [...newInvItems];
                        copy[idx].quantity = Number(e.target.value);
                        setNewInvItems(copy);
                      }}
                      className="w-16 text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-white text-center focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="Unit Rate"
                      value={item.rate}
                      onChange={e => {
                        const copy = [...newInvItems];
                        copy[idx].rate = Number(e.target.value);
                        setNewInvItems(copy);
                      }}
                      className="w-28 text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-white text-right focus:outline-none focus:border-emerald-500"
                    />
                    {newInvItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setNewInvItems(newInvItems.filter((_, i) => i !== idx))}
                        className="p-2 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Subtotal Calculation Display */}
              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-200">
                    {currencySymbol} {newInvItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>16% VAT:</span>
                  <span className="font-semibold text-slate-200">
                    {currencySymbol} {Math.round(newInvItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0) * 0.16).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-slate-700">
                  <span>Grand Total:</span>
                  <span className="text-emerald-400">
                    {currencySymbol} {Math.round(newInvItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0) * 1.16).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Invoice Notes & Wire Details</label>
                <textarea
                  rows={2}
                  value={newInvNotes}
                  onChange={e => setNewInvNotes(e.target.value)}
                  placeholder="Payment remittance info, M-Pesa paybill instructions or swift details..."
                  className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateInvoiceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-500/20 transition"
                >
                  Create & Save Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG BILLABLE TIME */}
      {showLogTimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-800/40">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Log Billable Time</h3>
                  <p className="text-xs text-slate-400">Link timecards directly to client monthly retainer budgets</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogTimeModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogTimeSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Client Brand *</label>
                <select
                  value={timeClientId}
                  onChange={e => setTimeClientId(e.target.value)}
                  className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  {scopedClients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Hours Spent *</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    value={timeHours}
                    onChange={e => setTimeHours(e.target.value)}
                    className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Rate ({currencySymbol}/hr)</label>
                  <input
                    type="number"
                    step="500"
                    value={timeHourlyRate}
                    onChange={e => setTimeHourlyRate(e.target.value)}
                    className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Deliverable Category</label>
                <select
                  value={timeCategory}
                  onChange={e => setTimeCategory(e.target.value as any)}
                  className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 capitalize"
                >
                  <option value="content_creation">Content Creation & Graphic Design</option>
                  <option value="video_editing">Video Editing & Reels Production</option>
                  <option value="community_management">Community Management & DM Triage</option>
                  <option value="strategy_review">Strategy & Executive Client Review</option>
                  <option value="analytics_reporting">Analytics Reporting & ROI Audit</option>
                  <option value="paid_ads">Paid Meta/LinkedIn Ads Optimization</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Work Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="E.g. Filmed roastery interview and color graded 4K vertical reel..."
                  value={timeDescription}
                  onChange={e => setTimeDescription(e.target.value)}
                  className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogTimeModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20 transition"
                >
                  Save Timecard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SETTLE PAYMENT SIMULATOR */}
      {selectedInvoiceForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-800/40">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Settle Invoice Payment</h3>
                  <p className="text-xs text-slate-400">{selectedInvoiceForPayment.invoiceNumber} • {currencySymbol} {selectedInvoiceForPayment.totalAmount.toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceForPayment(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaymentSettleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Payment Gateway / Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentGateway('mpesa')}
                    className={`p-3 rounded-xl border text-center transition ${
                      paymentGateway === 'mpesa'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold'
                        : 'border-slate-700 bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">M-Pesa</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Paybill STK</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentGateway('stripe')}
                    className={`p-3 rounded-xl border text-center transition ${
                      paymentGateway === 'stripe'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold'
                        : 'border-slate-700 bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">Stripe</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Card Gateway</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentGateway('bank_transfer')}
                    className={`p-3 rounded-xl border text-center transition ${
                      paymentGateway === 'bank_transfer'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold'
                        : 'border-slate-700 bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">Bank Wire</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">RTGS / EFT</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Transaction Confirmation Reference
                </label>
                <input
                  type="text"
                  placeholder={paymentGateway === 'mpesa' ? 'e.g. QK89X21NAIROBI-MPESA' : 'e.g. NCBA-WIRE-12903'}
                  value={paymentReference}
                  onChange={e => setPaymentReference(e.target.value)}
                  className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Client Brand:</span>
                  <span className="font-semibold text-white">{selectedInvoiceForPayment.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Due:</span>
                  <span className="font-bold text-emerald-400">
                    {currencySymbol} {selectedInvoiceForPayment.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForPayment(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Settlement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: WHITE-LABEL PRINTABLE INVOICE PREVIEW */}
      {selectedInvoiceForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 p-8 relative print:m-0 print:p-0">
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b pb-4 mb-6 print:hidden">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Official Agency Invoice Preview
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceForPreview(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">{workspace.name}</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Westlands Commercial Center, 5th Floor<br />
                  Nairobi, Kenya • PIN: P051288492X<br />
                  Email: {workspace.supportEmail}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {selectedInvoiceForPreview.invoiceNumber}
                </span>
                <div className="text-xs text-slate-500 mt-1">
                  Issue Date: <strong className="text-slate-800">{selectedInvoiceForPreview.issueDate}</strong><br />
                  Due Date: <strong className="text-slate-800">{selectedInvoiceForPreview.dueDate}</strong>
                </div>
                <div className="mt-2">
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                    selectedInvoiceForPreview.status === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedInvoiceForPreview.status === 'overdue'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {selectedInvoiceForPreview.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Billed To:
              </span>
              <div className="font-bold text-slate-900 text-base">{selectedInvoiceForPreview.clientName}</div>
              <div className="text-xs text-slate-600 mt-0.5">{selectedInvoiceForPreview.clientEmail}</div>
              {selectedInvoiceForPreview.clientAddress && (
                <div className="text-xs text-slate-500 mt-0.5">{selectedInvoiceForPreview.clientAddress}</div>
              )}
            </div>

            {/* Itemized Table */}
            <table className="w-full text-left text-xs mb-6">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-2.5">Service Description</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Unit Rate</th>
                  <th className="py-2.5 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedInvoiceForPreview.items.map((item, idx) => (
                  <tr key={idx} className="text-slate-800">
                    <td className="py-3 font-medium">{item.description}</td>
                    <td className="py-3 text-center text-slate-600">{item.quantity}</td>
                    <td className="py-3 text-right text-slate-600">{currencySymbol} {item.rate.toLocaleString()}</td>
                    <td className="py-3 text-right font-semibold">{currencySymbol} {item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Breakdown */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">
                    {currencySymbol} {selectedInvoiceForPreview.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>VAT ({selectedInvoiceForPreview.taxRatePercent}%):</span>
                  <span className="font-semibold text-slate-900">
                    {currencySymbol} {selectedInvoiceForPreview.taxAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Due:</span>
                  <span className="text-emerald-700">
                    {currencySymbol} {selectedInvoiceForPreview.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details Footer */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              <div className="font-bold text-slate-900 mb-1">Payment Instructions & Remittance:</div>
              <p>M-Pesa Paybill: <strong>522522</strong> • Account: <strong>{selectedInvoiceForPreview.invoiceNumber}</strong></p>
              <p className="mt-0.5">NCBA Bank Kenya • Account No: <strong>1004928172</strong> • Swift: <strong>NCBAKENA</strong></p>
              {selectedInvoiceForPreview.notes && (
                <p className="mt-2 text-[11px] text-slate-500 italic">Notes: {selectedInvoiceForPreview.notes}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
