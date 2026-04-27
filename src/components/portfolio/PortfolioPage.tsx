"use client";

import Link from "next/link";
import Image from "next/image";

interface Highlight {
  label: string;
  sub: string;
}

interface VideoEmbed {
  url: string;
  label?: string;
}

interface Coach {
  name: string;
  role: string;
  email?: string | null;
  phone?: string | null;
  note?: string | null;
}

interface PortfolioData {
  heroName: string;
  heroPosition?: string | null;
  heroTeam?: string | null;
  heroImageUrl?: string | null;
  heroTagline?: string | null;
  bio?: string | null;
  story?: string | null;
  scoutBreakdown?: string | null;
  statsJson?: Record<string, unknown> | null;
  highlightsJson?: Highlight[] | null;
  videoEmbeds?: VideoEmbed[] | null;
  photoGallery?: string[] | null;
  contactEmail?: string | null;
  socialLinks?: Record<string, string> | null;
  coaches?: Coach[] | null;
}

function renderScoutMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      elements.push(
        <h4 key={i} className="text-white/90 font-semibold mt-6 mb-2 text-xs uppercase tracking-widest">
          {line.slice(2, -2)}
        </h4>
      );
    } else if (line.startsWith("- ")) {
      const bullets: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        bullets.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2 mb-3">
          {bullets.map((b, bi) => (
            <li key={bi} className="flex gap-2 text-white/65 text-sm leading-relaxed">
              <span className="text-brand-400 shrink-0 mt-0.5">—</span>
              <span dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.+?)\*\*/g, "<strong class='text-white/90'>$1</strong>") }} />
            </li>
          ))}
        </ul>
      );
      continue;
    } else {
      elements.push(
        <p key={i} className="text-white/60 text-sm leading-relaxed mb-3"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<strong class='text-white/90'>$1</strong>") }}
        />
      );
    }
    i++;
  }
  return elements;
}

