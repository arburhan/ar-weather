import type { WeatherData } from "@/types";

// UI ডিজাইনের জন্য static dummy data। পরে এখানে আসল API-র data বসবে।
export const dummyWeather: WeatherData = {
  current: {
    location: "Dhaka, Bangladesh",
    temp: 29,
    feelsLike: 33,
    condition: "partly-cloudy-day",
    description: "Partly Cloudy",
    humidity: 74,
    windKph: 12,
  },
  hourly: [
    { time: "Now", temp: 29, condition: "partly-cloudy-day" },
    { time: "13:00", temp: 30, condition: "clear-day" },
    { time: "14:00", temp: 31, condition: "clear-day" },
    { time: "15:00", temp: 31, condition: "partly-cloudy-day" },
    { time: "16:00", temp: 30, condition: "cloudy" },
    { time: "17:00", temp: 28, condition: "rain" },
    { time: "18:00", temp: 27, condition: "drizzle" },
    { time: "19:00", temp: 26, condition: "clear-night" },
    { time: "20:00", temp: 26, condition: "partly-cloudy-night" },
    { time: "21:00", temp: 25, condition: "clear-night" },
    { time: "22:00", temp: 25, condition: "clear-night" },
    { time: "23:00", temp: 24, condition: "partly-cloudy-night" },
  ],
  daily: [
    { date: "2026-07-14", day: "Today", high: 31, low: 24, condition: "partly-cloudy-day", precipitation: 0.0 },
    { date: "2026-07-15", day: "Tue",   high: 32, low: 25, condition: "clear-day",         precipitation: 0.0 },
    { date: "2026-07-16", day: "Wed",   high: 30, low: 24, condition: "rain",               precipitation: 4.2 },
    { date: "2026-07-17", day: "Thu",   high: 28, low: 23, condition: "thunderstorm",       precipitation: 8.5 },
    { date: "2026-07-18", day: "Fri",   high: 29, low: 23, condition: "cloudy",             precipitation: 0.5 },
    { date: "2026-07-19", day: "Sat",   high: 31, low: 24, condition: "overcast",           precipitation: 0.0 },
    { date: "2026-07-20", day: "Sun",   high: 32, low: 25, condition: "clear-day",          precipitation: 0.0 },
  ],
};
