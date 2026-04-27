"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  "Athlete Basics",
  "Career Highlights",
  "Stats",
  "Your Story",
  "Goals & Links",
] as const;

interface IntakeFormProps {
  orderId: string;
  token: string;
  tier: string;
}

export default function IntakeForm({ orderId, token, tier }: IntakeFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    // Step 0 — Basics
    athleteName: "",
    dob: "",
    heightFeet: "",
    heightInches: "",
    position: "",
    hometown: "",
    currentTeam: "",
    parentFilled: false,
    parentName: "",
    parentEmail: "",
    // Step 1 — Highlights
    careerHighlights: "",
    accolades: "",
    // Step 2 — Stats
    statsJson: "",
    // Step 3 — Story
    goals: "",
    // Step 4 — Links
    targetAudience: "all" as "college" | "pro" | "brand" | "all",
    videoLinks: "",
    photoLinks: "",
  });

  function update(key: keyof typeof data, value: string | boolean) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function submit() {
    setSaving(true);
    setError("");
    try {
      const heightCm = data.heightFeet
        ? Math.round(
            (parseInt(data.heightFeet) * 12 + parseInt(data.heightInches || "0")) * 2.54
          )
        : undefined;

      let statsJson: object | undefined;
      if (data.statsJson.trim()) {
        try {
          statsJson = JSON.parse(data.statsJson);
        } catch {
          // treat as freeform text — wrap it
          statsJson = { notes: data.statsJson };
        }
      }

      const res = await fetch(`/api/intake/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          athleteName: data.athleteName,
          dob: data.dob || undefined,
          heightCm,
          position: data.position || undefined,
          hometown: data.hometown || undefined,
          currentTeam: data.currentTeam || undefined,
          careerHighlights: data.careerHighlights || undefined,
          accolades: data.accolades || undefined,
          statsJson,
          goals: data.goals || undefined,
          targetAudience: data.targetAudience,
          videoLinks: data.videoLinks
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean),
          photoLinks: data.photoLinks
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean),
          parentFilled: data.parentFilled,
          parentName: data.parentName || undefined,
          parentEmail: data.parentEmail || undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");
      router.refresh();
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex gap-1 mb-8">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-brand-500" : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-white/40 mb-6 uppercase tracking-wider">
        Step {step + 1} of {STEPS.length} — {STEPS[step]}
      </p>

      {/* Step 0 — Basics */}
      {step === 0 && (
        <div className="space-y-5">
          <Field label="Athlete's full name *">
            <input
              className="input"
              value={data.athleteName}
              onChange={(e) => update("athleteName", e.target.value)}
              placeholder="Maison Scheibel"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date of birth">
              <input
                className="input"
                type="date"
                value={data.dob}
                onChange={(e) => update("dob", e.target.value)}
              />
            </Field>
            <Field label="Position">
              <input
                className="input"
                value={data.position}
                onChange={(e) => update("position", e.target.value)}
                placeholder="Guard, Forward, Center..."
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Height (feet)">
              <input
                className="input"
                type="number"
                value={data.heightFeet}
                onChange={(e) => update("heightFeet", e.target.value)}
                placeholder="6"
                min={4}
                max={8}
              />
            </Field>
            <Field label="Height (inches)">
              <input
                className="input"
                type="number"
                value={data.heightInches}
                onChange={(e) => update("heightInches", e.target.value)}
                placeholder="4"
                min={0}
                max={11}
              />
            </Field>
          </div>
          <Field label="Hometown">
            <input
              className="input"
              value={data.hometown}
              onChange={(e) => update("hometown", e.target.value)}
              placeholder="Atlanta, GA"
            />
          </Field>
          <Field label="Current team / program">
            <input
              className="input"
              value={data.currentTeam}
              onChange={(e) => update("currentTeam", e.target.value)}
              placeholder="OTR Elite, Overtime Elite, etc."
            />
          </Field>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-brand-500"
              checked={data.parentFilled}
              onChange={(e) => update("parentFilled", e.target.checked)}
            />
            <span className="text-sm text-white/70">
              I'm a parent filling this out for my son
            </span>
          </label>

          {data.parentFilled && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Parent name">
                <input
                  className="input"
                  value={data.parentName}
                  onChange={(e) => update("parentName", e.target.value)}
                />
              </Field>
              <Field label="Parent email">
                <input
                  className="input"
                  type="email"
                  value={data.parentEmail}
                  onChange={(e) => update("parentEmail", e.target.value)}
                />
              </Field>
            </div>
          )}
        </div>
      )}

      {/* Step 1 — Highlights */}
      {step === 1 && (
        <div className="space-y-5">
          <Field
            label="Career highlights"
            hint="Key moments, standout games, big performances. Be specific."
          >
            <textarea
              className="input min-h-[140px] resize-y"
              value={data.careerHighlights}
              onChange={(e) => update("careerHighlights", e.target.value)}
              placeholder="e.g. Led OTR Elite to 2024 championship; dropped 32 pts vs top-ranked squad at Atlanta Jam; named MVP at Peach Jam..."
            />
          </Field>
          <Field
            label="Awards & accolades"
            hint="All-conference, MVP, rankings, invitations, all-star games..."
          >
            <textarea
              className="input min-h-[100px] resize-y"
              value={data.accolades}
              onChange={(e) => update("accolades", e.target.value)}
              placeholder="e.g. 2024 EYBL All-Region, #45 ESPN 2025 class, Jordan Brand Classic invitee..."
            />
          </Field>
        </div>
      )}

      {/* Step 2 — Stats */}
      {step === 2 && (
        <div className="space-y-5">
          <p className="text-white/50 text-sm">
            Paste your most recent season stats. You can enter them as text or
            a table — we'll handle formatting.
          </p>
          <Field
            label="Season stats"
            hint="PPG, RPG, APG, FG%, 3P%, season, number of games"
          >
            <textarea
              className="input min-h-[140px] resize-y font-mono text-sm"
              value={data.statsJson}
              onChange={(e) => update("statsJson", e.target.value)}
              placeholder={`18.4 PPG | 5.2 RPG | 4.8 APG | 47.2 FG% | 38.1 3P%\nSeason: 2024-25 | Games: 28\n\nOr just paste the numbers — we'll figure it out.`}
            />
          </Field>
        </div>
      )}

      {/* Step 3 — Story */}
      {step === 3 && (
        <div className="space-y-5">
          <Field
            label="Background & goals"
            hint="Where are you from? What drives you? Where do you want to go? Be honest — not polished."
          >
            <textarea
              className="input min-h-[200px] resize-y"
              value={data.goals}
              onChange={(e) => update("goals", e.target.value)}
              placeholder="e.g. Grew up in Marietta, started playing at 8 with my dad... I want to play D1 ball and eventually go pro. My goal is to find a program that needs a guard who can run an offense and defend..."
            />
          </Field>
        </div>
      )}

      {/* Step 4 — Links */}
      {step === 4 && (
        <div className="space-y-5">
          <Field label="Who is this portfolio for?">
            <select
              className="input"
              value={data.targetAudience}
              onChange={(e) =>
                update("targetAudience", e.target.value as typeof data.targetAudience)
              }
            >
              <option value="all">Everyone (college + pro + brands)</option>
              <option value="college">College coaches</option>
              <option value="pro">Pro agencies / scouts</option>
              <option value="brand">Brand sponsors</option>
            </select>
          </Field>
          <Field
            label="Highlight video links"
            hint="One per line — YouTube, Vimeo, Hudl, Google Drive"
          >
            <textarea
              className="input min-h-[100px] resize-y"
              value={data.videoLinks}
              onChange={(e) => update("videoLinks", e.target.value)}
              placeholder="https://youtube.com/watch?v=...&#10;https://hudl.com/..."
            />
          </Field>
          <Field
            label="Photo links (optional)"
            hint="One per line — Google Drive, Dropbox, direct image URLs"
          >
            <textarea
              className="input min-h-[80px] resize-y"
              value={data.photoLinks}
              onChange={(e) => update("photoLinks", e.target.value)}
              placeholder="https://drive.google.com/..."
            />
          </Field>
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-400 text-sm">{error}</p>
      )}

      {/* Nav */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="btn-secondary flex-1"
          >
            Back
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 && !data.athleteName.trim()}
            className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={saving}
            className="btn-primary flex-1 disabled:opacity-40"
          >
            {saving ? "Submitting…" : "Submit Intake Form"}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {hint && <p className="text-xs text-white/40 mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}
