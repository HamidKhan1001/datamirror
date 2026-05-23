import React, { useState, useEffect } from "react";
import { GlowCard } from "../ui/GlowCard";

interface SimulatedBucket {
  platform: string;
  bucket: string;
  primaryProduct: string;
  rankings: string[];
  abTestGroup: string;
  algorithmLogic: string;
}

export function RecommendationSimulator() {
  // Simulator input states
  const [deviceClass, setDeviceClass] = useState<"high" | "mid" | "low">("high");
  const [networkClass, setNetworkClass] = useState<"fast" | "slow">("fast");
  const [scrollDepth, setScrollDepth] = useState<number>(75);

  const [buckets, setBuckets] = useState<SimulatedBucket[]>([]);

  useEffect(() => {
    // Dynamically calculate feed recommendations based on user controls
    const newBuckets: SimulatedBucket[] = [
      {
        platform: "Amazon Marketplace Feed",
        bucket: deviceClass === "high" ? "High-Ticket Premium Enthusiast" : deviceClass === "mid" ? "Standard Consumer Cohort" : "Budget Utility Buyer",
        primaryProduct: deviceClass === "high" ? "Apple Mac Studio (64GB RAM)" : deviceClass === "mid" ? "Anker Wireless Powerbank" : "Refurbished USB-C Cable ($4.99)",
        rankings: deviceClass === "high" 
          ? ["1. Apple Mac Studio", "2. 4K Ultra-Wide Monitor", "3. Mechanical Keyboard"] 
          : deviceClass === "mid"
          ? ["1. Anker Powerbank", "2. Standard Laptop Case", "3. USB-C Wall Adapter"]
          : ["1. Value USB Cable", "2. Clearance Phone Stand", "3. Bulk AA Batteries"],
        abTestGroup: deviceClass === "high" ? "Cohort A (No-Discount Premium Banners)" : "Cohort C (High-Urgency Flash Coupon Active)",
        algorithmLogic: `Uses your hardware tier (${deviceClass.toUpperCase()}) to estimate spending elasticity. Ranks items using margins rather than generic unit sales.`
      },
      {
        platform: "TikTok Attention Loop",
        bucket: scrollDepth > 70 ? "Hyper-Active Doomscroller" : "Broad Casual Discoverer",
        primaryProduct: scrollDepth > 70 ? "Dopamine-Heavy Shock Comedy (Loop 0ms delay)" : "General Interest Travel & Cooking (Loop 200ms pause)",
        rankings: scrollDepth > 70
          ? ["1. Autoplay Action Fails", "2. Hyper-pacing ASMR", "3. Extreme Prank Compilation"]
          : ["1. Street Food Cooking", "2. European Travel Vlogs", "3. Mild Lifehack Tips"],
        abTestGroup: scrollDepth > 70 ? "Cohort B (Infinite Scroll Autoplay Active)" : "Cohort A (Engagement Baseline)",
        algorithmLogic: `Telemetry measures scroll speed (${scrollDepth}%). High rates trigger fast-cut retention anchors to prolong session time.`
      },
      {
        platform: "Netflix Cinematic Stream",
        bucket: networkClass === "fast" ? "HD Premium Pre-buffer Target" : "Standard Compression Viewer",
        primaryProduct: networkClass === "fast" ? "4K Sci-Fi Blockbuster (Pre-buffered)" : "Compressed Sitcom Stream (Low-bitrate baseline)",
        rankings: networkClass === "fast"
          ? ["1. Ultra-HD Action Trailer", "2. CGI Sci-Fi Special", "3. High-Fidelity Audio Series"]
          : ["1. Standard-res Comedy", "2. Low-bitrate Documentary", "3. Compressed Animation"],
        abTestGroup: networkClass === "fast" ? "Cohort A (Pre-render 4K Video Assets)" : "Cohort B (Pre-render Low-bitrate Static Assets)",
        algorithmLogic: `Assesses connection bandwidth (${networkClass.toUpperCase()}). Pre-buffers massive data packages only when playback delay risks are minimal.`
      }
    ];

    setBuckets(newBuckets);
  }, [deviceClass, networkClass, scrollDepth]);

  return (
    <div className="space-y-6">
      <div className="border-b border-[rgba(0,255,136,0.15)] pb-4">
        <h3 className="text-xl font-mono text-[var(--neon-green)] glow-green">
          // RECOMMENDATION ALGORITHM SIMULATOR
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Adjust the telemetry signals below to observe how commercial platforms re-bucket and steer your experience silently.
        </p>
      </div>

      {/* Simulator Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-lg bg-[rgba(0,255,136,0.02)] border border-[rgba(0,255,136,0.08)] font-mono text-sm">
        
        {/* Device Class Selector */}
        <div className="space-y-3">
          <label className="text-[var(--neon-green)]">// DEVICE CAPACITY CLASS</label>
          <div className="flex gap-2">
            {(["high", "mid", "low"] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setDeviceClass(tier)}
                className={`flex-1 py-1.5 px-2 rounded border uppercase text-xs transition-all ${
                  deviceClass === tier
                    ? "bg-[var(--neon-green)] text-[#050508] border-[var(--neon-green)] font-semibold shadow-[0_0_10px_rgba(0,255,136,0.3)]"
                    : "bg-transparent text-gray-400 border-[rgba(0,255,136,0.2)] hover:border-[rgba(0,255,136,0.5)]"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Network Class Selector */}
        <div className="space-y-3">
          <label className="text-[var(--neon-green)]">// NETWORK CONNECTIVITY</label>
          <div className="flex gap-2">
            {(["fast", "slow"] as const).map((speed) => (
              <button
                key={speed}
                onClick={() => setNetworkClass(speed)}
                className={`flex-1 py-1.5 px-2 rounded border uppercase text-xs transition-all ${
                  networkClass === speed
                    ? "bg-[var(--neon-green)] text-[#050508] border-[var(--neon-green)] font-semibold shadow-[0_0_10px_rgba(0,255,136,0.3)]"
                    : "bg-transparent text-gray-400 border-[rgba(0,255,136,0.2)] hover:border-[rgba(0,255,136,0.5)]"
                }`}
              >
                {speed}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Depth Slider */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <label className="text-[var(--neon-green)]">// SCROLL DEPTH SIGNAL</label>
            <span className="text-gray-300 font-semibold">{scrollDepth}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={scrollDepth}
            onChange={(e) => setScrollDepth(parseInt(e.target.value))}
            className="w-full h-1 bg-[rgba(0,255,136,0.15)] rounded-lg appearance-none cursor-pointer accent-[var(--neon-green)]"
          />
        </div>

      </div>

      {/* Simulator Visual Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {buckets.map((item, idx) => (
          <GlowCard key={idx} className="relative overflow-hidden flex flex-col justify-between">
            {/* Ambient CRT background scanning grid */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-[linear-gradient(135deg,transparent_60%,rgba(0,255,136,0.05)_100%)] pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[rgba(0,255,136,0.1)] pb-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500">FEED SYSTEM</span>
                <span className="text-xs font-mono font-semibold text-[var(--neon-green)]">{item.platform}</span>
              </div>

              <div>
                <span className="block text-[10px] font-mono text-gray-400">ASSIGNED TARGET COHORT:</span>
                <span className="text-sm font-semibold font-mono text-white block mt-0.5">{item.bucket}</span>
              </div>

              <div className="bg-[#050508] p-3 rounded border border-[rgba(0,255,136,0.08)] font-mono space-y-2">
                <span className="text-[10px] text-gray-500 block font-semibold">// ALGORITHM FEED RANKINGS:</span>
                {item.rankings.map((ranked, rIdx) => (
                  <span 
                    key={rIdx} 
                    className={`block text-xs ${rIdx === 0 ? "text-[var(--neon-green)] font-semibold" : "text-gray-400"}`}
                  >
                    {ranked}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[rgba(0,255,136,0.08)] font-mono text-[11px] text-gray-400 space-y-2">
              <p>
                <span className="text-gray-500 font-semibold">Active A/B Test:</span> {item.abTestGroup}
              </p>
              <p className="leading-relaxed bg-[rgba(0,255,136,0.02)] p-2 rounded text-[10px]">
                <span className="text-[var(--neon-green)] font-semibold">Engine Logic:</span> {item.algorithmLogic}
              </p>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}
