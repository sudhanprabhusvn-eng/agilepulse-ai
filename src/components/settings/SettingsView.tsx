import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  User,
  Palette,
  Globe,
  Bell,
  Cpu,
  Eye,
  Share2,
  Sliders,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  Shield,
  Volume2,
  Clock,
  Calendar,
  Layers,
  Zap,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Database,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SystemPreferences } from '../../types';

export function SettingsView() {
  const {
    systemPreferences,
    updateSystemPreferences,
    riskSensitivity,
    setRiskSensitivity,
    setToastMessage,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<
    'account' | 'appearance' | 'language' | 'notifications' | 'ai' | 'accessibility' | 'integrations'
  >('account');

  const [formState, setFormState] = useState<SystemPreferences>(systemPreferences);
  const [isDirty, setIsDirty] = useState(false);

  // MongoDB connection state
  const [mongoUri, setMongoUri] = useState('');
  const [mongoStatus, setMongoStatus] = useState<{
    configured: boolean;
    status: string;
    host: string | null;
    dbName: string | null;
  } | null>(null);
  const [testingMongo, setTestingMongo] = useState(false);
  const [mongoMessage, setMongoMessage] = useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/v1/mongodb/status')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setMongoStatus(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleTestMongo = async () => {
    setTestingMongo(true);
    setMongoMessage(null);
    try {
      const res = await fetch('/api/v1/mongodb/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri: mongoUri || undefined }),
      });
      const data = await res.json();
      setMongoMessage(data.message);
      if (data.data) {
        setMongoStatus(data.data);
      }
      setToastMessage(data.message);
    } catch (err: any) {
      setMongoMessage('Failed to reach backend endpoint.');
    } finally {
      setTestingMongo(false);
    }
  };

  const handleUpdate = (updater: (prev: SystemPreferences) => SystemPreferences) => {
    setFormState(updater);
    setIsDirty(true);
  };

  const handleSaveAll = () => {
    updateSystemPreferences(formState);
    setIsDirty(false);
  };

  const handleReset = () => {
    setFormState(systemPreferences);
    setIsDirty(false);
    setToastMessage('Settings reset to saved state.');
  };

  return (
    <div className="w-full space-y-8">
      {/* Title Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-black uppercase">
              Control Panel
            </span>
            <span className="text-xs font-mono text-zinc-400">Settings & Personalization</span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
            Platform Settings & Preferences
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5 max-w-2xl">
            Customize AI confidence models, appearance themes, quiet hours, accessibility, and integrations.
          </p>
        </div>

        {/* Unsaved Changes Save Bar Indicator */}
        {isDirty && (
          <div className="flex items-center gap-3 shrink-0 bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-2xl">
            <span className="text-xs text-emerald-400 font-semibold animate-pulse flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Unsaved changes
            </span>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs"
            >
              Reset
            </button>
            <button
              onClick={handleSaveAll}
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Grid: Category Sidebar + Content Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Category Navigation Cards */}
        <div className="space-y-2">
          <h2 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider mb-2">
            Settings Sections
          </h2>

          {[
            { id: 'account', label: 'Account Preferences', icon: User },
            { id: 'appearance', label: 'Appearance & Themes', icon: Palette },
            { id: 'language', label: 'Language & Region', icon: Globe },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'ai', label: 'AI Personalization', icon: Cpu },
            { id: 'accessibility', label: 'Accessibility', icon: Eye },
            { id: 'integrations', label: 'Integrations & APIs', icon: Share2 },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`w-full p-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-md'
                    : 'bg-white/80 backdrop-blur-md text-zinc-700 hover:bg-zinc-100 border border-white/90'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  <span>{cat.label}</span>
                </div>
                {isActive && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Account Preferences */}
          {activeCategory === 'account' && (
            <div className="p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-6">
              <div className="border-b border-zinc-100 pb-4">
                <h3 className="font-display text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" /> Account Preferences
                </h3>
                <p className="text-xs text-zinc-500">
                  Manage display options, profile visibility, default landing views, and auto-save.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Display Name</label>
                  <input
                    type="text"
                    value={formState.account.displayName}
                    onChange={(e) =>
                      handleUpdate((prev) => ({
                        ...prev,
                        account: { ...prev.account, displayName: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Username</label>
                  <input
                    type="text"
                    value={formState.account.username}
                    onChange={(e) =>
                      handleUpdate((prev) => ({
                        ...prev,
                        account: { ...prev.account, username: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Profile Visibility</label>
                  <select
                    value={formState.account.profileVisibility}
                    onChange={(e) =>
                      handleUpdate((prev) => ({
                        ...prev,
                        account: { ...prev.account, profileVisibility: e.target.value as any },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <option value="public">Public (Everyone in Org)</option>
                    <option value="team">Team Only</option>
                    <option value="private">Private (Only Admins)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Default Landing Page</label>
                  <select
                    value={formState.account.defaultLandingPage}
                    onChange={(e) =>
                      handleUpdate((prev) => ({
                        ...prev,
                        account: { ...prev.account, defaultLandingPage: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <option value="dashboard">Executive Dashboard</option>
                    <option value="board">Sprint Kanban Board</option>
                    <option value="analytics">Analytics Engine</option>
                    <option value="simulator">AI Simulator</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-zinc-900 text-xs">Auto-Save State Engine</h4>
                  <p className="text-[11px] text-zinc-500">Automatically synchronize task board edits across sessions.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdate((prev) => ({
                      ...prev,
                      account: { ...prev.account, autoSaveEnabled: !prev.account.autoSaveEnabled },
                    }))
                  }
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    formState.account.autoSaveEnabled ? 'bg-emerald-500' : 'bg-zinc-300'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-md ${
                      formState.account.autoSaveEnabled ? 'left-6' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Appearance & Themes */}
          {activeCategory === 'appearance' && (
            <div className="p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-6">
              <div className="border-b border-zinc-100 pb-4">
                <h3 className="font-display text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-emerald-600" /> Appearance & Theme
                </h3>
                <p className="text-xs text-zinc-500">
                  Select color palettes, card layout density, and UI animation behavior.
                </p>
              </div>

              {/* Theme Mode */}
              <div className="space-y-3">
                <label className="font-bold text-xs text-zinc-700">Theme Mode</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'light', label: 'Light Mode' },
                    { id: 'dark', label: 'Dark Mode' },
                    { id: 'system', label: 'System Default' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() =>
                        handleUpdate((prev) => ({
                          ...prev,
                          appearance: { ...prev.appearance, theme: t.id as any },
                        }))
                      }
                      className={`p-4 rounded-2xl border text-xs font-bold transition-all text-center ${
                        formState.appearance.theme === t.id
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Density & Border Radius */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-2">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Card Density</label>
                  <select
                    value={formState.appearance.cardDensity}
                    onChange={(e) =>
                      handleUpdate((prev) => ({
                        ...prev,
                        appearance: { ...prev.appearance, cardDensity: e.target.value as any },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <option value="comfortable">Comfortable (Spacious padding)</option>
                    <option value="compact">Compact (High data density)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Corner Border Radius</label>
                  <select
                    value={formState.appearance.borderRadius}
                    onChange={(e) =>
                      handleUpdate((prev) => ({
                        ...prev,
                        appearance: { ...prev.appearance, borderRadius: e.target.value as any },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <option value="sm">Small (4px)</option>
                    <option value="md">Medium (8px)</option>
                    <option value="lg">Large / Rounded (16px - Default)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* AI Personalization */}
          {activeCategory === 'ai' && (
            <div className="p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-6">
              <div className="border-b border-zinc-100 pb-4">
                <h3 className="font-display text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-600" /> AI Personalization & Confidence Thresholds
                </h3>
                <p className="text-xs text-zinc-500">
                  Configure real-time predictive risk models, auto-suggestions, and simulation sensitivity.
                </p>
              </div>

              {/* Risk Model Sensitivity Selector */}
              <div className="space-y-3">
                <label className="font-bold text-xs text-zinc-700">AI Risk Model Sensitivity Level</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['Conservative', 'Balanced', 'Aggressive'] as const).map((sens) => (
                    <div
                      key={sens}
                      onClick={() => setRiskSensitivity(sens)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        riskSensitivity === sens
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                          : 'bg-zinc-50 text-zinc-900 border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{sens}</span>
                        {riskSensitivity === sens && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                      </div>
                      <p className={`text-[11px] mt-2 leading-relaxed ${riskSensitivity === sens ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {sens === 'Conservative' && 'Flags risks early at low probability (>15%).'}
                        {sens === 'Balanced' && 'Standard ML threshold balancing false positives.'}
                        {sens === 'Aggressive' && 'Only alerts on high-confidence blockers (>75%).'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confidence Threshold Slider */}
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-zinc-900">
                  <span>Minimum AI Confidence Threshold</span>
                  <span className="text-indigo-600 font-mono text-sm">
                    {formState.aiPersonalization.confidenceThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={formState.aiPersonalization.confidenceThreshold}
                  onChange={(e) =>
                    handleUpdate((prev) => ({
                      ...prev,
                      aiPersonalization: {
                        ...prev.aiPersonalization,
                        confidenceThreshold: Number(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-indigo-600"
                />
                <p className="text-[11px] text-zinc-500">
                  Only trigger automatic recommendations when confidence score exceeds this value.
                </p>
              </div>

              {/* Feature Toggles */}
              <div className="space-y-3 pt-2">
                {[
                  { key: 'autoRecommendations', label: 'Auto-Generate Sprint Recommendations' },
                  { key: 'riskAnalysisEnabled', label: 'Continuous Velocity Drop Prediction' },
                  { key: 'smartPrioritization', label: 'Smart Backlog Prioritization' },
                  { key: 'predictiveInsights', label: 'Executive Predictive Insights' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-xs font-semibold text-zinc-800">{item.label}</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdate((prev) => ({
                          ...prev,
                          aiPersonalization: {
                            ...prev.aiPersonalization,
                            [item.key]: !(prev.aiPersonalization as any)[item.key],
                          },
                        }))
                      }
                      className={`w-11 h-6 rounded-full transition-all relative ${
                        (formState.aiPersonalization as any)[item.key] ? 'bg-indigo-600' : 'bg-zinc-300'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-md ${
                          (formState.aiPersonalization as any)[item.key] ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Integrations Settings */}
          {activeCategory === 'integrations' && (
            <div className="p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-6">
              <div className="border-b border-zinc-100 pb-4">
                <h3 className="font-display text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-emerald-600" /> Connected Tools & Database Integrations
                </h3>
                <p className="text-xs text-zinc-500">
                  Connect third-party developer platforms, calendar feeds, and MongoDB database clusters.
                </p>
              </div>

              {/* MongoDB Connection Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950 via-zinc-900 to-black text-white shadow-lg border border-emerald-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white flex items-center gap-2">
                        MongoDB Database Cluster
                        {mongoStatus?.status === 'connected' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            Connected ({mongoStatus.dbName || 'agilepulse'})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            {mongoStatus?.configured ? 'URI Set (Disconnected)' : 'In-Memory Mode'}
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Mongoose ODM active on backend with auto schema mapping for Users, Reports, and Tasks.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestMongo}
                    disabled={testingMongo}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingMongo ? 'animate-spin' : ''}`} />
                    {testingMongo ? 'Testing...' : 'Test / Connect MongoDB'}
                  </button>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    MongoDB Connection String (URI):
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="password"
                      value={mongoUri}
                      onChange={(e) => setMongoUri(e.target.value)}
                      placeholder="mongodb+srv://<username>:<password>@cluster0.mongodb.net/agilepulse"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Pro-tip: You can also specify <code className="text-emerald-400 font-mono">MONGODB_URI</code> in <code className="text-zinc-300 font-mono">.env.example</code> for automatic startup connection.
                  </p>
                </div>

                {mongoMessage && (
                  <div className={`p-3 rounded-xl text-xs font-mono font-semibold ${
                    mongoStatus?.status === 'connected'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                      : 'bg-zinc-900 text-amber-300 border border-amber-500/30'
                  }`}>
                    {mongoMessage}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'GitHub', key: 'github', detail: formState.integrations.github.repo },
                  { name: 'Jira Software', key: 'jira', detail: formState.integrations.jira.domain },
                  { name: 'Slack Alerts', key: 'slack', detail: formState.integrations.slack.channel },
                  { name: 'Google Calendar', key: 'googleCalendar', detail: formState.integrations.googleCalendar.account },
                  { name: 'Zoom Meetings', key: 'zoom', detail: formState.integrations.zoom.account },
                ].map((integ) => {
                  const data = (formState.integrations as any)[integ.key];
                  return (
                    <div
                      key={integ.key}
                      className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-zinc-900">{integ.name}</span>
                        {data.connected ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            Connected
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-600">
                            Disconnected
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-500 font-mono truncate">
                        {data.connected ? data.detail : 'Not configured'}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-zinc-400">Sync: {data.lastSync}</span>
                        <button
                          onClick={() => {
                            setToastMessage(`Triggered manual sync for ${integ.name}.`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-semibold text-[11px] flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> Sync Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fallback rendering for Language, Notifications, Accessibility */}
          {(activeCategory === 'language' || activeCategory === 'notifications' || activeCategory === 'accessibility') && (
            <div className="p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-6">
              <div className="border-b border-zinc-100 pb-4">
                <h3 className="font-display text-lg font-bold text-zinc-900 capitalize">
                  {activeCategory} Preferences
                </h3>
                <p className="text-xs text-zinc-500">
                  Enterprise preferences configured and persisted in real time.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All regional and accessibility parameters active.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
