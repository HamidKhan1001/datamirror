import React from "react";
import { AnimatedCounter } from "../ui/AnimatedCounter";
import { GlowCard } from "../ui/GlowCard";

interface FingerprintScoreCardProps {
  score: number;
  hash: string;
  tier: "Anonymous" | "Trackable" | "Highly Identifiable";
}

export function FingerprintScoreCard({ score, hash, tier }: FingerprintScoreCardProps) {
  const isHighlyTrackable = tier === "Highly Identifiable";
  const isAnonymous = tier === "Anonymous";

  // Steer theme styles based on tracking threat levels
  const tierColor = isHighlyTrackable 
    ? "text-[var(--electric-red)] glow-red font-bold" 
    : isAnonymous 
    ? "text-[var(--neon-green)] glow-green font-bold" 
    : "text-cyan-400 font-bold";

  const cardVariant = isHighlyTrackable ? "red" : "green";

  return (
    <GlowCard variant={cardVariant} className="flex flex-col md:flex-row gap-6 items-center justify-between overflow-hidden relative">
      <div className="space-y-4 flex-1 w-full">
        <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500">// THREAT RADAR INDEX</div>
        
        <div className="space-y-1">
          <h2 className="text-lg font-mono font-bold text-white tracking-tight">Identity Tracking Status</h2>
          <div className="text-xs font-mono text-gray-300">
            Current Tier: <span className={tierColor}>{tier}</span>
          </div>
        </div>

        <div className="bg-[#050508] p-3 rounded border border-[rgba(0,255,136,0.1)] font-mono text-[10px] text-gray-400 break-all space-y-1">
          <span className="text-gray-500 font-semibold block">// HARDWARE TELEMETRY HASH (SHA-256):</span>
          <span className="text-white select-all">{hash || "000000000000000000000000000000000000000000000000000000"}</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-[#050508] p-5 rounded border border-[rgba(0,255,136,0.15)] w-full md:w-44 text-center font-mono select-none">
        <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-semibold mb-1">UNIFIED SINGULARITY</span>
        
        <div className="text-5xl font-extrabold text-white flex items-baseline justify-center">
          <AnimatedCounter value={score} duration={1000} />
          <span className="text-sm text-gray-400 font-normal ml-0.5">%</span>
        </div>
        
        <p className="text-[9px] text-gray-400 mt-2 leading-relaxed">
          Browser configurations match less than {(100 - score).toFixed(1)}% of global traffic.
        </p>
      </div>
    </GlowCard>
  );
}
