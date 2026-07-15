"use server";

import {
  fetchWeatherByCoords,
  mapWeatherResponse,
} from "@/lib/weather-api";
import { dummyWeather } from "@/data/weather-data";
import type { WeatherData } from "@/types";

// Client থেকে lat/lon নিয়ে weather data fetch করে return করে।
// API key server-side এ থাকে — client কখনো দেখতে পায় না।
export async function getWeatherAction(
  lat: number,
  lon: number,
  locationName?: string
): Promise<{ data: WeatherData; error?: string }> {
  try {
    // lat/lon validate করি — client input বিশ্বাস নয়
    if (
      typeof lat !== "number" ||
      typeof lon !== "number" ||
      lat < -90 || lat > 90 ||
      lon < -180 || lon > 180
    ) {
      return { data: dummyWeather, error: "Invalid coordinates" };
    }

    const apiResponse = await fetchWeatherByCoords(lat, lon, 0); // no cache — user-triggered
    const name = locationName ?? `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;

    return { data: mapWeatherResponse(apiResponse, name) };
  } catch (err) {
    console.error("[getWeatherAction]", err);
    return { data: dummyWeather, error: "Failed to fetch weather" };
  }
}
