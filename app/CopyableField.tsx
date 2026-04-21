"use client";

import { useState, useCallback } from "react";

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function CopyableField({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [value]);

  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-lg bg-white/60 border border-pink-light/50 py-2.5 px-3 ${className}`}
    >
      <span className="text-foreground text-base font-light truncate flex-1 min-w-0">{value}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 p-1 text-pink hover:text-foreground transition-colors rounded"
        aria-label="Copy"
      >
        {copied ? (
          <CheckIcon className="w-4 h-4 text-accent-green" />
        ) : (
          <CopyIcon className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
