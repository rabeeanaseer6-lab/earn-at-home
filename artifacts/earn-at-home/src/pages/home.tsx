import { useState } from "react";
import { Link } from "wouter";
import {
  Search, Trophy, ArrowRight, AlertCircle,
  Users, Camera, CheckCircle, ChevronDown, ChevronUp, BookOpen, Calendar,
  MessageCircle, Banknote, GraduationCap, Smartphone, Briefcase, Star,
  Zap, Shield, TrendingUp, Globe, MonitorSmartphone, FileText, BarChart3,
  Clock, Award, ExternalLink
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupee } from "@/lib/utils";
import { useGetLeaderboard, useSearchWorkers, useListBlogPosts } from "@workspace/api-client-react";

const RATE_PER_IMAGE = 5;
const WHATSAPP_NUMBER = "923092821856";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const FAQ_ITEMS = [
  {
    q: "How do I get paid?",
    a: "We pay out daily via EasyPaisa and JazzCash once your uploaded folder is verified by our auto-checker. Your balance is tracked live on this platform and updated as soon as your batch is processed.",
  },
  {
    q: "What is a 'Duplicate'?",
    a: "Our system uses AI to detect if the same screenshot is uploaded twice. Only unique profile screenshots are paid at Rs. 5 each. Duplicates are shown separately in your stats so you can track accuracy.",
  },
  {
    q: "How do I join?",
    a: "Click the WhatsApp button to contact our Admin (03092821856) to get your free Worker ID and be added to the training group. The entire onboarding process is free.",
  },
  {
    q: "What is the rate per verified screenshot?",
    a: `The current rate is Rs ${RATE_PER_IMAGE} per valid, unique, high-quality screenshot. Only screenshots that pass our verification pipeline (non-duplicate, clear, within guidelines) are counted as payable.`,
  },
];

