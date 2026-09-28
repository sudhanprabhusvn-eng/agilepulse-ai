export class PerformanceOptimizer {
  public static debounce<T extends (...args: any[]) => void>(func: T, waitMs: number): T {
    let timeout: any;
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), waitMs);
    }) as T;
  }

  public static throttle<T extends (...args: any[]) => void>(func: T, limitMs: number): T {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limitMs);
      }
    }) as T;
  }

  public static measureLatency<T>(fn: () => T): { result: T; durationMs: number } {
    const start = performance.now();
    const result = fn();
    const durationMs = performance.now() - start;
    return { result, durationMs };
  }
}
