import React from 'react';
import { BarChart3, LineChart, Cpu, HardDrive, Zap, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const mockTelemetrySeries = [
  { time: '09:00', cpu: 18, memory: 35, latency: 28 },
  { time: '09:10', cpu: 22, memory: 38, latency: 32 },
  { time: '09:20', cpu: 28, memory: 40, latency: 45 },
  { time: '09:30', cpu: 25, memory: 41, latency: 35 },
  { time: '09:40', cpu: 24, memory: 42, latency: 38 },
];

export const MetricsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Prometheus & OpenTelemetry System Metrics
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Real-time performance telemetry for API endpoints, AI models, and memory load.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-600" />
            CPU Load (%)
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTelemetrySeries}>
                <XAxis dataKey="time" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="cpu" stroke="#10b981" fill="#10b98122" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-600" />
            API Latency (ms)
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTelemetrySeries}>
                <XAxis dataKey="time" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="latency" stroke="#6366f1" fill="#6366f122" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
