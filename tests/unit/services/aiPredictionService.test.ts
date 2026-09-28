import { describe, it, expect } from 'vitest';
import { calculateSprintHealth, runWhatIfSimulation } from '../../../src/services/aiPredictionService';

describe('aiPredictionService Unit Tests', () => {
  it('predicts sprint health correctly based on metrics', () => {
    const health = calculateSprintHealth([], 40, 20, 35);
    expect(health).toBeDefined();
    expect(health.score).toBeGreaterThanOrEqual(0);
    expect(health.riskLevel).toBeDefined();
  });

  it('runs sprint simulation', () => {
    const sim = runWhatIfSimulation(
      {
        additionalPoints: 5,
        capacityAdjustmentPercent: 0,
        blockedTaskCount: 1,
        remainingDays: 5,
      },
      40,
      20
    );

    expect(sim).toBeDefined();
    expect(sim.simulatedHealthScore).toBeGreaterThanOrEqual(0);
  });
});
