
import WeatherIcon from "./WeatherIcon";
import HourlyStrip from "./HourlyStrip";
import { WeatherData } from "@/lib/types";

// মোবাইল layout — ছোট স্ক্রিনের জন্য (md-এর নিচে দেখানো হয়)।
// সেকশনগুলো উপর-নিচে স্ট্যাক করা, touch scroll-বান্ধব।
export default function MobileWeather({ data }: { data: WeatherData }) {
  const { current, hourly, daily } = data;

  return (
    <div className="mx-auto w-full max-w-md px-4 py-6">
      {/* Current — কেন্দ্রে বড় আইকন + temp */}
      <section className="flex flex-col items-center rounded-3xl bg-white/60 px-6 py-8 text-center shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-white/5 dark:ring-white/10">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          {current.location}
        </p>
        <WeatherIcon condition={current.condition} size={140} />
        <div className="mt-1 flex items-start gap-1">
          <span className="text-6xl font-semibold tracking-tight">
            {current.temp}
          </span>
          <span className="mt-2 text-2xl text-zinc-500 dark:text-zinc-400">°C</span>
        </div>
        <p className="mt-1 text-base text-zinc-600 dark:text-zinc-300">
          {current.description}
        </p>
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          Feels like {current.feelsLike}° · Humidity {current.humidity}% · Wind{" "}
          {current.windKph} km/h
        </p>
      </section>

      {/* Hourly — অটো-স্ক্রলিং স্লাইডার */}
      <section className="mt-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Hourly
        </h2>
        <HourlyStrip hourly={hourly} iconSize={40} itemsPerView={4} />
      </section>

      {/* Daily / Weekly — লিস্ট (প্রতি সারিতে একটা দিন) */}
      <section className="mt-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          7-Day Forecast
        </h2>
        <div className="flex flex-col gap-2">
          {daily.map((d) => (
            <div
              key={d.day}
              className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-2.5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10"
            >
              <span className="w-10 text-sm font-medium">{d.day}</span>
              <WeatherIcon condition={d.condition} size={36} />
              <div className="ml-auto flex gap-2 text-sm">
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
