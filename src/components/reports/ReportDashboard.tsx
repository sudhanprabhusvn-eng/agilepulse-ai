import React from 'react';
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  Zap,
  Download,
  Calendar,
  Sparkles,
  ArrowRight,
  PieChart as PieChartIcon,
  Users,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportToPDF, exportToExcel, exportToCSV } from '../../services/exportService';

interface ReportDashboardProps {
  onNavigateTab: (tab: 'analytics' | 'builder' | 'templates' | 'saved' | 'history') => void;
}

export function ReportDashboard({ onNavigateTab }: ReportDashboardProps) {
  const {
    activeSprint,
    activeProject,
    tasks,
    riskPredictions,
    savedReports,
    currentUser,
    runReportNow,
    setToastMessage,
  } = useApp();

  const blockedCount = tasks.filter((t) => t.blocked).length;
  const highRiskCount = riskPredictions.filter((r) => r.level === 'high' || r.level === 'critical').length;

  const handleQuickExport = (type: 'pdf' | 'excel' | 'csv') => {
    const exportData = {
      title: `${activeProject.name} - ${activeSprint.name} Executive Summary`,
      project: activeProject,
      sprint: activeSprint,
      tasks,
      risks: riskPredictions,
      generatedBy: currentUser.name,
    };

    if (type === 'pdf') exportToPDF(exportData);
    else if (type === 'excel') exportToExcel(exportData);
    else if (type === 'csv') exportToCSV(exportData);

    runReportNow(savedReports[0]?.id || 'rep-saved-001', type);
    setToastMessage(`Generated quick ${type.toUpperCase()} executive export.`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Quick Actions */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 p-6 md:p-8 border border-zinc-800 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/20 border border-brand-green/30 text-brand-green text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Executive Telemetry v2.4 Active</span>
            </div>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight">
              Executive Telemetry & Report Exporter
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
              Real-time sprint velocity tracking, ML risk predictions, team utilization matrices, and automated PDF/Excel export reporting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleQuickExport('pdf')}
              className="px-4 py-2.5 rounded-2xl bg-brand-green text-black font-semibold text-xs hover:bg-lime-400 transition-all flex items-center gap-2 shadow-lg shadow-brand-green/20 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export PDF Report
            </button>
            <button
              onClick={() => handleQuickExport('excel')}
              className="px-4 py-2.5 rounded-2xl bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold text-xs hover:bg-zinc-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-400" /> Export Excel
            </button>
            <button
              onClick={() => onNavigateTab('builder')}
              className="px-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-700 text-white font-semibold text-xs hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400" /> Custom Builder
            </button>
          </div>
        </div>
      </div>

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Sprint Health Score</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-zinc-900">{activeSprint.healthScore}</span>
            <span className="text-xs font-bold text-emerald-600">/ 100</span>
          </div>
          <p className="text-[11px] text-zinc-500 font-medium">
            Optimal velocity trajectory in {activeSprint.name}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Velocity</span>
            <div className="w-8 h-8 rounded-xl bg-brand-green/20 text-zinc-900 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-zinc-900">
              {activeSprint.completedPoints}
            </span>
            <span className="text-xs font-medium text-zinc-500">/ {activeSprint.totalPoints} pts</span>
          </div>
          <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-green h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((activeSprint.completedPoints / Math.max(1, activeSprint.totalPoints)) * 100))}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical Blockers</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-zinc-900">{blockedCount}</span>
            <span className="text-xs font-medium text-amber-600">Active flags</span>
          </div>
          <p className="text-[11px] text-zinc-500 font-medium">
            {blockedCount > 0 ? 'Requires Scrum Master attention' : 'No active sprint blockers'}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold uppercase tracking-wider">AI Delay Risk</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-zinc-900">{highRiskCount}</span>
            <span className="text-xs font-medium text-purple-600">High impact items</span>
          </div>
          <p className="text-[11px] text-zinc-500 font-medium">ML confidence rate: 94%</p>
        </div>
      </div>

      {/* Category Quick Launcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-zinc-900">Enterprise Report Collections</h2>
            <p className="text-xs text-zinc-500">Choose from pre-configured reporting suites or standard templates</p>
          </div>
          <button
            onClick={() => onNavigateTab('templates')}
            className="text-xs font-bold text-zinc-900 hover:text-brand-green flex items-center gap-1 cursor-pointer transition-colors"
          >
            View All Templates ({6}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigateTab('templates')}
            className="p-5 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 text-white p-6 border border-zinc-800 hover:border-brand-green/50 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-brand-green/20 text-brand-green flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold">Sprint & Agile Reports</h3>
            <p className="text-xs text-zinc-400">Burndown telemetry, scope volatility, velocity history, and sprint completion probabilities.</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-green">
              Browse Suite <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => onNavigateTab('templates')}
            className="p-5 rounded-3xl bg-white border border-zinc-200/80 hover:border-zinc-400 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PieChartIcon className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-zinc-900">Portfolio & Executive</h3>
            <p className="text-xs text-zinc-500">Multi-project roadmap progress, epic release timelines, and cross-team dependencies.</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
              Browse Suite <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => onNavigateTab('templates')}
            className="p-5 rounded-3xl bg-white border border-zinc-200/80 hover:border-zinc-400 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-zinc-900">Team Capacity Matrix</h3>
            <p className="text-xs text-zinc-500">Workload distribution, overload risk indicators, and developer story point allocation.</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
              Browse Suite <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Saved Reports Quick List */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-zinc-900">Active Saved & Scheduled Reports</h3>
            <p className="text-xs text-zinc-500">Configured custom reports ready for instant distribution</p>
          </div>
          <button
            onClick={() => onNavigateTab('saved')}
            className="text-xs font-bold text-zinc-900 hover:text-brand-green transition-colors"
          >
            Manage Saved Reports ({savedReports.length})
          </button>
        </div>

        <div className="divide-y divide-zinc-100">
          {savedReports.map((r) => (
            <div key={r.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-zinc-900">{r.title}</span>
                    {r.isScheduled && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                        Scheduled
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500">{r.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleQuickExport('pdf')}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-800 text-xs font-semibold hover:bg-zinc-200 transition-colors"
                >
                  Run PDF
                </button>
                <button
                  onClick={() => onNavigateTab('analytics')}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
                >
                  View Interactive
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
