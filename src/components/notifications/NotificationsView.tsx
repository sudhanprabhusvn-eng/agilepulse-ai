import React, { useState } from 'react';
import { Bell, Activity, Megaphone, Settings } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
import { ActivityFeed } from './ActivityFeed';
import { AnnouncementPanel } from './AnnouncementPanel';
import { NotificationPreferencesView } from './NotificationPreferencesView';
import { ActiveTab } from '../../context/AppContext';

interface NotificationsViewProps {
  onNavigateTab?: (tab: ActiveTab) => void;
}

export function NotificationsView({ onNavigateTab }: NotificationsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'center' | 'activity' | 'announcements' | 'preferences'>('center');

  return (
    <div className="space-y-6 pb-12">
      {/* Module Header & Sub Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-zinc-900 tracking-tight">
              Communication & Notification Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-bold">
              Socket.IO Real-Time Active
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time notification triage, activity telemetry, broadcast announcements, and custom channel preferences.
          </p>
        </div>

        {/* Sub Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('center')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'center'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" /> Inbox Feed
          </button>
          <button
            onClick={() => setActiveSubTab('activity')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'activity'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Activity Stream
          </button>
          <button
            onClick={() => setActiveSubTab('announcements')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'announcements'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-brand-green" /> Broadcasts
          </button>
          <button
            onClick={() => setActiveSubTab('preferences')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'preferences'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> Preferences
          </button>
        </div>
      </div>

      {/* Render Sub View */}
      {activeSubTab === 'center' && <NotificationCenter onNavigateTab={onNavigateTab} />}
      {activeSubTab === 'activity' && <ActivityFeed />}
      {activeSubTab === 'announcements' && <AnnouncementPanel />}
      {activeSubTab === 'preferences' && <NotificationPreferencesView />}
    </div>
  );
}
