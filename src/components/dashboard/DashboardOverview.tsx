import React from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  Users,
  Plus,
  ArrowUpRight,
  ChevronRight,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';
import { mockBurndownData } from '../../data/mockData';

export function DashboardOverview() {
  const {
    currentUser,
    activeProject,
    activeSprint,
    tasks,
    riskPredictions,
    aiRecommendations,
    applyRecommendation,
    setActiveTab,
    setIsAiDrawerOpen,
  } = useApp();

  const totalPoints = tasks.reduce((sum, t) => sum + t.storyPoints, 0);
  const completedPoints = tasks.filter((t) => t.status === 'done').reduce((sum, t) => sum + t.storyPoints, 0);
  const inProgressPoints = tasks.filter((t) => t.status === 'in_progress').reduce((sum, t) => sum + t.storyPoints, 0);
  const blockedCount = tasks.filter((t) => t.blocked).length;

  const activeRisks = riskPredictions.filter((r) => r.status === 'active');
  const criticalRisks = activeRisks.filter((r) => r.level === 'critical');

  return (
    <div className="w-full space-y-8">
      {/* Top Welcome Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-green text-black uppercase tracking-wider">
              Active Role: {currentUser.role}
            </span>
            <span className="text-xs font-mono text-zinc-400">Project Key: {activeProject.key}</span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
            {activeSprint.name}
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5 max-w-2xl">
            Goal: {activeSprint.goal}
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => setActiveTab('board')}
            className="px-5 py-2.5 rounded-full bg-brand-green text-black text-sm font-semibold hover:bg-lime-400 transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            Sprint Board <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="px-5 py-2.5 rounded-full bg-zinc-800 border border-zinc-700 text-white text-sm font-medium hover:bg-zinc-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-brand-green" /> Ask AI
          </button>
        </div>

        {/* Decorative subtle background gradient */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-green/10 rounded-full filter blur-3xl pointer-events-none" />
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Sprint Health Score */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sprint Health Index</span>
            <div className="w-8 h-8 rounded-xl bg-brand-green/20 text-zinc-900 flex items-center justify-center font-bold text-xs">
              <Activity className="w-4 h-4 text-zinc-900" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-zinc-900">
              {activeSprint.healthScore}
            </span>
            <span className="text-xs font-bold text-zinc-500">/ 100</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-zinc-100">
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Status: Optimal
            </span>
            <span className="text-zinc-400">Target &gt; 80</span>
          </div>
        </div>

        {/* Metric 2: Story Points Progress */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Velocity Completion</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-zinc-900">
              {completedPoints}
            </span>
            <span className="text-xs text-zinc-500 font-semibold">/ {totalPoints} pts</span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 pt-3 border-t border-zinc-100">
            <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
              <div
                className="h-full bg-zinc-900 rounded-full transition-all duration-500"
                style={{ width: `${Math.round((completedPoints / Math.max(1, totalPoints)) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 3: Active Blockers */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Active Blockers</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${blockedCount > 0 ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`font-display text-4xl font-extrabold ${blockedCount > 0 ? 'text-red-600' : 'text-zinc-900'}`}>
              {blockedCount}
            </span>
            <span className="text-xs text-zinc-500 font-semibold">tasks blocked</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-zinc-100">
            <span className="text-zinc-500">Impact: AP-102 critical path</span>
            <button onClick={() => setActiveTab('board')} className="text-zinc-900 font-semibold hover:underline">
              Resolve →
            </button>
          </div>
        </div>

        {/* Metric 4: AI Risk Index */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">AI Risk Predictions</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-zinc-900">
              {activeRisks.length}
            </span>
            <span className="text-xs text-zinc-500 font-semibold">({criticalRisks.length} Critical)</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-zinc-100">
            <span className="text-zinc-500">Confidence: 94%</span>
            <button onClick={() => setActiveTab('simulator')} className="text-zinc-900 font-semibold hover:underline">
              Simulate →
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Burndown Chart + Risk Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Burndown & Forecast Trajectory Chart */}
        <div className="lg:col-span-8 p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold text-zinc-900">Sprint 24 Burndown & Forecast Trajectory</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-green text-black font-bold uppercase">
                  AI PREDICTIVE
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Comparing Ideal Linear Burndown vs Actual Story Points Remaining vs ML Model Forecast Curve.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('simulator')}
              className="px-3.5 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-brand-green" /> What-If Simulator
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockBurndownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9fff00" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#9fff00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="idealRemaining" name="Ideal Burndown" stroke="#a1a1aa" strokeDasharray="5 5" fill="none" strokeWidth={1.5} />
                <Area type="monotone" dataKey="actualRemaining" name="Actual Remaining" stroke="#18181b" fill="url(#actualGradient)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="predictedRemaining" name="AI Forecast Trajectory" stroke="#84cc16" fill="url(#predictedGradient)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-700 leading-relaxed">
              <strong className="text-zinc-900 font-semibold">AI Forecast Insight:</strong> Based on current daily velocity (3.2 pts/day) and unblocking of task AP-102, Sprint 24 is projected to complete on Day 14 at <strong>96% probability</strong>.
            </p>
          </div>
        </div>

        {/* Right Column: AI Risk Predictions Feed */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-zinc-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> High-Priority AI Risks
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                {activeRisks.length} Active
              </span>
            </div>

            <div className="space-y-4">
              {activeRisks.map((risk) => (
                <div
                  key={risk.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    risk.level === 'critical'
                      ? 'bg-red-50/70 border-red-200 text-red-950'
                      : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-white shadow-xs">
                      {risk.category}
                    </span>
                    <span className="text-xs font-extrabold font-mono text-red-600">
                      Score: {risk.riskScore}/100
                    </span>
                  </div>

                  <h4 className="font-bold text-sm mt-2">{risk.title}</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{risk.description}</p>

                  <div className="mt-3 pt-3 border-t border-black/5 text-[11px] font-semibold text-zinc-800">
                    💡 {risk.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actionable AI Recommendations Section */}
      <div className="p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-green" /> AI Optimization Recommendations
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              One-click optimizations generated by the predictive engine to boost sprint health score.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiRecommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                rec.applied
                  ? 'bg-emerald-50/60 border-emerald-200 opacity-80'
                  : 'bg-white border-zinc-200/90 shadow-xs hover:border-zinc-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 uppercase">
                    {rec.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 font-mono">
                    {rec.impactScore}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-zinc-900">{rec.title}</h3>
                <p className="text-xs text-zinc-600 mt-2 leading-relaxed">{rec.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100">
                {rec.applied ? (
                  <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 justify-center py-2 bg-emerald-100/80 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" /> Action Applied
                  </div>
                ) : (
                  <button
                    onClick={() => applyRecommendation(rec.id)}
                    className="w-full py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    Apply Optimization <ArrowUpRight className="w-3.5 h-3.5 text-brand-green" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
