import React, { useState } from 'react';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, Sliders } from 'lucide-react';
import { monitoringService, AlertRule } from '../../services/monitoringService';

export const AlertsView: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertRule[]>(monitoringService.getAlertRules());

  const handleToggle = (id: string) => {
    monitoringService.toggleAlertRule(id);
    setAlerts([...monitoringService.getAlertRules()]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            Infrastructure & Security Alerting Rules
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Automated alert thresholds for CPU, DB connection saturation, and security incidents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alerts.map((rule) => (
          <div key={rule.id} className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase ${
                  rule.severity === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {rule.severity}
                </span>
                <span className={`text-xs font-bold ${rule.status === 'Active' ? 'text-emerald-600' : 'text-zinc-400'}`}>
                  {rule.status}
                </span>
              </div>
              <h3 className="font-bold text-zinc-900 text-sm">{rule.name}</h3>
              <p className="text-xs text-zinc-500 mt-2 font-mono">
                Condition: {rule.metric} {rule.condition} {rule.threshold}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">Rule ID: {rule.id}</span>
              <button
                onClick={() => handleToggle(rule.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  rule.status === 'Active' ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800' : 'bg-zinc-900 text-white'
                }`}
              >
                {rule.status === 'Active' ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
