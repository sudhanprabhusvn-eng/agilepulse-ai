import { ChatChannel, ChatMessage, VideoMeeting, WhiteboardElement } from '../types';

export const mockChannels: ChatChannel[] = [
  { id: 'chan-gen', name: 'general-engineering', type: 'public', topic: 'Engineering updates, announcements & technical discussions', memberCount: 24, unreadCount: 2 },
  { id: 'chan-s24', name: 'sprint-24-war-room', type: 'sprint', topic: 'Sprint 24 active execution and risk tracking', memberCount: 8, unreadCount: 0 },
  { id: 'chan-ai', name: 'ai-agents-copilot', type: 'public', topic: 'Automated AI agent feedback and prompt iterations', memberCount: 15, unreadCount: 1 },
];

export const mockMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    channelId: 'chan-gen',
    senderId: 'usr-1',
    senderName: 'Sarah Jenkins',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    content: 'Team, the PostgreSQL backup & DB connection pool metrics look great after this morning’s optimization! 🚀',
    timestamp: '10:14 AM',
    reactions: [{ emoji: '🎉', count: 5, userIds: ['usr-2', 'usr-3'] }],
    isPinned: true,
  },
  {
    id: 'msg-2',
    channelId: 'chan-gen',
    senderId: 'usr-2',
    senderName: 'Michael Chang',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    content: 'Awesome. I triggered the AI Task Prioritization agent to adjust WSJF scores for the remaining Sprint 24 stories.',
    timestamp: '10:18 AM',
    reactions: [{ emoji: '👍', count: 3, userIds: ['usr-1'] }],
  },
];

export const mockMeetings: VideoMeeting[] = [
  {
    id: 'meet-1',
    title: 'Daily Agile Pulse & Risk Standup',
    provider: 'Google Meet',
    scheduledTime: '2026-08-02 11:00 AM',
    durationMinutes: 15,
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    attendees: ['Sarah Jenkins', 'Michael Chang', 'Alex Morgan', 'Elena Rostova'],
    aiSummary: 'Reviewed Sprint 24 burndown status. Unblocked DB migration PR.',
    actionItems: ['Alex to approve PR #142', 'Sarah to review AI agent logs'],
    status: 'Scheduled',
  },
  {
    id: 'meet-2',
    title: 'Sprint 24 Retrospective & Planning',
    provider: 'Zoom',
    scheduledTime: '2026-08-03 02:00 PM',
    durationMinutes: 45,
    meetingUrl: 'https://zoom.us/j/9876543210',
    attendees: ['Sarah Jenkins', 'Michael Chang', 'Alex Morgan'],
    status: 'Scheduled',
  },
];

export const mockWhiteboardElements: WhiteboardElement[] = [
  { id: 'wb-1', type: 'sticky', x: 100, y: 120, content: 'Optimize DB Pool Limit', color: '#fef08a', author: 'Sarah' },
  { id: 'wb-2', type: 'sticky', x: 280, y: 120, content: 'Deploy AI Prompt Library', color: '#bbf7d0', author: 'Michael' },
  { id: 'wb-3', type: 'shape', x: 100, y: 260, content: 'Sprint 25 Goal: Zero Blocker Velocity', color: '#e0e7ff', author: 'Alex' },
];
