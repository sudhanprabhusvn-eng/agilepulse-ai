import React, { useState, useEffect } from 'react';
import { Activity, Server, Cpu, Database, HardDrive, ShieldCheck, Zap, RefreshCw, CheckCircle2 } from 'lucide-react';
import { monitoringService, SystemHealthMetrics } from '../../services/monitoringService';

export const SystemHealthView: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemHealthMetrics>(monitoringService.getSystemMetrics());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshMetrics = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMetrics(monitoringService.getSystemMetrics());
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-green" />
            System Health & Infrastructure Status
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Real-time telemetry from microservices, databases, and container clusters.</p>
        </div>
        <button
          onClick={refreshMetrics}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-xl transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      {/* Grid of Key Health Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
            <span>CPU Utilization</span>
            <Cpu className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-3 text-2xl font-bold text-zinc-900">{metrics.cpuUsagePercent}%</div>
          <div className="w-full bg-zinc-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${metrics.cpuUsagePercent}%` }}></div>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Normal Load
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
            <span>Memory Allocation</span>
            <HardDrive className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-3 text-2xl font-bold text-zinc-900">{metrics.memoryUsagePercent}%</div>
          <div className="w-full bg-zinc-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${metrics.memoryUsagePercent}%` }}></div>
          </div>
          <div className="text-[11px] text-zinc-500 mt-2 font-mono">
            {metrics.memoryUsedMb} MB / {metrics.memoryTotalMb} MB
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
            <span>PostgreSQL DB Pool</span>
            <Database className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-3 text-2xl font-bold text-zinc-900">{metrics.dbPoolActive} Active</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-4 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Connection Pool Healthy
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
            <span>AI Service Status</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 text-2xl font-bold text-zinc-900">{metrics.aiServiceStatus}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-4 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> FastAPI Microservice Active
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6">
        <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <Server className="w-4 h-4 text-zinc-600" />
          Service Status Inventory
        </h3>
        <div className="divide-y divide-zinc-100 text-xs">
          {[
            { name: 'Nginx Reverse Proxy', port: '80 / 443', status: 'Operational', uptime: '99.99%' },
            { name: 'Node.js Express Server', port: '3000', status: 'Operational', uptime: '100%' },
            { name: 'FastAPI AI Engine', port: '8000', status: 'Operational', uptime: '99.95%' },
            { name: 'PostgreSQL 16 Database', port: '5432', status: 'Operational', uptime: '100%' },
            { name: 'Redis Cache & Queue', port: '6379', status: 'Operational', uptime: '100%' },
          ].map((svc, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between">
              <div>
                <div className="font-semibold text-zinc-900">{svc.name}</div>
                <div className="text-[11px] text-zinc-400 font-mono">Port: {svc.port}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-zinc-500 font-mono">{svc.uptime}</span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full border border-emerald-200">
                  {svc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
