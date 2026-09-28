export type UserRole = 
  | 'Scrum Master' 
  | 'Project Manager' 
  | 'Engineering Manager' 
  | 'Product Owner' 
  | 'Developer' 
  | 'Executive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  organization: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'code_review' | 'testing' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints: number;
  assigneeId: string;
  epic: string;
  createdAt: string;
  dueDate: string;
  blocked: boolean;
  blockerReason?: string;
  riskLevel: RiskLevel;
  riskReason?: string;
  tags: string[];
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'planning' | 'completed';
  totalPoints: number;
  completedPoints: number;
  targetVelocity: number;
  healthScore: number; // 0 - 100
  riskLevel: RiskLevel;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  currentSprintId: string;
  healthScore: number;
  openRisksCount: number;
  teamSize: number;
}

export interface RiskPrediction {
  id: string;
  sprintId: string;
  title: string;
  category: 'Scope Creep' | 'Resource Bottleneck' | 'Dependency Blocker' | 'Velocity Drop' | 'Technical Debt';
  riskScore: number; // 0 - 100
  level: RiskLevel;
  description: string;
  impact: string;
  contributingFactors: {
    factor: string;
    impactPercentage: number;
  }[];
  recommendedAction: string;
  status: 'active' | 'mitigated' | 'dismissed';
}

export interface AIRecommendation {
  id: string;
  title: string;
  category: 'Resource Reallocation' | 'Scope Reduction' | 'Dependency Resolution' | 'Process Optimization';
  description: string;
  impactScore: string; // e.g. "+12% Sprint Completion Probability"
  riskReduction: string; // e.g. "-28% Delay Risk"
  suggestedAction: string;
  applied: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  allocatedCapacityPoints: number;
  assignedPoints: number;
  completedPoints: number;
  utilizationPercentage: number;
  assignedTasksCount: number;
  status: 'Optimal' | 'Overloaded' | 'Underutilized';
}

export interface BurndownDataPoint {
  day: string;
  idealRemaining: number;
  actualRemaining: number;
  predictedRemaining: number;
}

export interface VelocityTrendPoint {
  sprintName: string;
  committedPoints: number;
  completedPoints: number;
  healthScore: number;
}

export interface AuditLogItem {
  id: string;
  user: string;
  action: string;
  details: string;
  timestamp: string;
}

// ==========================================
// REPORT TYPES & SCHEMAS
// ==========================================

export type ReportType =
  | 'sprint'
  | 'project'
  | 'team'
  | 'ai_insights'
  | 'risk'
  | 'executive'
  | 'compliance'
  | 'custom';

export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'markdown' | 'json';

export type ReportScheduleFrequency = 'daily' | 'weekly' | 'sprint_end' | 'monthly' | 'once';

export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'donut' | 'heatmap' | 'table';

export interface ReportKPICard {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'optimal' | 'warning' | 'critical';
  format?: 'number' | 'percentage' | 'currency' | 'text';
}

export interface ReportFilterConfig {
  dateRange: 'current_sprint' | 'last_30_days' | 'last_quarter' | 'year_to_date' | 'custom';
  startDate?: string;
  endDate?: string;
  projectId?: string;
  sprintId?: string;
  statusFilter?: TaskStatus[];
  priorityFilter?: TaskPriority[];
  riskFilter?: RiskLevel[];
  assigneeIds?: string[];
  includeAiPredictions?: boolean;
}

export interface ReportVisualizationConfig {
  chartType: ChartType;
  primaryMetric: string;
  secondaryMetric?: string;
  groupBy?: 'status' | 'assignee' | 'priority' | 'epic' | 'riskLevel';
  sortBy?: 'storyPoints' | 'dueDate' | 'priority' | 'riskScore';
  showLegend?: boolean;
  showValues?: boolean;
}

export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Sprint & Agile' | 'Portfolio & Exec' | 'Team & Resources' | 'AI & Predictive Risk' | 'Compliance & Audit';
  type: ReportType;
  isSystem: boolean;
  tags: string[];
  defaultKPIs: string[];
  defaultChartType: ChartType;
  popularForRoles: UserRole[];
  lastUpdated: string;
}

export interface SavedReport {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  createdBy: string;
  creatorAvatar?: string;
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  filterConfig: ReportFilterConfig;
  visualizationConfig: ReportVisualizationConfig;
  kpis: ReportKPICard[];
  isScheduled: boolean;
  scheduleFrequency?: ReportScheduleFrequency;
  scheduleRecipients?: string[];
  sharedWith: string[];
  isFavorite?: boolean;
  isPublic?: boolean;
}

