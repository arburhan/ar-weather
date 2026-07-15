
import { WeatherData } from "@/types";
import HourlyStrip from "./HourlyStrip";
import WeatherIcon from "./WeatherIcon";

// ডেস্কটপ layout — বড় স্ক্রিনের জন্য (md এবং তার উপরে দেখানো হয়)।
export default function DesktopWeather({ data }: { data: WeatherData }) {
  const { current, hourly, daily } = data;

  // 7 দিনের মধ্যে সর্বোচ্চ ও সর্বনিম্ন — temp range bar scale করতে
  const allHighs = daily.map((d) => d.high);
  const allLows  = daily.map((d) => d.low);
  const rangeMin = Math.min(...allLows);
  const rangeMax = Math.max(...allHighs);

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-10">

      {/* ── Current ─────────────────────────────────────────────────── */}
      <section className="flex items-center justify-between rounded-3xl bg-white/60 p-10 shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-white/5 dark:ring-white/10">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            {current.location}
          </p>
          <div className="mt-2 flex items-start gap-1">
            <span className="text-7xl font-semibold tracking-tight">{current.temp}</span>
            <span className="mt-2 text-3xl text-zinc-500 dark:text-zinc-400">°C</span>
          </div>
          <p className="mt-1 text-lg text-zinc-600 dark:text-zinc-300">{current.description}</p>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Feels like {current.feelsLike}° · Wind {current.windKph} km/h
          </p>
        </div>
        <WeatherIcon condition={current.condition} size={180} />
      </section>

      {/* ── Hourly ──────────────────────────────────────────────────── */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Hourly
        </h2>
        <HourlyStrip hourly={hourly} iconSize={44} itemsPerView={7} />
      </section>

      {/* ── 7-Day Forecast ──────────────────────────────────────────── */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          7-Day Forecast
        </h2>

        <div className="overflow-hidden rounded-3xl bg-white/60 ring-1 ring-black/5 backdrop-blur dark:bg-white/5 dark:ring-white/10">
          {daily.map((d, idx) => {
            // temp bar: low ও high-এর position 7 দিনের global range এর মধ্যে
            const lowPct  = ((d.low  - rangeMin) / (rangeMax - rangeMin)) * 100;
            const highPct = ((d.high - rangeMin) / (rangeMax - rangeMin)) * 100;
            const barLeft  = `${lowPct}%`;
            const barWidth = `${highPct - lowPct}%`;
            const isToday  = idx === 0;

            return (
              <div
                key={d.date}
                className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                  idx < daily.length - 1 ? "border-b border-black/5 dark:border-white/5" : ""
                } ${isToday ? "bg-sky-50/60 dark:bg-sky-900/20" : ""}`}
              >
                {/* Day label */}
                <span className={`w-14 shrink-0 text-sm ${isToday ? "font-bold text-sky-600 dark:text-sky-400" : "font-medium text-zinc-700 dark:text-zinc-300"}`}>
                  {d.day}
                </span>

                {/* Weather icon */}
                <WeatherIcon condition={d.condition} size={40} className="shrink-0" />

                {/* Precipitation */}
                <div className="w-12 shrink-0 text-center">
                  {d.precipitation > 0 ? (
                    <span className="text-xs font-medium text-blue-500 dark:text-blue-400">
                      {d.precipitation}mm
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-300 dark:text-zinc-600">—</span>
                  )}
                </div>

                {/* Low temp */}
                <span className="w-10 shrink-0 text-right text-sm text-zinc-400 dark:text-zinc-500">
                  {d.low}°
                </span>

                {/* Range bar */}
                <div className="relative h-1.5 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className="absolute inset-y-0 rounded-full bg-gradient-to-r from-sky-400 to-amber-400"
                    style={{ left: barLeft, width: barWidth }}
                  />
                </div>

                {/* High temp */}
                <span className="w-10 shrink-0 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
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
