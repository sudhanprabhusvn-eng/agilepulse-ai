import React from 'react';
import {
  Users,
  MessageSquare,
  Video,
  Calendar,
  PenTool,
  Activity,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CollaborationHubView: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            Enterprise Synergy Engine
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Collaboration & Team Hub</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Real-time team chat, video standups with AI summaries, interactive whiteboard, and shared calendar.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={() => setActiveTab('chat')}
          className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900 text-base group-hover:text-indigo-600 transition-colors">
              Team Chat & Channels
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Threaded replies, @mentions, code snippet sharing, and sprint channels.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 text-xs font-bold text-indigo-600">
            <span>Open Chat</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('meetings')}
          className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900 text-base group-hover:text-rose-600 transition-colors">
              Video Meetings & AI Action Items
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Google Meet, Zoom & Teams video rooms with automated AI transcripts.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 text-xs font-bold text-rose-600">
            <span>View Meetings</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('whiteboard')}
          className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <PenTool className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900 text-base group-hover:text-amber-600 transition-colors">
              Collaborative Whiteboard
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Sticky notes, mind maps, user cursors, and live sprint planning canvas.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 text-xs font-bold text-amber-600">
            <span>Launch Canvas</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('calendar')}
          className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900 text-base group-hover:text-emerald-600 transition-colors">
              Sprint & Team Calendar
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Sprint milestones, standup schedules, and team leave availability.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 text-xs font-bold text-emerald-600">
            <span>View Calendar</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
