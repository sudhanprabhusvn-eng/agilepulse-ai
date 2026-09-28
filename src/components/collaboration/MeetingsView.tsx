import React, { useState } from 'react';
import { Video, Calendar, Plus, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { mockMeetings } from '../../data/collaborationData';
import { VideoMeeting } from '../../types';

export const MeetingsView: React.FC = () => {
  const [meetings] = useState<VideoMeeting[]>(mockMeetings);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Video className="w-4 h-4" />
            Video Conferencing & AI Transcription
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Video Meetings Hub</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Integrated Google Meet, Zoom, and Teams video standups with automated action item generation.
          </p>
        </div>
        <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs">
          <Plus className="w-4 h-4" />
          Schedule Standup / Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meetings.map((m) => (
          <div key={m.id} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-rose-50 text-rose-700 font-bold text-[10px] rounded-full uppercase border border-rose-200">
                {m.provider}
              </span>
              <span className="text-xs font-bold text-emerald-600">{m.status}</span>
            </div>

            <div>
              <h3 className="font-bold text-zinc-900 text-lg">{m.title}</h3>
              <p className="text-xs text-zinc-500 mt-1 font-mono">{m.scheduledTime} ({m.durationMinutes} mins)</p>
            </div>

            {m.aiSummary && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-indigo-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  AI Summary & Action Items
                </span>
                <p className="text-indigo-800">{m.aiSummary}</p>
              </div>
            )}

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-xs text-zinc-400">{m.attendees.length} Attendees</span>
              <a
                href={m.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
              >
                Join Video Room
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
