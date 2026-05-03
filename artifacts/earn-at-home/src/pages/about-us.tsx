import { Link } from "wouter";
import { Layout } from "@/components/layout";
import {
  Shield, Zap, Users, Target, Heart, MessageCircle,
  CheckCircle, Camera, Banknote, Globe, ArrowRight, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetLeaderboard } from "@workspace/api-client-react";

const WHATSAPP_URL = "https://wa.me/923092821856";

const VALUES = [
  {
    icon: Shield,
    title: "Transparency First",
    desc: "Every upload is auto-processed and the results are shown live. You see exactly how many images were valid, how many were duplicates, and exactly what you earned — no guesswork.",
    color: "#c9a227",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    desc: "Our SHA-256 deduplication engine scans your entire ZIP in seconds. No waiting days for manual review — your stats and balance update the moment your batch is processed.",
    color: "#16a34a",
  },
  {
    icon: Heart,
    title: "Workers First",
    desc: "We built this platform because we believe Pakistani home workers deserve fair, consistent, and dignified income. Every feature we build starts with the question: does this help the worker?",
    color: "#ec4899",
  },
  {
    icon: Target,
    title: "Zero Fees",
    desc: "We never charge a registration fee, training fee, or processing fee. The platform is free to use and we make no deductions from your earnings. What you earn is what you receive.",
    color: "#7c3aed",
  },
];

const MILESTONES = [
  { year: "Day 1", label: "Platform Launched", sub: "Started with a WhatsApp group and a simple idea" },
  { year: "Week 2", label: "First Payouts Sent", sub: "EasyPaisa & JazzCash payments processed" },
  { year: "Month 1", label: "Auto-Checker Live", sub: "SHA-256 dedup engine replacing manual review" },
  { year: "Now", label: "Growing Daily", sub: "Hundreds of verified screenshots processed every day" },
];

