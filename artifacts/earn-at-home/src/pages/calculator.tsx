import { useState } from "react";
import { Link } from "wouter";
import { Calculator, IndianRupee, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupee } from "@/lib/utils";

const RATE = 5;

const TIPS = [
  {
    title: "Use high-resolution screenshots",
    body: "Capture at 1080p or higher. Blurry or compressed images are automatically flagged as low quality.",
  },
  {
    title: "Never submit the same image twice",
    body: "Our system detects duplicates using perceptual hashing. Even slightly cropped versions will be flagged.",
  },
  {
    title: "Follow batch-specific guidelines",
    body: "Each task type has different requirements. Always review the guidelines before starting a new batch.",
  },
  {
    title: "Invest in a good monitor",
    body: "A clear, large display helps you process more screenshots accurately and at higher speed.",
  },
];

export default function CalculatorPage() {
  const [perDay, setPerDay] = useState(200);
  const [days, setDays] = useState(25);
  const [accuracy, setAccuracy] = useState(90);

  const validPerDay = Math.round(perDay * (accuracy / 100));
  const dailyEarning = validPerDay * RATE;
  const weeklyEarning = validPerDay * 7 * RATE;
  const monthlyEarning = validPerDay * days * RATE;

  return (
    <Layout>
      <div className="py-10 border-b" style={{ backgroundColor: "#1a2744" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Badge
            className="mb-4 text-xs font-semibold uppercase tracking-widest border px-3 py-1"
            style={{ backgroundColor: "rgba(201,162,39,0.15)", color: "#c9a227", borderColor: "rgba(201,162,39,0.3)" }}
          >
            Earnings Calculator
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
            <Calculator className="h-8 w-8" style={{ color: "#c9a227" }} />
            How Much Can You Earn?
          </h1>
          <p className="text-white/60 text-base max-w-xl">
            Adjust the inputs below to estimate your potential monthly income from screenshot verification.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* INPUTS */}
        <div className="bg-white border rounded-2xl shadow-sm p-6 md:p-8 space-y-8">
          {/* Screenshots per day */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <label className="font-semibold text-sm" style={{ color: "#1a2744" }}>
                  Screenshots per day
                </label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  How many screenshots can you process in a day?
                </p>
              </div>
              <span className="text-3xl font-extrabold" style={{ color: "#1a2744" }}>
                {perDay.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={5000}
              step={50}
              value={perDay}
              onChange={(e) => setPerDay(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "#c9a227" }}
              data-testid="slider-per-day"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>50</span>
              <span>5,000</span>
            </div>
          </div>

          {/* Days per month */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <label className="font-semibold text-sm" style={{ color: "#1a2744" }}>
                  Working days per month
                </label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  How many days do you plan to work?
                </p>
              </div>
              <span className="text-3xl font-extrabold" style={{ color: "#1a2744" }}>
                {days} days
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={31}
              step={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "#c9a227" }}
              data-testid="slider-days"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 day</span>
              <span>31 days</span>
            </div>
          </div>

          {/* Accuracy */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <label className="font-semibold text-sm" style={{ color: "#1a2744" }}>
                  Expected accuracy rate
                </label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  What percentage of your screenshots will be valid (non-duplicate, clear)?
                </p>
              </div>
              <span className="text-3xl font-extrabold" style={{ color: "#1a2744" }}>
                {accuracy}%
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              step={1}
              value={accuracy}
              onChange={(e) => setAccuracy(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "#c9a227" }}
              data-testid="slider-accuracy"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border rounded-2xl p-6 text-center shadow-sm">
            <IndianRupee className="h-7 w-7 mx-auto mb-2 text-muted-foreground" />
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Daily Estimate
            </div>
            <div className="text-3xl font-extrabold" style={{ color: "#1a2744" }}>
              {formatRupee(dailyEarning)}
            </div>
            <div className="text-xs text-muted-foreground mt-1.5">
              {validPerDay.toLocaleString()} valid screenshots/day
            </div>
          </div>
          <div
            className="border rounded-2xl p-6 text-center shadow-sm"
            style={{ backgroundColor: "rgba(201,162,39,0.06)", borderColor: "rgba(201,162,39,0.3)" }}
          >
            <TrendingUp className="h-7 w-7 mx-auto mb-2" style={{ color: "#c9a227" }} />
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#c9a227" }}>
              Weekly Estimate
            </div>
            <div className="text-3xl font-extrabold" style={{ color: "#1a2744" }}>
              {formatRupee(weeklyEarning)}
            </div>
            <div className="text-xs text-muted-foreground mt-1.5">
              Based on 7 days/week
            </div>
          </div>
          <div
            className="border rounded-2xl p-6 text-center shadow-sm"
            style={{ backgroundColor: "#1a2744" }}
          >
            <IndianRupee className="h-7 w-7 mx-auto mb-2 text-white/60" />
            <div className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
              Monthly Estimate
            </div>
            <div className="text-3xl font-extrabold text-white">
              {formatRupee(monthlyEarning)}
            </div>
            <div className="text-xs text-white/40 mt-1.5">
              {days} working days × {accuracy}% accuracy
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          * Estimates are based on Rs {RATE}/valid screenshot. Actual earnings depend on task availability and batch quality. See{" "}
          <Link href="/disclaimer" className="underline hover:text-foreground">
            earning disclaimer
          </Link>.
        </p>

        {/* TIPS */}
        <section>
          <h2 className="text-xl font-bold mb-5" style={{ color: "#1a2744" }}>
            How to Maximize Your Accuracy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TIPS.map((tip) => (
              <div key={tip.title} className="bg-white border rounded-xl p-5 flex gap-4">
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#c9a227" }} />
                <div>
                  <div className="font-semibold text-sm mb-1" style={{ color: "#1a2744" }}>
                    {tip.title}
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    {tip.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-center gap-4">
          <Link href="/leaderboard">
            <Button className="gap-2">
              View Leaderboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/help">
            <Button variant="outline">Help Center</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
