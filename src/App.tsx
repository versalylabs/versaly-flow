/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AgencyProvider, useAgency } from './context/AgencyContext';
import { TopNav } from './components/layout/TopNav';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './components/auth/LoginPage';
import { RoadmapViewer } from './components/roadmap/RoadmapViewer';
import { FoundationInspector } from './components/foundation/FoundationInspector';
import { ArchitectureInspector } from './components/architecture/ArchitectureInspector';
import { AuthenticationManager } from './components/auth/AuthenticationManager';
import { MultiTenancyManager } from './components/tenancy/MultiTenancyManager';
import { RbacManager } from './components/rbac/RbacManager';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { ClientManagement } from './components/clients/ClientManagement';
import { ClientOnboarding } from './components/onboarding/ClientOnboarding';
import { TeamAllocation } from './components/team/TeamAllocation';
import { ContentComposer } from './components/composer/ContentComposer';
import { ClientApprovalsPortal } from './components/approvals/ClientApprovalsPortal';
import { ContentCalendar } from './components/calendar/ContentCalendar';
import { EditorialWorkflow } from './components/workflow/EditorialWorkflow';
import { DigitalAssetManager } from './components/dam/DigitalAssetManager';
import { CampaignManager } from './components/campaigns/CampaignManager';
import { TaskManager } from './components/tasks/TaskManager';
import { SocialConnectionsManager } from './components/social/SocialConnectionsManager';
import { PublishingEngine } from './components/publishing/PublishingEngine';
import { AnalyticsReporting } from './components/analytics/AnalyticsReporting';
import { CrmPipelineManager } from './components/crm/CrmPipelineManager';
import { BillingInvoicingManager } from './components/billing/BillingInvoicingManager';
import { UnifiedInboxManager } from './components/inbox/UnifiedInboxManager';
import { WorkflowAutomationManager } from './components/automation/WorkflowAutomationManager';
import { AiStrategyEngine } from './components/ai/AiStrategyEngine';
import { WhiteLabelManager } from './components/whitelabel/WhiteLabelManager';
import { SubscriptionTierManager } from './components/subscription/SubscriptionTierManager';
import { ProductivityStudio } from './components/productivity/ProductivityStudio';
import { CommandPalette } from './components/productivity/CommandPalette';
import { SecurityStudio } from './components/security/SecurityStudio';
import { PerformanceStudio } from './components/performance/PerformanceStudio';
import { TestingStudio } from './components/testing/TestingStudio';
import { InfrastructureStudio } from './components/infrastructure/InfrastructureStudio';
import { ObservabilityStudio } from './components/observability/ObservabilityStudio';
import { DocumentationStudio } from './components/documentation/DocumentationStudio';
import { AccessibilityStudio } from './components/accessibility/AccessibilityStudio';
import { LandingPage } from './components/landing/LandingPage';
import { UpcomingPhaseView } from './components/views/UpcomingPhaseView';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function MainLayout() {
  const { session, currentUser } = useAgency();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [authMode, setAuthMode] = useState<'landing' | 'signin' | 'register'>('landing');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const superAdminOnlyViews = [
    'observability',
    'infrastructure',
    'testing',
    'security',
    'tenancy',
    'rbac',
    'roadmap',
    'architecture',
    'foundation',
    'schema'
  ];

  // Defensive redirect: if non-super-admin tries to access platform tools, fallback to dashboard
  useEffect(() => {
    if (!isSuperAdmin && superAdminOnlyViews.includes(currentView)) {
      setCurrentView('dashboard');
    }
  }, [isSuperAdmin, currentView]);

  // Dynamic Browser Tab Name (Header Title)
  useEffect(() => {
    const viewTitles: Record<string, string> = {
      dashboard: 'Executive Dashboard',
      calendar: 'Content Calendar',
      composer: 'Content Composer',
      approvals: 'Client Approvals Portal',
      inbox: 'Unified Social Inbox',
      campaigns: 'Campaign Operations',
      clients: 'Client Management',
      billing: 'Billing & Retainers',
      analytics: 'Analytics & Reporting',
      dam: 'Digital Asset Vault',
      team: 'Team Allocation',
      tasks: 'Task Operations',
      crm: 'Agency CRM Pipeline',
      workflow: 'Editorial Workflow',
      automation: 'Workflow Automation',
      social: 'Connected Social Accounts',
      ai: 'AI Strategy Studio',
      subscription: 'Agency Subscription Tier',
      whitelabel: 'White-Label Branding',
      onboarding: 'Client Onboarding',
      documentation: 'Documentation Studio',
      accessibility: 'Accessibility Studio',
      productivity: 'Productivity Power Tools',
      performance: 'Performance Studio',
      security: 'Security & Vault Studio',
      testing: 'Automated Testing Studio',
      observability: 'Observability & Telemetry',
      infrastructure: 'Infrastructure Studio',
      tenancy: 'Multi-Tenancy Manager',
      rbac: 'RBAC Policy Matrix',
      roadmap: 'Platform Architecture Roadmap',
      architecture: 'Architecture Inspector',
      foundation: 'Foundation Inspector'
    };

    if (!session) {
      if (authMode === 'signin') {
        document.title = 'Sign In — Versaly Flow';
      } else if (authMode === 'register') {
        document.title = 'Start Free Trial — Versaly Flow';
      } else {
        document.title = 'Versaly Flow — Sovereign Operating System for Social Media Agencies';
      }
    } else {
      const pageTitle = viewTitles[currentView] || 'Dashboard';
      document.title = `${pageTitle} — Versaly Flow`;
    }
  }, [session, authMode, currentView]);

  // If unauthenticated, show public LandingPage with seamless toggle to Sign In or Free Trial
  if (!session) {
    if (authMode === 'signin') {
      return (
        <>
          <LoginPage
            initialMode="signin"
            onBackToLanding={() => setAuthMode('landing')}
            onSuccess={() => setCurrentView('dashboard')}
          />
          <ToastContainer />
        </>
      );
    }

    if (authMode === 'register') {
      return (
        <>
          <LoginPage
            initialMode="register"
            onBackToLanding={() => setAuthMode('landing')}
            onSuccess={() => setCurrentView('dashboard')}
          />
          <ToastContainer />
        </>
      );
    }

    return (
      <>
        <LandingPage
          isAuthenticated={false}
          onStartFreeTrial={() => setAuthMode('register')}
          onSignIn={() => setAuthMode('signin')}
        />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f17] text-slate-100 font-sans antialiased">
      {/* Collapsible Categorized Sidebar with Mobile Slide-in Drawer */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0b0f17]">
        {/* Skip link for screen reader & keyboard navigation */}
        <a href="#main-content" className="skip-to-content-link">
          Skip to main content
        </a>

        {/* Top Navigation Bar */}
        <TopNav
          currentView={currentView}
          setCurrentView={setCurrentView}
          onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
        />

        {/* Viewport wrapped in defensive Error Boundary */}
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto bg-[#0b0f17] outline-none">
          <ErrorBoundary>
            {/* Operational SMM Agency Views */}
            {currentView === 'dashboard' && <ExecutiveDashboard />}
            {currentView === 'composer' && <ContentComposer />}
            {currentView === 'workflow' && <EditorialWorkflow />}
            {currentView === 'calendar' && <ContentCalendar />}
            {currentView === 'approvals' && <ClientApprovalsPortal />}
            {currentView === 'publishing' && <PublishingEngine />}
            {currentView === 'dam' && <DigitalAssetManager />}
            {currentView === 'clients' && <ClientManagement />}
            {currentView === 'onboarding' && <ClientOnboarding />}
            {currentView === 'social_accounts' && <SocialConnectionsManager />}
            {currentView === 'campaigns' && <CampaignManager />}
            {currentView === 'inbox' && <UnifiedInboxManager />}
            {currentView === 'tasks' && <TaskManager />}
            {currentView === 'team' && <TeamAllocation />}
            {currentView === 'crm' && <CrmPipelineManager />}
            {currentView === 'billing' && <BillingInvoicingManager />}
            {currentView === 'analytics' && <AnalyticsReporting />}
            {currentView === 'productivity' && (
              <ProductivityStudio onNavigateToComposer={() => setCurrentView('composer')} />
            )}
            {currentView === 'performance' && <PerformanceStudio />}
            {currentView === 'ai_strategy' && (
              <AiStrategyEngine onNavigateToComposer={() => setCurrentView('composer')} />
            )}
            {currentView === 'automation' && <WorkflowAutomationManager />}
            {currentView === 'subscription' && <SubscriptionTierManager />}
            {currentView === 'whitelabel' && <WhiteLabelManager />}
            {currentView === 'documentation' && <DocumentationStudio />}
            {currentView === 'accessibility' && <AccessibilityStudio />}
            {currentView === 'landing' && (
              <LandingPage
                isAuthenticated={true}
                currentUserEmail={currentUser?.email}
                onLaunchWorkspace={() => setCurrentView('dashboard')}
                onStartFreeTrial={() => setCurrentView('subscription')}
                onSignIn={() => setCurrentView('dashboard')}
              />
            )}

            {/* Platform Super Admin Tools (Guarded) */}
            {isSuperAdmin && currentView === 'observability' && <ObservabilityStudio />}
            {isSuperAdmin && currentView === 'infrastructure' && <InfrastructureStudio />}
            {isSuperAdmin && currentView === 'testing' && <TestingStudio />}
            {isSuperAdmin && currentView === 'security' && <SecurityStudio />}
            {isSuperAdmin && currentView === 'rbac' && <RbacManager />}
            {isSuperAdmin && currentView === 'tenancy' && <MultiTenancyManager />}
            {isSuperAdmin && currentView === 'roadmap' && <RoadmapViewer setCurrentView={setCurrentView} />}
            {isSuperAdmin && currentView === 'auth' && <AuthenticationManager />}
            {isSuperAdmin && currentView === 'architecture' && <ArchitectureInspector />}
            {isSuperAdmin && (currentView === 'foundation' || currentView === 'schema') && (
              <FoundationInspector />
            )}

            {currentView.endsWith('_preview') && (
              <UpcomingPhaseView viewId={currentView} setCurrentView={setCurrentView} />
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* Global Toast Notification System */}
      <ToastContainer />

      {/* Global Cmd+K Spotlight Command Palette */}
      <CommandPalette currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AgencyProvider>
        <MainLayout />
      </AgencyProvider>
    </ErrorBoundary>
  );
}
