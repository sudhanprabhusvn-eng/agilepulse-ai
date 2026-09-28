import React from 'react';
import { X, CheckCheck, Bell, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { useApp, ActiveTab } from '../../context/AppContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export function NotificationDrawer({ isOpen, onClose, onNavigateTab }: NotificationDrawerProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useApp();

  if (!isOpen) return null;

  const activeNotifications = notifications.filter((n) => !n.archived);
  const unreadCount = activeNotifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-zinc-200 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-zinc-900 text-brand-green flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-zinc-900">Notifications</h2>
                <p className="text-[11px] text-zinc-500">{unreadCount} unread alerts</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                title="Mark all read"
                className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-600 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-4 h-4 text-emerald-600" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-zinc-100 text-xs">
            {activeNotifications.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 space-y-2">
                <Bell className="w-8 h-8 text-zinc-300 mx-auto" />
                <p>No active notifications</p>
              </div>
            ) : (
              activeNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.linkTab) {
                      onNavigateTab(notif.linkTab as ActiveTab);
                      onClose();
                    }
                  }}
                  className={`pt-3 pb-3 flex items-start gap-3 rounded-2xl p-3 transition-colors cursor-pointer hover:bg-zinc-50 ${
                    !notif.read ? 'bg-zinc-50/80 font-semibold' : ''
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                      !notif.read ? 'bg-brand-green' : 'bg-transparent'
                    }`}
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-zinc-900 text-xs">{notif.title}</h4>
                      <span className="text-[10px] text-zinc-400">{notif.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-zinc-600 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Link */}
          <div className="p-4 border-t border-zinc-100 bg-zinc-50/80 flex items-center justify-between">
            <button
              onClick={clearNotifications}
              className="text-[11px] font-semibold text-zinc-500 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
            <button
              onClick={() => {
                onNavigateTab('notifications');
                onClose();
              }}
              className="text-xs font-bold text-zinc-900 hover:text-brand-green transition-colors flex items-center gap-1 cursor-pointer"
            >
              View Full Notification Center <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
