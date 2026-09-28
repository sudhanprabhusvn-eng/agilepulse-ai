export interface AuditRecord {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  status: 'Success' | 'Denied' | 'Failed';
  ipAddress: string;
  details: string;
}

class AuditService {
  private auditRecords: AuditRecord[] = [
    {
      id: 'aud-2001',
      timestamp: new Date().toISOString(),
      userId: 'usr-1',
      userName: 'Sarah Jenkins',
      userRole: 'Scrum Master',
      action: 'UPDATE_SPRINT_GOAL',
      resource: 'Sprint 24',
      status: 'Success',
      ipAddress: '192.168.1.104',
      details: 'Updated goal for active sprint 24',
    },
    {
      id: 'aud-2002',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      userId: 'usr-2',
      userName: 'Alex Chen',
      userRole: 'Developer',
      action: 'TRIGGER_AI_PREDICTION',
      resource: 'AI Prediction Model',
      status: 'Success',
      ipAddress: '192.168.1.112',
      details: 'Executed AI risk assessment for Project Alpha',
    },
    {
      id: 'aud-2003',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      userId: 'usr-3',
      userName: 'David Miller',
      userRole: 'Product Owner',
      action: 'UPDATE_FEATURE_FLAGS',
      resource: 'Admin Configuration',
      status: 'Success',
      ipAddress: '192.168.1.150',
      details: 'Enabled beta feature flag ENABLE_AI_RECOMMENDATIONS',
    },
  ];

  public record(audit: Omit<AuditRecord, 'id' | 'timestamp'>): AuditRecord {
    const entry: AuditRecord = {
      ...audit,
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.auditRecords.unshift(entry);
    return entry;
  }

  public getRecords(): AuditRecord[] {
    return this.auditRecords;
  }
}

export const auditService = new AuditService();
