import React from "react";

interface GlowCardProps {
  children: React.ReactNode;
  variant?: "green" | "red";
  className?: string;
}

export function GlowCard({ children, variant = "green", className = "" }: GlowCardProps) {
  const panelStyle = variant === "green" ? "terminal-panel" : "terminal-panel-red";
  
  return (
    <div className={`p-5 rounded-lg ${panelStyle} ${className}`}>
      {children}
    </div>
  );
}
