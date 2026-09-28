import React, { useState } from 'react';
import { Terminal, Filter, Download, Search } from 'lucide-react';
import { loggingService, LogEntry } from '../../services/loggingService';

export const LogsView: React.FC = () => {
  const [levelFilter, setLevelFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const logs = loggingService.getLogs(levelFilter, categoryFilter).filter((l) =>
    l.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-600" />
            Centralized System & API Application Logs
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Structured JSON application logs with request correlation IDs.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search logs by message or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700"
        >
          <option value="all">All Levels</option>
          <option value="info">INFO</option>
          <option value="warn">WARN</option>
          <option value="error">ERROR</option>
          <option value="debug">DEBUG</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700"
        >
          <option value="all">All Categories</option>
          <option value="AUTH">AUTH</option>
          <option value="AI_ENGINE">AI_ENGINE</option>
          <option value="DATABASE">DATABASE</option>
        </select>
      </div>

      {/* Terminal View */}
      <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-4 font-mono text-xs overflow-x-auto shadow-xl">
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 py-1 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/50 p-1.5 rounded">
              <span className="text-zinc-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  log.level === 'error'
                    ? 'bg-rose-950 text-rose-400 border border-rose-800/50'
                    : log.level === 'warn'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                }`}
              >
                {log.level}
              </span>
              <span className="text-indigo-400 font-semibold whitespace-nowrap">[{log.category}]</span>
              <span className="text-zinc-300">{log.message}</span>
              {log.correlationId && <span className="text-zinc-600 ml-auto whitespace-nowrap text-[10px]">{log.correlationId}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
