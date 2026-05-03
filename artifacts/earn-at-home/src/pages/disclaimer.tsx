import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <Layout>
      <div className="py-10 border-b" style={{ backgroundColor: "#1a2744" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Badge
            className="mb-4 text-xs font-semibold uppercase tracking-widest border px-3 py-1"
            style={{ backgroundColor: "rgba(201,162,39,0.15)", color: "#c9a227", borderColor: "rgba(201,162,39,0.3)" }}
          >
            Legal
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8" style={{ color: "#c9a227" }} />
            Earning Disclaimer
          </h1>
          <p className="text-white/60 text-sm">Last updated: January 2025</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div
          className="border-l-4 p-5 rounded-r-xl mb-8 text-sm"
          style={{ borderColor: "#c9a227", backgroundColor: "rgba(201,162,39,0.06)" }}
        >
          <strong className="block mb-1" style={{ color: "#1a2744" }}>
            Important Notice
          </strong>
          <p className="text-muted-foreground leading-relaxed">
            The earning estimates and figures shown on this platform are for illustrative purposes only.
            Actual earnings will vary based on individual performance, task availability, and quality of
            work. This is not a guaranteed income scheme.
          </p>
        </div>

        <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-[#1a2744]">
          <h2>1. Nature of Engagement</h2>
          <p>
            Participation in the Earn at Home platform is task-based, not employment. Workers are
            independent task performers who earn compensation on a per-verified-screenshot basis. There
            is no employment contract, no fixed salary, and no guaranteed minimum income.
          </p>

          <h2>2. Earnings Are Performance-Based</h2>
          <p>
            Your earnings are directly determined by:
          </p>
          <ul>
            <li>The number of screenshots you submit per batch.</li>
            <li>The percentage of your submissions that pass quality verification (accuracy rate).</li>
            <li>The availability of tasks during a given period.</li>
            <li>Compliance with task-specific guidelines.</li>
          </ul>
          <p>
            Workers who submit more valid, high-quality screenshots will earn more. Workers with high
            duplicate rates or low-quality submissions will earn significantly less than estimated.
          </p>

          <h2>3. No Guaranteed Income</h2>
          <p>
            The income estimator and leaderboard figures on this platform represent historical or
            hypothetical performance. Past earnings of other workers do not guarantee similar results
            for you. Task availability is not guaranteed and may fluctuate based on client demand.
          </p>

          <h2>4. Tax Responsibility</h2>
          <p>
            All earnings received through the Earn at Home platform may be subject to income tax under
            applicable Indian tax laws. Workers are solely responsible for:
          </p>
          <ul>
            <li>Reporting their earnings to income tax authorities as required.</li>
            <li>Filing tax returns if their income exceeds the basic exemption limit.</li>
            <li>Paying any applicable taxes on their earnings.</li>
          </ul>
          <p>
            Earn at Home does not deduct TDS or file tax documents on behalf of workers. Consult a
            qualified tax advisor for guidance specific to your situation.
          </p>

          <h2>5. No Investment Required</h2>
          <p>
            Earn at Home does not require any registration fee, training fee, or purchase of materials.
            If anyone asks you to pay money to join or work on our platform, they are not affiliated
            with us and may be attempting fraud. Report such incidents to us immediately.
          </p>

          <h2>6. Platform Availability</h2>
          <p>
            Earn at Home reserves the right to modify, suspend, or discontinue task availability at
            any time without notice. Workers do not have a legal claim to any future tasks or earnings
            beyond those already approved and recorded on the platform.
          </p>

          <h2>7. Contact</h2>
          <p>
            If you have questions about earnings, payment calculations, or this disclaimer, contact us
            at: support@earnathome.in
          </p>
        </div>
      </div>
    </Layout>
  );
}
