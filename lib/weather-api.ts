import type { WeatherCondition, WeatherData, HourlyForecast, DailyForecast } from "@/types";

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

  if (code === 0) return day ? "clear-day" : "clear-night";
  if (code === 1) return day ? "clear-day" : "clear-night";
  if (code === 2) return day ? "partly-cloudy-day" : "partly-cloudy-night";
  if (code === 3) return "overcast";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 55) return "drizzle";
  if (code === 56 || code === 57) return "drizzle";
  if (code >= 61 && code <= 65) return "rain";
  if (code === 66 || code === 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code === 83 || code === 84) return "sleet";
  if (code === 85 || code === 86) return "snow";
  if (code === 95) return "thunderstorm";
  if (code === 96 || code === 99) return "thunderstorm";
  if (code > 3 && code < 45) return "cloudy";

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

// ── Day abbreviation ───────────────────────────────────────────────────
// "2026-07-15" → "Mon". noon offset দিয়ে timezone shift avoid করি।
function formatDayAbbr(dateStr: string): string {
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const d = new Date(`${dateStr}T12:00:00`);
  return DAYS[d.getDay()];
}

// ── Hourly derivation from current + daily ─────────────────────────────
// API-তে hourly endpoint নেই — daily max/min + sinusoidal curve দিয়ে
// পরবর্তী 12 ঘণ্টার realistic hourly forecast তৈরি করি।
//
// Temp curve মডেল (সাধারণ meteorological pattern):
//   • সর্বনিম্ন: ভোর ৫টায় (05:00)
//   • সর্বোচ্চ:  বিকাল ২টায় (14:00)
//   • sin-curve দিয়ে smooth interpolation
function deriveHourlyForecast(
  current: WeatherAICurrentRaw,
  daily: WeatherAIDailyRaw[],
  count = 12
): HourlyForecast[] {
  const hourly: HourlyForecast[] = [];
  // current.time = "2026-07-15T19:00" — local datetime
  const startMs = new Date(current.time).getTime();

  for (let i = 0; i < count; i++) {
    const slotMs   = startMs + i * 60 * 60 * 1000;
    const slotDate = new Date(slotMs);
    const hour     = slotDate.getHours();

    // কোন day-এর data নেব (আজ = 0, কাল = 1 ...)
    const startMidnight = new Date(new Date(current.time).toDateString()).getTime();
    const dayOffset = Math.floor((slotMs - startMidnight) / (24 * 60 * 60 * 1000));
    const dayData   = daily[Math.min(dayOffset, daily.length - 1)] ?? daily[daily.length - 1];

    // ── Sinusoidal temp curve ──────────────────────────────────────────
    // min at 05:00, max at 14:00 → phase shift = 5h, period = 24h
    // formula: T = avg + amplitude * sin(2π/24 * (hour - minHour - 6))
    // simplified: fraction 0→1 peak at 14:00
    const MIN_HOUR = 5;
    const MAX_HOUR = 14;
    const cycleHour = ((hour - MIN_HOUR) + 24) % 24; // 0 at min, 9 at max
    const phaseRad  = (cycleHour / (MAX_HOUR - MIN_HOUR)) * Math.PI;
    const fraction  = Math.max(0, Math.sin(phaseRad));  // 0..1

    const temp = Math.round(
      dayData.temp_min + fraction * (dayData.temp_max - dayData.temp_min)
    );

    // ── Day/night for condition icon ───────────────────────────────────
    const isDay: 0 | 1 = (hour >= 6 && hour < 20) ? 1 : 0;

    // ── Label ─────────────────────────────────────────────────────────
    const label = i === 0
      ? "Now"
      : `${String(hour).padStart(2, "0")}:00`;

    hourly.push({
      time:      label,
      temp,
      condition: weathercodeToCondition(dayData.weathercode, isDay),
    });
  }

  return hourly;
}

// ── Map full API response → app's WeatherData ──────────────────────────
// এই function-টি page.tsx ও server action — দুটো থেকেই ব্যবহার হয়।
export function mapWeatherResponse(
  apiResponse: WeatherAIResponse,
  locationName: string
): WeatherData {
  const { current, daily } = apiResponse;

  // প্রথম দিন "Today" দেখাবো — বাকিগুলো weekday abbreviation।
  const mappedDaily: DailyForecast[] = daily.map((d, idx) => ({
    date:          d.date,
    day:           idx === 0 ? "Today" : formatDayAbbr(d.date),
    high:          Math.round(d.temp_max),
    low:           Math.round(d.temp_min),
    condition:     weathercodeToCondition(d.weathercode, 1), // daily = daytime icon
    precipitation: Math.round(d.precipitation * 10) / 10,   // 1 দশমিক পর্যন্ত mm
  }));

  return {
    current: {
      location:    locationName,
      temp:        Math.round(current.temperature),
      feelsLike:   Math.round(current.temperature), // API-তে feels_like নেই
      condition:   weathercodeToCondition(current.weathercode, current.is_day),
      description: weathercodeToDescription(current.weathercode),
      humidity:    0,           // current endpoint-এ humidity নেই
      windKph:     current.windspeed,
    },
    hourly: deriveHourlyForecast(current, daily, 12),
    daily:  mappedDaily,
  };
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
  const lat = process.env.WEATHER_LAT ?? "23.8103";
  const lon = process.env.WEATHER_LON ?? "90.4125";
  return fetchWeatherByCoords(lat, lon, 600);
}
