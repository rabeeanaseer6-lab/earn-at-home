import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
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
            <Shield className="h-8 w-8" style={{ color: "#c9a227" }} />
            Privacy Policy
          </h1>
          <p className="text-white/60 text-sm">Last updated: January 2025</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-[#1a2744]">
          <h2>1. Information We Collect</h2>
          <p>
            When you register as a worker on the Earn at Home platform, we collect the following
            information:
          </p>
          <ul>
            <li>
              <strong>Identity information:</strong> Your full name and Worker ID assigned by us.
            </li>
            <li>
              <strong>Uploaded image batches:</strong> Screenshots submitted for verification tasks. These
              are stored temporarily for processing and quality review.
            </li>
            <li>
              <strong>Payment records:</strong> A log of all approved payments, including amounts and
              descriptions, linked to your Worker ID.
            </li>
            <li>
              <strong>Contact information:</strong> WhatsApp number or email address provided during
              registration, used solely for communication and task distribution.
            </li>
          </ul>
          <p>
            We do not collect financial account details (e.g., bank account or UPI ID) through our web
            platform. Payment disbursement details are handled through separate, secure channels.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We use collected information for the following purposes:</p>
          <ul>
            <li>To process and verify your submitted screenshot batches.</li>
            <li>To calculate and display your approved balance and payment history.</li>
            <li>To communicate task assignments, results, and payment notifications.</li>
            <li>To maintain platform integrity and detect fraudulent activity.</li>
            <li>To improve our verification algorithms and quality standards.</li>
          </ul>
          <p>
            We do not sell, rent, or share your personal information with third parties for marketing
            purposes.
          </p>

          <h2>3. Public Display of Information</h2>
          <p>
            The following information is displayed publicly on our platform to all visitors:
          </p>
          <ul>
            <li>Your full name</li>
            <li>Your Worker ID</li>
            <li>Your approved balance</li>
            <li>Your payment history (amounts and descriptions)</li>
            <li>Your upload statistics (total uploads, valid count, duplicate count)</li>
          </ul>
          <p>
            By participating in the Earn at Home platform, you consent to this public display. If you
            wish to remove your data, see Section 6 below.
          </p>

          <h2>4. Data Retention</h2>
          <p>
            We retain your personal information and payment records for as long as you are an active
            worker on our platform. If your account is inactive for more than 12 months, we may archive
            your data. Image batches submitted for verification are deleted from our servers within 90
            days of processing.
          </p>

          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data, including encrypted
            database storage and secure HTTPS connections. No system is completely secure; however, we
            take all reasonable steps to protect your information from unauthorized access.
          </p>

          <h2>6. Your Rights</h2>
          <p>As a worker on our platform, you have the right to:</p>
          <ul>
            <li>Request a copy of all personal data we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your account and associated data (subject to legal and financial record obligations).</li>
            <li>Opt out of non-essential communications.</li>
          </ul>
          <p>
            To exercise these rights, contact us at support@earnathome.in. We will respond to all valid
            requests within 14 business days.
          </p>

          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any significant changes will be
            communicated to active workers via WhatsApp or email. Continued use of the platform after
            changes constitutes acceptance of the updated policy.
          </p>

          <h2>8. Contact</h2>
          <p>
            For any privacy-related queries, contact us at: support@earnathome.in
          </p>
        </div>
      </div>
    </Layout>
  );
}
