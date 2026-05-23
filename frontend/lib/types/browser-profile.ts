export interface AnalysisRequest {
  fingerprint_hash: string;
  browser_tier: "modern" | "legacy";
  device_class: "high" | "mid" | "low";
  network_class: "fast" | "slow" | "unknown";
  timezone_region: string;
  language_group: string;
  storage_capabilities: string[];
  uniqueness_score: number;
  behavioral_signals: {
    time_on_page_seconds: number;
    scroll_depth_percent: number;
    interaction_count: number;
    idle_ratio: number;
  };
  raw_data?: Record<string, any>;
}

export interface AIAnalysisResponse {
  ad_profile: {
    inferred_demographics: string;
    income_bracket: "High" | "Medium" | "Low";
    interests: string[];
    purchase_intent_signals: string[];
  };
  recommendation_buckets: Array<{
    platform: string;
    bucket_name: string;
    mechanics: string;
  }>;
  data_valuation: {
    estimated_cpm_usd: number;
    valuation_tier: "Premium" | "Mid-Tier" | "Value";
    factors: string[];
  };
  dark_patterns: Array<{
    name: string;
    description: string;
    severity: "High" | "Medium" | "Low";
  }>;
  protection_advice: Array<{
    action: string;
    impact: string;
    difficulty: "Easy" | "Moderate" | "Hard";
  }>;
  meta: {
    tokens_used: number;
    latency_ms: number;
    scan_id?: string;
  };
}