export interface ScheduledReport {
  id: string;
  reportId: string;
  reportTitle: string;
  frequency: ReportScheduleFrequency;
  timeOfDay: string; // e.g. "09:00 AM"
  dayOfWeek?: string; // e.g. "Monday"
  recipients: string[];
  format: ReportFormat;
  status: 'active' | 'paused' | 'failed';
  lastRunAt?: string;
  nextRunAt: string;
  createdByName: string;
}

export interface ReportExecutionHistory {
  id: string;
  reportId: string;
  reportTitle: string;
  type: ReportType;
  generatedBy: string;
  generatedAt: string;
  format: ReportFormat;
  status: 'completed' | 'processing' | 'failed';
  fileSize: string;
  downloadUrl?: string;
  executionDurationMs: number;
}

// ==========================================
// NOTIFICATION & COMMUNICATION TYPES
// ==========================================

export type NotificationCategory =
  | 'project'
  | 'sprint'
  | 'task'
  | 'mention'
  | 'ai'
  | 'risk'
  | 'announcement'
  | 'system'
  | 'compliance';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'risk' | 'health' | 'task' | 'ai' | 'announcement' | 'system';
  category: NotificationCategory;
  priority: NotificationPriority;
  timestamp: string;
  read: boolean;
  pinned?: boolean;
  archived?: boolean;
  snoozedUntil?: string;
  linkTab?: string;
  actor?: {
    name: string;
    avatar: string;
  };
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationPreferences {
  channels: {
    inApp: boolean;
    email: boolean;
    browserPush: boolean;
    sound: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string; // "22:00"
    endTime: string;   // "07:00"
    timezone: string;
  };
  aiDigest: 'realtime' | 'daily' | 'weekly' | 'never';
  categories: {
    project: boolean;
    sprint: boolean;
    task: boolean;
    mention: boolean;
    ai: boolean;
    risk: boolean;
    announcement: boolean;
    system: boolean;
    compliance: boolean;
  };
  soundVolume: number; // 0 - 100
}

export interface ActivityFeedItem {
  id: string;
  userName: string;
  userRole: string;
  userAvatar: string;
  action: string;
  targetName: string;
  targetType: 'task' | 'sprint' | 'project' | 'report' | 'ai_recommendation' | 'risk';
  projectKey: string;
  timestamp: string;
  category: NotificationCategory;
  details?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  priority: 'normal' | 'urgent' | 'broadcast';
  pinned: boolean;
  targetAudience: string;
  tags: string[];
}

// ==========================================
// ENTERPRISE MANAGEMENT TYPES (PART 7)
// ==========================================

export interface UserProfile {
  id: string;
  avatar: string;
  coverImage: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  department: string;
  team: string;
  employeeId: string;
  bio: string;
  skills: string[];
  experienceYears: number;
  timeZone: string;
  language: string;
  joinedDate: string;
  lastLogin: string;
  onlineStatus: 'online' | 'busy' | 'away' | 'offline';
  role: UserRole;
  organization: string;
  completionScore: number;
}

export interface Workspace {
  id: string;
  name: string;
  logo: string;
  description: string;
  domain: string;
  timeZone: string;
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
  sprintDurationWeeks: number;
  currency: string;
  dateFormat: string;
  status: 'active' | 'archived';
  ownerId: string;
  createdAt: string;
  memberCount: number;
  projectCount: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  headAvatar: string;
  memberCount: number;
  teamCount: number;
  description: string;
}

export interface OrganizationTeam {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  leadName: string;
  leadAvatar: string;
  memberIds: string[];
  description: string;
  sprintVelocityAvg: number;
  activeProjectsCount: number;
}

export interface OrgMember {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  role: UserRole | string;
  department: string;
  team: string;
  status: 'active' | 'pending' | 'suspended';
  onlineStatus: 'online' | 'busy' | 'away' | 'offline';
  joinedDate: string;
  lastActive: string;
  employeeId: string;
}

export type ExtendedRoleName =
  | 'Super Admin'
  | 'Organization Admin'
  | 'Workspace Admin'
  | 'Project Manager'
  | 'Scrum Master'
  | 'Product Owner'
  | 'Team Lead'
  | 'Developer'
  | 'QA Engineer'
  | 'Viewer';

