export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: string;
  message: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

class LoggingService {
  private logs: LogEntry[] = [
    {
      id: 'log-101',
      timestamp: new Date().toISOString(),
      level: 'info',
      category: 'AUTH',
      message: 'User sarah.j@agilepulse.ai authenticated via JWT',
      correlationId: 'req-88192-a',
    },
    {
      id: 'log-102',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      level: 'warn',
      category: 'AI_ENGINE',
      message: 'Gemini API response latency exceeded 800ms threshold',
      correlationId: 'req-88193-b',
    },
    {
      id: 'log-103',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      level: 'info',
      category: 'DATABASE',
      message: 'PostgreSQL connection pool auto-scaled to 12 active connections',
      correlationId: 'req-88194-c',
    },
  ];

  public log(level: LogEntry['level'], category: string, message: string, metadata?: Record<string, any>): LogEntry {
    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      correlationId: `corr-${Math.random().toString(36).substring(2, 9)}`,
      metadata,
    };
    this.logs.unshift(entry);
    return entry;
  }

  public info(category: string, message: string, metadata?: Record<string, any>) {
    return this.log('info', category, message, metadata);
  }

  public warn(category: string, message: string, metadata?: Record<string, any>) {
    return this.log('warn', category, message, metadata);
  }

  public error(category: string, message: string, metadata?: Record<string, any>) {
    return this.log('error', category, message, metadata);
  }

  public getLogs(level?: string, category?: string): LogEntry[] {
    return this.logs.filter((l) => {
      if (level && level !== 'all' && l.level !== level) return false;
      if (category && category !== 'all' && l.category !== category) return false;
      return true;
    });
  }
}

export const loggingService = new LoggingService();
