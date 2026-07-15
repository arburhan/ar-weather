"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AutoRedirect({ seconds = 5 }: { seconds?: number }) {
  const [count, setCount] = useState(seconds);
  const router = useRouter();

  useEffect(() => {
    if (count <= 0) {
      router.push("/");
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, router]);

  // progress: 0 → 1 as countdown runs
  const progress = (seconds - count) / seconds;
  const circumference = 2 * Math.PI * 18; // r=18

  return (
    <div
      className="flex flex-col items-center gap-2"
      role="status"
      aria-live="polite"
      aria-label={`Redirecting to home in ${count} seconds`}
    >
      {/* Circular countdown ring */}
      <div className="relative flex items-center justify-center">
        <svg
          width="56"
          height="56"
          viewBox="0 0 44 44"
          className="-rotate-90"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="22"
            cy="22"
            r="18"
            fill="none"
            stroke="oklch(0.5 0 0 / 0.15)"
            strokeWidth="3"
          />
          {/* Progress */}
          <circle
            cx="22"
            cy="22"
            r="18"
            fill="none"
            stroke="url(#countdown-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            style={{ transition: "stroke-dashoffset 0.9s linear" }}
          />
          <defs>
            <linearGradient id="countdown-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="oklch(0.65 0.22 264)" />
              <stop offset="100%" stopColor="oklch(0.6 0.2 310)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Number in center */}
        <span className="absolute text-lg font-bold tabular-nums text-foreground">
          {count}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        Redirecting to home in{" "}
        <span className="font-semibold text-foreground">{count}s</span>
      </p>
    </div>
  );
}
