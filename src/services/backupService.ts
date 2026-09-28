export interface BackupRecord {
  id: string;
  timestamp: string;
  type: 'Full PostgreSQL' | 'Redis Cache Snapshot' | 'Configuration & Secrets';
  sizeMb: number;
  status: 'Completed' | 'In Progress' | 'Failed';
  durationSeconds: number;
  downloadUrl: string;
}

class BackupService {
  private backups: BackupRecord[] = [
    {
      id: 'bak-901',
      timestamp: new Date().toISOString(),
      type: 'Full PostgreSQL',
      sizeMb: 142.5,
      status: 'Completed',
      durationSeconds: 14,
      downloadUrl: '/backups/bak-901.sql.gz',
    },
    {
      id: 'bak-900',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      type: 'Full PostgreSQL',
      sizeMb: 139.8,
      status: 'Completed',
      durationSeconds: 13,
      downloadUrl: '/backups/bak-900.sql.gz',
    },
  ];

  public getBackups(): BackupRecord[] {
    return this.backups;
  }

  public triggerManualBackup(type: BackupRecord['type']): BackupRecord {
    const newBackup: BackupRecord = {
      id: `bak-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      type,
      sizeMb: parseFloat((140 + Math.random() * 5).toFixed(1)),
      status: 'Completed',
      durationSeconds: Math.floor(10 + Math.random() * 8),
      downloadUrl: `/backups/bak-latest.sql.gz`,
    };
    this.backups.unshift(newBackup);
    return newBackup;
  }
}

export const backupService = new BackupService();
