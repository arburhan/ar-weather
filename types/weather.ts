// আবহাওয়ার সম্ভাব্য কন্ডিশন — প্রতিটা একটা meteocons slug-এ ম্যাপ হবে (lib/icons.ts দেখো)
export type WeatherCondition =
  | "clear-day"
  | "clear-night"
  | "partly-cloudy-day"
  | "partly-cloudy-night"
  | "cloudy"
  | "overcast"
  | "rain"
  | "drizzle"
  | "thunderstorm"
  | "snow"
  | "sleet"
  | "fog"
  | "wind";

export interface CurrentWeather {
  location: string;
  temp: number;        // °C
  feelsLike: number;   // °C
  condition: WeatherCondition;
  description: string; // যেমন "Partly Cloudy"
  humidity: number;    // %
  windKph: number;     // km/h
}

export interface HourlyForecast {
  time: string;        // যেমন "14:00"
  temp: number;        // °C
  condition: WeatherCondition;
}

export interface DailyForecast {
  day: string;         // যেমন "Mon"
  high: number;        // °C
  low: number;         // °C
  condition: WeatherCondition;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}
