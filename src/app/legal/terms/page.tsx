import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-6">
        <Link href="/" className="text-brand-400 text-sm hover:underline">← Home</Link>
        <h1 className="font-serif text-3xl font-bold">Terms of Service</h1>
        <p className="text-white/50 text-sm">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-5 text-white/70 leading-relaxed text-sm">
          <section>
            <h2 className="text-white font-semibold mb-2">1. Service Description</h2>
            <p>OTR Portfolios provides professional web portfolio creation services for basketball players. Upon purchase, you receive a live hosted web page, downloadable PDF, and outreach email templates depending on your selected tier.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold mb-2">2. Payment & Refunds</h2>
            <p>All sales are final. Refunds are handled on a case-by-case basis. If you have not yet submitted your intake form, contact us within 48 hours of purchase for a full refund. Once intake is submitted and drafting has begun, refunds are not available.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold mb-2">3. Content Ownership</h2>
            <p>You retain full ownership of all content you provide (stats, photos, video links, biographical information). You grant OTR Portfolios a limited license to display this content within your portfolio page. We may use your portfolio as a sample or in our marketing with your permission.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold mb-2">4. Accuracy</h2>
            <p>You are responsible for the accuracy of information provided in the intake form. OTR Portfolios is not liable for inaccuracies in content derived from your submissions.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold mb-2">5. Portfolio Availability</h2>
            <p>We will maintain your portfolio page for a minimum of 12 months from publication. Hosting beyond 12 months is provided as long as the service is operational.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold mb-2">6. Contact</h2>
            <p>Questions? Email {process.env.ADMIN_EMAIL ?? "contact@otrportfolios.com"}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
