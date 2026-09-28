import { mockTestUser, mockTestSprint, mockAiPredictionResult } from '../fixtures/testData';

export const handlers = [
  {
    path: '/api/v1/auth/me',
    method: 'GET',
    response: { success: true, data: mockTestUser },
  },
  {
    path: '/api/v1/sprints/active',
    method: 'GET',
    response: { success: true, data: mockTestSprint },
  },
  {
    path: '/api/v1/ai/predict/sprint',
    method: 'POST',
    response: { success: true, data: mockAiPredictionResult },
  },
];
