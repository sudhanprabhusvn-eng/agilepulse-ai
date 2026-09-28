import React, { useState } from 'react';
import { Webhook, Key, Code2, Plus, Copy, Check, Download, Upload, ShieldCheck } from 'lucide-react';
import { mockWebhooks } from '../../data/integrationsData';
import { WebhookEndpoint } from '../../types';

export const WebhooksApiView: React.FC = () => {
  const [webhooks] = useState<WebhookEndpoint[]>(mockWebhooks);
  const [selectedSdk, setSelectedSdk] = useState<'node' | 'python' | 'curl'>('node');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Webhook className="w-4 h-4" />
            Developer Extensions & Webhooks
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Webhooks & API Management</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage outbound event delivery signatures, generate Personal Access Tokens (PATs), and inspect code SDK wrappers.
          </p>
        </div>
        <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs">
          <Plus className="w-4 h-4" />
          Create Webhook Endpoint
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Webhooks list */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Active Webhooks</h2>
          <div className="space-y-3">
            {webhooks.map((wh) => (
              <div key={wh.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900">{wh.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                    {wh.lastDeliveryStatus}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-zinc-500 truncate">{wh.targetUrl}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {wh.events.map((ev) => (
                    <span key={ev} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-mono text-[10px] rounded">
                      {ev}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SDK Snippets */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">SDK Code Examples</h2>
            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
              {(['node', 'python', 'curl'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedSdk(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer ${
                    selectedSdk === lang ? 'bg-zinc-900 text-white' : 'text-zinc-600'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 text-zinc-100 p-4 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto">
            {selectedSdk === 'node' && (
              <pre>{`import { AgilePulseClient } from '@agilepulse/sdk';

const client = new AgilePulseClient({
  apiKey: process.env.AGILEPULSE_API_KEY
});

const health = await client.sprints.getHealth('sprint-24');
console.log('Sprint Health:', health.score);`}</pre>
            )}
            {selectedSdk === 'python' && (
              <pre>{`from agilepulse import AgilePulseClient

client = AgilePulseClient(api_key="agp_sec_key_1234")
sprint_health = client.sprints.get_health("sprint-24")
print(f"Health Score: {sprint_health.score}")`}</pre>
            )}
            {selectedSdk === 'curl' && (
              <pre>{`curl -X GET https://agilepulse.ai/api/v1/health \\
  -H "Authorization: Bearer agp_sec_key_1234"`}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
