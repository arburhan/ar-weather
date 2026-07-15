import Link from "next/link";
import type { Metadata } from "next";
import GoBackButton from "@/components/go-back-button";
import WeatherIcon from "@/components/weather/WeatherIcon";
import AutoRedirect from "@/components/auto-redirect";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-24 text-foreground">
      {/* Ambient glow blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.6_0.22_264)_0%,transparent_70%)] opacity-20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 size-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.65_0.2_310)_0%,transparent_70%)] opacity-15 blur-3xl"
      />

      {/* Decorative grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(oklch(0.5_0_0/0.04)_1px,transparent_1px),linear-gradient(90deg,oklch(0.5_0_0/0.04)_1px,transparent_1px)] bg-[size:64px_64px]"
      />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        {/* Rain weather icon */}
        <div className="drop-shadow-[0_0_32px_oklch(0.6_0.22_264/0.4)]">
          <WeatherIcon condition="rain" size={160} loop />
        </div>

        {/* Giant 404 */}
        <div className="relative select-none -mt-4">
          <span
            className="block text-[clamp(5rem,16vw,10rem)] font-black leading-none tracking-tighter text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, oklch(0.85 0.12 264) 0%, oklch(0.65 0.22 264) 40%, oklch(0.6 0.2 310) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            404
          </span>
          {/* Echo / ghost text */}
          <span
            aria-hidden="true"
            className="absolute inset-0 block text-[clamp(5rem,16vw,10rem)] font-black leading-none tracking-tighter text-transparent opacity-10 blur-sm"
            style={{
              backgroundImage:
                "linear-gradient(135deg, oklch(0.85 0.12 264) 0%, oklch(0.65 0.22 264) 40%, oklch(0.6 0.2 310) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            404
          </span>
        </div>

        {/* Divider */}
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Heading */}
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            cant find this page
          </h1>
          <p className="max-w-sm text-base text-muted-foreground sm:text-lg">
            The page you are looking for doesnt exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            id="not-found-go-home"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
            style={{
              backgroundImage:
                "linear-gradient(135deg, oklch(0.45 0.2 264) 0%, oklch(0.55 0.22 310) 100%)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Go To Home Page
          </Link>

          <GoBackButton />
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
          <span className="size-1.5 animate-pulse rounded-full bg-destructive" />
          HTTP 404 — Not Found
        </div>

        {/* Auto redirect countdown */}
        <AutoRedirect seconds={5} />
      </div>
    </main>
  );
}
