export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  category: 'AI' | 'Beta' | 'Infrastructure' | 'UI';
  targetRoles: string[];
}

class FeatureFlagService {
  private flags: Map<string, FeatureFlag> = new Map([
    [
      'ENABLE_AI_RECOMMENDATIONS',
      {
        id: 'flag-1',
        key: 'ENABLE_AI_RECOMMENDATIONS',
        name: 'AI Sprint Recommendation Engine',
        description: 'Auto-generates actionable sprint scope adjustments and velocity optimizations',
        enabled: true,
        rolloutPercentage: 100,
        category: 'AI',
        targetRoles: ['Scrum Master', 'Product Owner', 'Admin'],
      },
    ],
    [
      'ENABLE_ADVANCED_METRICS',
      {
        id: 'flag-2',
        key: 'ENABLE_ADVANCED_METRICS',
        name: 'Advanced Prometheus & OTEL Metrics',
        description: 'Streams real-time CPU, DB pool, and API latency metrics to admin view',
        enabled: true,
        rolloutPercentage: 100,
        category: 'Infrastructure',
        targetRoles: ['Admin'],
      },
    ],
    [
      'ENABLE_CANARY_MONITORING',
      {
        id: 'flag-3',
        key: 'ENABLE_CANARY_MONITORING',
        name: 'Canary Operations & Health Dashboard',
        description: 'Enables blue-green canary deployment health checks and automatic rollback status',
        enabled: true,
        rolloutPercentage: 50,
        category: 'Beta',
        targetRoles: ['Admin'],
      },
    ],
  ]);

  public isEnabled(key: string, userRole?: string): boolean {
    const flag = this.flags.get(key);
    if (!flag || !flag.enabled) return false;
    if (userRole && flag.targetRoles.length > 0) {
      return flag.targetRoles.includes(userRole) || userRole === 'Admin';
    }
    return true;
  }

  public getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  public toggleFlag(key: string): FeatureFlag | undefined {
    const flag = this.flags.get(key);
    if (flag) {
      flag.enabled = !flag.enabled;
    }
    return flag;
  }
}

export const featureFlagService = new FeatureFlagService();
