import type { WeatherCondition } from "@/types";

// ── Raw API Response Types ─────────────────────────────────────────────
export interface WeatherAICurrentRaw {
  time: string;          // "2026-07-15T19:00"
  interval: number;
  temperature: number;   // °C
  windspeed: number;     // km/h
  winddirection: number; // degrees
  is_day: 0 | 1;
  weathercode: number;   // WMO code
}

export interface WeatherAIDailyRaw {
  date: string;          // "2026-07-15"
  temp_max: number;
  temp_min: number;
  precipitation: number;
  weathercode: number;
}

export interface WeatherAIResponse {
  lat: number;
  lon: number;
  units: string;
  days: number;
  current: WeatherAICurrentRaw;
  daily: WeatherAIDailyRaw[];
}

// ── WMO Weathercode → WeatherCondition ────────────────────────────────
// রেফারেন্স: WMO Code Table 4677 (Open-Meteo ও weather-ai.co উভয়েই ব্যবহার করে)
// is_day দিয়ে day/night ভেরিয়েন্ট ঠিক হয়।
export function weathercodeToCondition(
  code: number,
  isDay: 0 | 1
): WeatherCondition {
  const day = isDay === 1;

  // 0 — Clear sky
  if (code === 0) return day ? "clear-day" : "clear-night";

  // 1 — Mainly clear
  if (code === 1) return day ? "clear-day" : "clear-night";

  // 2 — Partly cloudy
  if (code === 2) return day ? "partly-cloudy-day" : "partly-cloudy-night";

  // 3 — Overcast
  if (code === 3) return "overcast";

  // 45, 48 — Fog / Rime fog
  if (code === 45 || code === 48) return "fog";

  // 51–55 — Drizzle (light → dense)
  if (code >= 51 && code <= 55) return "drizzle";

  // 56–57 — Freezing drizzle
  if (code === 56 || code === 57) return "drizzle";

  // 61–65 — Rain (slight → heavy)
  if (code >= 61 && code <= 65) return "rain";

  // 66–67 — Freezing rain
  if (code === 66 || code === 67) return "rain";

  // 71–77 — Snow / Snow grains
  if (code >= 71 && code <= 77) return "snow";

  // 80–82 — Rain showers (slight → violent)
  if (code >= 80 && code <= 82) return "rain";

  // 83–84 — Sleet showers
  if (code === 83 || code === 84) return "sleet";

  // 85–86 — Snow showers
  if (code === 85 || code === 86) return "snow";

  // 95 — Thunderstorm (slight/moderate)
  if (code === 95) return "thunderstorm";

  // 96, 99 — Thunderstorm with hail
  if (code === 96 || code === 99) return "thunderstorm";

  // 85+ cloudy fallback
  if (code > 3 && code < 45) return "cloudy";

  // Default fallback
  return day ? "clear-day" : "clear-night";
}

// ── WMO Weathercode → Human-readable description ───────────────────────
const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Icy Fog",
  51: "Light Drizzle",
  53: "Drizzle",
  55: "Heavy Drizzle",
  56: "Light Freezing Drizzle",
  57: "Freezing Drizzle",
  61: "Light Rain",
  63: "Rain",
  65: "Heavy Rain",
  66: "Light Freezing Rain",
  67: "Freezing Rain",
  71: "Light Snow",
  73: "Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Rain Showers",
  81: "Showers",
  82: "Heavy Showers",
  83: "Sleet Showers",
  84: "Heavy Sleet Showers",
  85: "Snow Showers",
  86: "Heavy Snow Showers",
  95: "Thunderstorm",
  96: "Thunderstorm with Hail",
  99: "Heavy Thunderstorm",
};

export function weathercodeToDescription(code: number): string {
  return WMO_DESCRIPTIONS[code] ?? "Unknown";
}

// ── API Fetch ──────────────────────────────────────────────────────────
const BASE_URL = "https://api.weather-ai.co/v1/weather";

function getApiKey(): string {
  const key = process.env.weather_api;
  if (!key) throw new Error("weather_api key is missing from .env.local");
  return key;
}

// নির্দিষ্ট lat/lon দিয়ে weather fetch — server action ও page দুটো থেকে ব্যবহার হয়।
export async function fetchWeatherByCoords(
  lat: number | string,
  lon: number | string,
  cacheSeconds = 600
): Promise<WeatherAIResponse> {
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getApiKey()}` },
    next: { revalidate: cacheSeconds },
  });

  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<WeatherAIResponse>;
}

// .env.local এর default location দিয়ে fetch — page.tsx initial load এ ব্যবহার হয়।
export async function fetchCurrentWeather(): Promise<WeatherAIResponse> {
  const lat = process.env.WEATHER_LAT  ?? "23.8103";
  const lon = process.env.WEATHER_LON  ?? "90.4125";
  // user-triggered refresh হলে cache নেই (0) — page load এ 10 মিনিট cache
  return fetchWeatherByCoords(lat, lon, 600);
}
