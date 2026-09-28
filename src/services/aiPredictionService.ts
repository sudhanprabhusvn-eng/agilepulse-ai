import { Task, RiskLevel, RiskPrediction, AIRecommendation } from '../types';

export interface SimulationInput {
  additionalPoints: number;
  capacityAdjustmentPercent: number; // e.g. -10, 0, +20
  blockedTaskCount: number;
  remainingDays: number;
}

export interface SimulationResult {
  simulatedHealthScore: number;
  simulatedCompletionProbability: number;
  simulatedRiskLevel: RiskLevel;
  predictedDelayDays: number;
  shapFeatures: { name: string; impact: number; positive: boolean }[];
  recommendation: string;
}

/**
 * Calculates Sprint Health Score (0 - 100) based on task progress, blockers, and capacity.
 */
export function calculateSprintHealth(
  tasks: Task[],
  totalPoints: number,
  completedPoints: number,
  targetVelocity: number
): { score: number; riskLevel: RiskLevel } {
  const remainingPoints = totalPoints - completedPoints;
  const blockedTasks = tasks.filter((t) => t.blocked);
  const blockedPoints = blockedTasks.reduce((acc, t) => acc + t.storyPoints, 0);

  // Velocity ratio
  const velocityProgress = (completedPoints / Math.max(1, targetVelocity)) * 100;
  
  // Blocker penalty (each blocked point drops score by 3%)
  const blockerPenalty = blockedPoints * 3;
  
  // Scope penalty if total > targetVelocity
  const scopePenalty = Math.max(0, (totalPoints - targetVelocity) * 2.5);

  let rawScore = 100 - (blockerPenalty + scopePenalty) + (velocityProgress * 0.15);
  rawScore = Math.min(100, Math.max(10, Math.round(rawScore)));

  let riskLevel: RiskLevel = 'low';
  if (rawScore < 60) riskLevel = 'critical';
  else if (rawScore < 75) riskLevel = 'high';
  else if (rawScore < 85) riskLevel = 'medium';

  return { score: rawScore, riskLevel };
}

/**
 * Runs the What-If AI Simulation Model
 */
export function runWhatIfSimulation(input: SimulationInput, currentPoints: number, currentCompleted: number): SimulationResult {
  const newTotal = currentPoints + input.additionalPoints;
  const remaining = newTotal - currentCompleted;
  
  // Base daily velocity capacity (e.g., ~3 points per day)
  const baseDailyCapacity = 3.2 * (1 + input.capacityAdjustmentPercent / 100);
  const maxCompletable = input.remainingDays * baseDailyCapacity;
  
  const pointDeficit = remaining - maxCompletable;
  const predictedDelayDays = Math.max(0, parseFloat((pointDeficit / baseDailyCapacity).toFixed(1)));
  
  let probability = Math.round(100 - (pointDeficit * 6) - (input.blockedTaskCount * 12));
  probability = Math.min(99, Math.max(15, probability));
  
  let simulatedHealthScore = Math.round(probability * 0.95);
  simulatedHealthScore = Math.min(98, Math.max(12, simulatedHealthScore));

  let simulatedRiskLevel: RiskLevel = 'low';
  if (simulatedHealthScore < 50) simulatedRiskLevel = 'critical';
  else if (simulatedHealthScore < 70) simulatedRiskLevel = 'high';
  else if (simulatedHealthScore < 82) simulatedRiskLevel = 'medium';

  // Feature impact (SHAP style)
  const shapFeatures = [
    { name: 'Remaining Workload', impact: Math.round(remaining * 1.8), positive: false },
    { name: 'Daily Velocity Capacity', impact: Math.round(baseDailyCapacity * 8), positive: true },
    { name: 'Active Blockers Penalty', impact: input.blockedTaskCount * 14, positive: false },
    { name: 'Scope Addition', impact: input.additionalPoints * 3, positive: false },
  ];

  let recommendation = 'Current configuration is healthy and projected to complete on time.';
  if (predictedDelayDays > 0) {
    recommendation = `Warning: Sprint is projected to slip by ${predictedDelayDays} days. Recommend reducing scope by ${Math.ceil(pointDeficit)} story points or unblocking tasks immediately.`;
  } else if (input.capacityAdjustmentPercent < 0) {
    recommendation = 'Reduced team capacity identified. Keep critical path tasks prioritized.';
  }

  return {
    simulatedHealthScore,
    simulatedCompletionProbability: probability,
    simulatedRiskLevel,
    predictedDelayDays,
    shapFeatures,
    recommendation,
  };
}

/**
 * Generates an instant AI response for conversational prompts about sprint health
 */
export function queryAgilePulseAI(userPrompt: string, tasks: Task[], healthScore: number): string {
  const lower = userPrompt.toLowerCase();

  if (lower.includes('risk') || lower.includes('block') || lower.includes('delay')) {
    const blocked = tasks.filter((t) => t.blocked);
    if (blocked.length > 0) {
      return `⚠️ **Critical Risk Identified**: Task **${blocked[0].id}** (${blocked[0].title}) is currently blocked due to: *"${blocked[0].blockerReason}"*. This task accounts for ${blocked[0].storyPoints} story points on the critical path. I recommend escalating this to the team lead or decoupling the dependency into a feature flag.`;
    }
    return `✅ Current risk level is **Medium**. No critical blockers are currently logged, but watch task **AP-101** which carries 8 story points nearing the sprint end date.`;
  }

  if (lower.includes('capacity') || lower.includes('workload') || lower.includes('who')) {
    return `📊 **Team Capacity Insight**: David Kim is currently over-allocated at **116% capacity** (14 pts assigned vs 12 target). Meanwhile, Marcus Vance has **35% available capacity**. Reassigning AP-106 (5 pts) to Marcus will reduce sprint bottleneck risk by 32%.`;
  }

  if (lower.includes('health') || lower.includes('score') || lower.includes('status')) {
    return `🎯 **Sprint Health Score**: **${healthScore}/100 (Optimal)**. Overall velocity is on track at 28/48 story points completed. 4 days remain in Sprint 24. With current daily burndown rate of 3.2 pts/day, we forecast completion on Day 14 at 96% probability.`;
  }

  if (lower.includes('recommend') || lower.includes('action') || lower.includes('improve')) {
    return `💡 **Top 3 AI Recommendations for Sprint 24**:
1. **Unblock AP-102**: Decouple SecOps compliance review behind a feature flag.
2. **Reallocate Workload**: Move AP-106 from David Kim to Marcus Vance.
3. **Backlog Deferral**: Move AP-108 (8 pts) to Sprint 25 to protect target delivery.`;
  }

  return `🤖 **AgilePulse AI Insight**: Based on telemetry from 48 committed story points across 5 team members, current sprint health is **${healthScore}/100**. To maximize delivery probability, maintain focus on resolving active code reviews (AP-102) and keeping task story point sizes below 5 points.`;
}
