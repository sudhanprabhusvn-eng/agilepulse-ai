import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Send, Bot, User, Activity, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { queryAgilePulseAI } from '../../services/aiPredictionService';

export function AIAssistantDrawer() {
  const { isAiDrawerOpen, setIsAiDrawerOpen, tasks, activeSprint, activeTab } = useApp();

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: `Hello! I am AgilePulse AI Copilot. Current Sprint Health is **${activeSprint.healthScore}/100**. Ask me about risks, team capacities, or recommendations!`,
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isAiDrawerOpen) {
    if (activeTab === 'landing') return null;
    return (
      <button
        onClick={() => setIsAiDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-zinc-900 text-white shadow-xl border border-zinc-700 hover:bg-zinc-800 transition-all cursor-pointer flex items-center gap-2 group hover:scale-105"
        title="Open AI Copilot"
      >
        <Sparkles className="w-5 h-5 text-brand-green group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-semibold pr-1 hidden sm:inline">AI Copilot</span>
      </button>
    );
  }

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isTyping) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    const newMsgs = [...messages, { role: 'user' as const, text: userText }];
    setMessages(newMsgs);
    setIsTyping(true);

    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          context: {
            sprintHealth: activeSprint.healthScore,
            totalTasks: tasks.length,
            blockedTasks: tasks.filter((t) => t.blocked).length,
            activeSprintName: activeSprint.name,
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data?.reply) {
          setMessages((prev) => [...prev, { role: 'assistant' as const, text: json.data.reply }]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // Fallback to local heuristic
    }

    // Heuristic inference fallback
    setTimeout(() => {
      const aiResponse = queryAgilePulseAI(userText, tasks, activeSprint.healthScore);
      setMessages((prev) => [...prev, { role: 'assistant' as const, text: aiResponse }]);
      setIsTyping(false);
    }, 400);
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: `Chat cleared. AgilePulse AI Copilot is standing by. Current Sprint Health is **${activeSprint.healthScore}/100**.`,
      },
    ]);
  };

  const quickPrompts = [
    'What are the top sprint risks?',
    'Who is over-allocated?',
    'What is our completion forecast?',
    'Give me 3 recommendations',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-lg bg-zinc-900 text-white h-full shadow-2xl flex flex-col justify-between border-l border-zinc-800"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-green text-black flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">AgilePulse AI Copilot</h2>
              <p className="text-xs text-zinc-400 font-mono">Inference Engine v2.4 Active</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded-lg border border-zinc-700 hover:border-zinc-500 cursor-pointer"
              title="Clear chat history"
            >
              Clear
            </button>
            <button
              onClick={() => setIsAiDrawerOpen(false)}
              className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs leading-relaxed ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-brand-green shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-brand-green text-black font-medium'
                    : 'bg-zinc-800 border border-zinc-700/80 text-zinc-200'
                }`}
              >
                {m.text}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 text-xs leading-relaxed justify-start items-center">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-brand-green shrink-0">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3 rounded-2xl bg-zinc-800 border border-zinc-700/80 text-zinc-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-green animate-spin" />
                <span>AI Copilot is analyzing sprint telemetry...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts & Input */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-950/80 space-y-3">
          {/* Quick Pills */}
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setInputQuery(prompt);
                }}
                className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              disabled={isTyping}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={isTyping ? "AI is replying..." : "Ask AgilePulse AI..."}
              className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-green disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isTyping || !inputQuery.trim()}
              className="p-2.5 rounded-xl bg-brand-green text-black font-bold hover:bg-lime-400 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
