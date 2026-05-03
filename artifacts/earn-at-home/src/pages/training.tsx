import { Link } from "wouter";
import {
  MessageCircle, BookOpen, Camera, CheckCircle, ArrowRight,
  Play, Star, Shield, Clock
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "923092821856";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const TRAINING_STEPS = [
  {
    step: 1,
    title: "Join the WhatsApp Group",
    body: "Click the WhatsApp button below to contact our Admin. You will receive your unique Worker ID and be added to the training group.",
    icon: MessageCircle,
  },
  {
    step: 2,
    title: "Complete Training Module 1",
    body: "Our trainer will send you a PDF guide and video explaining exactly how to capture screenshots correctly — which app, which settings, and how to save files.",
    icon: BookOpen,
  },
  {
    step: 3,
    title: "Submit a Practice Batch",
    body: "Complete a small practice batch of 50 screenshots. Our auto-checker will verify them and give you feedback on your accuracy before you begin paid work.",
    icon: Camera,
  },
  {
    step: 4,
    title: "Start Earning Rs. 5 Per Screenshot",
    body: "Once your practice batch is approved, you will receive your first paid batch assignment. Upload your folder and receive payment via EasyPaisa or JazzCash.",
    icon: CheckCircle,
  },
];

const FAQS = [
  {
    q: "How do I get paid?",
    a: "We pay out daily via EasyPaisa and JazzCash once your uploaded folder is verified by our auto-checker. Your balance is tracked live on this platform.",
  },
  {
    q: "What is a 'Duplicate'?",
    a: "Our system uses AI to detect if the same screenshot is uploaded twice. Only unique profile screenshots are paid at Rs. 5 each.",
  },
  {
    q: "How do I join?",
    a: "Click the WhatsApp button to contact our Admin (03092821856) to get your Worker ID and start the free training process.",
  },
  {
    q: "Is there any fee to join?",
    a: "No. Joining and training are completely free. Anyone asking for a registration fee on our behalf is a scammer.",
  },
  {
    q: "How many screenshots can I submit per day?",
    a: "There is no fixed limit. Most workers submit between 200 and 2,000 screenshots per day depending on their available time. The more you submit, the more you earn.",
  },
];

export default function TrainingPage() {
  return (
    <Layout>
      {/* Header */}
      <div className="py-12 border-b" style={{ backgroundColor: "#1a2744" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Badge
            className="mb-4 text-xs font-semibold uppercase tracking-widest border px-3 py-1"
            style={{ backgroundColor: "rgba(201,162,39,0.15)", color: "#c9a227", borderColor: "rgba(201,162,39,0.3)" }}
          >
            Free Training
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Professional Training
            <br />
            <span style={{ color: "#c9a227" }}>Provided Free of Charge</span>
          </h1>
          <p className="text-white/65 text-lg max-w-xl leading-relaxed mb-6">
            Don't know how to start? We provide complete training on how to capture and submit
            screenshots correctly. Join our WhatsApp group to receive your first training module
            and start earning Rs. 5 per valid screenshot.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-base transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#25D366", color: "white" }}
              data-testid="cta-whatsapp-training"
            >
              <MessageCircle className="h-5 w-5" />
              Start Training on WhatsApp
            </a>
            <Link href="/calculator">
              <Button variant="outline" className="h-14 px-7 text-base border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent">
                <Play className="h-4 w-4 mr-2" />
                Estimate Your Earnings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-16">
        {/* HOW IT WORKS */}
        <section>
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3">Step-by-Step Process</Badge>
            <h2 className="text-3xl font-extrabold" style={{ color: "#1a2744" }}>
              How to Get Started
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              From joining to earning — the entire process takes less than 24 hours.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRAINING_STEPS.map(({ step, title, body, icon: Icon }) => (
              <div
                key={step}
                className="bg-white border rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ backgroundColor: "#1a2744" }}
                  >
                    {step}
                  </div>
                  <Icon className="h-5 w-5 shrink-0" style={{ color: "#c9a227" }} />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1.5" style={{ color: "#1a2744" }}>
                    {title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BENEFITS */}
        <section
          className="rounded-2xl p-8 md:p-12"
          style={{ backgroundColor: "#1a2744" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                Why Workers Choose Earn at Home
              </h2>
              <ul className="space-y-3">
                {[
                  "Free professional training — no hidden fees",
                  "Rs. 5 per verified screenshot, paid daily",
                  "EasyPaisa and JazzCash payouts",
                  "Work from anywhere in Pakistan",
                  "No fixed hours — work at your own pace",
                  "Live balance tracking on our public portal",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                    <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#c9a227" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Star, label: "Daily Payouts", sub: "EasyPaisa & JazzCash" },
                { icon: Shield, label: "Free Training", sub: "Via WhatsApp Group" },
                { icon: Clock, label: "Flexible Hours", sub: "Work anytime" },
                { icon: CheckCircle, label: "Rs. 5 Rate", sub: "Per valid screenshot" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="rounded-xl p-4 text-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" style={{ color: "#c9a227" }} />
                  <div className="text-sm font-bold text-white">{label}</div>
                  <div className="text-xs text-white/50 mt-0.5">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold" style={{ color: "#1a2744" }}>
              Training FAQs
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((item, i) => (
              <div key={i} className="bg-white border rounded-xl overflow-hidden">
                <div className="px-5 py-4">
                  <div className="font-semibold text-sm mb-1.5" style={{ color: "#1a2744" }}>
                    {item.q}
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-extrabold mb-3" style={{ color: "#1a2744" }}>
            Ready to Start Earning?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Contact our admin on WhatsApp right now to get your free Worker ID and training guide.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#25D366", color: "white" }}
            data-testid="cta-whatsapp-bottom"
          >
            <MessageCircle className="h-5 w-5" />
            Join Now — 03092821856
          </a>
          <p className="text-xs text-muted-foreground mt-3">
            Free training · No registration fee · Start within 24 hours
          </p>
        </section>
      </div>
    </Layout>
  );
}