export default function AboutUsPage() {
  const { data: leaderboard } = useGetLeaderboard();

  const totalWorkers = leaderboard?.totalWorkers ?? 0;
  const totalScreenshots = leaderboard?.screenshotsProcessed ?? 0;
  const totalPaid = leaderboard?.totalPaid ?? 0;

  return (
    <Layout>
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden py-24"
        style={{ background: "linear-gradient(135deg, #0d1629 0%, #1a2744 60%, #0d1629 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, #c9a227 1px, transparent 1px), radial-gradient(circle at 80% 20%, #c9a227 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Badge
            className="mb-5 text-xs font-bold uppercase tracking-widest"
            style={{ backgroundColor: "rgba(201,162,39,0.15)", color: "#c9a227", border: "1px solid rgba(201,162,39,0.3)" }}
          >
            Our Story
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Pakistan's Home Earners<br />
            <span style={{ color: "#c9a227" }}>Deserve Better</span>
          </h1>
          <p className="text-lg text-white/65 leading-relaxed max-w-2xl mx-auto mb-10">
            Earn at Home was built with one goal: give every Pakistani the tools to earn a real,
            verifiable income from home — with no middlemen, no hidden fees, and no broken promises.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: "#25D366", color: "white" }}
            >
              <MessageCircle className="h-4 w-4" />
              Join Our Community
            </a>
            <Link href="/training">
              <Button
                variant="outline"
                className="h-12 px-7 border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent"
              >
                Free Training <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── LIVE STATS ── */}
      <section className="py-12" style={{ backgroundColor: "#1a2744" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Active Workers", value: totalWorkers.toLocaleString(), icon: Users, color: "#c9a227" },
              { label: "Screenshots Verified", value: totalScreenshots.toLocaleString(), icon: Camera, color: "#16a34a" },
              { label: "Total PKR Paid", value: `₨${Number(totalPaid).toLocaleString()}`, icon: Banknote, color: "#c9a227" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="text-center p-6 rounded-2xl"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,162,39,0.15)" }}
              >
                <Icon className="h-6 w-6 mx-auto mb-2" style={{ color }} />
                <div className="text-3xl font-black text-white">{value}</div>
                <div className="text-sm text-white/50 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-20">

        {/* ── MISSION ── */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: "rgba(201,162,39,0.1)", color: "#c9a227", border: "1px solid rgba(201,162,39,0.25)" }}>
              Our Mission
            </Badge>
            <h2 className="text-3xl font-black mb-5" style={{ color: "#1a2744" }}>
              Turning Smartphones<br />Into Paychecks
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Millions of Pakistanis have smartphones, reliable internet, and time to spare — but no path to
              a structured remote income. Traditional freelance platforms require specialized skills, fluent English,
              and months of building a portfolio before earning anything.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We created a different model: simple screenshot verification work that anyone can start today,
              with free WhatsApp training, a transparent Rs. 5 per screenshot rate, and daily payouts
              directly to EasyPaisa or JazzCash.
            </p>
            <div className="space-y-3">
              {[
                "No skills or experience required to start",
                "Free onboarding via WhatsApp training group",
                "Automated verification — no waiting for manual approval",
                "Same-day EasyPaisa & JazzCash payouts",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#16a34a" }} />
                  <span className="text-sm text-muted-foreground">{point}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div
              className="p-6 rounded-2xl"
              style={{ background: "linear-gradient(135deg, #1a2744, #0d1629)", border: "1px solid rgba(201,162,39,0.2)" }}
            >
              <Camera className="h-8 w-8 mb-4" style={{ color: "#c9a227" }} />
              <h3 className="text-white font-bold text-lg mb-2">Screenshot Verification</h3>
              <p className="text-white/55 text-sm leading-relaxed">
                Workers capture profile screenshots following our guidelines and submit them in batches.
                Our AI auto-checker verifies each one, removes duplicates, and credits the worker's account instantly.
              </p>
            </div>
            <div
              className="p-6 rounded-2xl"
              style={{ background: "linear-gradient(135deg, #0d3d1a, #0d1629)", border: "1px solid rgba(22,163,74,0.2)" }}
            >
              <Banknote className="h-8 w-8 mb-4" style={{ color: "#16a34a" }} />
              <h3 className="text-white font-bold text-lg mb-2">Daily EasyPaisa / JazzCash Payouts</h3>
              <p className="text-white/55 text-sm leading-relaxed">
                We process payments every day. Your balance is visible on the live leaderboard and your personal
                profile page at all times. No delays, no surprises.
              </p>
            </div>
          </div>
        </section>

        {/* ── VALUES ── */}
        <section>
          <div className="text-center mb-10">
            <Badge className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: "rgba(201,162,39,0.1)", color: "#c9a227", border: "1px solid rgba(201,162,39,0.25)" }}>
              Our Values
            </Badge>
            <h2 className="text-3xl font-black" style={{ color: "#1a2744" }}>What We Stand For</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {VALUES.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="p-6 rounded-2xl border bg-white hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
                >
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "#1a2744" }}>{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section>
          <div className="text-center mb-10">
            <Badge className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: "rgba(201,162,39,0.1)", color: "#c9a227", border: "1px solid rgba(201,162,39,0.25)" }}>
              The Process
            </Badge>
            <h2 className="text-3xl font-black" style={{ color: "#1a2744" }}>How Earn at Home Works</h2>
          </div>
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5" style={{ backgroundColor: "rgba(201,162,39,0.2)" }} />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "01", icon: MessageCircle, title: "Join on WhatsApp", desc: "Contact admin at 03092821856 to get your free Worker ID and access the training group." },
                { step: "02", icon: Globe, title: "Get Trained Free", desc: "Receive step-by-step guides on how to capture screenshots correctly and organize your submissions." },
                { step: "03", icon: Camera, title: "Submit Your Batch", desc: "Upload your ZIP file through our admin portal. The auto-checker processes it in seconds." },
                { step: "04", icon: Banknote, title: "Get Paid Daily", desc: "Earnings hit your EasyPaisa or JazzCash account. Your live balance is always visible on the platform." },
              ].map(({ step, icon: Icon, title, desc }) => (
                <div key={step} className="relative text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10"
                    style={{ backgroundColor: "#1a2744", border: "3px solid rgba(201,162,39,0.4)" }}
                  >
                    <Icon className="h-7 w-7" style={{ color: "#c9a227" }} />
                  </div>
                  <div className="text-xs font-black tracking-widest mb-2" style={{ color: "#c9a227" }}>STEP {step}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: "#1a2744" }}>{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section
          className="rounded-2xl p-8 md:p-10"
          style={{ background: "linear-gradient(135deg, #0d1629 0%, #1a2744 100%)" }}
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-white">Our Journey</h2>
            <p className="text-white/50 text-sm mt-1">From idea to Pakistan's #1 screenshot platform</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {MILESTONES.map(({ year, label, sub }, i) => (
              <div key={year} className="text-center">
                <div
                  className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-black mb-3"
                  style={{ backgroundColor: "rgba(201,162,39,0.2)", color: "#c9a227" }}
                >
                  {year}
                </div>
                <div className="text-white font-bold text-sm">{label}</div>
                <div className="text-white/40 text-xs mt-1 leading-relaxed">{sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section>
          <div className="text-center mb-10">
            <Badge className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: "rgba(201,162,39,0.1)", color: "#c9a227", border: "1px solid rgba(201,162,39,0.25)" }}>
              Worker Stories
            </Badge>
            <h2 className="text-3xl font-black" style={{ color: "#1a2744" }}>Earning From Home, Every Day</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                name: "Sana Malik",
                city: "Lahore",
                quote: "I started with no experience. The WhatsApp training took less than an hour. By the next day I had submitted my first batch and seen my balance go up in real time. It feels real because it is real.",
                earning: "Rs. 2,500/day",
              },
              {
                name: "Hamza Riaz",
                city: "Karachi",
                quote: "I was skeptical about online earning platforms after getting cheated before. But here everything is shown — my total uploads, valid count, duplicates, and balance. No hidden calculations.",
                earning: "Rs. 3,800/day",
              },
              {
                name: "Fatima Bashir",
                city: "Islamabad",
                quote: "The EasyPaisa transfer arrives the same day. I work after my kids go to sleep — about 2 hours — and it covers our grocery budget for the week. I've told everyone in my neighbourhood.",
                earning: "Rs. 1,800/day",
              },
            ].map(({ name, city, quote, earning }) => (
              <div
                key={name}
                className="p-6 rounded-2xl border bg-white hover:shadow-lg transition-all"
              >
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-current" style={{ color: "#c9a227" }} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">"{quote}"</p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <div className="font-bold text-sm" style={{ color: "#1a2744" }}>{name}</div>
                    <div className="text-xs text-muted-foreground">{city}</div>
                  </div>
                  <div className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                    {earning}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          className="rounded-2xl text-center p-10 md:p-14"
          style={{ background: "linear-gradient(135deg, #1a2744 0%, #0d3d56 100%)" }}
        >
          <h2 className="text-3xl font-black text-white mb-4">Ready to Start Earning?</h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">
            Join hundreds of Pakistani home workers already earning daily. Free training, instant verification,
            and same-day payouts — all through your phone.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: "#c9a227", color: "#1a2744" }}
            >
              <MessageCircle className="h-4 w-4" />
              Join Now — It's Free
            </a>
            <Link href="/leaderboard">
              <Button
                variant="outline"
                className="h-14 px-8 border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent"
              >
                See Leaderboard <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
