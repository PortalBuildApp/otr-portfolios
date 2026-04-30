import { NextResponse } from "next/server";
import { db } from "@/db";
import { athletes } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { heroName, heroPosition, heroTeam, heroTagline, heroImageUrl, slug: rawSlug } = body;

  if (!heroName) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = rawSlug ? slugify(rawSlug) : slugify(heroName);

  // Check slug is unique
  const existing = await db.select().from(athletes).where(eq(athletes.slug, slug));
  if (existing.length > 0) {
    return NextResponse.json({ error: `Slug "${slug}" is already taken` }, { status: 409 });
  }

  const [athlete] = await db
    .insert(athletes)
    .values({
      slug,
      heroName,
      heroPosition: heroPosition || null,
      heroTeam: heroTeam || null,
      heroTagline: heroTagline || null,
      heroImageUrl: heroImageUrl || null,
    })
    .returning();

  return NextResponse.json({ ok: true, athlete });
}
