import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { orders, athletes, outreachAssets, intakeResponses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/utils";
import { sendDeliveryEmail } from "@/lib/resend";
import type { AIDrafts } from "@/lib/anthropic";

interface PublishBody {
  orderId: string;
  drafts: AIDrafts;
  heroImageUrl?: string;
  contactEmail?: string;
  socialLinks?: Record<string, string>;
}

export async function POST(req: Request) {
  const ok = await isAdmin();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: PublishBody = await req.json();
  const { orderId, drafts, heroImageUrl, contactEmail, socialLinks } = body;

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const [intake] = await db
    .select()
    .from(intakeResponses)
    .where(eq(intakeResponses.orderId, orderId))
    .limit(1);
  if (!intake) return NextResponse.json({ error: "Intake not found" }, { status: 404 });

  // Build slug (ensure unique)
  const baseSlug = slugify(intake.athleteName);
  let slug = baseSlug;
  let attempt = 0;
  while (true) {
    const existing = await db
      .select({ id: athletes.id })
      .from(athletes)
      .where(eq(athletes.slug, slug))
      .limit(1);
    if (existing.length === 0) break;
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  // Parse stats
  let statsJson = intake.statsJson as object | null;
  if (typeof intake.statsJson === "string") {
    try { statsJson = JSON.parse(intake.statsJson as string); } catch {}
  }

  // Build highlights from stats
  const stats = statsJson as Record<string, number | string> | null;
  const highlightsJson = stats
    ? Object.entries({
        PPG: stats.ppg,
        RPG: stats.rpg,
        APG: stats.apg,
        "FG%": stats.fgPct ? `${stats.fgPct}%` : undefined,
      })
        .filter(([, v]) => v !== undefined)
        .map(([label, value]) => ({ label: String(value), sub: label }))
    : null;

  // Build video embeds from intake links
  const videoEmbeds =
    intake.videoLinks
      ?.filter(Boolean)
      .map((url) => ({
        url: toEmbedUrl(url),
        label: "Highlights",
      })) ?? null;

  const [athlete] = await db
    .insert(athletes)
    .values({
      slug,
      orderId: order.id,
      publishedAt: new Date(),
      lastUpdatedAt: new Date(),
      heroName: intake.athleteName,
      heroPosition: intake.position,
      heroTeam: intake.currentTeam,
      heroImageUrl: heroImageUrl ?? null,
      heroTagline: drafts.hero_tagline,
      bio: drafts.bio,
      story: drafts.story,
      scoutBreakdown: drafts.scout_breakdown,
      statsJson,
      highlightsJson,
      videoEmbeds,
      photoGallery: intake.photoLinks?.filter(Boolean) ?? null,
      contactEmail: contactEmail ?? order.buyerEmail,
      socialLinks: socialLinks ?? null,
      aiDraftsJson: drafts as unknown as object,
    })
    .returning();

  // Save outreach assets
  if (drafts.outreach_assets?.length) {
    await db.insert(outreachAssets).values(
      drafts.outreach_assets.map((a) => ({
        athleteId: athlete.id,
        kind: a.kind,
        subject: a.subject,
        body: a.body,
      }))
    );
  }

  // Update order status
  await db
    .update(orders)
    .set({ status: "published" })
    .where(eq(orders.id, orderId));

  // Send delivery email (no PDF in v1 — Puppeteer in Phase 6)
  try {
    await sendDeliveryEmail(order.buyerEmail, intake.athleteName, slug);
    await db.update(orders).set({ status: "delivered" }).where(eq(orders.id, orderId));
  } catch (e) {
    console.error("Delivery email failed", e);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return NextResponse.json({ slug, url: `${appUrl}/p/${slug}` });
}

function toEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return url;
}
