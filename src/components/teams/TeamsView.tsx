import React from 'react';
import { Users, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function TeamsView() {
  const { teamMembers, applyRecommendation } = useApp();

  return (
    <div className="w-full space-y-8">
      {/* Title Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-green text-black uppercase">
              Resource Management
            </span>
            <span className="text-xs font-mono text-zinc-400">Capacity Balancing</span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
            Team Capacity & Workload Allocation
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5 max-w-2xl">
            Monitors individual team member utilization rates to prevent developer burnout and resolve capacity bottlenecks.
          </p>
        </div>
      </div>

      {/* Team Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
              member.status === 'Overloaded'
                ? 'bg-red-50/70 border-red-200'
                : member.status === 'Underutilized'
                ? 'bg-blue-50/70 border-blue-200'
                : 'bg-white/80 border-white shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-base text-zinc-900">{member.name}</h3>
                    <p className="text-xs text-zinc-500 font-medium">{member.role}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase ${
                    member.status === 'Overloaded'
                      ? 'bg-red-200 text-red-900'
                      : member.status === 'Underutilized'
                      ? 'bg-blue-200 text-blue-900'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}
                >
                  {member.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-xs font-semibold text-zinc-700">
                  <span>Capacity Utilization</span>
                  <span className="font-mono">{member.utilizationPercentage}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-zinc-200/80 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      member.utilizationPercentage > 100
                        ? 'bg-red-500'
                        : member.utilizationPercentage < 50
                        ? 'bg-blue-500'
                        : 'bg-zinc-900'
                    }`}
                    style={{ width: `${Math.min(100, member.utilizationPercentage)}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-zinc-400 block text-[10px]">Assigned Story Pts</span>
                  <strong className="text-zinc-900 font-bold font-mono">{member.assignedPoints} pts</strong>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px]">Target Capacity</span>
                  <strong className="text-zinc-900 font-bold font-mono">{member.allocatedCapacityPoints} pts</strong>
                </div>
              </div>
            </div>

            {member.status === 'Overloaded' && (
              <div className="mt-6 pt-4 border-t border-red-200">
                <button
                  onClick={() => applyRecommendation('rec-1')}
                  className="w-full py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  Balance Workload (Reassign 5 pts) <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
