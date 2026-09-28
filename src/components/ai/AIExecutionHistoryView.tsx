import React, { useState } from 'react';
import {
  History,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Terminal,
} from 'lucide-react';
import { mockExecutionLogs } from '../../data/aiAutomationData';
import { ExecutionLogRecord } from '../../types';

export const AIExecutionHistoryView: React.FC = () => {
  const [logs] = useState<ExecutionLogRecord[]>(mockExecutionLogs);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            Audit & Telemetry Logs
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Execution History</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Real-time execution telemetry for AI agent runs, scheduled workflows, and prompt jobs.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 font-bold text-zinc-600 uppercase tracking-wider">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Name & Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Output Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-4 text-zinc-500 font-mono whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-4">
                    <div className="font-bold text-zinc-900">{log.name}</div>
                    <div className="text-[10px] text-zinc-400 uppercase font-bold">{log.type}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" />
                      {log.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono">{log.durationMs} ms</td>
                  <td className="p-4 font-mono text-zinc-600 max-w-xs truncate">{log.logOutput}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
