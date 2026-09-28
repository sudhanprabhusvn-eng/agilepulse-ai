import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { BackButtonHeader } from './components/common/BackButtonHeader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { ArchitectureSection } from './components/landing/ArchitectureSection';
import { AboutSection } from './components/landing/AboutSection';
import { PricingSection } from './components/landing/PricingSection';
import { Footer } from './components/landing/Footer';

import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { SprintBoard } from './components/kanban/SprintBoard';
import { ScenarioSimulator } from './components/simulator/ScenarioSimulator';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { TeamsView } from './components/teams/TeamsView';
import { ReportsView } from './components/reports/ReportsView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { SettingsView } from './components/settings/SettingsView';
import { ProfileView } from './components/profile/ProfileView';
import { WorkspaceView } from './components/workspace/WorkspaceView';
import { OrganizationView } from './components/organization/OrganizationView';
import { SecurityView } from './components/security/SecurityView';
import { AdminView } from './components/admin/AdminView';
import { DocsView } from './components/docs/DocsView';
import { AIAssistantDrawer } from './components/ai/AIAssistantDrawer';
import { AIAgentsView } from './components/ai/AIAgentsView';
import { AIWorkflowsView } from './components/ai/AIWorkflowsView';
import { AIAutomationView } from './components/ai/AIAutomationView';
import { AIPromptsView } from './components/ai/AIPromptsView';
import { AIExecutionHistoryView } from './components/ai/AIExecutionHistoryView';
import { GlobalSearchView } from './components/search/GlobalSearchView';
import { KnowledgeBaseView } from './components/knowledge/KnowledgeBaseView';
import { CollaborationHubView } from './components/collaboration/CollaborationHubView';
import { ChatView } from './components/collaboration/ChatView';
import { MeetingsView } from './components/collaboration/MeetingsView';
import { CalendarView } from './components/collaboration/CalendarView';
import { WhiteboardView } from './components/collaboration/WhiteboardView';
import { IntegrationsView } from './components/integrations/IntegrationsView';
import { PluginsMarketplaceView } from './components/integrations/PluginsMarketplaceView';
import { WebhooksApiView } from './components/integrations/WebhooksApiView';
import { PwaOfflineView } from './components/pwa/PwaOfflineView';

function AppContent() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="min-h-screen bg-bg-base text-zinc-900 font-sans antialiased selection:bg-brand-green selection:text-black flex flex-col justify-between">
      <Navbar />

      {activeTab === 'landing' ? (
        <div className="w-full flex-1 flex flex-col">
          <Hero />
          <FeaturesSection />
          <ArchitectureSection />
          <AboutSection />
          <PricingSection />
          <Footer />
        </div>
      ) : (
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-16">
          <BackButtonHeader />

          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'board' && <SprintBoard />}
          {activeTab === 'simulator' && <ScenarioSimulator />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'teams' && <TeamsView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'notifications' && <NotificationsView onNavigateTab={(tab) => setActiveTab(tab)} />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'workspace' && <WorkspaceView />}
          {activeTab === 'organization' && <OrganizationView />}
          {activeTab === 'security' && <SecurityView />}
          {activeTab === 'admin' && <AdminView />}
          {activeTab === 'docs' && <DocsView />}

          {/* Part 9 Views */}
          {activeTab === 'ai-agents' && <AIAgentsView />}
          {activeTab === 'ai-workflows' && <AIWorkflowsView />}
          {activeTab === 'ai-automation' && <AIAutomationView />}
          {activeTab === 'ai-prompts' && <AIPromptsView />}
          {activeTab === 'ai-history' && <AIExecutionHistoryView />}
          {activeTab === 'search' && <GlobalSearchView />}
          {activeTab === 'knowledge' && <KnowledgeBaseView />}
          {activeTab === 'collaboration' && <CollaborationHubView />}
          {activeTab === 'chat' && <ChatView />}
          {activeTab === 'meetings' && <MeetingsView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'whiteboard' && <WhiteboardView />}
          {activeTab === 'integrations' && <IntegrationsView />}
          {activeTab === 'plugins' && <PluginsMarketplaceView />}
          {activeTab === 'webhooks' && <WebhooksApiView />}
          {activeTab === 'pwa-offline' && <PwaOfflineView />}
        </main>
      )}

      {activeTab !== 'landing' && <Footer />}

      {/* Sliding AI Copilot Drawer */}
      <AIAssistantDrawer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
