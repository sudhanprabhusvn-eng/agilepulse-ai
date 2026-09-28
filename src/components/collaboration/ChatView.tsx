import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Pin,
  Smile,
  Paperclip,
  Users,
  Hash,
  Sparkles,
} from 'lucide-react';
import { mockChannels, mockMessages } from '../../data/collaborationData';
import { ChatChannel, ChatMessage } from '../../types';

export const ChatView: React.FC = () => {
  const [channels] = useState<ChatChannel[]>(mockChannels);
  const [activeChannel, setActiveChannel] = useState<ChatChannel>(channels[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [inputMsg, setInputMsg] = useState('');
  const [isCopilotTyping, setIsCopilotTyping] = useState(false);

  React.useEffect(() => {
    fetch(`/api/v1/chat/messages?channelId=${activeChannel.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setMessages(data.data);
        }
      })
      .catch(() => {});
  }, [activeChannel.id]);

  const handleSend = async () => {
    if (!inputMsg.trim()) return;
    const text = inputMsg.trim();
    setInputMsg('');

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId: activeChannel.id,
      senderId: 'usr-curr',
      senderName: 'You (Current User)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
    };
    setMessages((prev) => [...prev, newMsg]);

    // Send to backend
    fetch('/api/v1/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channelId: activeChannel.id,
        senderName: 'You (Current User)',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        content: text,
      }),
    }).catch(() => {});

    // If @copilot is mentioned, generate auto reply
    if (text.toLowerCase().includes('@copilot')) {
      setIsCopilotTyping(true);
      setTimeout(() => {
        let reply = `🤖 **AgilePulse AI Copilot**: Current Sprint 24 Health is at **84/100 (Optimal)** with 4 days remaining. Team velocity is tracking at 28/48 story points. Key priority is unblocking AP-102 (SecOps review).`;
        if (text.toLowerCase().includes('blocker') || text.toLowerCase().includes('risk')) {
          reply = `🤖 **AgilePulse AI Copilot**: Active blocker identified on Task **AP-102** (*SecOps Compliance Review*). Recommended step: Isolate behind a feature flag or escalate to security lead.`;
        }
        const copilotMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          channelId: activeChannel.id,
          senderId: 'copilot',
          senderName: 'AgilePulse AI Copilot',
          senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactions: [],
        };
        setMessages((prev) => [...prev, copilotMsg]);
        setIsCopilotTyping(false);
      }, 700);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
      {/* Channels Sidebar */}
      <div className="w-64 bg-zinc-50 border-r border-zinc-200 p-4 space-y-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            Team Channels
          </div>

          <div className="space-y-1">
            {channels.map((chan) => {
              const isActive = activeChannel.id === chan.id;
              return (
                <button
                  key={chan.id}
                  onClick={() => setActiveChannel(chan)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                    isActive ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:bg-zinc-200/60'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Hash className="w-3.5 h-3.5" />
                    {chan.name}
                  </span>
                  {chan.unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-mono">
                      {chan.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs space-y-1">
          <div className="font-bold text-indigo-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI Chat Copilot Active
          </div>
          <p className="text-[11px] text-indigo-700">Type @copilot in any channel to summarize threads or query sprint status.</p>
        </div>
      </div>

      {/* Main Chat Feed */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Channel Header */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-indigo-600" />
              {activeChannel.name}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">{activeChannel.topic}</p>
          </div>
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {activeChannel.memberCount} Members
          </span>
        </div>

        {/* Message Thread */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {messages.map((m) => (
            <div key={m.id} className="flex items-start gap-3">
              <img src={m.senderAvatar} alt={m.senderName} className="w-8 h-8 rounded-full object-cover shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-zinc-900">{m.senderName}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">{m.timestamp}</span>
                </div>
                <div className="mt-1 p-3 bg-zinc-50 border border-zinc-200/80 rounded-2xl text-xs text-zinc-800 leading-relaxed max-w-xl">
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          {isCopilotTyping && (
            <div className="flex items-start gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-brand-green flex items-center justify-center shrink-0 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-brand-green" />
              </div>
              <div className="p-3 bg-indigo-50/80 border border-indigo-200/80 rounded-2xl text-xs text-indigo-900 font-medium">
                AgilePulse AI Copilot is typing...
              </div>
            </div>
          )}
        </div>

        {/* Quick Copilot Chips & Input */}
        <div className="p-4 border-t border-zinc-200 bg-white space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            <span className="text-zinc-400 font-mono">Quick:</span>
            <button
              onClick={() => setInputMsg('@copilot sprint status')}
              className="px-2.5 py-0.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium border border-indigo-200 cursor-pointer"
            >
              @copilot sprint status
            </button>
            <button
              onClick={() => setInputMsg('@copilot active blockers')}
              className="px-2.5 py-0.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium border border-rose-200 cursor-pointer"
            >
              @copilot active blockers
            </button>
            <button
              onClick={() => setInputMsg('@copilot recommend action')}
              className="px-2.5 py-0.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium border border-emerald-200 cursor-pointer"
            >
              @copilot recommend action
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Message #${activeChannel.name} (type @copilot for AI assistance)...`}
              className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              onClick={handleSend}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
