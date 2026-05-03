import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export default function TermsPage() {
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
            <FileText className="h-8 w-8" style={{ color: "#c9a227" }} />
            Terms of Service
          </h1>
          <p className="text-white/60 text-sm">Last updated: January 2025</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-[#1a2744]">
          <h2>1. Eligibility</h2>
          <p>
            To participate as a worker on the Earn at Home platform, you must:
          </p>
          <ul>
            <li>Be at least 18 years of age.</li>
            <li>Be a resident of India.</li>
            <li>Have received an official Worker ID from us.</li>
            <li>Have the legal capacity to enter into a binding agreement.</li>
          </ul>
          <p>
            By using this platform, you confirm that you meet all eligibility requirements. We reserve
            the right to suspend accounts that do not meet these criteria.
          </p>

          <h2>2. Nature of Work</h2>
          <p>
            Workers on the Earn at Home platform are engaged in task-based data verification work.
            Specifically, you will process batches of screenshots and submit them for automated and
            human review. This is not employment. You are an independent task performer, not an
            employee, contractor, or agent of Earn at Home.
          </p>

          <h2>3. Payment Terms</h2>
          <ul>
            <li>The current rate is Rs 5 per valid, unique, high-quality screenshot.</li>
            <li>
              Only screenshots that pass our full verification pipeline (non-duplicate, meets resolution
              and clarity standards, follows task guidelines) are counted as payable.
            </li>
            <li>
              Payments are processed weekly, every Friday. Batches must be submitted and verified by
              Wednesday midnight IST to be included in that week's cycle.
            </li>
            <li>
              Payment rates may change. We will provide at least 7 days' notice of any rate changes via
              WhatsApp or email.
            </li>
          </ul>

          <h2>4. Worker Obligations</h2>
          <p>As a worker, you agree to:</p>
          <ul>
            <li>Submit only original, unique screenshots that you have not previously submitted.</li>
            <li>
              Ensure all submitted images meet our minimum quality standards (1080p resolution or higher,
              clear and legible).
            </li>
            <li>Follow the specific task guidelines provided for each batch type.</li>
            <li>Not attempt to manipulate, duplicate, or forge any submitted content.</li>
            <li>Not share your Worker ID or allow others to submit on your behalf.</li>
          </ul>

          <h2>5. Prohibited Conduct</h2>
          <p>The following activities are strictly prohibited and will result in immediate termination:</p>
          <ul>
            <li>Submitting duplicate, manipulated, or artificially generated images.</li>
            <li>Attempting to reverse-engineer or exploit our verification system.</li>
            <li>Creating multiple accounts to circumvent quality controls.</li>
            <li>Sharing or selling your Worker ID credentials.</li>
            <li>Submitting content that is illegal, obscene, or harmful.</li>
          </ul>

          <h2>6. Termination</h2>
          <p>
            We reserve the right to suspend or permanently terminate any worker account, with or without
            notice, for violation of these Terms, fraudulent activity, or any behavior that undermines
            platform integrity. Upon termination for cause, any pending balance may be forfeited.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            Earn at Home is not liable for any loss of income arising from platform downtime, changes
            in task availability, account suspension, or rejection of submitted batches. Workers
            participate at their own risk and accept that task availability is not guaranteed.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These Terms shall be governed by the laws of India. Any disputes shall be resolved through
            arbitration in accordance with the Arbitration and Conciliation Act, 1996.
          </p>

          <h2>9. Contact</h2>
          <p>
            For questions regarding these Terms, contact us at: support@earnathome.in
          </p>
        </div>
      </div>
    </Layout>
  );
}
