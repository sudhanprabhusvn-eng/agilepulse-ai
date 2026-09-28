import React, { useState } from 'react';
import {
  Activity,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Zap,
  FileText,
  User,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationCategory } from '../../types';

export function ActivityFeed() {
  const { activityFeed } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredItems = activityFeed.filter((act) => {
    const matchesSearch =
      act.userName.toLowerCase().includes(search.toLowerCase()) ||
      act.action.toLowerCase().includes(search.toLowerCase()) ||
      act.targetName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || act.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'risk':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'ai':
        return <Zap className="w-4 h-4 text-brand-green" />;
      case 'task':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'project':
        return <FileText className="w-4 h-4 text-indigo-500" />;
      default:
        return <Activity className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-6 animate-fade-in text-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div>
          <h2 className="font-display text-lg font-bold text-zinc-900">Workspace Activity Telemetry</h2>
          <p className="text-zinc-500">Live event stream across all sprint tasks, reports, and AI optimization events</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative max-w-xs">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-1.5 font-medium text-zinc-900 focus:outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5 font-semibold text-zinc-800"
          >
            <option value="all">All Categories</option>
            <option value="risk">Risk Events</option>
            <option value="ai">AI Recommendations</option>
            <option value="task">Task Updates</option>
            <option value="project">Project / Epic</option>
          </select>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-100">
        {filteredItems.map((item) => (
          <div key={item.id} className="relative flex items-start gap-3 group">
            <div className="absolute -left-6 top-0 w-7 h-7 rounded-full bg-white border border-zinc-200 shadow-xs flex items-center justify-center shrink-0 z-10">
              {getCategoryIcon(item.category)}
            </div>

            <div className="flex-1 bg-zinc-50/80 p-4 rounded-2xl border border-zinc-200/60 hover:bg-white hover:border-zinc-300 transition-all space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={item.userAvatar}
                    alt={item.userName}
                    className="w-5 h-5 rounded-full object-cover border border-zinc-300"
                  />
                  <span className="font-bold text-zinc-900">{item.userName}</span>
                  <span className="text-zinc-400 font-mono text-[10px]">({item.userRole})</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-medium">{item.timestamp}</span>
              </div>

              <div className="text-zinc-800">
                <span className="font-semibold text-zinc-900">{item.action}</span>{' '}
                <span className="font-mono text-zinc-900 bg-white px-1.5 py-0.5 rounded border border-zinc-200 font-bold">
                  {item.targetName}
                </span>
              </div>

              {item.details && <p className="text-zinc-500 text-[11px] pt-1">{item.details}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
