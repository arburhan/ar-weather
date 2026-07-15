
import { dummyWeather } from "@/lib/dummy";
import DesktopWeather from "../components/DesktopWeather";
import MobileWeather from "../components/MobileWeather";

// server component — dummy data ধরে দুটো layout render করে।
// responsive টগল: মোবাইলে MobileWeather, md+ এ DesktopWeather।
export default function Home() {
  return (
    <div className="min-h-screen w-full bg-linear-to-b from-sky-100 to-sky-50 text-zinc-900 dark:from-slate-900 dark:to-slate-950 dark:text-zinc-50">
      {/* মোবাইল — md-এর নিচে */}
      <div className="md:hidden">
        <MobileWeather data={dummyWeather} />
      </div>
      {/* ডেস্কটপ — md এবং তার উপরে */}
      <div className="hidden md:block">
        <DesktopWeather data={dummyWeather} />
      </div>
    </div>
  );
}
