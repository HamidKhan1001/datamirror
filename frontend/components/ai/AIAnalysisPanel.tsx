import React, { useState } from "react";
import { GlowCard } from "../ui/GlowCard";
import { TerminalText } from "../ui/TerminalText";
import { AIAnalysisResponse } from "../../lib/types/browser-profile";

interface AIAnalysisPanelProps {
  analysis: AIAnalysisResponse;
}

export function AIAnalysisPanel({ analysis }: AIAnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "cpm" | "vulnerabilities" | "protection">("profile");

  const { ad_profile, data_valuation, dark_patterns, protection_advice } = analysis;

  const tabClass = (tab: typeof activeTab) => 
    `py-2 px-3 border font-mono text-xs uppercase transition-all duration-150 ${
      activeTab === tab 
        ? "bg-[var(--neon-green)] text-[#050508] border-[var(--neon-green)] font-bold shadow-[0_0_10px_rgba(0,255,136,0.2)]" 
        : "bg-transparent text-gray-400 border-[rgba(0,255,136,0.15)] hover:border-[rgba(0,255,136,0.4)]"
    }`;

  return (
    <div className="space-y-6">
      
      {/* Title & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[rgba(0,255,136,0.15)] pb-4 gap-4">
        <div>
          <h3 className="text-xl font-mono text-[var(--neon-green)] glow-green">
            // AI RECONNAISSANCE ANALYSIS (SIMULATED COGNITIVE LAYER)
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Calculated offline locally on CPU to guarantee zero PII transmission & 100% free operation.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 flex-wrap select-none">
          <button onClick={() => setActiveTab("profile")} className={tabClass("profile")}>
            Ad Profile
          </button>
          <button onClick={() => setActiveTab("cpm")} className={tabClass("cpm")}>
            Ad Valuation
          </button>
          <button onClick={() => setActiveTab("vulnerabilities")} className={tabClass("vulnerabilities")}>
            Dark Patterns
          </button>
          <button onClick={() => setActiveTab("protection")} className={tabClass("protection")}>
            Mitigations
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="min-h-[300px]">

        {/* TAB 1: AD PROFILE */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Demographics Card */}
            <GlowCard className="space-y-4">
              <div className="border-b border-[rgba(0,255,136,0.08)] pb-2 font-mono text-xs text-[var(--neon-green)] font-semibold uppercase">
                // INFERRED PROFILE METADATA
              </div>
              <p className="text-sm font-mono text-gray-300 leading-relaxed min-h-[100px]">
                <TerminalText text={ad_profile.inferred_demographics} speed={10} />
              </p>
              <div className="bg-[#050508] p-3 rounded border border-[rgba(0,255,136,0.08)] font-mono text-xs">
                <span className="text-gray-500">estimated_income_bracket:</span>{" "}
                <span className="text-white font-bold">{ad_profile.income_bracket}</span>
              </div>
            </GlowCard>

            {/* Interests & Intent Cards */}
            <div className="space-y-6">
              <GlowCard className="space-y-3">
                <div className="font-mono text-xs text-[var(--neon-green)] uppercase font-semibold">
                  // COMMERCIALLY SEGMENTED INTEREST CHIPS
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {ad_profile.interests.map((interest, idx) => (
                    <span 
                      key={idx} 
                      className="py-1 px-2.5 rounded bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.15)] text-xs font-mono text-gray-200 select-all"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </GlowCard>

              <GlowCard className="space-y-3">
                <div className="font-mono text-xs text-[var(--neon-green)] uppercase font-semibold">
                  // PREDICTIVE PURCHASE SIGNALS
                </div>
                <ul className="space-y-2 font-mono text-xs text-gray-300 list-inside list-disc">
                  {ad_profile.purchase_intent_signals.map((signal, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {signal}
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </div>
          </div>
        )}

        {/* TAB 2: AD VALUATION */}
        {activeTab === "cpm" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* CPM Badge Card */}
            <GlowCard className="flex flex-col items-center justify-center text-center p-8 select-none">
              <span className="font-mono text-xs text-gray-500 uppercase tracking-widest block mb-1">
                ESTIMATED CPM VALUATION
              </span>
              <div className="text-6xl font-black text-white font-mono tracking-tight glow-green flex items-baseline justify-center">
                ${data_valuation.estimated_cpm_usd.toFixed(2)}
                <span className="text-lg text-gray-400 font-semibold ml-1">/ CPM</span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-3 max-w-[280px] leading-relaxed">
                This rate represents the theoretical auction value major exchanges charge advertisers to display 1,000 targeted banner impressions on your session.
              </p>
              <div className="mt-5 px-3 py-1 border border-cyan-400/30 bg-cyan-950/20 text-cyan-400 text-xs rounded font-mono uppercase font-bold">
                Tier Class: {data_valuation.valuation_tier}
              </div>
            </GlowCard>

            {/* Valuation Drivers */}
            <GlowCard className="space-y-4">
              <div className="border-b border-[rgba(0,255,136,0.08)] pb-2 font-mono text-xs text-[var(--neon-green)] font-semibold uppercase">
                // CRITICAL VALUATION PREMIUM COEFFICIENTS
              </div>
              <div className="space-y-3 font-mono text-xs text-gray-300">
                {data_valuation.factors.map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-[#050508] p-3 rounded border border-[rgba(0,255,136,0.08)]">
                    <span className="text-[var(--neon-green)] font-bold select-none">[+]</span>
                    <span className="leading-relaxed">{factor}</span>
                  </div>
                ))}
              </div>
            </GlowCard>
          </div>
        )}

        {/* TAB 3: DARK PATTERNS */}
        {activeTab === "vulnerabilities" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {dark_patterns.map((pattern, idx) => (
              <GlowCard key={idx} variant="red" className="flex flex-col justify-between p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-red-500/10 pb-2">
                    <span className="text-xs font-mono font-bold text-[var(--electric-red)] glow-red uppercase">
                      {pattern.name}
                    </span>
                    <span className="px-2 py-0.5 border border-red-500/30 bg-red-950/20 text-red-500 font-mono text-[9px] rounded font-semibold uppercase">
                      Severity: {pattern.severity}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-gray-300 leading-relaxed">
                    {pattern.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-red-500/10 font-mono text-[10px] text-gray-500 leading-relaxed">
                  System Vulnerability exploitation vector detected.
                </div>
              </GlowCard>
            ))}
          </div>
        )}

        {/* TAB 4: MITIGATIONS */}
        {activeTab === "protection" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {protection_advice.map((advice, idx) => (
              <GlowCard key={idx} className="flex flex-col justify-between p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[rgba(0,255,136,0.08)] pb-2">
                    <span className="text-xs font-mono font-bold text-white uppercase">
                      ACTION POINT {idx + 1}
                    </span>
                    <span className="px-1.5 py-0.5 border border-cyan-400/20 bg-cyan-950/20 text-cyan-400 font-mono text-[9px] rounded uppercase font-semibold">
                      {advice.difficulty}
                    </span>
                  </div>
                  
                  <h4 className="text-xs font-mono font-bold text-[var(--neon-green)] glow-green leading-snug">
                    {advice.action}
                  </h4>
                  
                  <p className="text-[11px] font-mono text-gray-300 leading-relaxed">
                    {advice.impact}
                  </p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-[rgba(0,255,136,0.08)] font-mono text-[9px] text-gray-500">
                  Recommended mitigative action vector.
                </div>
              </GlowCard>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
