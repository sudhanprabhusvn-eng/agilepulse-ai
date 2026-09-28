import React, { useState } from 'react';
import {
  Bell,
  Mail,
  Volume2,
  Moon,
  Sparkles,
  ShieldCheck,
  Check,
  Smartphone,
  Save,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationCategory, NotificationPreferences } from '../../types';

export function NotificationPreferencesView() {
  const { preferences, updatePreferences, setToastMessage } = useApp();
  const [localPrefs, setLocalPrefs] = useState(preferences);

  const handleToggleChannel = (channel: keyof typeof preferences.channels) => {
    setLocalPrefs((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: !prev.channels[channel],
      },
    }));
  };

  const handleToggleCategory = (cat: NotificationCategory) => {
    setLocalPrefs((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [cat]: !prev.categories[cat],
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences(localPrefs);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fade-in text-xs max-w-4xl">
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-zinc-900">Notification Channels & Delivery Settings</h2>
            <p className="text-zinc-500">Configure how and when AgilePulse alerts you across web, desktop, and email</p>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4 text-brand-green" /> Save Preferences
          </button>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => handleToggleChannel('inApp')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              localPrefs.channels.inApp ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <Bell className="w-5 h-5 text-brand-green" />
              <input type="checkbox" checked={localPrefs.channels.inApp} readOnly className="accent-brand-green w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs">In-App Center</h3>
            <p className="text-[11px] opacity-80">Real-time notification bell and slide-over triage drawer.</p>
          </div>

          <div
            onClick={() => handleToggleChannel('email')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              localPrefs.channels.email ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <Mail className="w-5 h-5 text-indigo-400" />
              <input type="checkbox" checked={localPrefs.channels.email} readOnly className="accent-indigo-500 w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs">Email Notifications</h3>
            <p className="text-[11px] opacity-80">Digest emails for critical risk flags and scheduled reports.</p>
          </div>

          <div
            onClick={() => handleToggleChannel('browserPush')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              localPrefs.channels.browserPush ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <Smartphone className="w-5 h-5 text-amber-400" />
              <input type="checkbox" checked={localPrefs.channels.browserPush} readOnly className="accent-amber-400 w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs">Browser Push</h3>
            <p className="text-[11px] opacity-80">Desktop system alerts for high priority mentions.</p>
          </div>

          <div
            onClick={() => handleToggleChannel('sound')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              localPrefs.channels.sound ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <Volume2 className="w-5 h-5 text-emerald-400" />
              <input type="checkbox" checked={localPrefs.channels.sound} readOnly className="accent-emerald-400 w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs">Audio Chimes</h3>
            <p className="text-[11px] opacity-80">Sound cues when new critical risk events occur.</p>
          </div>
        </div>

        {/* Quiet Hours & AI Digest */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-zinc-100">
          {/* Quiet Hours */}
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-zinc-700" />
                <h3 className="font-bold text-zinc-900">Quiet Hours Mode</h3>
              </div>
              <input
                type="checkbox"
                checked={localPrefs.quietHours.enabled}
                onChange={(e) =>
                  setLocalPrefs((prev) => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, enabled: e.target.checked },
                  }))
                }
                className="accent-zinc-900 w-4 h-4 rounded cursor-pointer"
              />
            </div>
            <p className="text-zinc-500 text-[11px]">Suppress non-critical push notifications during focus/sleep hours.</p>

            {localPrefs.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-semibold text-zinc-600 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={localPrefs.quietHours.startTime}
                    onChange={(e) =>
                      setLocalPrefs((prev) => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, startTime: e.target.value },
                      }))
                    }
                    className="w-full bg-white border border-zinc-300 rounded-xl px-2.5 py-1.5 font-mono text-zinc-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-600 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={localPrefs.quietHours.endTime}
                    onChange={(e) =>
                      setLocalPrefs((prev) => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, endTime: e.target.value },
                      }))
                    }
                    className="w-full bg-white border border-zinc-300 rounded-xl px-2.5 py-1.5 font-mono text-zinc-900"
                  />
                </div>
              </div>
            )}
          </div>

          {/* AI Digest */}
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-zinc-900">AI Predictive Summary Frequency</h3>
            </div>
            <p className="text-zinc-500 text-[11px]">Choose how frequently AI aggregates risk telemetry into summary cards.</p>

            <select
              value={localPrefs.aiDigest}
              onChange={(e) =>
                setLocalPrefs((prev) => ({
                  ...prev,
                  aiDigest: e.target.value as NotificationPreferences['aiDigest'],
                }))
              }
              className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 font-semibold text-zinc-900"
            >
              <option value="realtime">Real-time Stream (Instant Alerts)</option>
              <option value="daily">Daily Morning Executive Digest (09:00 AM)</option>
              <option value="weekly">Weekly Sprint Briefing (Mondays)</option>
              <option value="never">Disabled</option>
            </select>
          </div>
        </div>

        {/* Subscribed Notification Categories */}
        <div className="space-y-3 pt-2 border-t border-zinc-100">
          <h3 className="font-bold text-zinc-900">Subscribed Notification Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(Object.keys(localPrefs.categories) as NotificationCategory[]).map((cat) => {
              const active = localPrefs.categories[cat];
              return (
                <div
                  key={cat}
                  onClick={() => handleToggleCategory(cat)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    active ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                  }`}
                >
                  <span className="font-semibold text-xs capitalize">{cat} Alerts</span>
                  <input type="checkbox" checked={active} readOnly className="accent-brand-green w-4 h-4" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </form>
  );
}
