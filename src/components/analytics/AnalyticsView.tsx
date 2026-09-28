import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockVelocityTrends } from '../../data/mockData';

export function AnalyticsView() {
  const { teamMembers, tasks, activeSprint } = useApp();

  const velocityTrends = mockVelocityTrends.map((point) => {
    if (point.sprintName.includes('Active') || point.sprintName.includes(activeSprint.name)) {
      return {
        ...point,
        sprintName: `${activeSprint.name} (Active)`,
        committedPoints: activeSprint.totalPoints,
        completedPoints: activeSprint.completedPoints,
        healthScore: activeSprint.healthScore,
      };
    }
    return point;
  });

  const pieData = [
    { name: 'To Do', value: tasks.filter((t) => t.status === 'todo').length, color: '#e4e4e7' },
    { name: 'In Progress', value: tasks.filter((t) => t.status === 'in_progress').length, color: '#3b82f6' },
    { name: 'Code Review', value: tasks.filter((t) => t.status === 'code_review').length, color: '#a855f7' },
    { name: 'Testing', value: tasks.filter((t) => t.status === 'testing').length, color: '#f59e0b' },
    { name: 'Done', value: tasks.filter((t) => t.status === 'done').length, color: '#10b981' },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Title Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-green text-black uppercase">
              Predictive Analytics
            </span>
            <span className="text-xs font-mono text-zinc-400">Telemetry Engine</span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
            Sprint Velocity & Telemetry Analytics
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5 max-w-2xl">
            Historical sprint velocity performance, story point commitments, and distribution metrics across engineering epics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Historical Velocity Bar Chart */}
        <div className="lg:col-span-8 p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-bold text-zinc-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-zinc-900" /> Historical Velocity vs Commitment
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Committed Story Points vs Completed Points across recent sprints.</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-zinc-500 block">Current Completion</span>
              <span className="text-sm font-bold text-emerald-600">
                {activeSprint.completedPoints} / {activeSprint.totalPoints} pts
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={velocityTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                <XAxis dataKey="sprintName" tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                  formatter={(value: number, name: string) => [`${value} pts`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="committedPoints" name="Committed Points" fill="#d4d4d8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="completedPoints" name="Completed Points" fill="#18181b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Distribution Donut Chart */}
        <div className="lg:col-span-4 p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-zinc-900 mb-2">Task Status Breakdown</h3>
            <p className="text-xs text-zinc-500 mb-4">Active task count distribution across stages.</p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-zinc-100 text-xs">
            {pieData.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-zinc-600 font-medium">{p.name}: <strong className="text-zinc-900">{p.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
