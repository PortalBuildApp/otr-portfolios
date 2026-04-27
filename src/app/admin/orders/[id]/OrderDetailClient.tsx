"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { InferSelectModel } from "drizzle-orm";
import type { orders, intakeResponses, athletes } from "@/db/schema";
import type { AIDrafts } from "@/lib/anthropic";

type Order = InferSelectModel<typeof orders>;
type Intake = InferSelectModel<typeof intakeResponses>;
type Athlete = InferSelectModel<typeof athletes>;

interface Props {
  order: Order;
  intake: Intake | null;
  athlete: Athlete | null;
}

export default function OrderDetailClient({ order, intake, athlete }: Props) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [drafts, setDrafts] = useState<AIDrafts | null>(
    athlete?.aiDraftsJson ? (athlete.aiDraftsJson as AIDrafts) : null
  );

  // Editable draft fields
  const [heroTagline, setHeroTagline] = useState(
    drafts?.hero_tagline ?? athlete?.heroTagline ?? ""
  );
  const [bio, setBio] = useState(drafts?.bio ?? athlete?.bio ?? "");
  const [story, setStory] = useState(drafts?.story ?? athlete?.story ?? "");
  const [scout, setScout] = useState(
    drafts?.scout_breakdown ?? athlete?.scoutBreakdown ?? ""
  );
  const [heroImageUrl, setHeroImageUrl] = useState(athlete?.heroImageUrl ?? "");
  const [contactEmail, setContactEmail] = useState(
    athlete?.contactEmail ?? order.buyerEmail ?? ""
  );

  async function generateDrafts() {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/admin/generate-drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const { drafts: newDrafts } = await res.json();
      setDrafts(newDrafts);
      setHeroTagline(newDrafts.hero_tagline);
      setBio(newDrafts.bio);
      setStory(newDrafts.story);
      setScout(newDrafts.scout_breakdown);
      router.refresh();
    } catch (e) {
      setError("Generation failed. Check intake data and try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function publish() {
    setPublishing(true);
    setError("");
    try {
      const publishDrafts: AIDrafts = {
        hero_tagline: heroTagline,
        bio,
        story,
        scout_breakdown: scout,
        outreach_assets: drafts?.outreach_assets ?? [],
      };
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          drafts: publishDrafts,
          heroImageUrl: heroImageUrl || undefined,
          contactEmail: contactEmail || undefined,
        }),
      });
      if (!res.ok) throw new Error("Publish failed");
      const { url } = await res.json();
      router.refresh();
      window.open(url, "_blank");
    } catch (e) {
      setError("Publish failed. Check the console.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Order summary */}
      <div className="card p-5">
        <h2 className="font-semibold mb-4">Order Details</h2>
        <dl className="grid sm:grid-cols-3 gap-3 text-sm">
          <InfoRow label="Buyer" value={`${order.buyerName ?? "—"} (${order.buyerEmail})`} />
          <InfoRow label="Tier" value={order.tier.replace("_", " ")} />
          <InfoRow label="Amount" value={order.amountPaidCents ? `$${(order.amountPaidCents / 100).toFixed(0)}` : "—"} />
          <InfoRow label="OTR attributed" value={order.otrAttribution ? "Yes" : "No"} />
          <InfoRow label="Coupon" value={order.couponCode ?? "None"} />
          <InfoRow label="Status" value={order.status} />
        </dl>
      </div>

      {/* Intake data */}
      {intake ? (
        <div className="card p-5">
          <h2 className="font-semibold mb-4">Intake Data — {intake.athleteName}</h2>
          <dl className="grid sm:grid-cols-2 gap-3 text-sm">
            <InfoRow label="Position" value={intake.position ?? "—"} />
            <InfoRow label="Team" value={intake.currentTeam ?? "—"} />
            <InfoRow label="Hometown" value={intake.hometown ?? "—"} />
            <InfoRow label="Target audience" value={intake.targetAudience ?? "—"} />
            <InfoRow label="Parent filled" value={intake.parentFilled ? `Yes (${intake.parentName})` : "No"} />
          </dl>
          {intake.careerHighlights && (
            <div className="mt-4">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Career Highlights</p>
              <p className="text-sm text-white/70 whitespace-pre-wrap">{intake.careerHighlights}</p>
            </div>
          )}
          {intake.accolades && (
            <div className="mt-4">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Accolades</p>
              <p className="text-sm text-white/70 whitespace-pre-wrap">{intake.accolades}</p>
            </div>
          )}
          {intake.goals && (
            <div className="mt-4">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Goals / Background</p>
              <p className="text-sm text-white/70 whitespace-pre-wrap">{intake.goals}</p>
            </div>
          )}
          {intake.videoLinks && intake.videoLinks.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Video Links</p>
              <ul className="space-y-1">
                {intake.videoLinks.map((link, i) => (
                  <li key={i}>
                    <a href={link} target="_blank" className="text-brand-400 text-sm hover:underline">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="card p-5 text-center text-white/40">
          Waiting for intake form submission.
        </div>
      )}

      {/* Draft editor */}
      {intake && (
        <div className="card p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">AI Drafts</h2>
            {!athlete && (
              <button
                onClick={generateDrafts}
                disabled={generating}
                className="btn-primary text-sm py-2 px-4 disabled:opacity-40"
              >
                {generating ? "Generating…" : drafts ? "Regenerate" : "Generate Drafts"}
              </button>
            )}
          </div>

          {(drafts || athlete) && (
            <div className="space-y-4">
              <div>
                <label className="label">Hero image URL (optional)</label>
                <input
                  className="input"
                  value={heroImageUrl}
                  onChange={(e) => setHeroImageUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or direct image URL"
                />
              </div>
              <div>
                <label className="label">Contact email</label>
                <input
                  className="input"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              <DraftField label="Hero tagline" value={heroTagline} onChange={setHeroTagline} rows={2} />
              <DraftField label="Bio" value={bio} onChange={setBio} rows={6} />
              <DraftField label="Story" value={story} onChange={setStory} rows={10} />
              <DraftField label="Scout breakdown" value={scout} onChange={setScout} rows={8} />

              {drafts?.outreach_assets && drafts.outreach_assets.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-3">
                    Outreach Assets ({drafts.outreach_assets.length})
                  </p>
                  <div className="space-y-4">
                    {drafts.outreach_assets.map((a, i) => (
                      <div key={i} className="bg-white/5 rounded-lg p-4">
                        <p className="text-xs text-brand-400 uppercase tracking-wider mb-1">
                          {a.kind.replace("_", " ")} #{i + 1}
                        </p>
                        <p className="text-sm font-medium mb-2">Subject: {a.subject}</p>
                        <pre className="text-xs text-white/60 whitespace-pre-wrap font-sans">{a.body}</pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!athlete && (
                <button
                  onClick={publish}
                  disabled={publishing || !heroTagline || !bio}
                  className="btn-primary w-full disabled:opacity-40"
                >
                  {publishing ? "Publishing…" : "Publish Portfolio & Send Delivery Email"}
                </button>
              )}

              {athlete && (
                <div className="text-center text-green-400 text-sm font-medium">
                  ✓ Published at /p/{athlete.slug}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-white/40 uppercase tracking-wider">{label}</dt>
      <dd className="text-white mt-0.5">{value}</dd>
    </div>
  );
}

function DraftField({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows: number;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea
        className="input resize-y font-sans text-sm"
        style={{ minHeight: `${rows * 24}px` }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
