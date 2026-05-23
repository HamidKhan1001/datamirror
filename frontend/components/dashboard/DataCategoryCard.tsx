import React from "react";
import { GlowCard } from "../ui/GlowCard";

interface DataCategoryCardProps {
  title: string;
  data: Record<string, any>;
  iconLabel?: string;
}

export function DataCategoryCard({ title, data, iconLabel = "// SENSOR TELEMETRY" }: DataCategoryCardProps) {
  return (
    <GlowCard className="h-full flex flex-col justify-between overflow-hidden relative">
      {/* Visual background CRT scanning grid segment */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-[linear-gradient(135deg,transparent_75%,rgba(0,255,136,0.03)_100%)] pointer-events-none" />

      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[rgba(0,255,136,0.1)] pb-2 font-mono text-[9px] tracking-wider">
          <span className="text-gray-500 uppercase font-semibold">{iconLabel}</span>
          <span className="text-[var(--neon-green)] uppercase font-bold glow-green">{title}</span>
        </div>

        <div className="space-y-1.5 font-mono text-[11px] leading-relaxed">
          {Object.entries(data).map(([key, val]) => (
            <div key={key} className="flex justify-between items-start gap-4">
              <span className="text-gray-500 lowercase select-none truncate max-w-[130px]" title={key}>
                {key}:
              </span>
              <span 
                className={`text-right select-all truncate max-w-[190px] font-semibold ${
                  val === true 
                    ? "text-[var(--neon-green)]" 
                    : val === false 
                    ? "text-[var(--electric-red)]" 
                    : "text-gray-200"
                }`}
                title={String(val)}
              >
                {typeof val === "boolean" ? (val ? "enabled" : "disabled") : String(val ?? "n/a")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlowCard>
  );
}
