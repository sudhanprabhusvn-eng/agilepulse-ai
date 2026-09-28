import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Pin,
  Clock,
  Trash2,
  Archive,
  Search,
  Filter,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Megaphone,
  MessageSquare,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useApp, ActiveTab } from '../../context/AppContext';
import { AppNotification, NotificationCategory } from '../../types';

interface NotificationCenterProps {
  onNavigateTab?: (tab: ActiveTab) => void;
}

export function NotificationCenter({ onNavigateTab }: NotificationCenterProps) {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    archiveNotification,
    pinNotification,
    snoozeNotification,
    clearNotifications,
    setActiveTab,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'pinned' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [snoozeMenuId, setSnoozeMenuId] = useState<string | null>(null);

  const categories = ['all', 'risk', 'ai', 'sprint', 'task', 'mention', 'announcement', 'system'];

  const filteredNotifications = notifications.filter((n) => {
    // Search match
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase());

    // Filter type match
    let matchesType = true;
    if (filterType === 'unread') matchesType = !n.read && !n.archived;
    else if (filterType === 'pinned') matchesType = !!n.pinned && !n.archived;
    else if (filterType === 'archived') matchesType = !!n.archived;
    else matchesType = !n.archived; // 'all' shows active unarchived

    // Category match
    const matchesCategory = categoryFilter === 'all' || n.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  const getNotificationIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'risk':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'sprint':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'mention':
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-brand-green" />;
      default:
        return <Bell className="w-4 h-4 text-zinc-500" />;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationRead(notif.id);
    if (notif.linkTab) {
      if (onNavigateTab) onNavigateTab(notif.linkTab as ActiveTab);
      else setActiveTab(notif.linkTab as ActiveTab);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      {/* Search & Actions Header */}
      <div className="p-4 rounded-3xl bg-white border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search notification title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-10 pr-4 py-2 font-medium text-zinc-900 focus:outline-none focus:border-zinc-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-2xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer ${
                filterType === 'all' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('unread')}
              className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer ${
                filterType === 'unread' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Unread ({notifications.filter((n) => !n.read && !n.archived).length})
            </button>
            <button
              onClick={() => setFilterType('pinned')}
              className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer ${
                filterType === 'pinned' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Pinned
            </button>
            <button
              onClick={() => setFilterType('archived')}
              className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer ${
                filterType === 'archived' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Archive
            </button>
          </div>

          <button
            onClick={markAllNotificationsRead}
            className="px-3.5 py-2 rounded-2xl bg-zinc-100 text-zinc-800 font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> Mark All Read
          </button>
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-2xl font-semibold capitalize shrink-0 transition-all cursor-pointer ${
              categoryFilter === cat
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            {cat} Alerts
          </button>
        ))}
      </div>

      {/* Main Notification Feed List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200/80 space-y-3">
            <Bell className="w-8 h-8 text-zinc-300 mx-auto" />
            <h3 className="font-bold text-zinc-800">No Notifications Match Filter</h3>
            <p className="text-zinc-400 text-xs">Try selecting a different filter or clear search terms.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 relative group ${
                !notif.read
                  ? 'bg-white border-zinc-300 shadow-sm font-semibold'
                  : 'bg-zinc-50/80 border-zinc-200/80 text-zinc-600'
              } ${notif.pinned ? 'ring-2 ring-brand-green/40' : ''}`}
            >
              <div
                onClick={() => handleNotificationClick(notif)}
                className="flex items-start gap-3.5 flex-1 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5 border border-zinc-200/60">
                  {getNotificationIcon(notif.category)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-brand-green shrink-0" />}
                    <h4 className="font-bold text-zinc-900 text-xs">{notif.title}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-200/60 text-zinc-700 text-[10px] font-mono uppercase">
                      {notif.category}
                    </span>
                    {notif.pinned && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-brand-green">
                        <Pin className="w-3 h-3 fill-current" /> Pinned
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">{notif.message}</p>
                  <div className="text-[10px] text-zinc-400 font-medium pt-0.5">{notif.timestamp}</div>
                </div>
              </div>

              {/* Actions Box */}
              <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                <button
                  onClick={() => pinNotification(notif.id)}
                  title="Pin Notification"
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    notif.pinned ? 'bg-brand-green/20 text-zinc-900' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                  }`}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setSnoozeMenuId(snoozeMenuId === notif.id ? null : notif.id)}
                    title="Snooze"
                    className="p-2 rounded-xl bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>

                  {snoozeMenuId === notif.id && (
                    <div className="absolute right-0 bottom-10 z-30 bg-white border border-zinc-200 rounded-2xl shadow-xl p-2 w-36 space-y-1 animate-scale-up">
                      <button
                        onClick={() => {
                          snoozeNotification(notif.id, 1);
                          setSnoozeMenuId(null);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-zinc-100 text-[11px] font-semibold text-zinc-800 cursor-pointer"
                      >
                        Snooze 1 Hour
                      </button>
                      <button
                        onClick={() => {
                          snoozeNotification(notif.id, 4);
                          setSnoozeMenuId(null);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-zinc-100 text-[11px] font-semibold text-zinc-800 cursor-pointer"
                      >
                        Snooze 4 Hours
                      </button>
                      <button
                        onClick={() => {
                          snoozeNotification(notif.id, 24);
                          setSnoozeMenuId(null);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-zinc-100 text-[11px] font-semibold text-zinc-800 cursor-pointer"
                      >
                        Snooze 24 Hours
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => archiveNotification(notif.id)}
                  title="Archive"
                  className="p-2 rounded-xl bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => deleteNotification(notif.id)}
                  title="Delete"
                  className="p-2 rounded-xl bg-zinc-100 text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
