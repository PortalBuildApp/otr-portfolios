"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewPortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    heroName: "",
    slug: "",
    heroPosition: "",
    heroTeam: "",
    heroTagline: "",
    heroImageUrl: "",
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => {
      const next = { ...prev, [field]: e.target.value };
      // Auto-fill slug from name unless user has manually edited it
      if (field === "heroName" && prev.slug === slugify(prev.heroName)) {
        next.slug = slugify(e.target.value);
      }
      return next;
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/athletes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/admin/athletes/${data.athlete.id}/edit`);
      } else {
        setError(data.error ?? "Something went wrong");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error — " + String(err));
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-white/40 hover:text-white/70 text-sm transition-colors">
          ← Admin
        </Link>
        <span className="text-white/20">/</span>
        <span className="font-semibold">New Portfolio</span>
      </div>

      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold font-serif mb-8">Create Player Portfolio</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Player Name *</label>
            <input
              className="input"
              required
              value={form.heroName}
              onChange={set("heroName")}
              placeholder="e.g. Maison Kelly"
            />
          </div>

          <div>
            <label className="label">URL Slug *</label>
            <div className="flex items-center gap-2">
              <span className="text-white/30 text-sm">otr-portfolios.vercel.app/p/</span>
              <input
                className="input flex-1"
                required
                value={form.slug}
                onChange={set("slug")}
                placeholder="maison-kelly"
              />
            </div>
            <p className="text-white/30 text-xs mt-1">Auto-filled from name. Must be unique.</p>
          </div>

          <div>
            <label className="label">Position</label>
            <input
              className="input"
              value={form.heroPosition}
              onChange={set("heroPosition")}
              placeholder="e.g. Point Guard"
            />
          </div>

          <div>
            <label className="label">Team</label>
            <input
              className="input"
              value={form.heroTeam}
              onChange={set("heroTeam")}
              placeholder="e.g. Oak Ridge High School"
            />
          </div>

          <div>
            <label className="label">Tagline</label>
            <input
              className="input"
              value={form.heroTagline}
              onChange={set("heroTagline")}
              placeholder="e.g. The next chapter starts here."
            />
          </div>

          <div>
            <label className="label">Hero Image URL</label>
            <input
              className="input"
              value={form.heroImageUrl}
              onChange={set("heroImageUrl")}
              placeholder="https://..."
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating…" : "Create Portfolio →"}
          </button>
        </form>
      </div>
    </div>
  );
}
