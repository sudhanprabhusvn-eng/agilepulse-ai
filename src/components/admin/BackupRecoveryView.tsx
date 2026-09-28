import React, { useState } from 'react';
import { Database, Download, RefreshCw, CheckCircle2, Play } from 'lucide-react';
import { backupService, BackupRecord } from '../../services/backupService';

export const BackupRecoveryView: React.FC = () => {
  const [backups, setBackups] = useState<BackupRecord[]>(backupService.getBackups());
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleManualBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      backupService.triggerManualBackup('Full PostgreSQL');
      setBackups([...backupService.getBackups()]);
      setIsBackingUp(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            Automated Database Backup & Disaster Recovery
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Scheduled PostgreSQL snapshots, Redis dumps, and disaster recovery restore wizard.</p>
        </div>
        <button
          onClick={handleManualBackup}
          disabled={isBackingUp}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-xl transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <Play className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />
          {isBackingUp ? 'Generating Snapshot...' : 'Trigger Backup Now'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6">
        <h3 className="text-sm font-bold text-zinc-900 mb-4">Backup History & Downloads</h3>
        <div className="divide-y divide-zinc-100 text-xs">
          {backups.map((b) => (
            <div key={b.id} className="py-3.5 flex items-center justify-between">
              <div>
                <div className="font-bold text-zinc-900">{b.type}</div>
                <div className="text-[11px] text-zinc-400 font-mono">
                  {new Date(b.timestamp).toLocaleString()} • {b.sizeMb} MB • {b.durationSeconds}s
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full border border-emerald-200">
                  {b.status}
                </span>
                <a
                  href={b.downloadUrl}
                  download
                  className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-700 transition-colors"
                  title="Download Backup SQL"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