export interface RolePermission {
  id: string;
  name: ExtendedRoleName;
  description: string;
  isSystem: boolean;
  memberCount: number;
  permissions: {
    workspaces: ('create' | 'edit' | 'delete' | 'archive')[];
    projects: ('create' | 'edit' | 'delete' | 'view')[];
    sprints: ('manage' | 'view' | 'close')[];
    aiFeatures: ('run_simulations' | 'apply_recommendations' | 'view_analytics')[];
    admin: ('user_manage' | 'role_manage' | 'billing' | 'audit_logs' | 'system_config')[];
  };
}

export interface SystemPreferences {
  appearance: {
    theme: 'light' | 'dark' | 'system';
    primaryColor: string;
    accentColor: string;
    sidebarStyle: 'default' | 'compact' | 'icons';
    cardDensity: 'comfortable' | 'compact';
    fontSize: 'sm' | 'md' | 'lg';
    borderRadius: 'sm' | 'md' | 'lg' | 'full';
    animationsEnabled: boolean;
  };
  account: {
    displayName: string;
    username: string;
    emailPreferences: boolean;
    phoneNumber: string;
    profileVisibility: 'public' | 'team' | 'private';
    defaultLandingPage: string;
    defaultDashboard: string;
    autoSaveEnabled: boolean;
    defaultProjectKey: string;
    defaultSprintId: string;
  };
  languageAndRegion: {
    language: string;
    timeZone: string;
    country: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    numberFormat: string;
    currency: string;
    firstDayOfWeek: 'Monday' | 'Sunday';
  };
  aiPersonalization: {
    assistantEnabled: boolean;
    autoRecommendations: boolean;
    autoSprintSuggestions: boolean;
    riskAnalysisEnabled: boolean;
    aiSummaries: boolean;
    smartPrioritization: boolean;
    aiReportGeneration: boolean;
    predictiveInsights: boolean;
    confidenceThreshold: number; // 50 - 95
  };
  accessibility: {
    highContrastMode: boolean;
    reducedMotion: boolean;
    keyboardNavigation: boolean;
    focusIndicators: boolean;
    screenReaderLabels: boolean;
    largeText: boolean;
    accessibleColorPalette: boolean;
  };
  integrations: {
    github: { connected: boolean; repo: string; lastSync: string };
    gitlab: { connected: boolean; project: string; lastSync: string };
    jira: { connected: boolean; domain: string; lastSync: string };
    slack: { connected: boolean; channel: string; lastSync: string };
    msTeams: { connected: boolean; team: string; lastSync: string };
    googleCalendar: { connected: boolean; account: string; lastSync: string };
    outlookCalendar: { connected: boolean; account: string; lastSync: string };
    zoom: { connected: boolean; account: string; lastSync: string };
    webhookUrl: string;
  };
}

export interface UserSession {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  loginTime: string;
  isCurrent: boolean;
}

export interface LoginHistoryRecord {
  id: string;
  timestamp: string;
  status: 'success' | 'failed';
  ipAddress: string;
  device: string;
  browser: string;
  location: string;
  failureReason?: string;
}

export interface SecurityStatus {
  securityScore: number;
  accountProtectionStatus: 'Protected' | 'Action Needed' | 'Critical';
  passwordStrength: 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
  passwordLastChanged: string;
  twoFactorEnabled: boolean;
  activeSessionsCount: number;
  trustedDevicesCount: number;
  recoveryEmail: string;
  recoveryPhone: string;
  backupCodesRemaining: number;
  privacy: {
    profileVisibility: 'public' | 'team' | 'private';
    emailVisibility: 'public' | 'team' | 'private';
    activityVisibility: 'public' | 'team' | 'private';
    aiDataUsageConsent: boolean;
    analyticsConsent: boolean;
  };
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  onlineUsers: number;
  totalOrganizations: number;
  totalWorkspaces: number;
  totalProjects: number;
  activeSprints: number;
  aiUsageCredits: number;
  storageUsageGb: number;
  apiRequestsToday: number;
  securityAlertsCount: number;
  pendingInvitationsCount: number;
}

