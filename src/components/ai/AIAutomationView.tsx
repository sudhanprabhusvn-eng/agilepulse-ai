import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Brain,
  Sliders,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const AIAutomationView: React.FC = () => {
  const [autoPrioritize, setAutoPrioritize] = useState(true);
  const [capacityOptimization, setCapacityOptimization] = useState(true);
  const [smartNotifications, setSmartNotifications] = useState(true);
  const [appliedCount, setAppliedCount] = useState(4);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Brain className="w-4 h-4" />
            Autonomous Decision Intelligence
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">AI Automation Hub</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Automated story point suggestions, WSJF task prioritization, capacity planning, and deadline predictions.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-200">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-indigo-900">{appliedCount} Active AI Automations Applied</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900 text-base">Auto Task Prioritization</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Continuously ranks backlog items using Weighted Shortest Job First (WSJF) and PR dependency chains.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            <span className="text-xs font-semibold text-zinc-600">Status</span>
            <button
              onClick={() => setAutoPrioritize(!autoPrioritize)}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                autoPrioritize ? 'bg-emerald-600 text-white' : 'bg-zinc-200 text-zinc-700'
              }`}
            >
              {autoPrioritize ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900 text-base">Sprint Capacity Optimization</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Dynamically suggests point reallocation when developer PTO or bottleneck PRs are detected.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            <span className="text-xs font-semibold text-zinc-600">Status</span>
            <button
              onClick={() => setCapacityOptimization(!capacityOptimization)}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                capacityOptimization ? 'bg-emerald-600 text-white' : 'bg-zinc-200 text-zinc-700'
              }`}
            >
              {capacityOptimization ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900 text-base">Smart Risk Notifications</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Suppresses noisy alerts while instantly surfacing critical burndown deviations and blockers.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            <span className="text-xs font-semibold text-zinc-600">Status</span>
            <button
              onClick={() => setSmartNotifications(!smartNotifications)}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                smartNotifications ? 'bg-emerald-600 text-white' : 'bg-zinc-200 text-zinc-700'
              }`}
            >
              {smartNotifications ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
