"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Athlete = {
  id: string;
  slug: string;
  heroName: string;
  heroPosition: string | null;
  heroTeam: string | null;
  heroTagline: string | null;
  heroImageUrl: string | null;
  bio: string | null;
  story: string | null;
  contactEmail: string | null;
};

export default function AthleteEditForm({ athlete }: { athlete: Athlete }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    heroName: athlete.heroName ?? "",
    heroPosition: athlete.heroPosition ?? "",
    heroTeam: athlete.heroTeam ?? "",
    heroTagline: athlete.heroTagline ?? "",
    heroImageUrl: athlete.heroImageUrl ?? "",
    bio: athlete.bio ?? "",
    story: athlete.story ?? "",
    contactEmail: athlete.contactEmail ?? "",
  });

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    const res = await fetch(`/api/admin/athletes/${athlete.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSaved(true);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Save failed");
    }
    setSaving(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold font-serif">Edit Portfolio</h1>
        <a
          href={`/p/${athlete.slug}`}
          target="_blank"
          className="text-sm text-brand-400 hover:text-brand-300"
        >
          otr-portfolios.vercel.app/p/{athlete.slug}
        </a>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="label">Player Name</label>
          <input className="input" value={form.heroName} onChange={set("heroName")} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Position</label>
            <input className="input" value={form.heroPosition} onChange={set("heroPosition")} placeholder="Point Guard" />
          </div>
          <div>
            <label className="label">Team</label>
            <input className="input" value={form.heroTeam} onChange={set("heroTeam")} placeholder="Oak Ridge HS" />
          </div>
        </div>
        <div>
          <label className="label">Tagline</label>
          <input className="input" value={form.heroTagline} onChange={set("heroTagline")} placeholder="The next chapter starts here." />
        </div>
        <div>
          <label className="label">Hero Image URL</label>
          <input className="input" value={form.heroImageUrl} onChange={set("heroImageUrl")} placeholder="https://..." />
          {form.heroImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.heroImageUrl} alt="Preview" className="mt-2 w-full max-h-48 object-cover rounded-lg opacity-80" />
          )}
        </div>
        <div>
          <label className="label">Bio</label>
          <textarea className="input min-h-[100px] resize-y" value={form.bio} onChange={set("bio")} placeholder="Short bio shown on the portfolio..." />
        </div>
        <div>
          <label className="label">Story / About</label>
          <textarea className="input min-h-[120px] resize-y" value={form.story} onChange={set("story")} placeholder="Longer player story..." />
        </div>
        <div>
          <label className="label">Contact Email</label>
          <input className="input" type="email" value={form.contactEmail} onChange={set("contactEmail")} placeholder="player@email.com" />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {saved && <p className="text-green-400 text-sm">✓ Saved successfully</p>}

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
