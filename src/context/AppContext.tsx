import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Project,
  Sprint,
  Task,
  TaskStatus,
  RiskPrediction,
  AIRecommendation,
  TeamMember,
  AppNotification,
  AuditLogItem,
  RiskLevel,
  SavedReport,
  ReportTemplate,
  ScheduledReport,
  ReportExecutionHistory,
  NotificationPreferences,
  ActivityFeedItem,
  Announcement,
  ReportType,
  ReportFormat,
  ReportScheduleFrequency,
  UserProfile,
  Workspace,
  Department,
  OrganizationTeam,
  OrgMember,
  RolePermission,
  SystemPreferences,
  UserSession,
  LoginHistoryRecord,
  SecurityStatus,
  AdminStats,
  UserInvitation,
} from '../types';
import {
  mockUserProfile,
  mockWorkspaces,
  mockDepartments,
  mockOrganizationTeams,
  mockOrgMembers,
  mockRolePermissions,
  mockSystemPreferences,
  mockUserSessions,
  mockLoginHistory,
  mockSecurityStatus,
  mockAdminStats,
  mockUserInvitations,
} from '../data/enterpriseData';
import {
  mockCurrentUser,
  mockProjects,
  mockActiveSprint,
  mockTasks,
  mockRiskPredictions,
  mockAIRecommendations,
  mockTeamMembers,
  mockNotifications,
  mockAuditLogs,
} from '../data/mockData';
import {
  mockReportTemplates,
  mockSavedReports,
  mockScheduledReports,
  mockReportHistory,
} from '../data/reportsData';
import {
  mockDefaultPreferences,
  mockExpandedNotifications,
  mockActivityFeed,
  mockAnnouncements,
} from '../data/notificationsData';
import { calculateSprintHealth } from '../services/aiPredictionService';
import { socketService } from '../services/socketService';

