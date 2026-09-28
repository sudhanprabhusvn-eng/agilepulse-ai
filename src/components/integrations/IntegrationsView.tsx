import React, { useState } from 'react';
import { LayoutGrid, CheckCircle2, RefreshCw, Zap, ShieldCheck, Link2, ExternalLink } from 'lucide-react';
import { mockIntegrations } from '../../data/integrationsData';
import { ThirdPartyIntegration } from '../../types';

export const IntegrationsView: React.FC = () => {
  const [integrations, setIntegrations] = useState<ThirdPartyIntegration[]>(mockIntegrations);

  const handleToggleConnect = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, connected: !i.connected, status: !i.connected ? 'Healthy' : 'Disconnected' } : i
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Link2 className="w-4 h-4" />
            Enterprise Service Mesh
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Integration Center</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Connect Jira, Slack, GitHub, Teams, and Google Workspace to sync tasks and trigger automated AI workflows.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-700 font-bold text-[10px] rounded-full uppercase">
                  {item.category}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                    item.connected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                  }`}
                >
                  {item.connected ? 'Connected' : 'Not Connected'}
                </span>
              </div>

              <h3 className="font-bold text-zinc-900 text-lg">{item.name}</h3>
              <p className="text-xs text-zinc-500 mt-1 font-mono">
                Last Sync: {item.lastSyncTime} • Requests: {item.apiRequestsCount}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 font-mono">ID: {item.id}</span>
              <button
                onClick={() => handleToggleConnect(item.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  item.connected
                    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {item.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
