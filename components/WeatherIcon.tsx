"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { WeatherCondition } from "@/lib/types";
import { slugFor } from "@/lib/icons";


interface WeatherIconProps {
  condition: WeatherCondition;
  size?: number;
  loop?: boolean;
  className?: string;
}

// meteocons/lottie-এর fill স্টাইল থেকে animation JSON। slug বদলালে আইকনও বদলায়।
// dynamic import হওয়ায় webpack fill/ ফোল্ডারের জন্য একটা context বানায়।
export default function WeatherIcon({
  condition,
  size = 64,
  loop = true,
  className,
}: WeatherIconProps) {
  // any — Lottie animation JSON-এর নির্দিষ্ট টাইপ নেই
  const [data, setData] = useState<unknown>(null);

  useEffect(() => {
    let active = true;
    const slug = slugFor(condition);
    import(`@meteocons/lottie/fill/${slug}.json`)
      .then((mod) => {
        if (active) setData(mod.default);
      })
      .catch(() => {
        if (active) setData(null);
      });
    return () => {
      active = false;
    };
  }, [condition]);

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {data ? (
        <Lottie animationData={data} loop={loop} style={{ width: size, height: size }} />
      ) : null}
    </div>
  );
}
