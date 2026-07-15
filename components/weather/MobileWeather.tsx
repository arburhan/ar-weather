
import WeatherIcon from "./WeatherIcon";
import HourlyStrip from "./HourlyStrip";
import { WeatherData } from "@/types";

// মোবাইল layout — ছোট স্ক্রিনের জন্য (md-এর নিচে দেখানো হয়)।
// সেকশনগুলো উপর-নিচে স্ট্যাক করা, touch scroll-বান্ধব।
export default function MobileWeather({ data }: { data: WeatherData }) {
  const { current, hourly, daily } = data;

  // 7 দিনের global temp range — bar scale করতে
  const allHighs = daily.map((d) => d.high);
  const allLows = daily.map((d) => d.low);
  const rangeMin = Math.min(...allLows);
  const rangeMax = Math.max(...allHighs);

  return (
    <div className="mx-auto w-full max-w-md px-4 py-6">

      {/* ── Current ─────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center rounded-3xl bg-white/60 px-6 py-8 text-center shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-white/5 dark:ring-white/10">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          {current.location}
        </p>
        <WeatherIcon condition={current.condition} size={140} />
        <div className="mt-1 flex items-start gap-1">
          <span className="text-6xl font-semibold tracking-tight">{current.temp}</span>
          <span className="mt-2 text-2xl text-zinc-500 dark:text-zinc-400">°C</span>
        </div>
        <p className="mt-1 text-base text-zinc-600 dark:text-zinc-300">{current.description}</p>
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          Feels like {current.feelsLike}° · Wind {current.windKph} km/h
        </p>
      </section>

      {/* ── Hourly ──────────────────────────────────────────────────── */}
      <section className="mt-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Hourly
        </h2>
        <HourlyStrip hourly={hourly} iconSize={40} itemsPerView={4} />
      </section>

      {/* ── 7-Day Forecast ──────────────────────────────────────────── */}
      <section className="mt-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          7-Day Forecast
        </h2>

        <div className="overflow-hidden rounded-3xl bg-white/60 ring-1 ring-black/5 backdrop-blur dark:bg-white/5 dark:ring-white/10">
          {daily.map((d, idx) => {
            const lowPct = ((d.low - rangeMin) / (rangeMax - rangeMin)) * 100;
            const highPct = ((d.high - rangeMin) / (rangeMax - rangeMin)) * 100;
            const barLeft = `${lowPct}%`;
            const barWidth = `${highPct - lowPct}%`;
            const isToday = idx === 0;

            return (
              <div
                key={d.date}
                className={`flex items-center gap-3 px-4 py-3 ${idx < daily.length - 1 ? "border-b border-black/5 dark:border-white/5" : ""
                  } ${isToday ? "bg-sky-50/60 dark:bg-sky-900/20" : ""}`}
              >
                {/* Day label */}
                <span className={`w-11 shrink-0 text-xs ${isToday ? "font-bold text-sky-600 dark:text-sky-400" : "font-medium text-zinc-700 dark:text-zinc-300"}`}>
                  {d.day}
                </span>

                {/* Icon */}
                <WeatherIcon condition={d.condition} size={32} className="shrink-0" />

                {/* Precipitation */}
                <div className="w-10 shrink-0 text-center">
                  {d.precipitation > 0 ? (
                    <span className="text-xs font-medium text-blue-500 dark:text-blue-400">
                      {d.precipitation}mm
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-300 dark:text-zinc-600">—</span>
                  )}
                </div>

                {/* Low */}
                <span className="w-8 shrink-0 text-right text-xs text-zinc-400 dark:text-zinc-500">
                  {d.low}°
                </span>

                {/* Bar */}
                <div className="relative h-1.5 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className="absolute inset-y-0 rounded-full bg-linear-to-r from-sky-400 to-amber-400"
                    style={{ left: barLeft, width: barWidth }}
                  />
                </div>

                {/* High */}
                <span className="w-8 shrink-0 text-xs font-semibold text-zinc-800 dark:text-zinc-100">
                  {d.high}°
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
