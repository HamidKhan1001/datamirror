import React, { useEffect, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ value, duration = 1200, className = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.round(value);
    if (start === end) {
      setCount(end);
      return;
    }

    const stepMs = Math.max(10, Math.floor(duration / Math.max(1, end)));
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, stepMs);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span className={className}>{count}</span>;
}
