import React, { useEffect, useRef } from "react";

interface LiveDataFeedProps {
  logs: string[];
}

export function LiveDataFeed({ logs }: LiveDataFeedProps) {
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className="h-56 overflow-y-auto font-mono text-[11px] text-[var(--neon-green)] bg-[#030305] p-4 rounded border border-[rgba(0,255,136,0.15)] space-y-2 custom-scrollbar">
      {logs.length === 0 ? (
        <div className="text-gray-600 animate-pulse h-full flex items-center justify-center">
          // TERMINAL INERT. AWAITING SCAN INITIALIZATION COMMAND.
        </div>
      ) : (
        <>
          {logs.map((line, idx) => (
            <div key={idx} className="leading-relaxed break-all">
              <span className="text-gray-600 select-none mr-2">&gt;&gt;</span>
              {line}
            </div>
          ))}
          <div ref={terminalBottomRef} />
        </>
      )}
    </div>
  );
}
