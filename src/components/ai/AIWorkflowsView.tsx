import React, { useState } from 'react';
import {
  GitBranch,
  Play,
  Plus,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ShieldAlert,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { mockWorkflows } from '../../data/aiAutomationData';
import { WorkflowAutomation, WorkflowNode } from '../../types';

export const AIWorkflowsView: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowAutomation[]>(mockWorkflows);
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowAutomation>(workflows[0]);
  const [testingMode, setTestingMode] = useState(false);
  const [testLog, setTestLog] = useState<string | null>(null);

  const handleTestWorkflow = () => {
    setTestingMode(true);
    setTestLog('Simulating trigger event...');
    setTimeout(() => {
      setTestLog('Step 1: Trigger received (Sprint Progress > 95%). Pass.');
    }, 600);
    setTimeout(() => {
      setTestLog('Step 2: AI Agent calculated 45 capacity points. Pass.');
    }, 1200);
    setTimeout(() => {
      setTestLog('Step 3: Auto-approval routing sent to Scrum Master. Execution finished with status SUCCESS.');
      setTestingMode(false);
    }, 1800);
  };

  const handleToggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
    if (activeWorkflow.id === id) {
      setActiveWorkflow((prev) => ({ ...prev, enabled: !prev.enabled }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <GitBranch className="w-4 h-4" />
            Visual Automation Canvas
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Workflow Automation Builder</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Build event-driven workflows with triggers, AI reasoning blocks, approvals, and error retry logic.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTestWorkflow}
            disabled={testingMode}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${testingMode ? 'animate-spin' : ''}`} />
            {testingMode ? 'Simulating Test Run...' : 'Test Active Workflow'}
          </button>
        </div>
      </div>

      {/* Main Grid: Selector + Visual Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Workflows list */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Automations</h2>
            <button className="p-1 hover:bg-zinc-100 rounded-lg text-indigo-600">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {workflows.map((wf) => {
              const isActive = activeWorkflow.id === wf.id;
              return (
                <div
                  key={wf.id}
                  onClick={() => setActiveWorkflow(wf)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50/60 border-indigo-400 text-zinc-900'
                      : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{wf.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWorkflow(wf.id);
                      }}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        wf.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {wf.enabled ? 'Active' : 'Paused'}
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-500 line-clamp-1">{wf.description}</p>
                  <div className="mt-2 text-[10px] text-zinc-400 font-mono flex items-center justify-between">
                    <span>{wf.executionCount} Executions</span>
                    <span>v{wf.version}.0</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Canvas Node View (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">{activeWorkflow.name}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{activeWorkflow.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-lg">
                  Max Retries: {activeWorkflow.retryLogic.maxRetries}
                </span>
                <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-lg">
                  Backoff: {activeWorkflow.retryLogic.backoffSeconds}s
                </span>
              </div>
            </div>

            {/* Test Simulation output if running */}
            {testLog && (
              <div className="mb-6 p-4 bg-zinc-900 text-emerald-400 font-mono text-xs rounded-xl border border-zinc-800 shadow-inner flex items-center justify-between">
                <span>{testLog}</span>
                <button onClick={() => setTestLog(null)} className="text-zinc-400 hover:text-white">✕</button>
              </div>
            )}

            {/* Visual Nodes Timeline */}
            <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-indigo-200">
              {activeWorkflow.nodes.map((node: WorkflowNode, index: number) => {
                return (
                  <div key={node.id} className="flex items-start gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                      {index + 1}
                    </div>

                    <div className="flex-1 bg-zinc-50/90 border border-zinc-200 p-4 rounded-2xl shadow-2xs hover:border-indigo-300 transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold text-[10px] rounded-full uppercase tracking-wider">
                          {node.type}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">Node ID: {node.id}</span>
                      </div>
                      <h4 className="font-bold text-zinc-900 text-sm">{node.label}</h4>
                      <p className="text-xs text-zinc-500 mt-1">
                        Configured condition evaluation & automated routing.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
