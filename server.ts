import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import { createServer as createHttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  connectMongoDB,
  getMongoDBStatus,
  UserModel,
  ReportModel,
  NotificationModel,
  TaskModel,
} from './src/server/mongodb';

async function startServer() {
  const app = express();
  const httpServer = createHttpServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    },
  });

  const PORT = 3000;

  app.use(express.json());

  // Attempt lazy MongoDB connection
  connectMongoDB().catch((err) => console.log('[MongoDB] Startup connect notice:', err.message));

  // In-memory data store for backend APIs
  const usersStore = [
    {
      id: 'usr-1',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      username: 'sjenkins',
      email: 'sarah.j@agilepulse.ai',
      passwordHash: 'hashed_password_123',
      role: 'Scrum Master',
      organization: 'AgilePulse Inc.',
      jobTitle: 'Senior Scrum Master',
      status: 'Active',
      emailVerified: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];

  let savedReportsStore = [
    {
      id: 'rep-saved-001',
      title: 'Weekly Executive Sprint Briefing',
      type: 'sprint',
      createdBy: 'Sarah Jenkins',
      createdAt: '2026-07-15',
      isScheduled: true,
      scheduleFrequency: 'weekly',
    },
  ];

  let notificationsStore = [
    {
      id: 'notif-1',
      title: 'High Risk Flagged on Task AP-102',
      message: 'Task AP-102 flagged as Critical Blocker.',
      type: 'risk',
      category: 'risk',
      priority: 'critical',
      timestamp: '10 mins ago',
      read: false,
    },
  ];

  let preferencesStore = {
    channels: { inApp: true, email: true, browserPush: true, sound: true },
    quietHours: { enabled: false, startTime: '22:00', endTime: '07:00', timezone: 'PST' },
    aiDigest: 'daily',
    categories: {
      project: true,
      sprint: true,
      task: true,
      mention: true,
      ai: true,
      risk: true,
      announcement: true,
      system: true,
      compliance: true,
    },
    soundVolume: 80,
  };

  // In-memory Task store
  let tasksStore: any[] = [
    {
      id: 'AP-101',
      title: 'Implement Auth0 & OAuth2 authentication layer',
      status: 'done',
      priority: 'high',
      storyPoints: 5,
      assigneeName: 'Marcus Vance',
      sprintName: 'Sprint 24',
      blocked: false,
      createdAt: '2026-07-10',
    },
    {
      id: 'AP-102',
      title: 'Resolve SecOps critical compliance review blocker',
      status: 'in_progress',
      priority: 'critical',
      storyPoints: 8,
      assigneeName: 'Sarah Jenkins',
      sprintName: 'Sprint 24',
      blocked: true,
      blockerReason: 'Awaiting third-party security auditor sign-off on tokens.',
      createdAt: '2026-07-11',
    },
    {
      id: 'AP-103',
      title: 'Build automated AI Sprint Health prediction pipeline',
      status: 'in_progress',
      priority: 'high',
      storyPoints: 5,
      assigneeName: 'David Kim',
      sprintName: 'Sprint 24',
      blocked: false,
      createdAt: '2026-07-12',
    },
    {
      id: 'AP-104',
      title: 'Optimize Recharts burndown rendering latency',
      status: 'code_review',
      priority: 'medium',
      storyPoints: 3,
      assigneeName: 'Elena Rostova',
      sprintName: 'Sprint 24',
      blocked: false,
      createdAt: '2026-07-13',
    },
    {
      id: 'AP-105',
      title: 'Implement WebSocket bidirectional telemetry updates',
      status: 'testing',
      priority: 'medium',
      storyPoints: 5,
      assigneeName: 'Priya Sharma',
      sprintName: 'Sprint 24',
      blocked: false,
      createdAt: '2026-07-14',
    },
  ];

  // In-memory Chat Messages store
  let chatMessagesStore: any[] = [
    {
      id: 'msg-1',
      channelId: 'chan-1',
      senderId: 'usr-1',
      senderName: 'Sarah Jenkins',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      content: 'Morning team! Standup starts in 10 minutes. Please update your Sprint 24 cards.',
      timestamp: '09:00 AM',
    },
    {
      id: 'msg-2',
      channelId: 'chan-1',
      senderId: 'usr-2',
      senderName: 'Marcus Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      content: 'PR for AP-101 OAuth2 is up for code review. All unit tests passing.',
      timestamp: '09:12 AM',
    },
  ];

  // In-memory Audit Logs store
  let auditLogsStore: any[] = [
    { id: 'aud-1', action: 'System Initialization', user: 'System', timestamp: new Date().toISOString(), status: 'Success', ip: '127.0.0.1' },
    { id: 'aud-2', action: 'Security Audit Check', user: 'Sarah Jenkins', timestamp: new Date().toISOString(), status: 'Success', ip: '192.168.1.10' },
  ];

  // Socket.IO event handlers
  io.on('connection', (socket) => {
    console.log('[SocketServer] Client connected:', socket.id);

    socket.on('notification:send', (notif) => {
      notificationsStore.unshift(notif);
      io.emit('notification:new', notif);
    });

    socket.on('activity:send', (act) => {
      io.emit('activity:new', act);
    });

    socket.on('chat:send', (msg) => {
      chatMessagesStore.push(msg);
      io.emit('chat:new', msg);

      // Auto-reply from AI Copilot if mentioned
      if (msg.content && msg.content.toLowerCase().includes('@copilot')) {
        setTimeout(() => {
          const copilotMsg = {
            id: `msg-${Date.now()}`,
            channelId: msg.channelId,
            senderId: 'copilot',
            senderName: 'AgilePulse AI Copilot',
            senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
            content: `🤖 @${msg.senderName}: I analyzed your query! Current Sprint 24 Health is at **84/100 (Optimal)** with 4 days remaining. 28/48 story points completed.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          chatMessagesStore.push(copilotMsg);
          io.emit('chat:new', copilotMsg);
        }, 600);
      }
    });

    socket.on('disconnect', () => {
      console.log('[SocketServer] Client disconnected:', socket.id);
    });
  });

  // System Health & Monitoring Endpoints
  app.get('/api/v1/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'AgilePulse AI Operations Engine',
      version: '2.4.0',
      socketActive: true,
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/v1/health/liveness', (req, res) => {
    res.json({ status: 'alive', timestamp: new Date().toISOString() });
  });

  app.get('/api/v1/health/readiness', (req, res) => {
    const mongoStatus = getMongoDBStatus();
    res.json({
      status: 'ready',
      dependencies: {
        database: mongoStatus.status === 'connected' ? 'mongodb_connected' : 'in_memory_fallback',
        mongodb: mongoStatus,
        redis: 'ready',
        aiService: 'operational',
      },
      timestamp: new Date().toISOString(),
    });
  });

  // ==========================================
  // MONGODB MANAGEMENT APIs
  // ==========================================
  app.get('/api/v1/mongodb/status', (req, res) => {
    const status = getMongoDBStatus();
    res.json({
      success: true,
      data: status,
      instructions: {
        envVariable: 'MONGODB_URI',
        exampleUri: 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/agilepulse?retryWrites=true&w=majority',
      },
    });
  });

  app.post('/api/v1/mongodb/connect', async (req, res) => {
    const { uri } = req.body;
    if (uri) {
      process.env.MONGODB_URI = uri;
    }
    const result = await connectMongoDB();
    const status = getMongoDBStatus();
    res.json({
      success: result.connected,
      message: result.message,
      data: status,
    });
  });

  app.get('/api/v1/monitoring/metrics', (req, res) => {
    res.json({
      success: true,
      metrics: {
        cpuUsagePercent: 24.5,
        memoryUsagePercent: 42.1,
        activeUsersCount: 18,
        apiLatencyMs: 38,
        dbPoolActive: 5,
        uptimeSeconds: Math.floor(process.uptime()),
      },
    });
  });

  app.get('/api/v1/monitoring/logs', (req, res) => {
    res.json({
      success: true,
      logs: [
        { id: 'log-1', timestamp: new Date().toISOString(), level: 'info', category: 'SYSTEM', message: 'Operations engine healthy' },
      ],
    });
  });

  // Auth Routes API v1
  app.post('/api/v1/auth/register', (req, res) => {
    const { firstName, lastName, username, email, password, role } = req.body;
    if (!email || !password || !firstName) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const existing = usersStore.find((u) => u.email === email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      firstName,
      lastName: lastName || '',
      username: username || email.split('@')[0],
      email,
      passwordHash: 'hashed_' + password,
      role: role || 'Developer',
      organization: 'AgilePulse Team',
      jobTitle: role || 'Developer',
      status: 'Active',
      emailVerified: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    usersStore.push(newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user: newUser, tokens: { accessToken: 'jwt_' + Date.now(), expiresIn: '24h' } },
    });
  });

  app.post('/api/v1/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = usersStore.find((u) => u.email === email) || usersStore[0];
    res.json({
      success: true,
      data: { user, tokens: { accessToken: 'jwt_' + Date.now(), expiresIn: '24h' } },
    });
  });

  app.get('/api/v1/auth/me', (req, res) => {
    res.json({ success: true, data: usersStore[0] });
  });

  // ==========================================
  // REPORTS APIs
  // ==========================================
  app.get('/api/v1/reports/saved', async (req, res) => {
    const status = getMongoDBStatus();
    if (status.status === 'connected') {
      try {
        const mongoReports = await ReportModel.find().sort({ createdAt: -1 });
        return res.json({ success: true, db: 'mongodb', count: mongoReports.length, data: mongoReports });
      } catch (e: any) {
        console.error('MongoDB find error:', e.message);
      }
    }
    res.json({ success: true, db: 'memory', count: savedReportsStore.length, data: savedReportsStore });
  });

  app.post('/api/v1/reports/saved', async (req, res) => {
    const newReport = { id: `rep-saved-${Date.now()}`, createdAt: new Date().toISOString(), ...req.body };
    savedReportsStore.unshift(newReport);

    const status = getMongoDBStatus();
    if (status.status === 'connected') {
      try {
        const doc = await ReportModel.create({
          reportId: newReport.id,
          title: newReport.title || 'Executive Report',
          type: newReport.type || 'sprint',
          createdBy: newReport.createdBy || 'Sarah Jenkins',
          isScheduled: newReport.isScheduled || false,
          scheduleFrequency: newReport.scheduleFrequency || 'weekly',
        });
        return res.status(201).json({ success: true, db: 'mongodb', message: 'Report created in MongoDB', data: doc });
      } catch (e: any) {
        console.error('MongoDB create report error:', e.message);
      }
    }

    res.status(201).json({ success: true, db: 'memory', message: 'Report created in memory', data: newReport });
  });

  app.delete('/api/v1/reports/saved/:id', async (req, res) => {
    savedReportsStore = savedReportsStore.filter((r) => r.id !== req.params.id);

    const status = getMongoDBStatus();
    if (status.status === 'connected') {
      try {
        await ReportModel.deleteOne({ reportId: req.params.id });
      } catch (e: any) {
        console.error('MongoDB delete report error:', e.message);
      }
    }

    res.json({ success: true, message: 'Saved report deleted' });
  });

  app.post('/api/v1/reports/export', (req, res) => {
    const { reportTitle, format, recipientEmail } = req.body;
    res.json({
      success: true,
      message: `Export generated in ${format || 'PDF'} format. Link sent to ${recipientEmail || 'user'}`,
      downloadUrl: `/exports/${Date.now()}-report.${format || 'pdf'}`,
    });
  });

  // ==========================================
  // NOTIFICATIONS APIs
  // ==========================================
  app.get('/api/v1/notifications', (req, res) => {
    res.json({ success: true, unreadCount: notificationsStore.filter((n) => !n.read).length, data: notificationsStore });
  });

  app.patch('/api/v1/notifications/:id/read', (req, res) => {
    notificationsStore = notificationsStore.map((n) => (n.id === req.params.id ? { ...n, read: true } : n));
    res.json({ success: true, message: 'Notification marked as read' });
  });

  app.post('/api/v1/notifications/read-all', (req, res) => {
    notificationsStore = notificationsStore.map((n) => ({ ...n, read: true }));
    res.json({ success: true, message: 'All notifications marked as read' });
  });

  app.delete('/api/v1/notifications/:id', (req, res) => {
    notificationsStore = notificationsStore.filter((n) => n.id !== req.params.id);
    res.json({ success: true, message: 'Notification deleted' });
  });

  // ==========================================
  // PREFERENCES APIs
  // ==========================================
  app.get('/api/v1/preferences', (req, res) => {
    res.json({ success: true, data: preferencesStore });
  });

  app.put('/api/v1/preferences', (req, res) => {
    preferencesStore = { ...preferencesStore, ...req.body };
    res.json({ success: true, message: 'Preferences updated successfully', data: preferencesStore });
  });

  // ==========================================
  // TASKS APIs (MongoDB + In-Memory)
  // ==========================================
  app.get('/api/v1/tasks', async (req, res) => {
    const status = getMongoDBStatus();
    if (status.status === 'connected') {
      try {
        const mongoTasks = await TaskModel.find().sort({ createdAt: -1 });
        if (mongoTasks.length > 0) {
          return res.json({ success: true, db: 'mongodb', count: mongoTasks.length, data: mongoTasks });
        }
      } catch (e: any) {
        console.error('MongoDB get tasks error:', e.message);
      }
    }
    res.json({ success: true, db: 'memory', count: tasksStore.length, data: tasksStore });
  });

  app.post('/api/v1/tasks', async (req, res) => {
    const newTask = {
      id: req.body.id || `AP-${100 + tasksStore.length + 1}`,
      createdAt: new Date().toISOString(),
      ...req.body,
    };
    tasksStore.unshift(newTask);

    const status = getMongoDBStatus();
    if (status.status === 'connected') {
      try {
        await TaskModel.create({
          taskId: newTask.id,
          title: newTask.title || 'Untitled Task',
          status: newTask.status || 'todo',
          priority: newTask.priority || 'medium',
          storyPoints: newTask.storyPoints || 3,
          assigneeName: newTask.assigneeName || 'Unassigned',
          sprintName: newTask.sprintName || 'Sprint 24',
          blocked: Boolean(newTask.blocked),
        });
      } catch (e: any) {
        console.error('MongoDB create task error:', e.message);
      }
    }

    io.emit('task:new', newTask);
    res.status(201).json({ success: true, data: newTask });
  });

  app.patch('/api/v1/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    tasksStore = tasksStore.map((t) => (t.id === taskId ? { ...t, ...req.body } : t));

    const status = getMongoDBStatus();
    if (status.status === 'connected') {
      try {
        await TaskModel.updateOne({ taskId }, { $set: req.body });
      } catch (e: any) {
        console.error('MongoDB update task error:', e.message);
      }
    }

    io.emit('task:updated', { id: taskId, updates: req.body });
    res.json({ success: true, message: 'Task updated successfully', data: { id: taskId, ...req.body } });
  });

  app.delete('/api/v1/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    tasksStore = tasksStore.filter((t) => t.id !== taskId);

    const status = getMongoDBStatus();
    if (status.status === 'connected') {
      try {
        await TaskModel.deleteOne({ taskId });
      } catch (e: any) {
        console.error('MongoDB delete task error:', e.message);
      }
    }

    io.emit('task:deleted', { id: taskId });
    res.json({ success: true, message: 'Task deleted successfully' });
  });

  // ==========================================
  // AI PREDICTION & COPILOT APIs
  // ==========================================
  app.post('/api/v1/ai/chat', async (req, res) => {
    const { message, context } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message text is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const hasValidKey = apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.length > 10;

    if (hasValidKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = 'You are AgilePulse AI Copilot, an elite Agile and Scrum intelligence assistant. Provide structured, actionable, and encouraging recommendations with markdown formatting, emoji highlights, and clear steps. Focus on sprint velocity, risk reduction, blockers, and team health.';
        const fullPrompt = `${systemInstruction}\n\nUser Question: ${message}\nContext: ${JSON.stringify(context || {})}`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: fullPrompt,
        });
        const reply = response.text || 'AgilePulse AI has analyzed your request. Keep tasks prioritized and resolve active blockers.';
        return res.json({ success: true, provider: 'gemini', data: { reply } });
      } catch (err: any) {
        console.warn('[Gemini AI] Call failed, using intelligent heuristic fallback:', err.message);
      }
    }

    // Heuristic Fallback
    const lower = message.toLowerCase();
    let reply = `🤖 **AgilePulse AI Copilot Insight**:\n\nBased on your active sprint metrics, team velocity is tracking well at **82% on-time probability**. Key recommendation: ensure task AP-102 (SecOps review) is addressed promptly to unblock downstream dependencies.`;

    if (lower.includes('risk') || lower.includes('block') || lower.includes('delay')) {
      reply = `⚠️ **Critical Risk Assessment**:\n\n- **Primary Blocker**: Task **AP-102** (*SecOps Compliance Review*) is currently blocked, locking 8 story points on the critical path.\n- **Recommended Mitigation**: Decouple the compliance verification behind an active feature flag or run an emergency 15-minute unblocking standup with security leads.`;
    } else if (lower.includes('capacity') || lower.includes('workload') || lower.includes('who')) {
      reply = `📊 **Team Capacity Analysis**:\n\n- **David Kim**: Allocated at **116% capacity** (14 pts assigned vs 12 target).\n- **Marcus Vance**: Available capacity at **35%**.\n- **Action**: Reallocate 3-5 story points from David to Marcus to rebalance workload and prevent burn-out.`;
    } else if (lower.includes('forecast') || lower.includes('completion') || lower.includes('health')) {
      reply = `🎯 **Sprint Health & Completion Forecast**:\n\n- **Current Health Score**: **84/100 (Optimal)**\n- **Committed Points**: 48 pts | **Completed**: 28 pts\n- **Burndown Velocity**: 3.2 pts/day\n- **Estimated Delivery**: 100% chance of completing top 4 critical user stories by sprint deadline.`;
    } else if (lower.includes('recommend') || lower.includes('advice') || lower.includes('improve')) {
      reply = `💡 **Top 3 High-Impact Sprint Recommendations**:\n\n1. **Unblock AP-102**: Coordinate security sign-off or isolate behind feature toggle.\n2. **Rebalance Workload**: Shift user story AP-106 from David Kim to Marcus Vance.\n3. **De-scope Low-Priority Items**: Defer AP-108 to Sprint 25 if QA testing runs over day 12.`;
    }

    return res.json({ success: true, provider: 'heuristic', data: { reply } });
  });

  app.post('/api/v1/ai/predict/sprint', (req, res) => {
    const { velocity = 28, total_story_points = 48, historical_completion_rate = 0.85 } = req.body;
    const expected = Math.round(Math.min(1.0, (Number(velocity) * Number(historical_completion_rate)) / Math.max(Number(total_story_points), 1)) * 100);
    const risk_level = expected >= 85 ? 'Low' : expected >= 70 ? 'Medium' : 'High';
    res.json({
      success: true,
      data: {
        sprint_id: req.body.sprint_id || 'sprint-24',
        predicted_completion_rate: expected,
        risk_level,
        recommended_scope_adjustment: risk_level === 'Low' ? 0 : risk_level === 'Medium' ? 5 : 15,
        confidence_score: 0.94,
      },
    });
  });

  app.post('/api/v1/ai/predict/risk', (req, res) => {
    const { active_blockers = 1, overdue_tasks = 0, unassigned_stories = 0 } = req.body;
    const composite_score = Math.min(100, (Number(active_blockers) * 25) + (Number(overdue_tasks) * 15) + (Number(unassigned_stories) * 10));
    const status = composite_score > 60 ? 'Critical' : composite_score > 30 ? 'Moderate' : 'Healthy';
    res.json({
      success: true,
      data: {
        project_id: req.body.project_id || 'proj-1',
        composite_risk_score: composite_score,
        status,
        actionable_insights: [
          'Reassign unassigned high priority user stories',
          'Hold an emergency blocker removal standup',
          'Review team capacity allocation',
        ],
      },
    });
  });

  // ==========================================
  // CHAT & COLLABORATION APIs
  // ==========================================
  app.get('/api/v1/chat/messages', (req, res) => {
    const { channelId } = req.query;
    const filtered = channelId ? chatMessagesStore.filter((m) => m.channelId === channelId) : chatMessagesStore;
    res.json({ success: true, count: filtered.length, data: filtered });
  });

  app.post('/api/v1/chat/messages', (req, res) => {
    const { channelId, senderName, senderAvatar, content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      channelId: channelId || 'chan-1',
      senderId: `usr-${Date.now()}`,
      senderName: senderName || 'You (Current User)',
      senderAvatar: senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    chatMessagesStore.push(newMsg);
    io.emit('chat:new', newMsg);

    // Auto-reply from AI Copilot if mentioned
    if (content.toLowerCase().includes('@copilot')) {
      setTimeout(() => {
        const copilotMsg = {
          id: `msg-${Date.now() + 1}`,
          channelId: newMsg.channelId,
          senderId: 'copilot',
          senderName: 'AgilePulse AI Copilot',
          senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
          content: `🤖 @${newMsg.senderName}: I reviewed the query! Sprint 24 Health is at **84/100 (Optimal)** with 4 days remaining. Team velocity is 28 pts completed.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        chatMessagesStore.push(copilotMsg);
        io.emit('chat:new', copilotMsg);
      }, 500);
    }

    res.status(201).json({ success: true, data: newMsg });
  });

  // ==========================================
  // ADMIN & AUDIT TRAIL APIs
  // ==========================================
  app.get('/api/v1/admin/audit-logs', (req, res) => {
    res.json({ success: true, count: auditLogsStore.length, data: auditLogsStore });
  });

  app.post('/api/v1/admin/audit-logs', (req, res) => {
    const newLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'Success',
      ip: req.ip || '127.0.0.1',
      ...req.body,
    };
    auditLogsStore.unshift(newLog);
    res.status(201).json({ success: true, data: newLog });
  });

  app.get('/api/v1/admin/stats', (req, res) => {
    res.json({
      success: true,
      data: {
        totalUsers: 142,
        activeWorkspaces: 8,
        activeSprints: 5,
        totalTasks: tasksStore.length,
        uptimePercentage: 99.98,
        aiQueriesProcessed: 12450,
      },
    });
  });

  // ==========================================
  // GLOBAL SEARCH & RAG API
  // ==========================================
  app.get('/api/v1/search', (req, res) => {
    const q = ((req.query.q as string) || '').toLowerCase();
    const matchedTasks = tasksStore.filter(
      (t) => t.title?.toLowerCase().includes(q) || t.id?.toLowerCase().includes(q)
    );
    const matchedReports = savedReportsStore.filter((r) => r.title?.toLowerCase().includes(q));
    res.json({
      success: true,
      query: q,
      results: {
        tasks: matchedTasks,
        reports: matchedReports,
      },
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`AgilePulse AI server & Socket.IO running on http://localhost:${PORT}`);
  });
}

startServer();
