import React from "react";

interface ScanningBarProps {
  active: boolean;
}

export function ScanningBar({ active }: ScanningBarProps) {
  if (!active) return null;
  
  return (
    <>
      {/* Dynamic sweeping overlay */}
      <div className="scanner-beam" />
      <div className="fixed inset-0 bg-[rgba(0,255,136,0.03)] pointer-events-none z-40" />
    </>
  );
}
