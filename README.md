# Weather App

A server-side rendered weather dashboard built with Next.js App Router. The app fetches real-time weather data, displays animated weather icons, and supports live location detection via the browser Geolocation API.

---

## What was built

### Core application

- Server Component home page that fetches weather data on every request (revalidated every 10 minutes via `next: { revalidate: 600 }`)
- Responsive weather dashboard with separate layouts for mobile and desktop
- Current conditions: temperature, wind speed, weather description, and animated icon
- 12-hour hourly forecast strip derived from a sinusoidal temperature curve (no hourly API endpoint needed)
- 7-day daily forecast with high/low temperature range bars scaled across the week

### Live location detection

- "My current location" button triggers the browser Geolocation API
- Coordinates are reverse-geocoded to a readable city name using the Nominatim / OpenStreetMap API
- Weather is then fetched via a Next.js Server Action so the API key never leaves the server

### 404 page

- Custom `app/not-found.tsx` following the Next.js App Router file convention
- Animated rain icon from `@meteocons/lottie`
- 5-second countdown with a circular SVG progress ring, then auto-redirects to home
- Split into Server Component (`not-found.tsx`) and two Client Components (`GoBackButton`, `AutoRedirect`) to keep the page as server-rendered as possible

---

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI primitives | shadcn/ui, Radix UI |
| Icons | Lucide React |
| Weather icons | @meteocons/lottie (Lottie animations), lottie-react |
| Weather API | weather-ai.co REST API (WMO weather codes) |
| Reverse geocoding | Nominatim / OpenStreetMap |
| Font | Geist Sans, Geist Mono (via `next/font/google`) |
| Package manager | pnpm |
| Runtime | Node.js |

---

## Project structure

```
app/
  layout.tsx          Root layout with font variables
  page.tsx            Home page — SSR weather fetch
  globals.css         Tailwind v4 theme tokens and base styles
  not-found.tsx       Custom 404 page (Server Component)

components/
  weather/
    WeatherApp.tsx    Client shell — location button, state, layout switching
    DesktopWeather.tsx   Desktop layout (md and above)
    MobileWeather.tsx    Mobile layout
    HourlyStrip.tsx   Horizontal scrollable hourly forecast
    WeatherIcon.tsx   Lottie-based animated weather icon (Client Component)
  go-back-button.tsx  Back navigation button (Client Component)
  auto-redirect.tsx   5-second countdown redirect (Client Component)

lib/
  weather-api.ts      API fetch, WMO code mapping, hourly derivation
  actions.ts          Server Action for client-triggered weather fetch
  icons.ts            WeatherCondition to meteocons slug mapping
  utils.ts            Shared utilities

types/
  weather.ts          WeatherCondition, WeatherData, and related interfaces

data/
  weather-data.ts     Fallback dummy data used when the API is unavailable
```

---

## Environment variables

Create a `.env.local` file in the project root:

```
weather_api=your_weather_ai_api_key

# Default location for the initial page load (Dhaka, Bangladesh)
WEATHER_LAT=23.8103
WEATHER_LON=90.4125
WEATHER_LOCATION=Dhaka, Bangladesh
```

The API key is only accessed in Server Components and Server Actions and is never sent to the browser.

---

## Running locally

```bash
pnpm install
pnpm dev
```

The app will be available at `http://localhost:3000`.

---

## Key implementation notes

**Hourly forecast derivation** — The external API does not provide an hourly endpoint. Hourly temperatures are approximated using a sinusoidal curve between the daily minimum (peaking at 05:00) and daily maximum (peaking at 14:00). This is a standard meteorological model and produces realistic-looking values.

**WMO weather codes** — The API returns WMO Code Table 4677 integers. These are mapped to a `WeatherCondition` union type which then maps to the correct Meteocons animation slug.

**Server/Client split on the 404 page** — `not-found.tsx` is a Server Component and exports `metadata`. The countdown timer and the back button each need browser APIs (`useRouter`, `history.back`), so they are extracted into their own `"use client"` components and imported into the page.

**API key security** — `weather_api` is read only inside `lib/weather-api.ts`, which is imported exclusively by `lib/actions.ts` (a Server Action) and `app/page.tsx` (a Server Component). The key is never bundled into client JavaScript.
