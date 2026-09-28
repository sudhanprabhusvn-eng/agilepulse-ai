import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Download,
  Filter,
  RefreshCw,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportToPDF, exportToExcel, exportToCSV } from '../../services/exportService';
import { mockVelocityTrends } from '../../data/mockData';

export function ReportAnalytics() {
  const {
    activeSprint,
    activeProject,
    tasks,
    riskPredictions,
    teamMembers,
    currentUser,
    setToastMessage,
  } = useApp();

  const [dateRange, setDateRange] = useState('current_sprint');
  const [selectedChart, setSelectedChart] = useState<'burndown' | 'velocity' | 'capacity' | 'risks'>('burndown');

  // Burndown mock telemetry data
  const burndownData = [
    { day: 'Day 1', ideal: 42, actual: 42, predicted: 42 },
    { day: 'Day 2', ideal: 38, actual: 40, predicted: 39 },
    { day: 'Day 3', ideal: 34, actual: 35, predicted: 35 },
    { day: 'Day 4', ideal: 30, actual: 32, predicted: 31 },
    { day: 'Day 5', ideal: 26, actual: 26, predicted: 27 },
    { day: 'Day 6', ideal: 22, actual: 20, predicted: 22 },
    { day: 'Day 7', ideal: 18, actual: 16, predicted: 17 },
    { day: 'Day 8 (Today)', ideal: 14, actual: 14, predicted: 13 },
    { day: 'Day 9', ideal: 10, actual: null, predicted: 9 },
    { day: 'Day 10', ideal: 5, actual: null, predicted: 4 },
    { day: 'Day 12', ideal: 0, actual: null, predicted: 0 },
  ];

  // Velocity Trend data dynamically mapped from historical trends & active sprint
  const velocityData = mockVelocityTrends.map((point) => {
    if (point.sprintName.includes('Active') || point.sprintName.includes(activeSprint.name)) {
      return {
        sprint: `${activeSprint.name} (Active)`,
        committed: activeSprint.totalPoints,
        completed: activeSprint.completedPoints,
        health: activeSprint.healthScore,
      };
    }
    return {
      sprint: point.sprintName,
      committed: point.committedPoints,
      completed: point.completedPoints,
      health: point.healthScore,
    };
  });

  // Risk breakdown data
  const riskCategories = [
    { name: 'Scope Creep', count: 3, color: '#f59e0b' },
    { name: 'Resource Bottleneck', count: 2, color: '#ef4444' },
    { name: 'Dependency Blocker', count: 4, color: '#8b5cf6' },
    { name: 'Velocity Drop', count: 1, color: '#3b82f6' },
  ];

  const handleExport = (type: 'pdf' | 'excel' | 'csv') => {
    const data = {
      title: `Executive Analytics Telemetry - ${activeSprint.name}`,
      project: activeProject,
      sprint: activeSprint,
      tasks,
      risks: riskPredictions,
      generatedBy: currentUser.name,
    };
    if (type === 'pdf') exportToPDF(data);
    else if (type === 'excel') exportToExcel(data);
    else exportToCSV(data);

    setToastMessage(`Exported ${selectedChart.toUpperCase()} analytics report as ${type.toUpperCase()}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filter Bar & Export Actions */}
      <div className="p-4 rounded-3xl bg-white border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-zinc-100 font-semibold text-zinc-800">
            <Filter className="w-3.5 h-3.5" />
            <span>Time Horizon:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent font-bold text-zinc-900 focus:outline-none cursor-pointer"
            >
              <option value="current_sprint">Current Active Sprint</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_quarter">Last Quarter (Q2)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-2xl">
            <button
              onClick={() => setSelectedChart('burndown')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedChart === 'burndown' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Burndown
            </button>
            <button
              onClick={() => setSelectedChart('velocity')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedChart === 'velocity' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Velocity
            </button>
            <button
              onClick={() => setSelectedChart('capacity')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedChart === 'capacity' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Team Utilization
            </button>
            <button
              onClick={() => setSelectedChart('risks')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedChart === 'risks' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              AI Risks
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="px-3.5 py-2 rounded-2xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-brand-green" /> Export PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-3 py-2 rounded-2xl bg-zinc-100 text-zinc-800 text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Excel
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-3 py-2 rounded-2xl bg-zinc-100 text-zinc-800 text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            CSV
          </button>
        </div>
      </div>

      {/* Main Interactive Chart Display */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-bold text-zinc-900">
                {selectedChart === 'burndown' && 'Active Sprint Telemetry & Ideal Burndown'}
                {selectedChart === 'velocity' && 'Historical Velocity & Target Track'}
                {selectedChart === 'capacity' && 'Developer Capacity Utilization Matrix'}
                {selectedChart === 'risks' && 'AI Predictive Risk Exposure Distribution'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                Real-Time Recharts
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              {selectedChart === 'burndown' && 'Tracking story points remaining against target ideal trajectory.'}
              {selectedChart === 'velocity' && 'Comparing committed vs actual completed points across past sprints.'}
              {selectedChart === 'capacity' && 'Assessing engineer story point loads to balance workload.'}
              {selectedChart === 'risks' && 'Categorized AI model probability breakdown.'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-zinc-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-zinc-900" /> Actual
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-brand-green" /> Ideal / Target
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500" /> AI Forecast
            </span>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {selectedChart === 'burndown' ? (
              <AreaChart data={burndownData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorIdeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a3e635" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a3e635" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis dataKey="day" stroke="#a1a1aa" fontSize={11} />
                <YAxis stroke="#a1a1aa" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="actual" stroke="#18181b" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="ideal" stroke="#84cc16" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorIdeal)" />
                <Area type="monotone" dataKey="predicted" stroke="#a855f7" strokeWidth={2} strokeDasharray="3 3" fill="none" />
              </AreaChart>
            ) : selectedChart === 'velocity' ? (
              <BarChart data={velocityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis dataKey="sprint" stroke="#a1a1aa" fontSize={11} />
                <YAxis stroke="#a1a1aa" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                  formatter={(value: number, name: string) => [`${value} pts`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="committed" name="Committed Points" fill="#d4d4d8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="completed" name="Completed Points" fill="#18181b" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : selectedChart === 'capacity' ? (
              <BarChart data={teamMembers} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} />
                <YAxis stroke="#a1a1aa" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="assignedPoints" fill="#18181b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="allocatedCapacityPoints" fill="#a3e635" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={riskCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {riskCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold">
            <TrendingUp className="w-4 h-4 text-brand-green" />
            <span>Scope Volatility Index</span>
          </div>
          <div className="text-2xl font-display font-bold text-zinc-900">3.4% Low</div>
          <p className="text-[11px] text-zinc-500">Only 2 story points added after sprint commitment.</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Avg Workload Balance</span>
          </div>
          <div className="text-2xl font-display font-bold text-zinc-900">91% Optimal</div>
          <p className="text-[11px] text-zinc-500">1 developer overloaded (David Kim 120%).</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI Predictive Target</span>
          </div>
          <div className="text-2xl font-display font-bold text-zinc-900">96.2% On-Time</div>
          <p className="text-[11px] text-zinc-500">ML model projects sprint completion on Aug 8.</p>
        </div>
      </div>
    </div>
  );
}
