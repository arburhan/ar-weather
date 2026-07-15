import type { WeatherCondition } from "@/types";

// প্রতিটা কন্ডিশনকে meteocons/lottie-এর slug-এ ম্যাপ করি।
// এই slug থেকেই WeatherIcon কম্পোনেন্ট animation JSON লোড করবে।
// সব slug @meteocons/lottie/fill/*.json-এ আছে (যাচাই করা হয়েছে)।
export const CONDITION_TO_SLUG: Record<WeatherCondition, string> = {
  "clear-day": "clear-day",
  "clear-night": "clear-night",
  "partly-cloudy-day": "partly-cloudy-day",
  "partly-cloudy-night": "partly-cloudy-night",
  cloudy: "cloudy",
  overcast: "overcast-day",
  rain: "rain",
  drizzle: "drizzle",
  thunderstorm: "thunderstorms-day-rain",
  snow: "snow",
  sleet: "sleet",
  fog: "fog-day",
  wind: "wind",
};

export function slugFor(condition: WeatherCondition): string {
  return CONDITION_TO_SLUG[condition];
}