export interface UserInvitation {
  id: string;
  email: string;
  role: UserRole | string;
  department: string;
  team: string;
  workspace: string;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

// PART 9 - SECTION 1: AI AGENTS & WORKFLOW AUTOMATION
export interface AIAgent {
  id: string;
  name: string;
  type: 'Sprint Planning' | 'Task Prioritization' | 'Risk Prediction' | 'Resource Allocation' | 'Report Generation' | 'Notification' | 'Meeting Summary' | 'Documentation Assistant' | 'Retrospective Assistant' | 'Productivity Coach';
  status: 'Idle' | 'Running' | 'Scheduled' | 'Error';
  lastRun: string;
  successRate: number; // percentage
  avgExecutionTimeMs: number;
  totalExecutions: number;
  description: string;
  version: string;
  autoExecute: boolean;
  capabilities: string[];
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay' | 'approval' | 'ai_block' | 'schedule';
  label: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  conditionValue?: boolean;
}

export interface WorkflowAutomation {
  id: string;
  name: string;
  description: string;
  triggerEvent: string;
  enabled: boolean;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  retryLogic: { maxRetries: number; backoffSeconds: number };
  version: number;
  lastExecuted?: string;
  executionCount: number;
  successCount: number;
}

export interface AIPromptTemplate {
  id: string;
  title: string;
  category: 'Sprint Analysis' | 'Risk Assessment' | 'Task Drafting' | 'Meeting Summary' | 'Code Review' | 'Custom';
  promptText: string;
  variables: string[];
  version: string;
  isFavorite: boolean;
  updatedAt: string;
  usageCount: number;
}

export interface ExecutionLogRecord {
  id: string;
  workflowId?: string;
  agentId?: string;
  name: string;
  type: 'Workflow' | 'Agent' | 'Prompt Job';
  status: 'Success' | 'Failure' | 'In Progress';
  timestamp: string;
  durationMs: number;
  logOutput: string;
  retryCount: number;
}

// PART 9 - SECTION 2: SEARCH, KNOWLEDGE MANAGEMENT & RAG
export interface KnowledgeArticle {
  id: string;
  title: string;
  category: 'SOP' | 'Sprint Best Practices' | 'Architecture Wiki' | 'FAQ' | 'Team Playbook';
  content: string; // Markdown / Rich text
  tags: string[];
  author: string;
  viewsCount: number;
  helpfulCount: number;
  updatedAt: string;
  status: 'Published' | 'Draft' | 'Archived';
  chunkCount?: number;
}

export interface RAGDocument {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'md' | 'txt';
  fileSizeMb: number;
  uploadedBy: string;
  uploadedAt: string;
  chunkCount: number;
  vectorIndexed: boolean;
  summary: string;
  tags: string[];
}

export interface GlobalSearchResult {
  id: string;
  title: string;
  type: 'Project' | 'Task' | 'Sprint' | 'Document' | 'User' | 'Message' | 'Report';
  snippet: string;
  urlTab: string;
  relevanceScore: number;
}

// PART 9 - SECTION 3: COLLABORATION, COMMUNICATION & PRODUCTIVITY
export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  reactions: { emoji: string; count: number; userIds: string[] }[];
  isPinned?: boolean;
  attachments?: { name: string; url: string; type: string }[];
  threadCount?: number;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'sprint' | 'direct';
  topic: string;
  memberCount: number;
  unreadCount: number;
}

export interface VideoMeeting {
  id: string;
  title: string;
  provider: 'Google Meet' | 'Microsoft Teams' | 'Zoom';
  scheduledTime: string;
  durationMinutes: number;
  meetingUrl: string;
  attendees: string[];
  aiSummary?: string;
  actionItems?: string[];
  status: 'Scheduled' | 'In Progress' | 'Completed';
}

export interface WhiteboardElement {
  id: string;
  type: 'sticky' | 'shape' | 'text' | 'drawing';
  x: number;
  y: number;
  content: string;
  color: string;
  author: string;
}

// PART 9 - SECTION 4: INTEGRATIONS & PLUGINS
export interface ThirdPartyIntegration {
  id: string;
  name: string;
  category: 'Project Management' | 'Communication' | 'Version Control' | 'Cloud Storage' | 'Calendar' | 'Auth';
  connected: boolean;
  status: 'Healthy' | 'Warning' | 'Disconnected';
  lastSyncTime: string;
  apiRequestsCount: number;
  icon: string;
  configUrl?: string;
}

export interface PluginItem {
  id: string;
  name: string;
  developer: string;
  category: 'Productivity' | 'Analytics' | 'AI Modules' | 'DevOps';
  installed: boolean;
  enabled: boolean;
  rating: number;
  version: string;
  description: string;
}

export interface WebhookEndpoint {
  id: string;
  name: string;
  targetUrl: string;
  events: string[];
  secretKey: string;
  active: boolean;
  lastDeliveryStatus: 'Success' | 'Failed' | 'Never';
}

// PART 9 - SECTION 5: OFFLINE, PWA & DEVICE
export interface OfflineSyncStatus {
  isOnline: boolean;
  pendingQueueCount: number;
  lastSyncTimestamp: string;
  storageUsageMb: number;
  syncState: 'Idle' | 'Syncing' | 'Error';
}



