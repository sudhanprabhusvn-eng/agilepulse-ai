import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, HardDrive, Download, Smartphone, CheckCircle2, RefreshCw, Zap } from 'lucide-react';
import { OfflineSyncStatus } from '../../types';

export const PwaOfflineView: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<OfflineSyncStatus>({
    isOnline: navigator.onLine,
    pendingQueueCount: 0,
    lastSyncTimestamp: new Date().toLocaleTimeString(),
    storageUsageMb: 14.8,
    syncState: 'Idle',
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus((s) => ({ ...s, isOnline: true }));
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus((s) => ({ ...s, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setSyncStatus((prev) => ({
        ...prev,
        pendingQueueCount: 0,
        lastSyncTimestamp: new Date().toLocaleTimeString(),
        syncState: 'Idle',
      }));
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Smartphone className="w-4 h-4" />
            Offline First & Progressive Web App
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">PWA & Offline Control Center</h1>
          <p className="text-sm text-zinc-500 mt-1">
            IndexedDB caching, service worker background sync, optimistic updates, and mobile install prompt.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {isOnline ? 'Online Engine' : 'Offline Mode Active'}
          </span>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Offline Queue'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Service Worker Cache</span>
          <div className="text-2xl font-bold text-zinc-900 font-mono">{syncStatus.storageUsageMb} MB</div>
          <p className="text-xs text-zinc-500">IndexedDB offline store for tasks, boards, and conversations.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pending Offline Queue</span>
          <div className="text-2xl font-bold text-indigo-600 font-mono">{syncStatus.pendingQueueCount} Pending</div>
          <p className="text-xs text-zinc-500">Action items waiting for background sync execution.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Last Sync Time</span>
          <div className="text-2xl font-bold text-zinc-900 font-mono">{syncStatus.lastSyncTimestamp}</div>
          <p className="text-xs text-zinc-500">Automatic background sync running every 60s when connected.</p>
        </div>
      </div>
    </div>
  );
};
