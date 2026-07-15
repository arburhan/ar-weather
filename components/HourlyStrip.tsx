"use client";

import { useEffect, useRef, useState } from "react";

import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import WeatherIcon from "./WeatherIcon";
import { HourlyForecast } from "@/lib/types";

interface HourlyStripProps {
  hourly: HourlyForecast[];
  iconSize?: number;
  // প্রতি "view"-এ কয়টা কার্ড দেখাবে — basis এই সংখ্যা দিয়ে ঠিক হয়।
  itemsPerView?: number;
}

// Hourly forecast — shadcn Carousel (Embla) দিয়ে অটো-স্লাইডিং স্ট্রিপ।
// ping-pong: ডান দিক (সামনে) চলতে চলতে শেষ কার্ডে ঠেকলে দিক উল্টে
// রিভার্সে প্রথম কার্ডে ফেরে, তারপর আবার সামনে — এভাবে চলতেই থাকে।
// loop অফ রাখি, নাহলে canScrollNext/canScrollPrev দিয়ে প্রান্ত ধরা যায় না।
// touch-hold বা mouse hover করলে থামে; ছেড়ে দিলে আবার চলে।
export default function HourlyStrip({
  hourly,
  iconSize = 44,
  itemsPerView = 6,
}: HourlyStripProps) {
  const [api, setApi] = useState<CarouselApi>();
  const pausedRef = useRef(false);
  const dirRef = useRef<1 | -1>(1); // 1 = সামনে, -1 = রিভার্স

  useEffect(() => {
    if (!api) return;

    const STEP_MS = 2000; // প্রতি ধাপের মাঝের বিরতি

    const tick = () => {
      if (pausedRef.current) return;
      if (dirRef.current === 1) {
        // সামনে যাচ্ছি — আর সামনে না গেলে দিক উল্টাই
        if (api.canScrollNext()) api.scrollNext();
        else {
          dirRef.current = -1;
          api.scrollPrev();
        }
      } else {
        // রিভার্সে যাচ্ছি — আর পেছনে না গেলে দিক উল্টাই
        if (api.canScrollPrev()) api.scrollPrev();
        else {
          dirRef.current = 1;
          api.scrollNext();
        }
      }
    };

    const id = setInterval(tick, STEP_MS);
    return () => clearInterval(id);
  }, [api]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  // basis: itemsPerView অনুযায়ী প্রতিটা কার্ডের প্রস্থ (শতকরা)।
  const basis = `${100 / itemsPerView}%`;

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: "start", loop: false, dragFree: true }}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      className="w-full"
    >
      <CarouselContent>
        {hourly.map((h) => (
          <CarouselItem
            key={h.time}
            style={{ flexBasis: basis }}
            className="min-w-0"
          >
            <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/60 px-3 py-3 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {h.time}
              </span>
              <WeatherIcon condition={h.condition} size={iconSize} loop />
              <span className="text-sm font-medium">{h.temp}°</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
