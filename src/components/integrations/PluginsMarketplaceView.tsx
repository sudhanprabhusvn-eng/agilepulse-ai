import React, { useState } from 'react';
import { Store, Star, Download, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { mockPlugins } from '../../data/integrationsData';
import { PluginItem } from '../../types';

export const PluginsMarketplaceView: React.FC = () => {
  const [plugins, setPlugins] = useState<PluginItem[]>(mockPlugins);

  const handleToggleInstall = (id: string) => {
    setPlugins((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, installed: !p.installed, enabled: !p.installed } : p
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            Ecosystem Extension Marketplace
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Plugin Marketplace</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Install modular extensions for custom WSJF logic, code review risk scoring, and executive reports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plugins.map((plug) => (
          <div key={plug.id} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[10px] rounded-full uppercase">
                  {plug.category}
                </span>
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {plug.rating}
                </span>
              </div>

              <h3 className="font-bold text-zinc-900 text-base">{plug.name}</h3>
              <p className="text-xs text-zinc-500 mt-1">{plug.description}</p>
              <span className="text-[10px] text-zinc-400 block mt-2 font-mono">By {plug.developer} • v{plug.version}</span>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-600">{plug.installed ? 'Installed & Active' : 'Available'}</span>
              <button
                onClick={() => handleToggleInstall(plug.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  plug.installed
                    ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                {plug.installed ? 'Uninstall' : 'Install Plugin'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
