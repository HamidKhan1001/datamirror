/**
 * Browser Session Manager
 * Manages persistent session tracking across page loads
 */

export interface SessionData {
  session_id: string;
  fingerprint_hash: string;
  created_at: number;
  last_activity: number;
  page_visits: number;
  total_time_ms: number;
}

export class SessionManager {
  private sessionId: string;
  private fingerprintHash: string;
  private startTime: number;
  private isNewSession: boolean = false;
  private readonly SESSION_KEY = "datamirror_session_id";
  private readonly SESSION_FP_KEY = "datamirror_fingerprint";
  private readonly SESSION_START_KEY = "datamirror_session_start";
  private readonly SESSION_VISITS_KEY = "datamirror_session_visits";

  constructor(fingerprintHash: string) {
    this.fingerprintHash = fingerprintHash;
    this.startTime = Date.now();
    
    // Try to restore existing session or create new one
    const existingSessionId = sessionStorage.getItem(this.SESSION_KEY);
    const existingFp = sessionStorage.getItem(this.SESSION_FP_KEY);
    
    if (existingSessionId && existingFp === fingerprintHash) {
      // Resume existing session
      this.sessionId = existingSessionId;
      this.isNewSession = false;
    } else {
      // Create new session
      this.sessionId = this.generateSessionId();
      this.isNewSession = true;
      sessionStorage.setItem(this.SESSION_KEY, this.sessionId);
      sessionStorage.setItem(this.SESSION_FP_KEY, fingerprintHash);
      sessionStorage.setItem(this.SESSION_START_KEY, this.startTime.toString());
      sessionStorage.setItem(this.SESSION_VISITS_KEY, "1");
    }

    // Update last activity
    this.updateLastActivity();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateLastActivity() {
    sessionStorage.setItem("datamirror_last_activity", Date.now().toString());
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public isNew(): boolean {
    return this.isNewSession;
  }

  public getSessionData(): SessionData {
    const startTime = parseInt(sessionStorage.getItem(this.SESSION_START_KEY) || "0");
    const visits = parseInt(sessionStorage.getItem(this.SESSION_VISITS_KEY) || "1");
    const totalTime = Date.now() - startTime;

    return {
      session_id: this.sessionId,
      fingerprint_hash: this.fingerprintHash,
      created_at: startTime,
      last_activity: Date.now(),
      page_visits: visits,
      total_time_ms: totalTime,
    };
  }

  public recordPageVisit() {
    const visits = parseInt(sessionStorage.getItem(this.SESSION_VISITS_KEY) || "1");
    sessionStorage.setItem(this.SESSION_VISITS_KEY, (visits + 1).toString());
    this.updateLastActivity();
  }

  public endSession() {
    sessionStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem(this.SESSION_FP_KEY);
    sessionStorage.removeItem(this.SESSION_START_KEY);
    sessionStorage.removeItem(this.SESSION_VISITS_KEY);
    sessionStorage.removeItem("datamirror_last_activity");
  }
}

/**
 * Cross-session tracking (persistent across sessions)
 * Uses localStorage to track historical patterns
 */
export class VisitorProfile {
  private readonly PROFILE_KEY = "datamirror_visitor_profile";
  private profile: any;

  constructor() {
    this.loadProfile();
  }

  private loadProfile() {
    const stored = localStorage.getItem(this.PROFILE_KEY);
    if (stored) {
      try {
        this.profile = JSON.parse(stored);
      } catch {
        this.profile = this.createEmptyProfile();
      }
    } else {
      this.profile = this.createEmptyProfile();
    }
  }

  private createEmptyProfile() {
    return {
      created_at: Date.now(),
      session_count: 0,
      total_visits: 0,
      last_visit: Date.now(),
      average_session_duration_ms: 0,
      device_consistency_score: 0,
      behavior_patterns: {},
    };
  }

  public updateWithSession(sessionData: SessionData) {
    this.profile.session_count++;
    this.profile.total_visits += sessionData.page_visits;
    this.profile.last_visit = Date.now();
    
    // Update average session duration
    const prevCount = Math.max(1, this.profile.session_count - 1);
    const prevTotal = this.profile.average_session_duration_ms * prevCount;
    this.profile.average_session_duration_ms = (prevTotal + sessionData.total_time_ms) / this.profile.session_count;
    
    this.saveProfile();
  }

  private saveProfile() {
    try {
      localStorage.setItem(this.PROFILE_KEY, JSON.stringify(this.profile));
    } catch (e) {
      console.warn("Failed to save visitor profile:", e);
    }
  }

  public getProfile() {
    return this.profile;
  }

  public reset() {
    localStorage.removeItem(this.PROFILE_KEY);
    this.profile = this.createEmptyProfile();
  }
}
