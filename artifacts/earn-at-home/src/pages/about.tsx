import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout";
import { Github, Linkedin, Globe, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

/* ── Skill Slides ── */
const SKILL_SLIDES = [
  {
    category: "AI & Automation",
    skills: ["Machine Learning", "Predictive Modeling", "AI Pipelines", "Process Automation", "NLP", "Data Intelligence"],
    color: "#c9a227",
  },
  {
    category: "Full-Stack Engineering",
    skills: ["React / TypeScript", "Node.js / Express", "REST & GraphQL APIs", "PostgreSQL", "Drizzle ORM", "Vite"],
    color: "#1a2744",
  },
  {
    category: "Data & Analytics",
    skills: ["Python / Pandas", "Kaggle Projects", "Analytics Pipelines", "A/B Testing", "Behavior Modeling", "SEO Analytics"],
    color: "#16a34a",
  },
  {
    category: "Growth & SEO",
    skills: ["SEO Architecture", "Niche Site Strategy", "Content Systems", "User Flow Optimization", "Conversion Rate", "Digital Ecosystems"],
    color: "#7c3aed",
  },
];

/* ── Stats ── */
const STATS = [
  { value: 25, suffix: "+", label: "Web Assets Built" },
  { value: 5, suffix: "+", label: "Years Engineering" },
  { value: 100, suffix: "%", label: "Independent Founder" },
  { value: 3, suffix: "+", label: "Active Platforms" },
];

/* ── Timeline ── */
const TIMELINE = [
  {
    year: "Present",
    title: "Founder @ NovatraTech",
    desc: "Building scalable SaaS products, automated web infrastructures, and data-intelligent digital ecosystems.",
  },
  {
    year: "Ongoing",
    title: "25+ Niche Web Assets",
    desc: "Independently developed and managed niche web properties combining full-stack engineering with SEO architecture and data analytics.",
  },
  {
    year: "GitHub & Kaggle",
    title: "Applied Research & Publishing",
    desc: "Actively developing and publishing projects focused on applied analytics, predictive systems, and automation frameworks.",
  },
  {
    year: "Foundation",
    title: "AI & Data Systems Developer",
    desc: "Specializing at the intersection of software engineering, search intelligence, and applied data science.",
  },
];

/* ── Animated Counter Hook ── */
function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ── Intersection Observer Hook ── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ── Stat Card ── */
function StatCard({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const { ref, inView } = useInView();
  const count = useCounter(value, 1600, inView);
  return (
    <div
      ref={ref}
      className="text-center p-6 rounded-2xl border transition-all duration-700"
      style={{
        backgroundColor: "rgba(255,255,255,0.06)",
        borderColor: "rgba(201,162,39,0.25)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="text-4xl font-black mb-1" style={{ color: "#c9a227" }}>
        {count}{suffix}
      </div>
      <div className="text-sm text-white/70 font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
}

/* ── Skills Slider ── */
function SkillsSlider() {
  const [active, setActive] = useState(0);
  const [animDir, setAnimDir] = useState<"left" | "right">("right");
  const [visible, setVisible] = useState(true);

  const navigate = (dir: "left" | "right") => {
    setAnimDir(dir);
    setVisible(false);
    setTimeout(() => {
      setActive((prev) =>
        dir === "right"
          ? (prev + 1) % SKILL_SLIDES.length
          : (prev - 1 + SKILL_SLIDES.length) % SKILL_SLIDES.length
      );
      setVisible(true);
    }, 200);
  };

  useEffect(() => {
    const interval = setInterval(() => navigate("right"), 3500);
    return () => clearInterval(interval);
  }, []);

  const slide = SKILL_SLIDES[active];

  return (
    <div className="relative rounded-3xl overflow-hidden p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
      {/* Slide content */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : animDir === "right" ? "translateX(-30px)" : "translateX(30px)",
          transition: "all 0.2s ease",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: slide.color }} />
          <h3 className="text-xl font-bold text-white">{slide.category}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {slide.skills.map((skill, i) => (
            <span
              key={skill}
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${slide.color}20`,
                border: `1px solid ${slide.color}50`,
                color: slide.color,
                animationDelay: `${i * 60}ms`,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex gap-2">
          {SKILL_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setAnimDir(i > active ? "right" : "left"); setVisible(false); setTimeout(() => { setActive(i); setVisible(true); }, 200); }}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? "24px" : "8px",
                height: "8px",
                backgroundColor: i === active ? "#c9a227" : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate("left")} className="p-2 rounded-full transition-colors hover:bg-white/10">
            <ChevronLeft className="h-4 w-4 text-white/70" />
          </button>
          <button onClick={() => navigate("right")} className="p-2 rounded-full transition-colors hover:bg-white/10">
            <ChevronRight className="h-4 w-4 text-white/70" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Timeline Item ── */
function TimelineItem({ year, title, desc, index }: { year: string; title: string; desc: string; index: number }) {
  const { ref, inView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className="flex gap-6"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-40px)",
        transition: `all 0.6s cubic-bezier(0.16,1,0.3,1)`,
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ backgroundColor: "#c9a227", boxShadow: "0 0 12px rgba(201,162,39,0.6)" }} />
        <div className="w-px flex-1 mt-2" style={{ backgroundColor: "rgba(201,162,39,0.2)" }} />
      </div>
      <div className="pb-8">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#c9a227" }}>{year}</span>
        <h4 className="text-white font-bold text-lg mt-1">{title}</h4>
        <p className="text-white/60 text-sm mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

/* ── Focus Card (needs own component to use hook at top level) ── */
function FocusCard({ title, icon, desc, color, index }: { title: string; icon: string; desc: string; color: string; index: number }) {
  const { ref, inView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className="card-hover p-6 rounded-2xl"
      style={{
        backgroundColor: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
        transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 80}ms`,
      }}
    >
      <div
        className="text-2xl w-12 h-12 flex items-center justify-center rounded-xl mb-4"
        style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
      >
        {icon}
      </div>
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

/* ── Main Page ── */
export default function AboutPage() {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <Layout>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 0.4; }
          100% { transform: scale(0.9); opacity: 0.8; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(90px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotate(180deg) translateX(110px) rotate(-180deg); }
          to { transform: rotate(540deg) translateX(110px) rotate(-540deg); }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #c9a227 0%, #f5d76e 40%, #c9a227 60%, #f5d76e 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .card-hover {
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(201,162,39,0.15);
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d1629 0%, #1a2744 50%, #0d1629 100%)" }}
      >
        {/* Orbiting particles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-64 h-64 opacity-20">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "#c9a227",
                  animation: `orbit${i % 2 === 0 ? "" : "2"} ${5 + i * 2}s linear infinite`,
                  marginTop: "-4px",
                  marginLeft: "-4px",
                }}
              />
            ))}
          </div>
        </div>

        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(201,162,39,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                style={{
                  backgroundColor: "rgba(201,162,39,0.12)",
                  border: "1px solid rgba(201,162,39,0.3)",
                  color: "#c9a227",
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                Founder & Developer
              </div>

              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 leading-none"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? "translateY(0)" : "translateY(30px)",
                  transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
                }}
              >
                <span className="text-white block">Rabeea</span>
                <span className="shimmer-text block">Naseer</span>
              </h1>

              <p
                className="text-lg text-white/70 mb-2 font-medium"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s",
                }}
              >
                AI & Data-Driven Systems Developer
              </p>
              <p
                className="text-base font-bold mb-8"
                style={{
                  color: "#c9a227",
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s",
                }}
              >
                Founder @ NovatraTech
              </p>

              <p
                className="text-white/60 text-base leading-relaxed mb-10 max-w-xl"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s",
                }}
              >
                Building scalable SaaS products, automated web infrastructures,
                and data-intelligent, revenue-generating digital ecosystems —
                where AI and data continuously enhance performance, scalability, and real-world impact.
              </p>

              {/* CTA Links */}
              <div
                className="flex flex-wrap gap-3"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s",
                }}
              >
                {[
                  { icon: Globe, label: "Portfolio", href: "https://rabeeanaseer.online", bg: "#c9a227", fg: "#1a2744" },
                  { icon: Github, label: "GitHub", href: "https://github.com/rabeeanaseer6-lab", bg: "transparent", fg: "white" },
                  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/rabeea-naseer-045b4a337/", bg: "transparent", fg: "white" },
                ].map(({ icon: Icon, label, href, bg, fg }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: bg,
                      color: fg,
                      border: bg === "transparent" ? "1px solid rgba(255,255,255,0.2)" : "none",
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Animated Avatar */}
            <div
              className="flex justify-center"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "scale(1)" : "scale(0.8)",
                transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.3s",
              }}
            >
              <div className="relative w-72 h-72">
                {/* Pulsing rings */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: `2px solid rgba(201,162,39,${0.4 - i * 0.12})`,
                      transform: `scale(${1 + i * 0.12})`,
                      animation: `pulse-ring ${2 + i * 0.5}s ease-in-out infinite`,
                      animationDelay: `${i * 0.4}s`,
                    }}
                  />
                ))}

                {/* Avatar circle */}
                <div
                  className="absolute inset-4 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #c9a227 0%, #f5d76e 50%, #c9a227 100%)",
                    animation: "float 6s ease-in-out infinite",
                    boxShadow: "0 20px 60px rgba(201,162,39,0.4)",
                  }}
                >
                  <div className="text-center">
                    <div className="text-6xl font-black" style={{ color: "#1a2744" }}>RN</div>
                    <div className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: "#1a2744" }}>NovatraTech</div>
                  </div>
                </div>

                {/* Floating skill badges */}
                {[
                  { label: "AI/ML", top: "0%", left: "60%", delay: "0s" },
                  { label: "SaaS", top: "70%", left: "80%", delay: "0.5s" },
                  { label: "SEO", top: "80%", left: "5%", delay: "1s" },
                  { label: "Data", top: "5%", left: "0%", delay: "1.5s" },
                ].map(({ label, top, left, delay }) => (
                  <div
                    key={label}
                    className="absolute px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{
                      top,
                      left,
                      backgroundColor: "#1a2744",
                      border: "1px solid rgba(201,162,39,0.5)",
                      color: "#c9a227",
                      animation: `float 4s ease-in-out infinite`,
                      animationDelay: delay,
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20" style={{ background: "#1a2744" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <StatCard key={s.label} {...s} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS SLIDER ── */}
      <section className="py-24" style={{ background: "linear-gradient(180deg, #0d1629 0%, #1a2744 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Core Expertise</h2>
            <p className="text-white/50">Swipe through the skill domains</p>
          </div>
          <SkillsSlider />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-24" style={{ background: "#1a2744" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Bio */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
                About <span className="shimmer-text">Rabeea</span>
              </h2>
              <div className="space-y-5 text-white/65 leading-relaxed">
                <p>
                  Rabeea Naseer is an AI & data-driven systems developer and the founder of <strong className="text-white">NovatraTech</strong>,
                  focused on building scalable SaaS products, automated web infrastructures, and data-intelligent,
                  revenue-generating digital ecosystems.
                </p>
                <p>
                  She has independently developed and managed <strong className="text-white">25+ niche web assets</strong>,
                  combining full-stack engineering with SEO architecture, data analytics, and user behavior modeling
                  to transform websites into automated, performance-driven systems rather than static builds.
                </p>
                <p>
                  Her work sits at the intersection of software engineering, search intelligence, and applied data science,
                  integrating analytics pipelines and AI automation to optimize decision-making, user flows, and scalable growth.
                </p>
                <p>
                  She actively develops and publishes projects on <strong className="text-white">GitHub and Kaggle</strong>,
                  focusing on applied analytics, predictive systems, and automation frameworks.
                </p>
                <p>
                  Her long-term focus is on engineering intelligent, self-optimizing digital ecosystems — where AI and data
                  continuously enhance performance, scalability, and real-world impact.
                </p>
              </div>

              {/* Links */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: Globe, label: "Portfolio", sub: "rabeeanaseer.online", href: "https://rabeeanaseer.online", color: "#c9a227" },
                  { icon: Github, label: "GitHub", sub: "rabeeanaseer6-lab", href: "https://github.com/rabeeanaseer6-lab", color: "#e5e7eb" },
                  { icon: Linkedin, label: "LinkedIn", sub: "Rabeea Naseer", href: "https://www.linkedin.com/in/rabeea-naseer-045b4a337/", color: "#0ea5e9" },
                ].map(({ icon: Icon, label, sub, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-hover flex items-center gap-3 p-4 rounded-xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <Icon className="h-5 w-5 shrink-0" style={{ color }} />
                    <div>
                      <div className="text-white text-sm font-semibold">{label}</div>
                      <div className="text-white/40 text-xs truncate">{sub}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-2xl font-black text-white mb-8">Journey</h3>
              {TIMELINE.map((item, i) => (
                <TimelineItem key={i} {...item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOCUS AREAS ── */}
      <section className="py-24" style={{ background: "linear-gradient(180deg, #0d1629 0%, #121e38 100%)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">What I Build</h2>
            <p className="text-white/50">Intelligent systems at the intersection of engineering and data</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Scalable SaaS", icon: "⚡", desc: "Full-stack products built for growth — automated, modular, and data-aware from day one.", color: "#c9a227" },
              { title: "SEO Architecture", icon: "🔍", desc: "Technical SEO infrastructure integrated into site builds, not bolted on after.", color: "#7c3aed" },
              { title: "AI Pipelines", icon: "🤖", desc: "Automation and ML systems that optimize decisions, user flows, and operational scale.", color: "#16a34a" },
              { title: "Niche Web Assets", icon: "🌐", desc: "Performance-driven web properties combining analytics, UX, and revenue engineering.", color: "#0ea5e9" },
              { title: "Predictive Systems", icon: "📊", desc: "Kaggle-published analytics models and data-driven frameworks applied to real problems.", color: "#f59e0b" },
              { title: "Digital Ecosystems", icon: "🚀", desc: "Self-optimizing infrastructures where every component feeds back into growth.", color: "#ec4899" },
            ].map((item, i) => (
              <FocusCard key={item.title} {...item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20" style={{ background: "#1a2744" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Let's Connect</h2>
          <p className="text-white/60 mb-8">
            Open to collaborations, consulting, and building together. Reach out through any channel below.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://rabeeanaseer.online"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: "#c9a227", color: "#1a2744" }}
            >
              <Globe className="h-4 w-4" /> Visit Portfolio
            </a>
            <a
              href="https://github.com/rabeeanaseer6-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105"
              style={{ border: "1px solid rgba(255,255,255,0.2)", color: "white" }}
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/rabeea-naseer-045b4a337/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105"
              style={{ border: "1px solid rgba(14,165,233,0.4)", color: "#0ea5e9" }}
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