export default function PortfolioPage({ data }: { data: PortfolioData }) {
  const highlights = data.highlightsJson as Highlight[] | null;
  const videos = data.videoEmbeds as VideoEmbed[] | null;
  const photos = data.photoGallery as string[] | null;
  const social = data.socialLinks as Record<string, string> | null;
  const coaches = data.coaches as Coach[] | null;

  const storyParagraphs = data.story?.split("\n\n").filter(Boolean) ?? [];
  const bioParagraphs = data.bio?.split("\n\n").filter(Boolean) ?? [];

  return (
    <article className="min-h-screen bg-neutral-950 text-white">

      {/* ── HERO ── full-bleed portrait ── */}
      <header className="relative overflow-hidden h-screen">
        {/* Dark base */}
        <div className="absolute inset-0 bg-neutral-950" />

        {/* Full-bleed photo — object-contain keeps full portrait uncropped */}
        {data.heroImageUrl && (
          <Image
            src={data.heroImageUrl}
            alt={data.heroName}
            fill
            className="object-contain object-center"
            priority
          />
        )}

        {/* Gradient at bottom so text is readable */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
        {/* Subtle top fade */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-neutral-950/60 to-transparent" />

        {/* Text — pinned to bottom */}
        <div className="absolute inset-x-0 bottom-0 z-10 max-w-6xl mx-auto px-6 lg:px-8 pb-14">
          <p className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-4">
            OTR Portfolios · 2026
          </p>
          <h1 className="font-serif text-6xl sm:text-7xl font-bold leading-none mb-3 tracking-tight">
            {data.heroName}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mb-4 text-white/60 text-sm font-medium">
            {data.heroPosition && <span>{data.heroPosition}</span>}
            {data.heroPosition && data.heroTeam && <span className="text-white/20">·</span>}
            {data.heroTeam && <span>{data.heroTeam}</span>}
          </div>
          {data.heroTagline && (
            <p className="text-white/75 text-base sm:text-lg leading-snug max-w-xl font-light mb-6">
              {data.heroTagline}
            </p>
          )}
          {data.contactEmail && (
            <a
              href={`mailto:${data.contactEmail}`}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Get in touch →
            </a>
          )}
        </div>
      </header>

      {/* ── STAT BAR ── */}
      {highlights && highlights.length > 0 && (
        <div className="border-y border-white/10 bg-white/[0.03]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-5">
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              {highlights.map((h, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-white leading-none">{h.label}</div>
                  <div className="text-xs text-white/40 mt-1">{h.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 space-y-20">

        {/* Bio + Scout side-by-side */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          {data.bio && (
            <section>
              <SectionLabel>About</SectionLabel>
              <div className="space-y-5">
                {bioParagraphs.map((para, i) => (
                  <p key={i} className="text-white/70 leading-relaxed text-base lg:text-lg">
                    {para}
                  </p>
                ))}
              </div>
              {photos && photos[0] && (
                <div className="relative mt-8 rounded-2xl overflow-hidden border border-white/10" style={{ aspectRatio: "4/3" }}>
                  <Image src={photos[0]} alt={data.heroName} fill className="object-cover" />
                </div>
              )}
            </section>
          )}
          {data.scoutBreakdown && (
            <aside>
              <SectionLabel>Scout File</SectionLabel>
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5">
                {renderScoutMarkdown(data.scoutBreakdown)}
              </div>
            </aside>
          )}
        </div>


        {/* Film */}
        {videos && videos.length > 0 && (
          <section>
            <SectionLabel>Film</SectionLabel>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {videos.map((v, i) => (
                <div key={i}>
                  {v.label && (
                    <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">{v.label}</p>
                  )}
                  <div
                    className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-black"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    <iframe
                      src={v.url}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={v.label ?? `Clip ${i + 1}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Story */}
        {data.story && (
          <section>
            <SectionLabel>The Story</SectionLabel>
            <div className="grid lg:grid-cols-2 gap-x-16 gap-y-5">
              {storyParagraphs.map((para, i) => (
                <p key={i} className="text-white/65 leading-relaxed text-base">
                  {para}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Coaches & References */}
        {coaches && coaches.length > 0 && (
          <section>
            <SectionLabel>Coaches & References</SectionLabel>
            <div className="grid sm:grid-cols-2 gap-4">
              {coaches.map((c, i) => (
                <div key={i} className="bg-white/[0.04] border border-white/10 rounded-xl p-5 space-y-1">
                  <p className="font-semibold text-white">{c.name}</p>
                  <p className="text-xs text-white/50 leading-relaxed">{c.role}</p>
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="block text-sm text-brand-400 hover:text-brand-300 transition-colors pt-1">
                      {c.email}
                    </a>
                  )}
                  {c.phone && (
                    <a href={`tel:${c.phone}`} className="block text-sm text-white/60">
                      {c.phone}
                    </a>
                  )}
                  {c.note && (
                    <p className="text-xs text-white/35 italic pt-1">{c.note}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        {(data.contactEmail || social?.instagram) && (
          <section className="border-t border-white/10 pt-12">
            <SectionLabel>Contact</SectionLabel>
            <div className="flex flex-wrap gap-4 items-center">
              {data.contactEmail && (
                <a
                  href={`mailto:${data.contactEmail}`}
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
                >
                  {data.contactEmail}
                </a>
              )}
              {social?.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-medium px-5 py-3 rounded-lg transition-colors text-sm"
                >
                  Instagram →
                </a>
              )}
            </div>
          </section>
        )}
      </div>

      <footer className="border-t border-white/10 py-8 px-6 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/25">
          <span>Portfolio by OTR Portfolios</span>
          <Link href="/" className="hover:text-white/40 transition-colors">
            Get your portfolio →
          </Link>
        </div>
      </footer>
    </article>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-brand-400 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
        {children}
      </span>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}
