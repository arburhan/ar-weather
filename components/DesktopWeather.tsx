
import { WeatherData } from "@/lib/types";
import HourlyStrip from "./HourlyStrip";


import WeatherIcon from "./WeatherIcon";

// ডেস্কটপ layout — বড় স্ক্রিনের জন্য (md এবং তার উপরে দেখানো হয়)।
export default function DesktopWeather({ data }: { data: WeatherData }) {
  const { current, hourly, daily } = data;

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-10">
      {/* Current — বড় আইকন + temp */}
      <section className="flex items-center justify-between rounded-3xl bg-white/60 p-10 shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-white/5 dark:ring-white/10">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            {current.location}
          </p>
          <div className="mt-2 flex items-start gap-1">
            <span className="text-7xl font-semibold tracking-tight">
              {current.temp}
            </span>
            <span className="mt-2 text-3xl text-zinc-500 dark:text-zinc-400">°C</span>
          </div>
          <p className="mt-1 text-lg text-zinc-600 dark:text-zinc-300">
            {current.description}
          </p>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Feels like {current.feelsLike}° · Humidity {current.humidity}% · Wind{" "}
            {current.windKph} km/h
          </p>
        </div>
        <WeatherIcon condition={current.condition} size={180} />
      </section>

      {/* Hourly — নিজে নিজে স্মুদভাবে স্লাইড হয় */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Hourly
        </h2>
        <HourlyStrip hourly={hourly} iconSize={44} itemsPerView={7} />
      </section>

      {/* Daily / Weekly — কার্ড */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          7-Day Forecast
        </h2>
        <div className="grid grid-cols-7 gap-3">
          {daily.map((d) => (
            <div
              key={d.day}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white/60 px-2 py-4 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10"
            >
              <span className="text-sm font-medium">{d.day}</span>
              <WeatherIcon condition={d.condition} size={48} />
              <div className="flex gap-1 text-sm">
                <span className="font-medium">{d.high}°</span>
                <span className="text-zinc-400">{d.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
