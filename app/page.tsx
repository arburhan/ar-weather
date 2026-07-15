import WeatherApp from "@/components/weather/WeatherApp";
import {
  fetchCurrentWeather,
  weathercodeToCondition,
  weathercodeToDescription,
} from "@/lib/weather-api";
import { dummyWeather } from "@/data/weather-data";
import type { WeatherData } from "@/types";

// server component — initial data SSR দিয়ে আসে।
// location button click করলে WeatherApp client-side এ update করে।
export const revalidate = 600;

export default async function Home() {
  let initialData: WeatherData = dummyWeather;

  try {
    const apiResponse = await fetchCurrentWeather();
    const { current } = apiResponse;

    initialData = {
      current: {
        location: process.env.WEATHER_LOCATION ?? "Dhaka, Bangladesh",
        temp: Math.round(current.temperature),
        feelsLike: Math.round(current.temperature),
        condition: weathercodeToCondition(current.weathercode, current.is_day),
        description: weathercodeToDescription(current.weathercode),
        humidity: 0,
        windKph: current.windspeed,
      },
      hourly: dummyWeather.hourly,
      daily: dummyWeather.daily,
    };
  } catch (err) {
    console.error("[Weather Page]", err);
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-sky-100 to-sky-50 text-zinc-900 dark:from-slate-900 dark:to-slate-950 dark:text-zinc-50">
      {/* WeatherApp: server data দিয়ে শুরু, button click এ real location এ switch করে */}
      <WeatherApp initialData={initialData} />
    </div>
  );
}
