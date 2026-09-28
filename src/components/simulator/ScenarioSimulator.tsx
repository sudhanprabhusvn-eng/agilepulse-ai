import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, Activity, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw, Sparkles, BarChart2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { runWhatIfSimulation } from '../../services/aiPredictionService';

export function ScenarioSimulator() {
  const { activeSprint, tasks } = useApp();

  const totalPoints = tasks.reduce((sum, t) => sum + t.storyPoints, 0);
  const completedPoints = tasks.filter((t) => t.status === 'done').reduce((sum, t) => sum + t.storyPoints, 0);

  const [additionalPoints, setAdditionalPoints] = useState<number>(5);
  const [capacityAdjustment, setCapacityAdjustment] = useState<number>(0);
  const [blockedCount, setBlockedCount] = useState<number>(1);
  const [remainingDays, setRemainingDays] = useState<number>(4);

  const simulation = runWhatIfSimulation(
    {
      additionalPoints,
      capacityAdjustmentPercent: capacityAdjustment,
      blockedTaskCount: blockedCount,
      remainingDays,
    },
    totalPoints,
    completedPoints
  );

  return (
    <div className="w-full space-y-8">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-green text-black uppercase">
              Predictive Intelligence
            </span>
            <span className="text-xs font-mono text-zinc-400">RandomForest Model v2.4</span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
            What-If Scenario Simulator
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5 max-w-2xl">
            Simulate how scope additions, team capacity shifts, and blocker resolutions impact your sprint health and completion deadlines.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center gap-3 shrink-0">
          <Cpu className="w-8 h-8 text-brand-green" />
          <div>
            <div className="text-xs text-zinc-400 font-mono">Inference Latency</div>
            <div className="text-sm font-bold text-white font-mono">180ms (Realtime)</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Sliders & Controls */}
        <div className="lg:col-span-5 p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <h2 className="font-display text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Simulation Parameters
            </h2>
            <button
              onClick={() => {
                setAdditionalPoints(0);
                setCapacityAdjustment(0);
                setBlockedCount(1);
                setRemainingDays(4);
              }}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Default
            </button>
          </div>

          {/* Slider 1: Added Scope */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-zinc-700">
              <label>Scope Addition (Story Points)</label>
              <span className="font-mono text-zinc-900 font-bold px-2 py-0.5 bg-zinc-100 rounded">
                +{additionalPoints} pts
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              step={1}
              value={additionalPoints}
              onChange={(e) => setAdditionalPoints(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>0 (No Scope Creep)</span>
              <span>25 pts (Heavy Addition)</span>
            </div>
          </div>

          {/* Slider 2: Team Capacity Adjustment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-zinc-700">
              <label>Team Capacity Adjustment</label>
              <span className="font-mono text-zinc-900 font-bold px-2 py-0.5 bg-zinc-100 rounded">
                {capacityAdjustment >= 0 ? `+${capacityAdjustment}%` : `${capacityAdjustment}%`}
              </span>
            </div>
            <input
              type="range"
              min={-40}
              max={40}
              step={5}
              value={capacityAdjustment}
              onChange={(e) => setCapacityAdjustment(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>-40% (Sick leave / Burnout)</span>
              <span>+40% (Overtime / Surge)</span>
            </div>
          </div>

          {/* Slider 3: Active Blockers Count */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-zinc-700">
              <label>Active Blocker Count</label>
              <span className="font-mono text-zinc-900 font-bold px-2 py-0.5 bg-zinc-100 rounded">
                {blockedCount} blocked
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={6}
              step={1}
              value={blockedCount}
              onChange={(e) => setBlockedCount(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>0 Blockers</span>
              <span>6 Blockers</span>
            </div>
          </div>

          {/* Slider 4: Remaining Days */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-zinc-700">
              <label>Remaining Days in Sprint</label>
              <span className="font-mono text-zinc-900 font-bold px-2 py-0.5 bg-zinc-100 rounded">
                {remainingDays} days
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={remainingDays}
              onChange={(e) => setRemainingDays(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>
        </div>

        {/* Right Column: Real-time ML Prediction Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Score Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Health Score */}
            <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                Simulated Health Index
              </span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-zinc-900">
                  {simulation.simulatedHealthScore}
                </span>
                <span className="text-xs text-zinc-500 font-semibold">/ 100</span>
              </div>
              <span
                className={`mt-2 inline-block text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  simulation.simulatedHealthScore >= 80
                    ? 'bg-emerald-100 text-emerald-800'
                    : simulation.simulatedHealthScore >= 60
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {simulation.simulatedRiskLevel} Risk
              </span>
            </div>

            {/* Completion Probability */}
            <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                Completion Confidence
              </span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-extrabold text-zinc-900">
                  {simulation.simulatedCompletionProbability}%
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-2">Probability of meeting target velocity</p>
            </div>

            {/* Delay Forecast */}
            <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                Projected Schedule Slip
              </span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className={`font-display text-4xl font-extrabold ${simulation.predictedDelayDays > 0 ? 'text-red-600' : 'text-zinc-900'}`}>
                  +{simulation.predictedDelayDays}
                </span>
                <span className="text-xs text-zinc-500 font-semibold">days</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-2">
                {simulation.predictedDelayDays === 0 ? 'On schedule' : 'Deadline slip risk'}
              </p>
            </div>
          </div>

          {/* SHAP Feature Importance Factor Weightings */}
          <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm">
            <h3 className="font-display text-base font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-zinc-800" /> SHAP Feature Impact Breakdown
            </h3>
            <p className="text-xs text-zinc-500 mb-6">
              Explains how individual input features mathematically contribute to the simulated risk score.
            </p>

            <div className="space-y-4">
              {simulation.shapFeatures.map((feat) => (
                <div key={feat.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-zinc-800">
                    <span>{feat.name}</span>
                    <span className={`font-mono font-bold ${feat.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {feat.positive ? `+${feat.impact}% (Positive)` : `-${feat.impact}% (Risk Penalty)`}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${feat.positive ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, Math.max(10, feat.impact * 2.5))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendation Result Box */}
          <div className="p-6 rounded-3xl bg-zinc-900 text-white shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-brand-green text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> AI Prescriptive Guidance
            </div>
            <p className="text-sm text-zinc-200 leading-relaxed">
              {simulation.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
