import React, { useState } from 'react';
import {
  Bot,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Activity,
  Sliders,
  Sparkles,
  RefreshCw,
  Zap,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { mockAIAgents } from '../../data/aiAutomationData';
import { AIAgent } from '../../types';

export const AIAgentsView: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>(mockAIAgents);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(agents[0]);
  const [runningAgentId, setRunningAgentId] = useState<string | null>(null);

  const handleRunAgent = (agentId: string) => {
    setRunningAgentId(agentId);
    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === agentId
            ? { ...a, lastRun: 'Just now', totalExecutions: a.totalExecutions + 1, status: 'Idle' }
            : a
        )
      );
      setRunningAgentId(null);
    }, 1500);
  };

  const handleToggleAutoExecute = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, autoExecute: !a.autoExecute } : a))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Bot className="w-4 h-4" />
            Intelligent Agent Orchestration
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">AI Agent Center</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Autonomous AI agents operating continuously to forecast risks, rebalance workloads, and generate report summaries.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            10 Active Agents
          </div>
          <div className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" />
            98.2% Avg Success
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent List Cards (2 Cols) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {agents.map((agent) => {
            const isSelected = selectedAgent?.id === agent.id;
            const isRunning = runningAgentId === agent.id;

            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                    : 'bg-white/90 border-zinc-200 hover:border-zinc-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full border bg-zinc-100 text-zinc-700 border-zinc-200 font-mono">
                      v{agent.version}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full border flex items-center gap-1 uppercase ${
                        agent.status === 'Running' || isRunning
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                      {isRunning ? 'Running' : agent.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-zinc-900 text-base">{agent.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{agent.description}</p>

                  <div className="mt-4 pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase font-bold">Success Rate</span>
                      <span className="font-bold text-emerald-600">{agent.successRate}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase font-bold">Avg Speed</span>
                      <span className="font-bold text-zinc-800">{agent.avgExecutionTimeMs}ms</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {agent.lastRun}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunAgent(agent.id);
                    }}
                    disabled={isRunning}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Play className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
                    {isRunning ? 'Executing...' : 'Trigger'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Agent Capabilities & Detail Panel (1 Col) */}
        {selectedAgent && (
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Cpu className="w-4 h-4" />
                Agent Inspection
              </div>
              <h2 className="text-xl font-bold text-zinc-900">{selectedAgent.name}</h2>
              <p className="text-xs text-zinc-500 mt-1">{selectedAgent.description}</p>
            </div>

            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-600">Auto Execution Mode</span>
                <button
                  onClick={() => handleToggleAutoExecute(selectedAgent.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                    selectedAgent.autoExecute ? 'bg-indigo-600 text-white' : 'bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {selectedAgent.autoExecute ? 'Enabled (Auto)' : 'Manual Only'}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-600">Total Executions</span>
                <span className="font-bold text-zinc-900 font-mono">{selectedAgent.totalExecutions}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-600">Avg Latency</span>
                <span className="font-bold text-zinc-900 font-mono">{selectedAgent.avgExecutionTimeMs} ms</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3">Core Capabilities</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.capabilities.map((cap, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3" />
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Status: <strong className="text-emerald-600">{selectedAgent.status}</strong></span>
              <button
                onClick={() => handleRunAgent(selectedAgent.id)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Zap className="w-3.5 h-3.5" />
                Run Immediately
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
