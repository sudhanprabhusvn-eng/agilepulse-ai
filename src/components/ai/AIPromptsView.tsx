import React, { useState } from 'react';
import {
  FileCode,
  Star,
  Plus,
  Play,
  Copy,
  Check,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { mockPromptTemplates } from '../../data/aiAutomationData';
import { AIPromptTemplate } from '../../types';

export const AIPromptsView: React.FC = () => {
  const [prompts, setPrompts] = useState<AIPromptTemplate[]>(mockPromptTemplates);
  const [activePrompt, setActivePrompt] = useState<AIPromptTemplate>(prompts[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activePrompt.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <FileCode className="w-4 h-4" />
            Prompt Engineering Library
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">AI Prompt Management</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Standardized system prompt templates with variable binding for sprint reviews, risk scoring, and standup summaries.
          </p>
        </div>
        <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs">
          <Plus className="w-4 h-4" />
          Create New Prompt Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">Templates Library</h2>
          {prompts.map((p) => (
            <div
              key={p.id}
              onClick={() => setActivePrompt(p)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                activePrompt.id === p.id
                  ? 'bg-indigo-50 border-indigo-400 text-zinc-900 shadow-xs'
                  : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">{p.title}</span>
                <Star className={`w-3.5 h-3.5 ${p.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`} />
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1">{p.promptText}</p>
              <div className="mt-2 text-[10px] text-zinc-400 font-mono flex items-center justify-between">
                <span>{p.category}</span>
                <span>Used {p.usageCount}x</span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {activePrompt.category}
              </span>
              <h2 className="text-xl font-bold text-zinc-900 mt-2">{activePrompt.title}</h2>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Prompt'}
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block mb-2">Prompt Template Text</label>
            <div className="bg-zinc-900 text-zinc-100 p-4 rounded-2xl font-mono text-xs leading-relaxed border border-zinc-800 shadow-inner">
              {activePrompt.promptText}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block mb-2">Template Variables</label>
            <div className="flex flex-wrap gap-2">
              {activePrompt.variables.map((v) => (
                <span key={v} className="px-3 py-1 bg-zinc-100 text-zinc-800 text-xs font-mono font-bold rounded-lg border border-zinc-200">
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
