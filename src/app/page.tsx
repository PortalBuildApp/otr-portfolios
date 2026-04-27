import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OTR Portfolios — Turn Your Game Into a Career",
  description:
    "Professional live web portfolios for basketball players. Get discovered by college coaches, pro agents, and brand sponsors.",
};

const tiers = [
  {
    id: "college",
    name: "College Scholarship",
    price: "$397",
    bestFor: "Players 18–21",
    tagline: "Chase the scholarship",
    features: [
      "Live hosted portfolio page",
      "AI-written bio, story & scout breakdown",
      "5 personalized college coach cover letters",
      "Shareable link + PDF download",
      "OG preview cards for social sharing",
    ],
    cta: "Get My College Portfolio",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro Tryout",
    price: "$497",
    bestFor: "Players 22–27",
    tagline: "Chase the contract",
    features: [
      "Live hosted portfolio page",
      "AI-written bio, story & scout breakdown",
      "3 agency intro emails",
      "Shareable link + PDF download",
      "OG preview cards for social sharing",
    ],
    cta: "Get My Pro Portfolio",
    highlight: false,
  },
  {
    id: "sponsorship",
    name: "Sponsorship",
    price: "$497",
    bestFor: "Brand-building players",
    tagline: "Chase the deal",
    features: [
      "Live hosted portfolio page",
      "AI-written bio, story & scout breakdown",
      "5 brand pitch emails",
      "Shareable link + PDF download",
      "OG preview cards for social sharing",
    ],
    cta: "Get My Sponsorship Portfolio",
    highlight: false,
  },
  {
    id: "full_stack",
    name: "Full Stack",
    price: "$997",
    bestFor: "Players who want all doors open",
    tagline: "Chase everything",
    features: [
      "Everything in all three tiers",
      "5 college coach letters",
      "3 agency intro emails",
      "5 brand pitch emails",
      "Priority turnaround (24 hrs)",
      "Live page + PDF + full outreach kit",
    ],
    cta: "Get the Full Stack",
    highlight: true,
  },
];

const faqs = [
  {
    q: "What exactly do I get?",
    a: "A live, hosted web page — like a personal website — that tells your basketball story professionally. It's designed to be sent to coaches, agents, and brands instead of a PDF or email attachment. You also get a downloadable PDF version and ready-to-send outreach emails depending on your tier.",
  },
  {
    q: "How does it work?",
    a: "After you pay, you'll receive a link to fill out a 10-minute intake form. We collect your career highlights, stats, goals, and any video links. Within 24 hours, we use that information (plus AI writing assistance) to build your portfolio draft. You review and we publish.",
  },
  {
    q: "My son is in high school — is this for him?",
    a: "Yes. The College Scholarship tier is built for players aged 18–21 chasing scholarships. Parents often fill out the intake form. The portfolio does the work coaches want: tells the story, shows the film, makes contact easy.",
  },
  {
    q: "What's the OTR coupon code?",
    a: "If you played in an OTR Tour, use code OTR at checkout for 10% off.",
  },
  {
    q: "Can I update my portfolio later?",
    a: "Yes — updates are available as a paid add-on. Reply to your delivery email to request changes.",
  },
  {
    q: "How long does it take?",
    a: "24 hours after your intake form is submitted. Full Stack orders are prioritized.",
  },
];

export default function SalesPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-serif text-xl font-bold tracking-tight">OTR Portfolios</span>
          <Link
            href="/sample"
            target="_blank"
            className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
          >
            See a live portfolio →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 pt-20 pb-16 text-center max-w-4xl mx-auto">
        <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-4">
          By OTR Tours
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
          Your game deserves a{" "}
          <span className="text-brand-400">real platform</span>
        </h1>
        <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          A live, professional portfolio that tells your basketball story — built
          to pitch college coaches, pro agencies, and brand sponsors. Not a PDF.
          Not a Word doc. A real page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/sample" target="_blank" className="btn-primary text-base px-8 py-4">
            See a live portfolio
          </Link>
          <a href="#pricing" className="btn-secondary text-base px-8 py-4">
            View pricing
          </a>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-white/10 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 text-center">
          {[
            { stat: "24 hrs", label: "Avg delivery time" },
            { stat: "1 link", label: "Sends everywhere" },
            { stat: "OTR-backed", label: "Trusted by coaches" },
          ].map(({ stat, label }) => (
            <div key={stat}>
              <div className="text-2xl font-bold text-brand-400">{stat}</div>
              <div className="text-sm text-white/50">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { n: "1", title: "Pick your tier", body: "Choose college, pro, sponsorship, or Full Stack. Use code OTR for 10% off if you're an OTR Tour player." },
            { n: "2", title: "Fill the intake form", body: "A 10-minute form covering your career, stats, highlights, and goals. Parents can fill it for their son." },
            { n: "3", title: "Get your portfolio", body: "Within 24 hours you receive a live link, a PDF, and ready-to-send outreach emails for coaches, agents, or brands." },
          ].map(({ n, title, body }) => (
            <div key={n} className="card p-6">
              <div className="w-9 h-9 rounded-full bg-brand-600/30 text-brand-400 flex items-center justify-center font-bold text-sm mb-4">
                {n}
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 py-20 max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl font-bold text-center mb-4">Pricing</h2>
        <p className="text-center text-white/50 mb-12">
          OTR Tour players: use code <span className="text-brand-400 font-mono font-bold">OTR</span> for 10% off
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative card p-6 flex flex-col gap-4 ${
                tier.highlight ? "border-brand-500 ring-1 ring-brand-500/50" : ""
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}
              <div>
                <p className="text-brand-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  {tier.bestFor}
                </p>
                <h3 className="font-serif text-xl font-bold">{tier.name}</h3>
                <p className="text-white/50 text-sm">{tier.tagline}</p>
              </div>
              <div className="text-3xl font-bold">{tier.price}</div>
              <ul className="space-y-2 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-white/70">
                    <span className="text-brand-400 mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/checkout/${tier.id}`}
                className={`w-full text-center py-3 rounded-lg font-semibold text-sm transition-colors ${
                  tier.highlight
                    ? "bg-brand-600 hover:bg-brand-500 text-white"
                    : "border border-white/20 hover:border-white/40 hover:bg-white/5 text-white"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 max-w-3xl mx-auto">
        <h2 className="font-serif text-3xl font-bold text-center mb-12">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map(({ q, a }) => (
            <div key={q} className="border-b border-white/10 pb-6">
              <h3 className="font-semibold text-lg mb-2">{q}</h3>
              <p className="text-white/60 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl font-bold mb-4">Ready to build your portfolio?</h2>
        <p className="text-white/60 mb-8">
          See exactly what you're getting first.
        </p>
        <Link href="/sample" target="_blank" className="btn-primary text-base px-8 py-4">
          See a live portfolio →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <span>© {new Date().getFullYear()} OTR Portfolios. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/legal/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-neutral-950/95 border-t border-white/10 p-4 z-50">
        <Link href="/sample" target="_blank" className="btn-primary w-full text-sm py-3">
          See a live portfolio →
        </Link>
      </div>
    </div>
  );
}
