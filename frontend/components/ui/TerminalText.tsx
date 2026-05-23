import React, { useState, useEffect } from "react";

interface TerminalTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export function TerminalText({ text, speed = 15, className = "" }: TerminalTextProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    if (!text) return;

    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return <span className={`${className} typing-cursor`}>{displayedText}</span>;
}
