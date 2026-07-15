"use client";

import { useState, useTransition } from "react";
import { MapPin, RefreshCw, LocateFixed } from "lucide-react";
import { getWeatherAction } from "@/lib/actions";
import DesktopWeather from "./DesktopWeather";
import MobileWeather from "./MobileWeather";
import type { WeatherData } from "@/types";

interface WeatherAppProps {
  initialData: WeatherData;
}

type LocationState = "idle" | "locating" | "fetching" | "done" | "error";

export default function WeatherApp({ initialData }: WeatherAppProps) {
  const [weatherData, setWeatherData] = useState<WeatherData>(initialData);
  const [locationState, setLocationState] = useState<LocationState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ── Browser Geolocation → Server Action ──────────────────────────────
  const handleLocate = () => {
    if (!navigator.geolocation) {
      setErrorMsg("এই ব্রাউজার Geolocation support করে না।");
      setLocationState("error");
      return;
    }

    setLocationState("locating");
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationState("fetching");

        // Nominatim দিয়ে reverse geocoding — location name পাই
        let locationName: string | undefined;
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const geoData = await geoRes.json();
          const city =
            geoData.address?.city ??
            geoData.address?.town ??
            geoData.address?.village ??
            geoData.address?.county;
          const country = geoData.address?.country;
          if (city && country) locationName = `${city}, ${country}`;
          else if (geoData.display_name) locationName = geoData.display_name.split(",").slice(0, 2).join(",").trim();
        } catch {
          // geocoding ব্যর্থ হলে শুধু coordinates দেখাবো
        }

        // Server Action call — API key server-side এ থাকে
        startTransition(async () => {
          const result = await getWeatherAction(latitude, longitude, locationName);
          if (result.error) {
            setErrorMsg(result.error);
            setLocationState("error");
          } else {
            setWeatherData(result.data);
            setLocationState("done");
          }
        });
      },
      (err) => {
        setLocationState("error");
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg("Location permission দেওয়া হয়নি। Browser settings থেকে allow করুন।");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setErrorMsg("আপনার location এখন পাওয়া যাচ্ছে না।");
        } else {
          setErrorMsg("Location নিতে সময় বেশি লাগছে। আবার চেষ্টা করুন।");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // ── Button label & icon ──────────────────────────────────────────────
  const isLoading = locationState === "locating" || locationState === "fetching" || isPending;

  const buttonLabel =
    locationState === "locating" ? "Location নেওয়া হচ্ছে..." :
      locationState === "fetching" ? "Weather আনা হচ্ছে..." :
        isPending ? "আপডেট হচ্ছে..." :
          "my current Location";

  return (
    <div className="relative">
      {/* ── Location Button ──────────────────────────────────────────── */}
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex flex-col items-center gap-2">
        {/* Error toast */}
        {locationState === "error" && errorMsg && (
          <div className="rounded-xl bg-red-500/90 px-4 py-2 text-sm text-white shadow-lg backdrop-blur max-w-xs text-center">
            {errorMsg}
          </div>
        )}

        <button
          id="locate-btn"
          onClick={handleLocate}
          disabled={isLoading}
          aria-label="আমার বর্তমান location অনুযায়ী weather দেখাও"
          className={`
            group flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold
            shadow-lg ring-1 transition-all duration-300
            ${isLoading
              ? "cursor-not-allowed bg-white/60 text-zinc-400 ring-black/5 dark:bg-white/10 dark:text-zinc-500 dark:ring-white/10"
              : locationState === "done"
                ? "bg-emerald-500 text-white ring-emerald-400/50 hover:bg-emerald-600 shadow-emerald-500/30"
                : "bg-white/80 text-zinc-800 ring-black/10 hover:bg-white hover:shadow-xl dark:bg-slate-800/90 dark:text-zinc-100 dark:ring-white/10 dark:hover:bg-slate-700"
            }
            backdrop-blur
          `}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : locationState === "done" ? (
            <LocateFixed className="h-4 w-4" />
          ) : (
            <MapPin className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          )}
          <span>{buttonLabel}</span>
        </button>
      </div>

      {/* ── Weather Display ──────────────────────────────────────────── */}
      <div className="md:hidden">
        <MobileWeather data={weatherData} />
      </div>
      <div className="hidden md:block">
        <DesktopWeather data={weatherData} />
      </div>
    </div>
  );
}
