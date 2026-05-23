import React, { useState, useEffect } from "react";
import { LiveDataFeed } from "../dashboard/LiveDataFeed";
import { FingerprintScoreCard } from "../dashboard/FingerprintScoreCard";
import { DataCategoryCard } from "../dashboard/DataCategoryCard";
import { AIAnalysisPanel } from "../ai/AIAnalysisPanel";
import { RecommendationSimulator } from "../simulator/RecommendationSimulator";
import { ScanningBar } from "../ui/ScanningBar";
import { GlowCard } from "../ui/GlowCard";

// Collectors imports
import { getCanvasFingerprint } from "../../lib/collectors/canvas-fingerprint";
import { getWebGLFingerprint } from "../../lib/collectors/webgl-fingerprint";
import { getAudioFingerprint } from "../../lib/collectors/audio-fingerprint";
import { getFontFingerprint } from "../../lib/collectors/font-fingerprint";
import { BehavioralTracker } from "../../lib/collectors/behavioral-tracker";
import { calculateUniquenessScore } from "../../lib/scoring/uniqueness-score";
import { sendAnalysis } from "../../lib/api-client";
import { AnalysisRequest, AIAnalysisResponse } from "../../lib/types/browser-profile";

export function CollectionEngine() {
  const [engineState, setEngineState] = useState<"idle" | "consent" | "scanning" | "results">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  
  // Data stores
  const [collectedData, setCollectedData] = useState<Record<string, any>>({});
  const [scoreData, setScoreData] = useState<{ score: number; hash: string; tier: "Anonymous" | "Trackable" | "Highly Identifiable" } | null>(null);
  const [aiReport, setAiReport] = useState<AIAnalysisResponse | null>(null);
  const [tracker, setTracker] = useState<BehavioralTracker | null>(null);

  // Triggered on page load to initialize behavioral listeners
  useEffect(() => {
    const activeTracker = new BehavioralTracker();
    setTracker(activeTracker);
    return () => {
      activeTracker.destroy();
    };
  }, []);

  const addLog = (message: string, delay: number = 300): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, message]);
        resolve();
      }, delay);
    });
  };

  const startScanProcedure = async () => {
    setEngineState("scanning");
    setLogs([]);
    setScanProgress(0);

    // 1. Initializing scan console logs
    await addLog("INITIALIZING CRYPTO SIGNALS SCAN SEQUENCE...", 200);
    await addLog("ESTABLISHING UNIFIED TELEMETRY BOUNDARY...", 150);

    // 2. Browser parameters extraction
    await addLog("QUERYING CLIENT ENGINE METRICS...", 200);
    const userAgent = navigator.userAgent;
    const isModern = !!(window.crypto && window.fetch && window.customElements);
    await addLog(`[SUCCESS] Browser Engine checked. Platform Tier: ${isModern ? "MODERN" : "LEGACY"}`, 100);

    // 3. Screen and hardware capabilities
    await addLog("COLLECTING DEVICE HARDWARE telemetry...", 250);
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const cpuCores = navigator.hardwareConcurrency || 4;
    const devMemory = (navigator as any).deviceMemory || 8;
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    await addLog(`[SUCCESS] CPU: ${cpuCores} cores, Memory: ${devMemory}GB, Res: ${screenRes}`, 100);

    // 4. Timezone/locale metrics
    await addLog("QUERYING COARSE GEOGRAPHIC LOCALE...", 200);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const language = navigator.language || "en-US";
    await addLog(`[SUCCESS] Inferred Region: ${timezone}, Language Pref: ${language}`, 100);

    // 5. Connection metadata
    await addLog("ANALYZING LATENCY AND NETWORK SPEED...", 250);
    const conn = (navigator as any).connection;
    const networkClass = conn ? (conn.downlink > 10 ? "fast" : "slow") : "unknown";
    await addLog(`[SUCCESS] Network Link: ${networkClass.toUpperCase()} (downlink: ${conn?.downlink || "n/a"} Mbps)`, 100);

    // 6. Local storage capacities
    await addLog("MEASURING STORAGE AND SANDBOX RESTRICTIONS...", 200);
    const storageCaps: string[] = ["cookies"];
    if (typeof localStorage !== "undefined") storageCaps.push("localStorage");
    if (typeof sessionStorage !== "undefined") storageCaps.push("sessionStorage");
    if (typeof indexedDB !== "undefined") storageCaps.push("IndexedDB");
    await addLog(`[SUCCESS] Storage Sandbox Capability Set: [${storageCaps.join(", ")}]`, 100);

    // 7. Advanced Fingerprinting Extraction
    await addLog("COMPUTING MULTI-POINT telemetry SIGNATURES...", 300);
    
    // Canvas hash
    await addLog("  -> executing offscreen canvas rendering pipeline...", 200);
    const canvasResult = await getCanvasFingerprint();
    await addLog(`  -> canvas_signature_sha256: ${canvasResult.hash.substring(0, 24)}...`, 100);

    // WebGL strings
    await addLog("  -> unmasking WebGL graphics acceleration renderer...", 200);
    const webglResult = getWebGLFingerprint();
    await addLog(`  -> unmasked_gpu: ${webglResult.renderer}`, 100);

    // Audio hash
    await addLog("  -> calibrating Web Audio oscillator compressor wave...", 200);
    const audioResult = await getAudioFingerprint();
    await addLog(`  -> audio_signature_sha256: ${audioResult.substring(0, 24)}...`, 100);

    // Font list
    await addLog("  -> measuring precise canvas text fonts widths...", 200);
    const fontsResult = getFontFingerprint();
    await addLog(`  -> detected_system_fonts: ${fontsResult.length} assets mapped`, 100);

    // 8. Session Behavioral Tracker
    await addLog("INTERCEPTING BEHAVIORAL INTERACTION SIGNATURES...", 200);
    const behavioralSignals = tracker ? tracker.getSignals() : {
      time_on_page_seconds: 4.2,
      scroll_depth_percent: 45,
      interaction_count: 12,
      idle_ratio: 0.1
    };
    await addLog(`[SUCCESS] Behavioral signals compiled. Interactions count: ${behavioralSignals.interaction_count}`, 100);

    // 9. Compute composite Uniqueness Percentile
    await addLog("COMPILING COMPOSITE PRIVACY SINGULARITY INDEX...", 350);
    const uniqueness = calculateUniquenessScore({
      deviceMemory: devMemory,
      cpuCores: cpuCores,
      timezone,
      language,
      fontsCount: fontsResult.length,
      hasWebGL: webglResult.vendor !== "unsupported",
      hasAudio: audioResult !== "unsupported",
      storageCapabilitiesCount: storageCaps.length,
      dnt: navigator.doNotTrack === "1"
    });
    
    setScoreData({
      score: uniqueness.score,
      hash: canvasResult.hash,
      tier: uniqueness.tier
    });
    await addLog(`[SUCCESS] Percentile calculated: More unique than ${uniqueness.score}% of global visitors.`, 150);

    // 10. Forward to backend proxy for AI analysis and storage
    await addLog("TRANSMITTING ANONYMIZED TELEMETRY TO COGNITIVE ANALYSIS NODE...", 300);
    
    // Assemble category maps for display cards
    const browserMap = {
      user_agent: navigator.userAgent.substring(0, 48) + "...",
      browser_tier: isModern ? "modern" : "legacy",
      cookie_enabled: navigator.cookieEnabled,
      do_not_track: navigator.doNotTrack === "1"
    };

    const deviceMap = {
      screen_resolution: screenRes,
      pixel_ratio: window.devicePixelRatio || 1.0,
      cpu_cores: cpuCores,
      device_memory_gb: devMemory,
      touch_supported: hasTouch
    };

    const networkMap = {
      effective_bandwidth: conn?.downlink ? `${conn.downlink} Mbps` : "unknown",
      round_trip_time: conn?.rtt ? `${conn.rtt} ms` : "unknown",
      connection_type: conn?.effectiveType || "unknown"
    };

    const storageMap = {
      localStorage: typeof localStorage !== "undefined",
      sessionStorage: typeof sessionStorage !== "undefined",
      indexedDB: typeof indexedDB !== "undefined"
    };

    const locationMap = {
      timezone_region: timezone,
      locale_language: language,
      referrer_source: document.referrer || "direct_navigation"
    };

    const fingerprintMap = {
      canvas_sha256: canvasResult.hash.substring(0, 16) + "...",
      webgl_vendor: webglResult.vendor,
      webgl_renderer: webglResult.renderer,
      audio_sha256: audioResult.substring(0, 16) + "...",
      detected_fonts_count: fontsResult.length
    };

    setCollectedData({
      browser: browserMap,
      device: deviceMap,
      network: networkMap,
      storage: storageMap,
      location: locationMap,
      fingerprints: fingerprintMap,
      behavioral: {
        seconds_active: behavioralSignals.time_on_page_seconds,
        max_scroll_depth: `${behavioralSignals.scroll_depth_percent}%`,
        click_touch_events: behavioralSignals.interaction_count,
        session_idle_ratio: `${Math.round(behavioralSignals.idle_ratio * 100)}%`
      }
    });

    // Request payload assembly
    const analysisPayload: AnalysisRequest = {
      fingerprint_hash: canvasResult.hash,
      browser_tier: isModern ? "modern" : "legacy",
      device_class: devMemory >= 8 && cpuCores >= 8 ? "high" : devMemory <= 4 ? "low" : "mid",
      network_class: networkClass,
      timezone_region: timezone,
      language_group: language,
      storage_capabilities: storageCaps,
      uniqueness_score: uniqueness.score,
      behavioral_signals: {
        time_on_page_seconds: behavioralSignals.time_on_page_seconds,
        scroll_depth_percent: behavioralSignals.scroll_depth_percent,
        interaction_count: behavioralSignals.interaction_count,
        idle_ratio: behavioralSignals.idle_ratio
      },
      raw_data: {
        screen_size: screenRes,
        pixel_ratio: window.devicePixelRatio,
        gpu_vendor: webglResult.vendor,
        gpu_renderer: webglResult.renderer,
        fonts_detected: fontsResult.join(", "),
        audio_frequency_hash: audioResult,
        user_agent: userAgent
      }
    };

    try {
      const response = await sendAnalysis(analysisPayload);
      setAiReport(response);
      await addLog("[SUCCESS] Profile synthesis resolved. Persisted to Neon Postgres database.", 200);
      await addLog("DISPLAYING VISUALIZED IDENTITY RADAR MAP...", 100);
      
      setTimeout(() => {
        setEngineState("results");
      }, 500);

    } catch (apiError) {
      console.error("[Analysis Query Failed]", apiError);
      await addLog("[FATAL] Profiler connection failed. Aborting database writing.", 100);
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. IDLE STATE: LANDING PAGE */}
      {engineState === "idle" && (
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-16 space-y-6">
          <div className="space-y-3">
            <span className="font-mono text-xs text-[var(--neon-green)] tracking-widest uppercase block animate-pulse">
              // TELEMETRY SCANNERS LOADED
            </span>
            <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight text-white leading-tight">
              Every website you visit builds a profile of you.<br />
              <span className="text-[var(--neon-green)] glow-green">See yours.</span>
            </h1>
          </div>
          
          <p className="text-sm text-gray-400 font-mono leading-relaxed max-w-lg">
            This workspace queries silent browser vectors (WebGL, audio dynamics, canvas shadows) to display exactly how you look to advertising exchanges in real-time.
          </p>

          <div className="pt-4 select-none">
            <button
              onClick={() => setEngineState("consent")}
              className="py-3 px-8 rounded border border-[var(--neon-green)] bg-transparent text-[var(--neon-green)] font-mono text-sm uppercase tracking-wider font-semibold transition-all hover:bg-[var(--neon-green)] hover:text-[#050508] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] cursor-pointer"
            >
              Scan My Browser
            </button>
          </div>
        </div>
      )}

      {/* 2. CONSENT STATE: SECURITY DIALOG */}
      {engineState === "consent" && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 z-50 animate-fade-in font-mono">
          <div className="max-w-md w-full terminal-panel rounded-lg p-6 space-y-6 relative overflow-hidden">
            <div className="scanner-beam opacity-40" />

            <div className="border-b border-[rgba(0,255,136,0.15)] pb-3">
              <h3 className="text-base font-bold text-[var(--neon-green)] glow-green">
                // CONSENT & SANITIZATION PROTOCOL
              </h3>
            </div>

            <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
              <p>
                Before scanning, we require confirmation of privacy conditions:
              </p>
              <ul className="space-y-2.5 list-inside list-disc">
                <li>
                  <span className="text-white font-semibold">Anonymized Signatures:</span> Your canvas and audio metrics are hashed on-client using SHA-256 before transmission.
                </li>
                <li>
                  <span className="text-white font-semibold">PII Sanitization:</span> Raw IP addresses, geolocation coordinates, and custom user credentials are purges at the border.
                </li>
                <li>
                  <span className="text-white font-semibold">Neon Postgres Persistence:</span> Browser capability specs and AI-generated assessments are saved in the database for admin inspects.
                </li>
              </ul>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setEngineState("idle")}
                className="flex-1 py-2 px-3 border border-gray-600 bg-transparent text-gray-400 uppercase text-xs hover:border-white hover:text-white transition-all cursor-pointer"
              >
                Abort Scan
              </button>
              <button
                onClick={startScanProcedure}
                className="flex-1 py-2 px-3 border border-[var(--neon-green)] bg-[var(--neon-green)] text-[#050508] font-bold uppercase text-xs hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all cursor-pointer"
              >
                Authorize & Scan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. SCANNING STATE: ANIMATION AND LIVE FEED */}
      {engineState === "scanning" && (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
          <ScanningBar active={true} />
          
          <div className="text-center font-mono space-y-2">
            <span className="text-xs text-[var(--neon-green)] tracking-widest uppercase block animate-pulse">
              // TELEMETRY PROFILER ACTIVE
            </span>
            <h3 className="text-lg font-bold text-white uppercase">Evaluating Hardware telemetry Vectors</h3>
          </div>

          <LiveDataFeed logs={logs} />
        </div>
      )}

      {/* 4. RESULTS STATE: VISUAL TERMINAL DASHBOARD */}
      {engineState === "results" && scoreData && aiReport && (
        <div className="space-y-12 animate-fade-in">
          
          {/* Uniqueness Score Card */}
          <FingerprintScoreCard 
            score={scoreData.score} 
            hash={scoreData.hash} 
            tier={scoreData.tier} 
          />

          {/* Master AI Profiling Panel */}
          <AIAnalysisPanel analysis={aiReport} />

          {/* Interactive Recommendation Simulator */}
          <RecommendationSimulator />

          {/* Grid Panel for Sensor Categories */}
          <div className="space-y-6">
            <div className="border-b border-[rgba(0,255,136,0.15)] pb-4">
              <h3 className="text-xl font-mono text-[var(--neon-green)] glow-green">
                // RAW SENSOR METRICS PANEL
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Anonymized data payloads compiled from standard JS browser features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DataCategoryCard title="Browser Engines" data={collectedData.browser} iconLabel="// 01. BROWSER TELEMETRY" />
              <DataCategoryCard title="Device Hardware" data={collectedData.device} iconLabel="// 02. HARDWARE MATRIX" />
              <DataCategoryCard title="Network Connectivity" data={collectedData.network} iconLabel="// 03. COMMUNICATIONS LINK" />
              <DataCategoryCard title="Capabilities" data={collectedData.storage} iconLabel="// 04. SANDBOX PRIVILEGES" />
              <DataCategoryCard title="Locale Registry" data={collectedData.location} iconLabel="// 05. REGIONAL LOCALES" />
              <DataCategoryCard title="Advanced Signatures" data={collectedData.fingerprints} iconLabel="// 06. TELEMETRY HASHES" />
            </div>
          </div>

          {/* Reset button container */}
          <div className="flex justify-center pt-4 select-none">
            <button
              onClick={() => {
                setEngineState("idle");
                setLogs([]);
                setScoreData(null);
                setAiReport(null);
              }}
              className="py-2.5 px-6 rounded border border-gray-600 bg-transparent text-gray-400 font-mono text-xs uppercase tracking-wider hover:border-[var(--neon-green)] hover:text-[var(--neon-green)] hover:shadow-[0_0_10px_rgba(0,255,136,0.15)] transition-all cursor-pointer"
            >
              Re-Scan System
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
