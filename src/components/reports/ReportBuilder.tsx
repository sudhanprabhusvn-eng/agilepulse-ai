import React, { useState } from 'react';
import {
  Zap,
  Save,
  Download,
  Calendar,
  CheckCircle2,
  Plus,
  Trash2,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TrendingUp,
  Table as TableIcon,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  ReportType,
  ChartType,
  ReportKPICard,
  SavedReport,
  ReportFilterConfig,
  ReportVisualizationConfig,
} from '../../types';
import { exportToPDF, exportToExcel, exportToCSV } from '../../services/exportService';

export function ReportBuilder() {
  const {
    activeProject,
    activeSprint,
    tasks,
    riskPredictions,
    saveReport,
    currentUser,
    setToastMessage,
  } = useApp();

  const [reportTitle, setReportTitle] = useState('Custom Sprint & Risk Telemetry Briefing');
  const [reportDescription, setReportDescription] = useState('Self-service custom report tracking velocity, risk score, and team capacity.');
  const [reportType, setReportType] = useState<ReportType>('sprint');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>([
    'Sprint Health',
    'Completed Velocity',
    'Active Blockers',
    'AI Risk Exposure',
  ]);
  const [dateRange, setDateRange] = useState<ReportFilterConfig['dateRange']>('current_sprint');
  const [includeAI, setIncludeAI] = useState(true);

  const availableKPIs = [
    'Sprint Health',
    'Completed Velocity',
    'Active Blockers',
    'AI Risk Exposure',
    'Team Utilization %',
    'Scope Volatility Index',
    'On-Time Delivery Probability',
    'SOC2 Audit Violations',
  ];

  const handleToggleKPI = (kpi: string) => {
    if (selectedKPIs.includes(kpi)) {
      if (selectedKPIs.length > 1) {
        setSelectedKPIs(selectedKPIs.filter((k) => k !== kpi));
      }
    } else {
      setSelectedKPIs([...selectedKPIs, kpi]);
    }
  };

  const handleSaveReport = () => {
    const kpiCards: ReportKPICard[] = selectedKPIs.map((k, i) => ({
      id: `kpi-custom-${i}`,
      label: k,
      value: k === 'Sprint Health' ? `${activeSprint.healthScore} / 100` : k === 'Completed Velocity' ? `${activeSprint.completedPoints} pts` : k === 'Active Blockers' ? `${tasks.filter((t) => t.blocked).length}` : '92%',
      status: 'optimal',
    }));

    const newReport: Omit<SavedReport, 'id' | 'createdAt' | 'updatedAt'> = {
      title: reportTitle,
      description: reportDescription,
      type: reportType,
      createdBy: currentUser.name,
      creatorAvatar: currentUser.avatar,
      filterConfig: {
        dateRange,
        projectId: activeProject.id,
        includeAiPredictions: includeAI,
      },
      visualizationConfig: {
        chartType,
        primaryMetric: 'storyPoints',
        groupBy: 'status',
        showLegend: true,
        showValues: true,
      },
      kpis: kpiCards,
      isScheduled: false,
      sharedWith: ['Workspace Members'],
      isFavorite: true,
      isPublic: true,
    };

    saveReport(newReport);
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    const data = {
      title: reportTitle,
      project: activeProject,
      sprint: activeSprint,
      tasks,
      risks: riskPredictions,
      generatedBy: currentUser.name,
    };
    if (format === 'pdf') exportToPDF(data);
    else if (format === 'excel') exportToExcel(data);
    else exportToCSV(data);

    setToastMessage(`Exported custom built report as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Main Form Controls */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-green/20 text-zinc-900 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h1 className="font-display text-xl font-bold text-zinc-900">Self-Service Report Builder</h1>
            </div>
            <p className="text-xs text-zinc-500">Configure custom enterprise reports with live preview and multi-format export.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveReport}
              className="px-4 py-2.5 rounded-2xl bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4 text-brand-green" /> Save Report
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2.5 rounded-2xl bg-brand-green text-black font-semibold text-xs hover:bg-lime-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>

        {/* Builder Step 1: Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-700 block">Report Title</label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3.5 py-2.5 font-semibold text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-700 block">Report Description</label>
            <input
              type="text"
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3.5 py-2.5 text-zinc-800 focus:outline-none focus:border-zinc-900"
            />
          </div>
        </div>

        {/* Builder Step 2: Category & Chart Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-700 block">Report Type Category</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2.5 font-medium text-zinc-900"
            >
              <option value="sprint">Sprint & Velocity Report</option>
              <option value="ai_insights">AI Risk & Predictive Telemetry</option>
              <option value="executive">Executive Portfolio ROI</option>
              <option value="team">Team Capacity & Allocation</option>
              <option value="compliance">Compliance & SOC2 Audit</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-700 block">Visualization Style</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2.5 font-medium text-zinc-900"
            >
              <option value="bar">Bar Chart</option>
              <option value="area">Area Burndown Chart</option>
              <option value="line">Line Trend Chart</option>
              <option value="pie">Pie Donut Breakdown</option>
              <option value="table">Tabular Data Grid</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-700 block">Time Horizon</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as ReportFilterConfig['dateRange'])}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2.5 font-medium text-zinc-900"
            >
              <option value="current_sprint">Current Sprint ({activeSprint.name})</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_quarter">Last Quarter (Q2)</option>
              <option value="year_to_date">Year to Date (YTD)</option>
            </select>
          </div>
        </div>

        {/* Builder Step 3: Select Included KPIs */}
        <div className="space-y-3 pt-2">
          <label className="font-semibold text-xs text-zinc-700 block">Select Included Key Metrics (KPIs)</label>
          <div className="flex flex-wrap gap-2">
            {availableKPIs.map((kpi) => {
              const active = selectedKPIs.includes(kpi);
              return (
                <button
                  key={kpi}
                  type="button"
                  onClick={() => handleToggleKPI(kpi)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                  }`}
                >
                  {active && <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />}
                  <span>{kpi}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Interactive Preview Card */}
      <div className="p-6 rounded-3xl bg-zinc-950 text-white border border-zinc-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-green" />
            <h3 className="font-display text-base font-bold text-white">Live Report Output Preview</h3>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">AgilePulse AI Render Engine</span>
        </div>

        <div className="space-y-4 bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green">
              {reportType.toUpperCase()} REPORT
            </span>
            <h2 className="font-display text-xl font-bold text-white">{reportTitle}</h2>
            <p className="text-xs text-zinc-400">{reportDescription}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {selectedKPIs.map((kpi, i) => (
              <div key={i} className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60 space-y-1">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase block">{kpi}</span>
                <span className="text-base font-bold text-white">
                  {kpi === 'Sprint Health' ? `${activeSprint.healthScore} / 100` : kpi === 'Completed Velocity' ? `${activeSprint.completedPoints} pts` : kpi === 'Active Blockers' ? `${tasks.filter((t) => t.blocked).length}` : '92%'}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center text-xs text-zinc-400">
            📊 [{chartType.toUpperCase()} CHART PREVIEW]: Rendering {tasks.length} task telemetry points across {selectedKPIs.length} KPIs for {activeProject.name}.
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2">
          <span className="text-zinc-400">Ready to export or distribute to team schedules.</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('excel')}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 text-zinc-200 font-semibold hover:bg-zinc-700 cursor-pointer"
            >
              Export Excel
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 text-zinc-200 font-semibold hover:bg-zinc-700 cursor-pointer"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
