export const mockTestUser = {
  id: 'usr-test-101',
  firstName: 'Sarah',
  lastName: 'Jenkins',
  email: 'sarah.j@agilepulse.ai',
  role: 'Scrum Master',
  organization: 'AgilePulse AI',
};

export const mockTestSprint = {
  id: 'sprint-2026-04',
  name: 'Sprint 24 - AI Analytics Engine',
  goal: 'Deliver production AI prediction capabilities',
  status: 'active',
  startDate: '2026-07-20',
  endDate: '2026-08-03',
  totalPoints: 42,
  completedPoints: 28,
};

export const mockAiPredictionResult = {
  sprintId: 'sprint-2026-04',
  completionProbability: 92,
  predictedVelocity: 38,
  riskLevel: 'Low',
  confidenceScore: 0.94,
};
