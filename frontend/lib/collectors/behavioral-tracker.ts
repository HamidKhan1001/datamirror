export class BehavioralTracker {
  private startTime: number = Date.now();
  private interactionCount: number = 0;
  private maxScrollPercent: number = 0;
  private lastActiveTime: number = Date.now();
  private totalIdleTime: number = 0;
  private idleIntervalId: number | null = null;

  constructor() {
    if (typeof window === "undefined") return;

    // Attach listeners for interactive telemetry signatures
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    window.addEventListener("click", this.handleInteraction, { passive: true });
    window.addEventListener("mousemove", this.handleInteraction, { passive: true });
    window.addEventListener("keypress", this.handleInteraction, { passive: true });
    window.addEventListener("touchstart", this.handleInteraction, { passive: true });

    // Track idle intervals every second
    this.idleIntervalId = window.setInterval(this.calculateIdleTime, 1000) as unknown as number;
  }

  private handleScroll = () => {
    this.handleInteraction();
    try {
      const doc = document.documentElement;
      const body = document.body;
      const scrollTop = doc.scrollTop || body.scrollTop;
      const scrollHeight = doc.scrollHeight || body.scrollHeight;
      const clientHeight = doc.clientHeight;

      const totalScrollable = scrollHeight - clientHeight;
      if (totalScrollable > 0) {
        const percent = (scrollTop / totalScrollable) * 100;
        this.maxScrollPercent = Math.max(this.maxScrollPercent, Math.round(percent));
      }
    } catch (e) {
      // Graceful error isolation
    }
  };

  private handleInteraction = () => {
    this.interactionCount++;
    this.lastActiveTime = Date.now();
  };

  private calculateIdleTime = () => {
    const idlePeriod = Date.now() - this.lastActiveTime;
    // Consider idle if no interaction for over 2 seconds
    if (idlePeriod > 2000) {
      this.totalIdleTime += 1000;
    }
  };

  public getSignals() {
    const totalDuration = (Date.now() - this.startTime) / 1000;
    const totalIdle = this.totalIdleTime / 1000;
    const idleRatio = totalDuration > 0 ? totalIdle / totalDuration : 0;

    return {
      time_on_page_seconds: Math.round(Math.max(1, totalDuration) * 10) / 10,
      scroll_depth_percent: Math.min(100, Math.max(0, this.maxScrollPercent)),
      interaction_count: this.interactionCount,
      idle_ratio: Math.round(Math.min(1.0, Math.max(0.0, idleRatio)) * 100) / 100
    };
  }

  public destroy() {
    if (typeof window === "undefined") return;

    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("click", this.handleInteraction);
    window.removeEventListener("mousemove", this.handleInteraction);
    window.removeEventListener("keypress", this.handleInteraction);
    window.removeEventListener("touchstart", this.handleInteraction);

    if (this.idleIntervalId !== null) {
      clearInterval(this.idleIntervalId);
    }
  }
}