export type ActiveTab =
  | 'landing'
  | 'dashboard'
  | 'board'
  | 'analytics'
  | 'simulator'
  | 'teams'
  | 'reports'
  | 'notifications'
  | 'settings'
  | 'profile'
  | 'workspace'
  | 'organization'
  | 'security'
  | 'admin'
  | 'docs'
  | 'ai-agents'
  | 'ai-workflows'
  | 'ai-automation'
  | 'ai-prompts'
  | 'ai-history'
  | 'search'
  | 'knowledge'
  | 'collaboration'
  | 'chat'
  | 'meetings'
  | 'calendar'
  | 'whiteboard'
  | 'integrations'
  | 'plugins'
  | 'webhooks'
  | 'pwa-offline';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  goBack: () => void;
  previousTab: ActiveTab | null;
  currentUser: User;
  setRole: (role: UserRole) => void;
  projects: Project[];
  activeProject: Project;
  setActiveProject: (proj: Project) => void;
  activeSprint: Sprint;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'riskLevel'>) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  toggleTaskBlocker: (taskId: string, blockerReason?: string) => void;
  deleteTask: (taskId: string) => void;
  riskPredictions: RiskPrediction[];
  aiRecommendations: AIRecommendation[];
  applyRecommendation: (recId: string) => void;
  teamMembers: TeamMember[];

  // Notification State & Actions
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  archiveNotification: (id: string) => void;
  pinNotification: (id: string) => void;
  snoozeNotification: (id: string, durationHours: number) => void;
  clearNotifications: () => void;

  // Preferences, Activity Feed & Announcements
  preferences: NotificationPreferences;
  updatePreferences: (newPrefs: Partial<NotificationPreferences>) => void;
  activityFeed: ActivityFeedItem[];
  addActivityItem: (item: Omit<ActivityFeedItem, 'id' | 'timestamp'>) => void;
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;

  // Reports State & Actions
  savedReports: SavedReport[];
  reportTemplates: ReportTemplate[];
  scheduledReports: ScheduledReport[];
  reportHistory: ReportExecutionHistory[];
  saveReport: (report: Omit<SavedReport, 'id' | 'createdAt' | 'updatedAt'>) => SavedReport;
  deleteSavedReport: (id: string) => void;
  createSchedule: (schedule: Omit<ScheduledReport, 'id' | 'nextRunAt'>) => void;
  toggleScheduleStatus: (id: string) => void;
  deleteScheduledReport: (id: string) => void;
  runReportNow: (reportId: string, format?: ReportFormat) => void;

  // Enterprise Part 7 States & Actions
  userProfile: UserProfile;
  updateUserProfile: (updated: Partial<UserProfile>) => void;
  workspaces: Workspace[];
  addWorkspace: (ws: Omit<Workspace, 'id' | 'createdAt' | 'memberCount' | 'projectCount'>) => void;
  updateWorkspace: (id: string, updated: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;
  departments: Department[];
  organizationTeams: OrganizationTeam[];
  addTeam: (team: Omit<OrganizationTeam, 'id' | 'sprintVelocityAvg' | 'activeProjectsCount'>) => void;
  deleteTeam: (id: string) => void;
  orgMembers: OrgMember[];
  addOrgMember: (member: Omit<OrgMember, 'id' | 'joinedDate' | 'lastActive'>) => void;
  updateOrgMember: (id: string, updated: Partial<OrgMember>) => void;
  deleteOrgMember: (id: string) => void;
  rolePermissions: RolePermission[];
  updateRolePermissions: (roleId: string, permissions: RolePermission['permissions']) => void;
  systemPreferences: SystemPreferences;
  updateSystemPreferences: (updated: Partial<SystemPreferences>) => void;
  userSessions: UserSession[];
  terminateSession: (id: string) => void;
  terminateAllOtherSessions: () => void;
  loginHistory: LoginHistoryRecord[];
  securityStatus: SecurityStatus;
  updateSecurityStatus: (updated: Partial<SecurityStatus>) => void;
  adminStats: AdminStats;
  userInvitations: UserInvitation[];
  createInvitation: (inv: Omit<UserInvitation, 'id' | 'invitedBy' | 'invitedAt' | 'expiresAt' | 'status'>) => void;
  cancelInvitation: (id: string) => void;

  // UI & Infrastructure
  auditLogs: AuditLogItem[];
  addAuditLog: (action: string, details: string) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  riskSensitivity: 'Conservative' | 'Balanced' | 'Aggressive';
  setRiskSensitivity: (sensitivity: 'Conservative' | 'Balanced' | 'Aggressive') => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<ActiveTab>('landing');
  const [tabHistory, setTabHistory] = useState<ActiveTab[]>([]);

  const handleSetActiveTab = (newTab: ActiveTab) => {
    if (newTab !== activeTab) {
      setTabHistory((prev) => [...prev, activeTab]);
      setActiveTabState(newTab);
    }
  };

  const goBack = () => {
    if (tabHistory.length > 0) {
      const prev = tabHistory[tabHistory.length - 1];
      setTabHistory((history) => history.slice(0, history.length - 1));
      setActiveTabState(prev);
    } else {
      setActiveTabState('landing');
    }
  };

  const previousTab = tabHistory.length > 0 ? tabHistory[tabHistory.length - 1] : null;
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [activeProject, setActiveProject] = useState<Project>(mockProjects[0]);
  const [activeSprint, setActiveSprint] = useState<Sprint>(mockActiveSprint);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [riskPredictions, setRiskPredictions] = useState<RiskPrediction[]>(mockRiskPredictions);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>(mockAIRecommendations);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [notifications, setNotifications] = useState<AppNotification[]>(mockExpandedNotifications);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(mockAuditLogs);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskSensitivity, setRiskSensitivity] = useState<'Conservative' | 'Balanced' | 'Aggressive'>('Balanced');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reports & Notifications State
  const [savedReports, setSavedReports] = useState<SavedReport[]>(mockSavedReports);
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>(mockReportTemplates);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>(mockScheduledReports);
  const [reportHistory, setReportHistory] = useState<ReportExecutionHistory[]>(mockReportHistory);
  const [preferences, setPreferences] = useState<NotificationPreferences>(mockDefaultPreferences);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>(mockActivityFeed);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);

  // Enterprise Part 7 States
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [departments] = useState<Department[]>(mockDepartments);
  const [organizationTeams, setOrganizationTeams] = useState<OrganizationTeam[]>(mockOrganizationTeams);
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>(mockOrgMembers);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>(mockRolePermissions);
  const [systemPreferences, setSystemPreferences] = useState<SystemPreferences>(mockSystemPreferences);
  const [userSessions, setUserSessions] = useState<UserSession[]>(mockUserSessions);
  const [loginHistory] = useState<LoginHistoryRecord[]>(mockLoginHistory);
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>(mockSecurityStatus);
  const [adminStats] = useState<AdminStats>(mockAdminStats);
  const [userInvitations, setUserInvitations] = useState<UserInvitation[]>(mockUserInvitations);

  // Enterprise Handlers
  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
    setToastMessage('User profile updated successfully.');
    addAuditLog('Profile Update', 'Updated user profile information');
  };

  const addWorkspace = (ws: Omit<Workspace, 'id' | 'createdAt' | 'memberCount' | 'projectCount'>) => {
    const newWs: Workspace = {
      ...ws,
      id: `ws-${100 + workspaces.length + 1}`,
      createdAt: new Date().toISOString().substring(0, 10),
      memberCount: 1,
      projectCount: 0,
    };
    setWorkspaces((prev) => [newWs, ...prev]);
    setToastMessage(`Workspace "${newWs.name}" created successfully.`);
    addAuditLog('Workspace Created', `Created workspace: ${newWs.name}`);
  };

  const updateWorkspace = (id: string, updated: Partial<Workspace>) => {
    setWorkspaces((prev) => prev.map((w) => (w.id === id ? { ...w, ...updated } : w)));
    setToastMessage('Workspace settings updated.');
    addAuditLog('Workspace Updated', `Updated workspace ID: ${id}`);
  };

  const deleteWorkspace = (id: string) => {
    setWorkspaces((prev) => prev.filter((w) => w.id !== id));
    setToastMessage('Workspace deleted.');
    addAuditLog('Workspace Deleted', `Deleted workspace ID: ${id}`);
  };

  const addTeam = (teamData: Omit<OrganizationTeam, 'id' | 'sprintVelocityAvg' | 'activeProjectsCount'>) => {
    const newTeam: OrganizationTeam = {
      ...teamData,
      id: `team-${Date.now()}`,
      sprintVelocityAvg: 30,
      activeProjectsCount: 1,
    };
    setOrganizationTeams((prev) => [...prev, newTeam]);
    setToastMessage(`Team "${newTeam.name}" created.`);
    addAuditLog('Team Created', `Created team ${newTeam.name}`);
  };

  const deleteTeam = (id: string) => {
    setOrganizationTeams((prev) => prev.filter((t) => t.id !== id));
    setToastMessage('Team removed.');
    addAuditLog('Team Removed', `Removed team ID ${id}`);
  };

  const addOrgMember = (memberData: Omit<OrgMember, 'id' | 'joinedDate' | 'lastActive'>) => {
    const newMember: OrgMember = {
      ...memberData,
      id: `usr-${Date.now()}`,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastActive: 'Just now',
    };
    setOrgMembers((prev) => [newMember, ...prev]);
    setToastMessage(`Member ${newMember.fullName} added.`);
    addAuditLog('Member Added', `Added ${newMember.email} to organization`);
  };

  const updateOrgMember = (id: string, updated: Partial<OrgMember>) => {
    setOrgMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
    setToastMessage('Member record updated.');
    addAuditLog('Member Updated', `Updated member ID ${id}`);
  };

  const deleteOrgMember = (id: string) => {
    setOrgMembers((prev) => prev.filter((m) => m.id !== id));
    setToastMessage('Member removed from organization.');
    addAuditLog('Member Removed', `Removed member ID ${id}`);
  };

  const updateRolePermissions = (roleId: string, permissions: RolePermission['permissions']) => {
    setRolePermissions((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions } : r))
    );
    setToastMessage('Role permissions updated.');
    addAuditLog('Role Permissions Updated', `Updated permissions for role ID ${roleId}`);
  };

  const updateSystemPreferences = (updated: Partial<SystemPreferences>) => {
    setSystemPreferences((prev) => ({
      ...prev,
      ...updated,
      appearance: { ...prev.appearance, ...(updated.appearance || {}) },
      account: { ...prev.account, ...(updated.account || {}) },
      languageAndRegion: { ...prev.languageAndRegion, ...(updated.languageAndRegion || {}) },
      aiPersonalization: { ...prev.aiPersonalization, ...(updated.aiPersonalization || {}) },
      accessibility: { ...prev.accessibility, ...(updated.accessibility || {}) },
      integrations: { ...prev.integrations, ...(updated.integrations || {}) },
    }));
    setToastMessage('Preferences saved.');
    addAuditLog('Preferences Changed', 'Updated system preferences');
  };

  const terminateSession = (id: string) => {
    setUserSessions((prev) => prev.filter((s) => s.id !== id));
    setToastMessage('Session terminated successfully.');
    addAuditLog('Session Terminated', `Terminated session ID ${id}`);
  };

  const terminateAllOtherSessions = () => {
    setUserSessions((prev) => prev.filter((s) => s.isCurrent));
    setToastMessage('All other active sessions logged out.');
    addAuditLog('Sessions Cleared', 'Terminated all active user sessions except current');
  };

  const updateSecurityStatus = (updated: Partial<SecurityStatus>) => {
    setSecurityStatus((prev) => ({ ...prev, ...updated }));
    setToastMessage('Security settings updated.');
    addAuditLog('Security Settings Updated', 'Updated account security configuration');
  };

  const createInvitation = (invData: Omit<UserInvitation, 'id' | 'invitedBy' | 'invitedAt' | 'expiresAt' | 'status'>) => {
    const newInv: UserInvitation = {
      ...invData,
      id: `inv-${Date.now()}`,
      invitedBy: currentUser.name,
      invitedAt: new Date().toISOString().substring(0, 10),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      status: 'pending',
    };
    setUserInvitations((prev) => [newInv, ...prev]);
    setToastMessage(`Invitation sent to ${newInv.email}`);
    addAuditLog('Invitation Sent', `Sent invitation to ${newInv.email}`);
  };

  const cancelInvitation = (id: string) => {
    setUserInvitations((prev) => prev.filter((i) => i.id !== id));
    setToastMessage('Invitation cancelled.');
    addAuditLog('Invitation Cancelled', `Cancelled invitation ID ${id}`);
  };

  // Connect real-time socket service
  useEffect(() => {
    socketService.connect();

    const unsubNotif = socketService.onNotification((newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
      setToastMessage(`🔔 ${newNotif.title}: ${newNotif.message}`);
    });

    const unsubAct = socketService.onActivity((act) => {
      setActivityFeed((prev) => [act, ...prev]);
    });

    return () => {
      unsubNotif();
      unsubAct();
      socketService.disconnect();
    };
  }, []);

  // Recalculate sprint metrics whenever tasks change
  useEffect(() => {
    const total = tasks.reduce((sum, t) => sum + t.storyPoints, 0);
    const completed = tasks.filter((t) => t.status === 'done').reduce((sum, t) => sum + t.storyPoints, 0);

    const { score, riskLevel } = calculateSprintHealth(tasks, total, completed, activeSprint.targetVelocity);

    setActiveSprint((prev) => ({
      ...prev,
      totalPoints: total,
      completedPoints: completed,
      healthScore: score,
      riskLevel,
    }));
  }, [tasks, activeSprint.targetVelocity]);

  const setRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
    addAuditLog('User Role Switch', `Changed active role to ${role}`);
  };

  const addTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'riskLevel'>) => {
    const newId = `AP-${100 + tasks.length + 1}`;
    const newTask: Task = {
      ...newTaskData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      riskLevel: newTaskData.storyPoints > 7 ? 'high' : newTaskData.blocked ? 'critical' : 'low',
    };

    setTasks((prev) => [newTask, ...prev]);

    // Background sync to backend API & MongoDB
    fetch('/api/v1/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    }).catch(() => {});

    addAuditLog('Task Created', `Created task ${newId} (${newTask.title}) assigned to ${newTask.assigneeId}`);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Task Created',
      message: `Task ${newId} (${newTask.storyPoints} pts) added to Sprint backlog.`,
      type: 'task',
      category: 'task',
      priority: 'medium',
      timestamp: 'Just now',
      read: false,
      linkTab: 'board',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addActivityItem({
      userName: currentUser.name,
      userRole: currentUser.role,
      userAvatar: currentUser.avatar,
      action: 'Created Task',
      targetName: `${newId}: ${newTask.title}`,
      targetType: 'task',
      projectKey: activeProject.key,
      category: 'task',
      details: `${newTask.storyPoints} Story Points assigned`,
    });
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    // Background sync to backend API & MongoDB
    fetch(`/api/v1/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {});

    addAuditLog('Task Status Updated', `Moved ${taskId} to ${newStatus.replace('_', ' ').toUpperCase()}`);

    addActivityItem({
      userName: currentUser.name,
      userRole: currentUser.role,
      userAvatar: currentUser.avatar,
      action: `Moved status to ${newStatus.replace('_', ' ').toUpperCase()}`,
      targetName: taskId,
      targetType: 'task',
      projectKey: activeProject.key,
      category: 'task',
    });
  };

  const toggleTaskBlocker = (taskId: string, blockerReason?: string) => {
    let nextBlocked = false;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isBlockedNow = !t.blocked;
          nextBlocked = isBlockedNow;
          return {
            ...t,
            blocked: isBlockedNow,
            blockerReason: isBlockedNow ? blockerReason || 'Work dependent on external review.' : undefined,
            riskLevel: isBlockedNow ? ('critical' as RiskLevel) : ('low' as RiskLevel),
          };
        }
        return t;
      })
    );

    // Background sync to backend API & MongoDB
    fetch(`/api/v1/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocked: nextBlocked, blockerReason }),
    }).catch(() => {});

    addAuditLog('Blocker Flagged', `Toggled blocker on ${taskId}. Reason: ${blockerReason || 'Cleared'}`);
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    // Background sync to backend API & MongoDB
    fetch(`/api/v1/tasks/${taskId}`, {
      method: 'DELETE',
    }).catch(() => {});

    addAuditLog('Task Deleted', `Removed ${taskId} from sprint backlog.`);
  };

  const applyRecommendation = (recId: string) => {
    setAiRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, applied: true } : r))
    );

    if (recId === 'rec-1') {
      setTasks((prev) =>
        prev.map((t) => (t.id === 'AP-106' ? { ...t, assigneeId: 'm-3' } : t))
      );
      setTeamMembers((prev) =>
        prev.map((m) => {
          if (m.id === 'm-5') return { ...m, assignedPoints: m.assignedPoints - 5, utilizationPercentage: 80, status: 'Optimal' };
          if (m.id === 'm-3') return { ...m, assignedPoints: m.assignedPoints + 5, utilizationPercentage: 108, status: 'Optimal' };
          return m;
        })
      );
    } else if (recId === 'rec-2') {
      toggleTaskBlocker('AP-102');
    } else if (recId === 'rec-3') {
      deleteTask('AP-108');
    }

    addAuditLog('AI Recommendation Applied', `Applied recommendation ${recId}`);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Recommendation Applied',
      message: 'AI optimization applied successfully! Sprint Health improved.',
      type: 'ai',
      category: 'ai',
      priority: 'high',
      timestamp: 'Just now',
      read: false,
      linkTab: 'dashboard',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Notification Actions
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setToastMessage('Marked all notifications as read.');
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const archiveNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, archived: true } : n))
    );
    setToastMessage('Notification archived.');
  };

  const pinNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const snoozeNotification = (id: string, durationHours: number) => {
    const snoozeUntil = new Date(Date.now() + durationHours * 3600000).toISOString();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, snoozedUntil: snoozeUntil } : n))
    );
    setToastMessage(`Snoozed notification for ${durationHours} hour(s).`);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setToastMessage('Cleared all active notifications.');
  };

  // Notification Preferences & Activity Feed
  const updatePreferences = (newPrefs: Partial<NotificationPreferences>) => {
    setPreferences((prev) => ({
      ...prev,
      ...newPrefs,
      channels: { ...prev.channels, ...(newPrefs.channels || {}) },
      quietHours: { ...prev.quietHours, ...(newPrefs.quietHours || {}) },
      categories: { ...prev.categories, ...(newPrefs.categories || {}) },
    }));
    setToastMessage('Notification preferences updated successfully.');
  };

  const addActivityItem = (item: Omit<ActivityFeedItem, 'id' | 'timestamp'>) => {
    const newAct: ActivityFeedItem = {
      ...item,
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
    };
    setActivityFeed((prev) => [newAct, ...prev]);
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    // Also broadcast notification
    const newNotif: AppNotification = {
      id: `notif-ann-${Date.now()}`,
      title: `📢 ${newAnn.title}`,
      message: newAnn.content,
      type: 'announcement',
      category: 'announcement',
      priority: newAnn.priority === 'broadcast' ? 'critical' : 'high',
      timestamp: 'Just now',
      read: false,
      pinned: newAnn.pinned,
      linkTab: 'notifications',
      actor: {
        name: newAnn.author,
        avatar: newAnn.authorAvatar,
      },
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setToastMessage(`Broadcast announcement created: ${newAnn.title}`);
  };

  // Reports Management Actions
  const saveReport = (reportData: Omit<SavedReport, 'id' | 'createdAt' | 'updatedAt'>): SavedReport => {
    const newReport: SavedReport = {
      ...reportData,
      id: `rep-saved-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setSavedReports((prev) => [newReport, ...prev]);
    addAuditLog('Saved Custom Report Created', `Saved report "${newReport.title}" (${newReport.type})`);
    setToastMessage(`Custom Report "${newReport.title}" saved successfully.`);
    return newReport;
  };

  const deleteSavedReport = (id: string) => {
    setSavedReports((prev) => prev.filter((r) => r.id !== id));
    setToastMessage('Saved report deleted.');
  };

  const createSchedule = (scheduleData: Omit<ScheduledReport, 'id' | 'nextRunAt'>) => {
    const newSched: ScheduledReport = {
      ...scheduleData,
      id: `sched-${Date.now()}`,
      nextRunAt: new Date(Date.now() + 86400000).toLocaleString(),
    };
    setScheduledReports((prev) => [newSched, ...prev]);
    addAuditLog('Report Schedule Created', `Scheduled report "${newSched.reportTitle}" (${newSched.frequency})`);
    setToastMessage(`Scheduled report "${newSched.reportTitle}" active.`);
  };

  const toggleScheduleStatus = (id: string) => {
    setScheduledReports((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s))
    );
  };

  const deleteScheduledReport = (id: string) => {
    setScheduledReports((prev) => prev.filter((s) => s.id !== id));
    setToastMessage('Report schedule deleted.');
  };

  const runReportNow = (reportId: string, format: ReportFormat = 'pdf') => {
    const rep = savedReports.find((r) => r.id === reportId) || savedReports[0];
    const newExec: ReportExecutionHistory = {
      id: `exec-${Date.now()}`,
      reportId: rep ? rep.id : 'manual-1',
      reportTitle: rep ? rep.title : 'Sprint Health Report',
      type: rep ? rep.type : 'sprint',
      generatedBy: currentUser.name,
      generatedAt: new Date().toLocaleString(),
      format,
      status: 'completed',
      fileSize: '1.2 MB',
      executionDurationMs: Math.floor(Math.random() * 400) + 150,
    };
    setReportHistory((prev) => [newExec, ...prev]);
    setToastMessage(`Ran report "${newExec.reportTitle}". Export ready in ${format.toUpperCase()}`);
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      user: `${currentUser.name} (${currentUser.role})`,
      action,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab: handleSetActiveTab,
        goBack,
        previousTab,
        currentUser,
        setRole,
        projects,
        activeProject,
        setActiveProject,
        activeSprint,
        tasks,
        addTask,
        updateTaskStatus,
        toggleTaskBlocker,
        deleteTask,
        riskPredictions,
        aiRecommendations,
        applyRecommendation,
        teamMembers,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        archiveNotification,
        pinNotification,
        snoozeNotification,
        clearNotifications,
        preferences,
        updatePreferences,
        activityFeed,
        addActivityItem,
        announcements,
        addAnnouncement,
        savedReports,
        reportTemplates,
        scheduledReports,
        reportHistory,
        saveReport,
        deleteSavedReport,
        createSchedule,
        toggleScheduleStatus,
        deleteScheduledReport,
        runReportNow,
        userProfile,
        updateUserProfile,
        workspaces,
        addWorkspace,
        updateWorkspace,
        deleteWorkspace,
        departments,
        organizationTeams,
        addTeam,
        deleteTeam,
        orgMembers,
        addOrgMember,
        updateOrgMember,
        deleteOrgMember,
        rolePermissions,
        updateRolePermissions,
        systemPreferences,
        updateSystemPreferences,
        userSessions,
        terminateSession,
        terminateAllOtherSessions,
        loginHistory,
        securityStatus,
        updateSecurityStatus,
        adminStats,
        userInvitations,
        createInvitation,
        cancelInvitation,
        auditLogs,
        addAuditLog,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        searchQuery,
        setSearchQuery,
        riskSensitivity,
        setRiskSensitivity,
        toastMessage,
        setToastMessage,
      }}
    >
      {children}

      {/* Floating Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white border border-zinc-700 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up text-xs font-semibold">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-zinc-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
