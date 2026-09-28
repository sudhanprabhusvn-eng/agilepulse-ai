import React from 'react';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';
import { useApp, ActiveTab } from '../../context/AppContext';

export const TAB_LABELS: Record<ActiveTab, string> = {
  landing: 'Home',
  dashboard: 'Dashboard',
  board: 'Sprint Board',
  analytics: 'Sprint Analytics',
  simulator: 'Scenario Simulator',
  teams: 'Team Capacity',
  reports: 'Reports & Insights',
  notifications: 'Notifications',
  settings: 'System Settings',
  profile: 'User Profile',
  workspace: 'Workspace Hub',
  organization: 'Organization Management',
  security: 'Security & Access',
  admin: 'Admin Governance',
  docs: 'Documentation',
  'ai-agents': 'AI Agents',
  'ai-workflows': 'AI Workflows',
  'ai-automation': 'AI Automation',
  'ai-prompts': 'AI Prompts',
  'ai-history': 'Execution History',
  search: 'Global Search',
  knowledge: 'Knowledge Base',
  collaboration: 'Collaboration Hub',
  chat: 'Team Chat',
  meetings: 'Virtual Meetings',
  calendar: 'Sprint Calendar',
  whiteboard: 'Whiteboard',
  integrations: 'Integrations',
  plugins: 'Plugins Marketplace',
  webhooks: 'Webhooks & API',
  'pwa-offline': 'Offline & PWA',
};

interface BackButtonHeaderProps {
  customTitle?: string;
  className?: string;
}

export const BackButtonHeader: React.FC<BackButtonHeaderProps> = ({ customTitle, className = '' }) => {
  const { activeTab, setActiveTab, goBack, previousTab } = useApp();

  if (activeTab === 'landing') return null;

  const currentTitle = customTitle || TAB_LABELS[activeTab] || 'Page';
  const prevTitle = previousTab ? TAB_LABELS[previousTab] || 'Back' : 'Home';

  return (
    <div className={`mb-6 flex flex-wrap items-center justify-between gap-3 p-3.5 px-4 rounded-2xl bg-white/80 backdrop-blur-md border border-zinc-200/80 shadow-xs ${className}`}>
      {/* Left: Back Button & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={goBack}
          className="px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white font-bold text-xs hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 shrink-0"
          title={`Go back to ${prevTitle}`}
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Back</span>
        </button>

        <div className="h-4 w-[1px] bg-zinc-200 hidden sm:block" />

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('landing')}
            className="hover:text-zinc-900 flex items-center gap-1 cursor-pointer transition-colors shrink-0"
          >
            <Home className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-zinc-300 shrink-0" />

          {previousTab && previousTab !== 'landing' && (
            <>
              <button
                onClick={goBack}
                className="hover:text-zinc-900 cursor-pointer transition-colors truncate max-w-[120px]"
              >
                {prevTitle}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
            </>
          )}

          <span className="font-bold text-zinc-900 truncate max-w-[160px] sm:max-w-none">
            {currentTitle}
          </span>
        </nav>
      </div>

      {/* Right: Quick Return to Home / Dashboard */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        {activeTab !== 'dashboard' && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-3 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Dashboard
          </button>
        )}
        <button
          onClick={() => setActiveTab('landing')}
          className="px-3 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
        >
          Landing Page
        </button>
      </div>
    </div>
  );
};
