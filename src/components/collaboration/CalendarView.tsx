import React from 'react';
import { Calendar as CalendarIcon, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarIcon className="w-4 h-4" />
            Team Schedule & Availability
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Sprint Calendar</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Synchronized sprint milestones, release dates, video standups, and team leave schedule.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-zinc-900 text-base">August 2026</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-zinc-200 rounded-xl hover:bg-zinc-100 text-zinc-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 border border-zinc-200 rounded-xl hover:bg-zinc-100 text-zinc-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-zinc-500 py-2 border-b border-zinc-100">
          <div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div><div>SUN</div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-xs">
          {Array.from({ length: 31 }).map((_, i) => {
            const day = i + 1;
            const isToday = day === 2; // Aug 2
            return (
              <div
                key={day}
                className={`h-24 p-2 rounded-xl border flex flex-col justify-between ${
                  isToday ? 'bg-indigo-50/50 border-indigo-400 font-bold' : 'bg-zinc-50/50 border-zinc-200'
                }`}
              >
                <span className={`text-[11px] ${isToday ? 'text-indigo-600' : 'text-zinc-500'}`}>{day}</span>
                {day === 2 && (
                  <div className="p-1 bg-indigo-600 text-white rounded text-[9px] font-bold truncate">
                    Sprint 24 Standup
                  </div>
                )}
                {day === 5 && (
                  <div className="p-1 bg-emerald-600 text-white rounded text-[9px] font-bold truncate">
                    Sprint 24 Demo
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
