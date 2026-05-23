/**
 * Session Analytics Collector
 * Tracks heatmaps, scrolling patterns, click locations, and dwell time
 */

export interface HeatmapPoint {
  x: number;
  y: number;
  timestamp: number;
  type: "click" | "hover" | "scroll";
  element?: string;
}

export interface ScrollPattern {
  timestamp: number;
  scrollY: number;
  scrollX: number;
  direction: "up" | "down" | "left" | "right" | "none";
  velocity: number;
}

export interface ClickPattern {
  x: number;
  y: number;
  timestamp: number;
  button: number; // 0=left, 1=middle, 2=right
  element?: string;
  elementClass?: string;
}

export class HeatmapCollector {
  private heatmapPoints: HeatmapPoint[] = [];
  private scrollPatterns: ScrollPattern[] = [];
  private clickPatterns: ClickPattern[] = [];
  private scrollTimeout: NodeJS.Timeout | null = null;
  private lastScrollY: number = 0;
  private lastScrollX: number = 0;
  private lastScrollTime: number = 0;

  constructor() {
    this.initializeListeners();
  }

  private initializeListeners() {
    // Click tracking
    document.addEventListener("click", (e) => this.trackClick(e), true);
    document.addEventListener("dblclick", (e) => this.trackClick(e), true);

    // Scroll tracking
    window.addEventListener("scroll", () => this.trackScroll(), { passive: true });

    // Mouse hover for heatmap
    document.addEventListener("mousemove", (e) => this.trackMouseMove(e), { passive: true });
  }

  private trackClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    this.clickPatterns.push({
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now(),
      button: e.button,
      element: target.tagName,
      elementClass: target.className,
    });

    this.heatmapPoints.push({
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now(),
      type: "click",
      element: target.tagName,
    });
  }

  private trackMouseMove(e: MouseEvent) {
    // Sample heatmap data every 100ms to avoid overwhelming data collection
    const now = Date.now();
    if (now % 100 < 5) {
      this.heatmapPoints.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: now,
        type: "hover",
      });
    }
  }

  private trackScroll() {
    const now = Date.now();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Calculate scroll velocity
    let velocity = 0;
    if (this.lastScrollTime > 0) {
      const timeDelta = now - this.lastScrollTime;
      const yDelta = scrollY - this.lastScrollY;
      velocity = Math.abs(yDelta) / (timeDelta + 1); // pixels per ms
    }

    // Determine scroll direction
    let direction: "up" | "down" | "left" | "right" | "none" = "none";
    if (scrollY > this.lastScrollY) direction = "down";
    else if (scrollY < this.lastScrollY) direction = "up";
    else if (scrollX > this.lastScrollX) direction = "right";
    else if (scrollX < this.lastScrollX) direction = "left";

    this.scrollPatterns.push({
      timestamp: now,
      scrollY,
      scrollX,
      direction,
      velocity,
    });

    this.lastScrollY = scrollY;
    this.lastScrollX = scrollX;
    this.lastScrollTime = now;

    // Clear old samples (keep last 5 mins)
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    this.scrollPatterns = this.scrollPatterns.filter((p) => p.timestamp > fiveMinutesAgo);
  }

  public getHeatmapData() {
    return this.heatmapPoints;
  }

  public getScrollPatterns() {
    return this.scrollPatterns;
  }

  public getClickPatterns() {
    return this.clickPatterns;
  }

  public getAnalytics() {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    const recentClicks = this.clickPatterns.filter((c) => c.timestamp > fiveMinutesAgo);
    const recentScrolls = this.scrollPatterns.filter((s) => s.timestamp > fiveMinutesAgo);

    return {
      heatmap_points_count: this.heatmapPoints.length,
      click_count: recentClicks.length,
      scroll_count: recentScrolls.length,
      average_scroll_velocity: 
        recentScrolls.length > 0 
          ? recentScrolls.reduce((sum, s) => sum + s.velocity, 0) / recentScrolls.length 
          : 0,
      scroll_depth_percent: this.calculateScrollDepth(),
      time_period_ms: 5 * 60 * 1000,
    };
  }

  private calculateScrollDepth(): number {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    return documentHeight > 0 ? (scrolled / documentHeight) * 100 : 0;
  }

  public destroy() {
    // Cleanup listeners if needed
    document.removeEventListener("click", this.trackClick);
  }
}
