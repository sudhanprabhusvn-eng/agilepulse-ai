import { io, Socket } from 'socket.io-client';
import { AppNotification, ActivityFeedItem } from '../types';

type NotificationListener = (notif: AppNotification) => void;
type ActivityListener = (activity: ActivityFeedItem) => void;
type SprintUpdateListener = (data: { sprintId: string; healthScore: number }) => void;

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private notificationListeners: Set<NotificationListener> = new Set();
  private activityListeners: Set<ActivityListener> = new Set();
  private sprintListeners: Set<SprintUpdateListener> = new Set();
  private mockInterval: ReturnType<typeof setInterval> | null = null;

  public connect(url: string = window.location.origin) {
    if (this.socket && this.socket.connected) return;

    try {
      this.socket = io(url, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 5000,
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('[SocketService] Connected to real-time server:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('[SocketService] Disconnected from server');
      });

      this.socket.on('notification:new', (notif: AppNotification) => {
        this.notificationListeners.forEach((fn) => fn(notif));
      });

      this.socket.on('activity:new', (act: ActivityFeedItem) => {
        this.activityListeners.forEach((fn) => fn(act));
      });

      this.socket.on('sprint:update', (data) => {
        this.sprintListeners.forEach((fn) => fn(data));
      });
    } catch (err) {
      console.warn('[SocketService] Socket connection failed, using real-time mock fallback:', err);
    }

    // Always start subtle mock heartbeats to guarantee live dynamic updates in client UI
    this.startMockHeartbeat();
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
    this.isConnected = false;
  }

  public onNotification(cb: NotificationListener) {
    this.notificationListeners.add(cb);
    return () => this.notificationListeners.delete(cb);
  }

  public onActivity(cb: ActivityListener) {
    this.activityListeners.add(cb);
    return () => this.activityListeners.delete(cb);
  }

  public onSprintUpdate(cb: SprintUpdateListener) {
    this.sprintListeners.add(cb);
    return () => this.sprintListeners.delete(cb);
  }

  public emitNotification(notif: AppNotification) {
    if (this.socket && this.isConnected) {
      this.socket.emit('notification:send', notif);
    }
    // Also trigger local listeners immediately
    this.notificationListeners.forEach((fn) => fn(notif));
  }

  public emitActivity(activity: ActivityFeedItem) {
    if (this.socket && this.isConnected) {
      this.socket.emit('activity:send', activity);
    }
    this.activityListeners.forEach((fn) => fn(activity));
  }

  private startMockHeartbeat() {
    if (this.mockInterval) return;

    // Simulate occasional real-time telemetry events every 45s for demo reactivity
    this.mockInterval = setInterval(() => {
      const randomTrigger = Math.random();

      if (randomTrigger > 0.6) {
        const mockNotif: AppNotification = {
          id: `socket-notif-${Date.now()}`,
          title: 'Live Telemetry Alert',
          message: 'AI Model detected zero-delay throughput in Sprint 24 backlog.',
          type: 'ai',
          category: 'ai',
          priority: 'medium',
          timestamp: 'Just now',
          read: false,
          actor: {
            name: 'AI Agent Realtime',
            avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=250',
          },
        };
        this.notificationListeners.forEach((fn) => fn(mockNotif));
      }
    }, 45000);
  }

  public getStatus() {
    return {
      connected: this.isConnected,
      id: this.socket?.id || null,
    };
  }
}

export const socketService = new SocketService();
