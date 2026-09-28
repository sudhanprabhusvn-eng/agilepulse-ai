import { ThirdPartyIntegration, PluginItem, WebhookEndpoint } from '../types';

export const mockIntegrations: ThirdPartyIntegration[] = [
  { id: 'int-jira', name: 'Jira Software', category: 'Project Management', connected: true, status: 'Healthy', lastSyncTime: '5 mins ago', apiRequestsCount: 1420, icon: 'LayoutGrid', configUrl: 'https://jira.atlassian.com' },
  { id: 'int-slack', name: 'Slack Workspace', category: 'Communication', connected: true, status: 'Healthy', lastSyncTime: '2 mins ago', apiRequestsCount: 3890, icon: 'MessageSquare', configUrl: 'https://slack.com' },
  { id: 'int-github', name: 'GitHub Enterprise', category: 'Version Control', connected: true, status: 'Healthy', lastSyncTime: '10 mins ago', apiRequestsCount: 2150, icon: 'GitBranch' },
  { id: 'int-teams', name: 'Microsoft Teams', category: 'Communication', connected: false, status: 'Disconnected', lastSyncTime: 'Never', apiRequestsCount: 0, icon: 'Video' },
  { id: 'int-gdrive', name: 'Google Drive', category: 'Cloud Storage', connected: true, status: 'Healthy', lastSyncTime: '1 hour ago', apiRequestsCount: 520, icon: 'HardDrive' },
  { id: 'int-gcal', name: 'Google Calendar', category: 'Calendar', connected: true, status: 'Healthy', lastSyncTime: '30 mins ago', apiRequestsCount: 890, icon: 'Calendar' },
];

export const mockPlugins: PluginItem[] = [
  { id: 'plug-1', name: 'Agile WSJF Prioritizer Pro', developer: 'AgilePulse Ecosystem', category: 'Productivity', installed: true, enabled: true, rating: 4.9, version: '2.3.0', description: 'Advanced Weighted Shortest Job First automation with drag-and-drop scoring.' },
  { id: 'plug-2', name: 'Code Quality Risk Analyzer', developer: 'DevOps Tools Inc.', category: 'DevOps', installed: true, enabled: true, rating: 4.8, version: '1.8.5', description: 'Analyzes GitHub pull request diff complexity and maps to task risk scores.' },
  { id: 'plug-3', name: 'Executive Burndown Heatmap', developer: 'DataViz Labs', category: 'Analytics', installed: false, enabled: false, rating: 4.7, version: '1.0.2', description: 'Generates multi-sprint executive heatmap dashboards for C-level leadership.' },
  { id: 'plug-4', name: 'AI Voice Standup Assistant', developer: 'VoiceAI Systems', category: 'AI Modules', installed: false, enabled: false, rating: 4.6, version: '0.9.4', description: 'Converts daily voice standups into structured Markdown notes and Jira subtasks.' },
];

export const mockWebhooks: WebhookEndpoint[] = [
  { id: 'wh-1', name: 'Production Sprint Risk Webhook', targetUrl: 'https://api.company.com/webhooks/sprint-risk', events: ['sprint.risk_critical', 'task.blocked'], secretKey: 'whsec_98723498237498237498', active: true, lastDeliveryStatus: 'Success' },
  { id: 'wh-2', name: 'Slack Executive Notification Pipeline', targetUrl: 'https://hooks.slack.com/services/T00/B00/XXXX', events: ['report.generated', 'sprint.completed'], secretKey: 'whsec_123498712398712398', active: true, lastDeliveryStatus: 'Success' },
];
