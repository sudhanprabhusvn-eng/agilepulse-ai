import React, { useState } from 'react';
import {
  BarChart3,
  PieChart,
  Zap,
  FileText,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ReportDashboard } from './ReportDashboard';
import { ReportAnalytics } from './ReportAnalytics';
import { ReportBuilder } from './ReportBuilder';
import { ReportTemplates } from './ReportTemplates';
import { SavedReports } from './SavedReports';
import { ReportHistory } from './ReportHistory';

export function ReportsView() {
  const [activeSubTab, setActiveSubTab] = useState<
    'dashboard' | 'analytics' | 'builder' | 'templates' | 'saved' | 'history'
  >('dashboard');

  return (
    <div className="space-y-6 pb-12">
      {/* Module Header & Sub Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-zinc-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-zinc-900 tracking-tight">
              Reports & Executive Telemetry
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-green/20 text-zinc-900 text-xs font-bold">
              AI Active
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Sprint velocity tracking, predictive risk forecasts, SOC2 compliance, and automated report distribution.
          </p>
        </div>

        {/* Sub Tab Navigation Pills */}
        <div className="flex items-center gap-1.5 bg-zinc-100 p-1.5 rounded-2xl overflow-x-auto max-w-full shrink-0">
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubTab === 'dashboard'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubTab === 'analytics'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" /> Analytics
          </button>
          <button
            onClick={() => setActiveSubTab('builder')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubTab === 'builder'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Builder
          </button>
          <button
            onClick={() => setActiveSubTab('templates')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubTab === 'templates'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Templates
          </button>
          <button
            onClick={() => setActiveSubTab('saved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubTab === 'saved'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Saved & Schedules
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubTab === 'history'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Audit History
          </button>
        </div>
      </div>

      {/* Render Sub View */}
      {activeSubTab === 'dashboard' && <ReportDashboard onNavigateTab={(tab) => setActiveSubTab(tab)} />}
      {activeSubTab === 'analytics' && <ReportAnalytics />}
      {activeSubTab === 'builder' && <ReportBuilder />}
      {activeSubTab === 'templates' && <ReportTemplates />}
      {activeSubTab === 'saved' && <SavedReports />}
      {activeSubTab === 'history' && <ReportHistory />}
    </div>
  );
}
