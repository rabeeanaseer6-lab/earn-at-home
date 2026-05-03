import { useState } from "react";
import { Link } from "wouter";
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, BookOpen } from "lucide-react";
import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FaqItem {
  q: string;
  a: string;
}

interface Section {
  title: string;
  items: FaqItem[];
}

const SECTIONS: Section[] = [
  {
    title: "Getting Started",
    items: [
      {
        q: "How do I join the Earn at Home platform?",
        a: "To join, you need to be referred by an existing worker or apply through our official registration process. Contact us on WhatsApp or email us at support@earnathome.in. We verify all new workers before issuing a Worker ID.",
      },
      {
        q: "What is a Worker ID and where do I find it?",
        a: "Your Worker ID is a unique alphanumeric code (e.g., WRK001) issued when you join the platform. You can find it in your welcome message or by contacting support. Use this ID to search for your profile on our public leaderboard.",
      },
      {
        q: "What equipment do I need?",
        a: "You need a smartphone or computer capable of taking clear screenshots at 1080p resolution or higher, a stable internet connection to upload batches, and WhatsApp or email to receive task instructions.",
      },
      {
        q: "Is there any registration fee?",
        a: "No. Joining the Earn at Home platform is completely free. We do not charge any registration, training, or deposit fees. Anyone asking for a fee on our behalf is a scammer.",
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        q: "When are payments processed?",
        a: "Payments are processed every Friday. To be included, your verified batch must be submitted and cleared by Wednesday midnight (IST). Approved amounts are added to your balance the same week.",
      },
      {
        q: "What is the rate per screenshot?",
        a: "The current rate is Rs 5 per valid, unique, high-quality screenshot. Only screenshots that pass our full verification pipeline (non-duplicate, clear, meets guidelines) are counted as payable.",
      },
      {
        q: "How do I check my balance?",
        a: "Visit the homepage or leaderboard and search for your name or Worker ID. Your approved balance and full payment history will be displayed in real time.",
      },
      {
        q: "Can my balance be deducted or reduced?",
        a: "Your balance only increases as payments are approved. However, if a batch is rejected or disputed after initial approval, the corresponding amount may be reversed. We notify you immediately in such cases.",
      },
    ],
  },
  {
    title: "Technical Issues",
    items: [
      {
        q: "Why is my upload showing as duplicate?",
        a: "Our OCR and perceptual hashing system detects duplicate images even if they are slightly cropped or adjusted. Ensure each screenshot in your batch is unique. You can view your duplicate count on your public profile.",
      },
      {
        q: "My images are marked as low quality — why?",
        a: "Images must meet minimum resolution (1080p) and clarity standards. Blurry, heavily compressed, or dark screenshots are flagged as low quality and may not count toward your payable total. Ensure your device camera or screen capture is set to the highest quality setting.",
      },
      {
        q: "How long does verification take?",
        a: "Verification typically takes 24-48 hours after you submit a batch. Complex batches with many images may take up to 72 hours. Admin review follows immediately after automated processing.",
      },
    ],
  },
  {
    title: "Account & Policy",
    items: [
      {
        q: "Can I update my name or contact information?",
        a: "Contact our support team to update your name or contact details. Worker IDs cannot be changed once assigned.",
      },
      {
        q: "What happens if I submit fraudulent images?",
        a: "Any worker found submitting manipulated, fabricated, or fraudulent images will be immediately suspended from the platform, their pending balance will be forfeited, and they may be reported to relevant authorities.",
      },
      {
        q: "Is my data secure?",
        a: "Yes. We collect only the minimum data necessary (name, Worker ID, uploaded batches, payment records). See our Privacy Policy for full details on how we handle and protect your data.",
      },
    ],
  },
];

function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border rounded-xl bg-white overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-sm hover:bg-muted/30 transition-colors"
            style={{ color: "#1a2744" }}
            onClick={() => setOpen(open === i ? null : i)}
            data-testid={`help-faq-${i}`}
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

export default function HelpPage() {
  return (
    <Layout>
      <div className="py-10 border-b" style={{ backgroundColor: "#1a2744" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Badge
            className="mb-4 text-xs font-semibold uppercase tracking-widest border px-3 py-1"
            style={{ backgroundColor: "rgba(201,162,39,0.15)", color: "#c9a227", borderColor: "rgba(201,162,39,0.3)" }}
          >
            Help Center
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
            <HelpCircle className="h-8 w-8" style={{ color: "#c9a227" }} />
            How Can We Help?
          </h1>
          <p className="text-white/60 text-base max-w-xl">
            Find answers to the most common questions about working with our platform.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "#1a2744" }}>
              <HelpCircle className="h-5 w-5" style={{ color: "#c9a227" }} />
              {section.title}
            </h2>
            <Accordion items={section.items} />
          </section>
        ))}

        {/* Contact CTA */}
        <section
          className="rounded-2xl p-8 text-center"
          style={{ backgroundColor: "#1a2744" }}
        >
          <h2 className="text-xl font-bold text-white mb-2">
            Still have questions?
          </h2>
          <p className="text-white/60 text-sm mb-6">
            Our support team is available Monday to Saturday, 9am – 6pm IST.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#25D366", color: "white" }}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
            <Link href="/blog">
              <Button variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent">
                <BookOpen className="h-4 w-4" />
                Browse Articles
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
