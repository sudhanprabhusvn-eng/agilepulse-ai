export interface SystemHealthMetrics {
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  memoryUsedMb: number;
  memoryTotalMb: number;
  activeUsersCount: number;
  activeSocketsCount: number;
  apiLatencyMs: number;
  dbPoolActive: number;
  redisConnectionStatus: 'Healthy' | 'Degraded' | 'Offline';
  aiServiceStatus: 'Operational' | 'Degraded' | 'Offline';
  uptimeSeconds: number;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: '>' | '<' | '==';
  threshold: number;
  severity: 'Critical' | 'Warning' | 'Info';
  status: 'Active' | 'Triggered' | 'Disabled';
  lastTriggered?: string;
}

class MonitoringService {
  private alertRules: AlertRule[] = [
    {
      id: 'alt-101',
      name: 'High CPU Utilization Warning',
      metric: 'cpuUsagePercent',
      condition: '>',
      threshold: 85,
      severity: 'Warning',
      status: 'Active',
    },
    {
      id: 'alt-102',
      name: 'Database Connection Pool Saturation',
      metric: 'dbPoolActive',
      condition: '>',
      threshold: 18,
      severity: 'Critical',
      status: 'Active',
    },
    {
      id: 'alt-103',
      name: 'AI Engine Latency Spike',
      metric: 'apiLatencyMs',
      condition: '>',
      threshold: 500,
      severity: 'Warning',
      status: 'Triggered',
      lastTriggered: '10 mins ago',
    },
  ];

  public getSystemMetrics(): SystemHealthMetrics {
    return {
      cpuUsagePercent: 24.5,
      memoryUsagePercent: 42.1,
      memoryUsedMb: 1724,
      memoryTotalMb: 4096,
      activeUsersCount: 18,
      activeSocketsCount: 12,
      apiLatencyMs: 38,
      dbPoolActive: 5,
      redisConnectionStatus: 'Healthy',
      aiServiceStatus: 'Operational',
      uptimeSeconds: 86420,
    };
  }

  public getAlertRules(): AlertRule[] {
    return this.alertRules;
  }

  public toggleAlertRule(id: string): AlertRule | undefined {
    const rule = this.alertRules.find((r) => r.id === id);
    if (rule) {
      rule.status = rule.status === 'Disabled' ? 'Active' : 'Disabled';
    }
    return rule;
  }
}

export const monitoringService = new MonitoringService();