function IncomeEstimator() {
  const [screenshots, setScreenshots] = useState(500);
  const daily = screenshots * RATE_PER_IMAGE;
  const weekly = daily * 7;
  const monthly = daily * 30;

  return (
    <div className="rounded-2xl border bg-white shadow-sm p-6 md:p-8">
      <h2 className="text-xl font-bold mb-1" style={{ color: "#1a2744" }}>
        Income Estimator
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        How much can you earn? Adjust the slider to find out.
      </p>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-foreground">
            Screenshots per day
          </label>
          <span className="text-2xl font-bold" style={{ color: "#1a2744" }}>
            {screenshots.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={100}
          max={5000}
          step={50}
          value={screenshots}
          onChange={(e) => setScreenshots(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: "#c9a227" }}
          data-testid="slider-screenshots"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>100</span>
          <span>5,000</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Daily", value: daily },
          { label: "Weekly", value: weekly },
          { label: "Monthly (30d)", value: monthly },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="text-center rounded-xl py-4 px-2"
            style={{ backgroundColor: "rgba(201,162,39,0.08)" }}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {label}
            </div>
            <div className="text-lg font-bold" style={{ color: "#1a2744" }}>
              {formatRupee(value)}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        * Based on Rs {RATE_PER_IMAGE}/valid screenshot. Actual earnings depend on accuracy rate. See{" "}
        <Link href="/disclaimer" className="underline hover:text-foreground">
          earning disclaimer
        </Link>.
      </p>
    </div>
  );
}

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className="border rounded-xl bg-white overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-sm hover:bg-muted/30 transition-colors"
            style={{ color: "#1a2744" }}
            onClick={() => setOpen(open === i ? null : i)}
            data-testid={`faq-toggle-${i}`}
          >
            {item.q}
            {open === i ? (
              <ChevronUp className="h-4 w-4 shrink-0 ml-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 ml-4 text-muted-foreground" />
            )}
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t bg-muted/10 pt-3">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useGetLeaderboard();
  const { data: blogPosts, isLoading: isLoadingBlog } = useListBlogPosts({ limit: 3 });

  const { data: searchResults, isLoading: isLoadingSearch } = useSearchWorkers(
    { q: debouncedQuery },
    { query: { enabled: debouncedQuery.length > 0 } }
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery.trim());
  };

  return (
    <Layout>
      {/* HERO */}
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{ backgroundColor: "#1a2744" }}
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 50%, #c9a227 0%, transparent 60%), radial-gradient(circle at 80% 20%, #c9a227 0%, transparent 40%)",
            }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <Badge
            className="mb-6 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest border"
            style={{ backgroundColor: "rgba(201,162,39,0.15)", color: "#c9a227", borderColor: "rgba(201,162,39,0.3)" }}
          >
            Pakistan's #1 Verification Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 leading-tight tracking-tight">
            Earn at Home —<br />
            <span style={{ color: "#c9a227" }}>Pakistan's #1</span> Screenshot<br />
            Processing Platform
          </h1>
          <p className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto mb-8 leading-relaxed">
            Earn Rs. {RATE_PER_IMAGE} per valid screenshot from home. Get paid daily
            via EasyPaisa or JazzCash. Free training provided on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#25D366", color: "white" }}
              data-testid="cta-join-now"
            >
              <MessageCircle className="h-4 w-4" />
              Join Now — WhatsApp
            </a>
            <a
              href="#search"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#c9a227", color: "#1a2744" }}
              data-testid="cta-check-balance"
            >
              Check Your Balance
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border border-white/20 text-white hover:bg-white/10 transition-colors"
              data-testid="cta-leaderboard"
            >
              <Trophy className="h-4 w-4" />
              Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* LIVE STATS BAR */}
      <section className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Users className="h-6 w-6" style={{ color: "#c9a227" }} />,
                label: "Total Active Workers",
                value: isLoadingLeaderboard
                  ? null
                  : (leaderboard?.totalWorkers ?? 0).toLocaleString(),
              },
              {
                icon: <Camera className="h-6 w-6" style={{ color: "#c9a227" }} />,
                label: "Screenshots Processed",
                value: isLoadingLeaderboard
                  ? null
                  : (leaderboard?.screenshotsProcessed ?? 0).toLocaleString(),
              },
              {
                icon: <Banknote className="h-6 w-6" style={{ color: "#c9a227" }} />,
                label: "Total PKR Paid",
                value: isLoadingLeaderboard
                  ? null
                  : formatRupee(leaderboard?.totalPaid ?? 0),
              },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <div
                  className="p-3 rounded-xl shrink-0"
                  style={{ backgroundColor: "rgba(201,162,39,0.1)" }}
                >
                  {icon}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {label}
                  </div>
                  <div className="text-2xl font-bold" style={{ color: "#1a2744" }}>
                    {value === null ? (
                      <Skeleton className="h-7 w-28 mt-1" />
                    ) : (
                      value
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAYMENT LOGOS BAR */}
      <section className="bg-muted/30 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-center gap-6 md:gap-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Payouts via
          </span>
          {[
            { label: "EasyPaisa", color: "#00A650", symbol: "EP" },
            { label: "JazzCash", color: "#ED1C24", symbol: "JC" },
            { label: "Bank Transfer", color: "#1a2744", symbol: "BT" },
          ].map(({ label, color, symbol }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white shadow-sm"
            >
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: color }}
              >
                {symbol}
              </div>
              <span className="text-sm font-semibold" style={{ color: "#1a2744" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE PAYOUT TICKER */}
      {leaderboard?.recentPayments && leaderboard.recentPayments.length > 0 && (
        <section
          className="overflow-hidden py-3 border-b"
          style={{ backgroundColor: "rgba(201,162,39,0.07)" }}
        >
          <div
            className="flex gap-8 whitespace-nowrap animate-marquee"
            style={{ animation: "marquee 28s linear infinite" }}
          >
            {[...leaderboard.recentPayments, ...leaderboard.recentPayments].map((p, i) => (
              <span key={i} className="inline-flex items-center gap-2 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
                <span style={{ color: "#1a2744" }}>
                  Worker #{p.workerId} just received{" "}
                  <span className="font-bold text-green-700">{formatRupee(p.amount)}</span>{" "}
                  via EasyPaisa
                </span>
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* INCOME ESTIMATOR */}
        <section>
          <IncomeEstimator />
        </section>

        {/* LEADERBOARD */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#1a2744" }}>
                Top Earners
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Ranked by approved balance
              </p>
            </div>
            <Link href="/leaderboard">
              <Button variant="outline" size="sm" className="gap-1.5">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
            <div
              className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b"
              style={{ backgroundColor: "#f8f9fc" }}
            >
              <div className="col-span-2 text-center">Rank</div>
              <div className="col-span-5">Worker</div>
              <div className="col-span-5 text-right">Balance</div>
            </div>
            <div className="divide-y">
              {isLoadingLeaderboard
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 px-5 py-4 items-center">
                      <Skeleton className="col-span-2 h-8 w-8 mx-auto rounded-full" />
                      <div className="col-span-5 space-y-1.5">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="col-span-5 h-5 w-24 ml-auto" />
                    </div>
                  ))
                : leaderboard?.topWorkers.map((worker, index) => (
                    <Link href={`/worker/${worker.id}`} key={worker.id}>
                      <div
                        className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-muted/30 cursor-pointer transition-colors group"
                        data-testid={`row-leaderboard-${worker.id}`}
                      >
                        <div className="col-span-2 flex justify-center">
                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
                              index === 0
                                ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                : index === 1
                                ? "bg-gray-100 text-gray-600 border border-gray-300"
                                : index === 2
                                ? "bg-orange-100 text-orange-700 border border-orange-300"
                                : "text-muted-foreground"
                            }`}
                          >
                            {worker.rank}
                          </div>
                        </div>
                        <div className="col-span-5">
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {worker.name}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground">
                            {worker.workerId}
                          </div>
                        </div>
                        <div className="col-span-5 text-right flex items-center justify-end gap-2">
                          <span className="font-bold text-green-700">
                            {formatRupee(worker.balance)}
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
        </section>

        {/* SEARCH */}
        <section id="search">
          <div className="mb-6">
            <h2 className="text-2xl font-bold" style={{ color: "#1a2744" }}>
              Find Your Profile
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Search by your name or Worker ID to see your balance and payment history
            </p>
          </div>
          <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-6 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Name or Worker ID..."
                className="pl-9 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <Button type="submit" className="h-11 px-6" data-testid="button-search">
              Search
            </Button>
            {debouncedQuery && (
              <Button
                variant="ghost"
                type="button"
                onClick={() => { setSearchQuery(""); setDebouncedQuery(""); }}
              >
                Clear
              </Button>
            )}
          </form>

          {debouncedQuery && (
            <div>
              {isLoadingSearch ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                  ))}
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((worker) => (
                    <Link href={`/worker/${worker.id}`} key={worker.id}>
                      <div
                        className="bg-white border rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
                        data-testid={`card-search-worker-${worker.id}`}
                      >
                        <div>
                          <div className="font-bold text-lg" style={{ color: "#1a2744" }}>
                            {worker.name}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground mt-0.5">
                            ID: {worker.workerId}
                          </div>
                          {(worker as any).validCount !== undefined && (
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="text-xs text-green-700 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {(worker as any).validCount} valid
                              </Badge>
                              <Badge variant="outline" className="text-xs text-muted-foreground">
                                {(worker as any).totalUploads} total
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                              Balance
                            </div>
                            <div className="text-xl font-bold text-green-700">
                              {formatRupee(worker.balance)}
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 border rounded-xl bg-muted/20 text-center text-muted-foreground">
                  <AlertCircle className="h-10 w-10 mb-3 opacity-40" />
                  <p className="font-semibold">No workers found</p>
                  <p className="text-sm mt-1">Try a different name or exact Worker ID</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* RECENT ARTICLES */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#1a2744" }}>
                Resource Center
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Guides, tips, and platform updates
              </p>
            </div>
            <Link href="/blog">
              <Button variant="outline" size="sm" className="gap-1.5">
                All Articles <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {isLoadingBlog
              ? [1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-xl" />
                ))
              : blogPosts?.map((post) => (
                  <Link href={`/blog/${post.slug}`} key={post.slug}>
                    <div className="bg-white border rounded-xl p-5 h-full flex flex-col hover:shadow-md transition-all cursor-pointer group">
                      <Badge variant="secondary" className="w-fit text-xs mb-3">
                        {post.category}
                      </Badge>
                      <h3 className="font-bold text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2" style={{ color: "#1a2744" }}>
                        {post.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : ""}
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </section>

        {/* TRAINING SECTION */}
        <section
          className="rounded-2xl p-8 md:p-12"
          style={{ backgroundColor: "#1a2744" }}
          data-testid="section-training"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge
                className="mb-4 text-xs font-semibold uppercase tracking-widest border"
                style={{ backgroundColor: "rgba(201,162,39,0.15)", color: "#c9a227", borderColor: "rgba(201,162,39,0.3)" }}
              >
                Free Training
              </Badge>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                Professional Training Provided
              </h2>
              <p className="text-white/65 text-sm leading-relaxed mb-6">
                Don't know how to start? We provide complete training on how to capture and submit
                screenshots correctly. Join our WhatsApp group to receive your first training module
                and start earning Rs. 5 per valid screenshot.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#25D366", color: "white" }}
                  data-testid="cta-training-whatsapp"
                >
                  <MessageCircle className="h-4 w-4" />
                  Start Training on WhatsApp
                </a>
                <Link href="/training">
                  <Button variant="outline" className="h-12 px-6 border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Smartphone, label: "WhatsApp Training", sub: "Step-by-step guides" },
                { icon: Camera, label: "Screenshot Guide", sub: "Correct capture methods" },
                { icon: CheckCircle, label: "Quality Check", sub: "AI duplicate detection" },
                { icon: Banknote, label: "Daily Payout", sub: "EasyPaisa & JazzCash" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="rounded-xl p-4 text-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" style={{ color: "#c9a227" }} />
                  <div className="text-sm font-bold text-white">{label}</div>
                  <div className="text-xs text-white/50 mt-0.5">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST STRIP ── */}
        <section className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0d1629 0%, #1a2744 100%)" }}>
          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              <Badge className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: "rgba(201,162,39,0.15)", color: "#c9a227", border: "1px solid rgba(201,162,39,0.3)" }}>
                Trusted in Pakistan
              </Badge>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Why Thousands Choose Earn at Home</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Shield, stat: "100%", label: "Verified Payouts", sub: "EasyPaisa & JazzCash" },
                { icon: Clock, stat: "24hr", label: "Payment Cycle", sub: "Processed daily" },
                { icon: Zap, stat: "Rs.5", label: "Per Screenshot", sub: "Flat honest rate" },
                { icon: Award, stat: "Free", label: "Training", sub: "WhatsApp onboarding" },
              ].map(({ icon: Icon, stat, label, sub }) => (
                <div key={label} className="text-center p-5 rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,162,39,0.15)" }}>
                  <Icon className="h-6 w-6 mx-auto mb-2" style={{ color: "#c9a227" }} />
                  <div className="text-2xl font-black text-white">{stat}</div>
                  <div className="text-sm font-semibold text-white/80 mt-0.5">{label}</div>
                  <div className="text-xs text-white/40 mt-0.5">{sub}</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { icon: TrendingUp, text: "Your balance updates in real-time the moment your batch is approved." },
                { icon: Users, text: "Growing community of Pakistani home workers earning daily from their phones." },
                { icon: BarChart3, text: "Full stats transparency — see total uploads, valid count, and duplicates in your dashboard." },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <Icon className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#c9a227" }} />
                  <p className="text-sm text-white/60 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LEARN SKILLS ── */}
        <section>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#1a2744" }}>Learn Skills & Earn More</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Master these skills to unlock higher-paying opportunities</p>
            </div>
            <Link href="/training">
              <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                Free Training <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Camera,
                title: "Screenshot Processing",
                level: "Beginner",
                levelColor: "#16a34a",
                desc: "Learn to capture high-quality profile screenshots efficiently. Master bulk workflows and folder organization to maximize your daily output.",
                time: "1–2 hours",
                earning: "Rs. 5 / screenshot",
                cta: "Start Free",
                href: WHATSAPP_URL,
                external: true,
              },
              {
                icon: FileText,
                title: "Data Entry & Annotation",
                level: "Beginner",
                levelColor: "#16a34a",
                desc: "Learn data entry, image labeling, and form-filling tasks. These foundational skills open doors to many remote work platforms worldwide.",
                time: "2–3 hours",
                earning: "Rs. 500–2,000/day",
                cta: "Explore Training",
                href: "/training",
                external: false,
              },
              {
                icon: MonitorSmartphone,
                title: "App & Web Testing",
                level: "Intermediate",
                levelColor: "#d97706",
                desc: "Test mobile apps and websites, report bugs, and provide user feedback. Growing demand globally with flexible remote hours.",
                time: "3–5 hours",
                earning: "Rs. 1,000–3,000/day",
                cta: "Learn More",
                href: "/training",
                external: false,
              },
              {
                icon: BarChart3,
                title: "Social Media Management",
                level: "Intermediate",
                levelColor: "#d97706",
                desc: "Manage profiles, schedule posts, and grow engagement for businesses. One of the most in-demand remote skills in Pakistan right now.",
                time: "3–4 hours",
                earning: "Rs. 1,500–4,000/day",
                cta: "Learn More",
                href: "/training",
                external: false,
              },
              {
                icon: Globe,
                title: "Freelance Writing",
                level: "Intermediate",
                levelColor: "#d97706",
                desc: "Write product descriptions, blog posts, and social captions for clients worldwide. Urdu and English writers both in high demand.",
                time: "2–4 hours",
                earning: "Rs. 1,000–5,000/day",
                cta: "Learn More",
                href: "/training",
                external: false,
              },
              {
                icon: TrendingUp,
                title: "Affiliate Marketing",
                level: "Advanced",
                levelColor: "#7c3aed",
                desc: "Promote products online and earn commissions. Combine with your social media skills for a fully automated passive income stream.",
                time: "Flexible",
                earning: "Unlimited",
                cta: "Learn More",
                href: "/training",
                external: false,
              },
            ].map(({ icon: Icon, title, level, levelColor, desc, time, earning, cta, href, external }) => (
              <div
                key={title}
                className="bg-white border rounded-2xl p-5 flex flex-col hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-xl" style={{ backgroundColor: "rgba(26,39,68,0.08)" }}>
                    <Icon className="h-5 w-5" style={{ color: "#1a2744" }} />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${levelColor}15`, color: levelColor }}>
                    {level}
                  </span>
                </div>
                <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors" style={{ color: "#1a2744" }}>{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">{desc}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pt-3 border-t">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-green-700">
                    <Banknote className="h-3.5 w-3.5" />
                    <span>{earning}</span>
                  </div>
                </div>
                {external ? (
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                    style={{ backgroundColor: "#1a2744", color: "white" }}>
                    {cta} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <Link href={href}>
                    <Button className="w-full" style={{ backgroundColor: "#1a2744", color: "white" }}>{cta}</Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── JOBS FOR YOU BANNER ── */}
        <section className="relative rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1a2744 0%, #0d3d56 50%, #1a2744 100%)" }}>
          {/* Decorative grid */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(201,162,39,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.8) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="relative p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-5" style={{ backgroundColor: "rgba(201,162,39,0.15)", border: "1px solid rgba(201,162,39,0.3)", color: "#c9a227" }}>
                  <Briefcase className="h-3.5 w-3.5" />
                  Find More Jobs
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                  Want More Ways<br />to Earn Online?
                </h2>
                <p className="text-white/65 text-sm leading-relaxed mb-6">
                  Explore hundreds of verified remote job listings on <strong className="text-white">jobs-for-you.online</strong> —
                  Pakistan's dedicated remote jobs board. Find data entry, freelance writing, virtual assistant,
                  and more home-based positions updated daily.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://jobs-for-you.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105 hover:shadow-xl"
                    style={{ backgroundColor: "#c9a227", color: "#1a2744" }}
                  >
                    <Briefcase className="h-4 w-4" />
                    Browse Jobs Now
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
                    style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Ask on WhatsApp
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: FileText, label: "Data Entry", count: "120+ Jobs" },
                  { icon: Globe, label: "Freelance Writing", count: "80+ Jobs" },
                  { icon: MonitorSmartphone, label: "Virtual Assistant", count: "95+ Jobs" },
                  { icon: BarChart3, label: "Social Media", count: "70+ Jobs" },
                  { icon: Camera, label: "Image Tasks", count: "50+ Jobs" },
                  { icon: TrendingUp, label: "Marketing", count: "60+ Jobs" },
                ].map(({ icon: Icon, label, count }) => (
                  <a
                    key={label}
                    href="https://jobs-for-you.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-xl transition-all hover:scale-105 cursor-pointer"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <Icon className="h-4 w-4 shrink-0" style={{ color: "#c9a227" }} />
                    <div>
                      <div className="text-white text-xs font-semibold">{label}</div>
                      <div className="text-white/40 text-xs">{count}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SUCCESS TIPS ── */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold" style={{ color: "#1a2744" }}>Tips to Maximize Your Earnings</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Follow these practices to earn more every day</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "📱", tip: "Work in batches", desc: "Process 200–300 screenshots per session rather than one by one. Your speed and accuracy increase with practice." },
              { icon: "🔍", tip: "Avoid duplicates", desc: "Our AI flags identical screenshots. Always check your folder before uploading to maximize your valid count." },
              { icon: "📂", tip: "Organize your folder", desc: "Label folders with the date and your Worker ID. Makes tracking easy and prevents resubmitting old batches." },
              { icon: "⏰", tip: "Submit daily", desc: "Daily submissions keep your balance growing steadily. Small consistent effort beats occasional large batches." },
            ].map(({ icon, tip, desc }) => (
              <div key={tip} className="bg-white border rounded-2xl p-5 text-center hover:shadow-md transition-all">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold text-sm mb-2" style={{ color: "#1a2744" }}>{tip}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold" style={{ color: "#1a2744" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Everything you need to know about working with us
            </p>
          </div>
          <FaqAccordion />
          <div className="mt-6 text-center">
            <Link href="/help">
              <Button variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Visit Help Center
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
