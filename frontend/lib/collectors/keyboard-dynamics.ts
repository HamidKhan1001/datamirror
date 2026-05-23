/**
 * Keyboard Dynamics Collector
 * Captures typing patterns, dwell times, and keyboard rhythm for biometric profiling
 */

export interface KeystrokeData {
  key: string;
  timestamp: number;
  duration: number; // How long key was held
}

export interface KeyboardProfile {
  average_dwell_time_ms: number; // Time held down per key
  average_interval_ms: number; // Time between keystrokes
  total_keys_pressed: number;
  typing_speed_wpm: number; // Words per minute equivalent
  key_hold_variance: number; // Consistency of holding
  keystroke_interval_variance: number; // Consistency of interval
}

export class KeyboardDynamicsCollector {
  private keyDownTimes: Map<string, number> = new Map();
  private keystrokeData: KeystrokeData[] = [];
  private keyPressCount: number = 0;
  private lastKeystrokeTime: number = 0;
  private typingStartTime: number = 0;

  constructor() {
    this.initializeListeners();
  }

  private initializeListeners() {
    document.addEventListener("keydown", (e) => this.onKeyDown(e), { passive: true });
    document.addEventListener("keyup", (e) => this.onKeyUp(e), { passive: true });
  }

  private onKeyDown(e: KeyboardEvent) {
    const key = e.key;
    
    if (!this.keyDownTimes.has(key)) {
      this.keyDownTimes.set(key, Date.now());
      
      if (this.typingStartTime === 0) {
        this.typingStartTime = Date.now();
      }
    }
  }

  private onKeyUp(e: KeyboardEvent) {
    const key = e.key;
    const downTime = this.keyDownTimes.get(key);

    if (downTime !== undefined) {
      const upTime = Date.now();
      const duration = upTime - downTime;
      const now = Date.now();

      this.keystrokeData.push({
        key: this.sanitizeKey(key),
        timestamp: now,
        duration: duration,
      });

      this.lastKeystrokeTime = now;
      this.keyPressCount++;
      this.keyDownTimes.delete(key);

      // Keep last 1000 keystrokes in memory
      if (this.keystrokeData.length > 1000) {
        this.keystrokeData.shift();
      }
    }
  }

  private sanitizeKey(key: string): string {
    // Don't capture sensitive keys
    const sensitiveKeys = ["Enter", "Tab", "Backspace", "Delete", "Shift", "Control", "Alt"];
    if (sensitiveKeys.includes(key)) {
      return key;
    }
    // For regular chars, just use a placeholder to avoid capturing actual text
    return key.length === 1 ? "CHAR" : key;
  }

  public getKeyboardProfile(): KeyboardProfile {
    if (this.keystrokeData.length < 2) {
      return {
        average_dwell_time_ms: 0,
        average_interval_ms: 0,
        total_keys_pressed: 0,
        typing_speed_wpm: 0,
        key_hold_variance: 0,
        keystroke_interval_variance: 0,
      };
    }

    // Calculate dwell times
    const dwellTimes = this.keystrokeData.map((k) => k.duration);
    const avgDwell = dwellTimes.reduce((a, b) => a + b, 0) / dwellTimes.length;
    const dwellVariance = Math.sqrt(
      dwellTimes.reduce((sum, val) => sum + Math.pow(val - avgDwell, 2), 0) / dwellTimes.length
    );

    // Calculate intervals
    const intervals: number[] = [];
    for (let i = 1; i < this.keystrokeData.length; i++) {
      intervals.push(this.keystrokeData[i].timestamp - this.keystrokeData[i - 1].timestamp);
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const intervalVariance = Math.sqrt(
      intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length
    );

    // Estimate WPM (5 chars = 1 word average)
    const totalTime = this.lastKeystrokeTime - this.typingStartTime;
    const minutes = totalTime / 60000;
    const words = this.keyPressCount / 5;
    const wpm = minutes > 0 ? words / minutes : 0;

    return {
      average_dwell_time_ms: Math.round(avgDwell),
      average_interval_ms: Math.round(avgInterval),
      total_keys_pressed: this.keyPressCount,
      typing_speed_wpm: Math.round(wpm * 10) / 10,
      key_hold_variance: Math.round(dwellVariance),
      keystroke_interval_variance: Math.round(intervalVariance),
    };
  }

  public getRawKeystrokeData() {
    return [...this.keystrokeData];
  }

  public destroy() {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
  }
}
