import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-6">
        <Link href="/" className="text-brand-400 text-sm hover:underline">← Home</Link>
        <h1 className="font-serif text-3xl font-bold">Privacy Policy</h1>
        <p className="text-white/50 text-sm">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-5 text-white/70 leading-relaxed text-sm">
          <section>
            <h2 className="text-white font-semibold mb-2">Information We Collect</h2>
            <p>We collect information you provide directly: name, email address, billing information (processed by Stripe — we never see your card number), and the athlete information you submit in the intake form.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold mb-2">How We Use It</h2>
            <p>We use your information to create and deliver your portfolio, process payments, and send you transactional emails related to your order. We do not sell your data or use it for advertising.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold mb-2">Third-Party Services</h2>
            <p>We use Stripe for payment processing, Resend for transactional email, Neon for database hosting, and Vercel for app hosting. Each has their own privacy policy.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold mb-2">Data Retention</h2>
            <p>We retain your order data and portfolio content as long as your portfolio is live. You may request deletion by contacting us.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold mb-2">Contact</h2>
            <p>Privacy questions: {process.env.ADMIN_EMAIL ?? "contact@otrportfolios.com"}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
