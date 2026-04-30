import { NextResponse } from "next/server";
import { db } from "@/db";
import { athletes } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { heroName, heroPosition, heroTeam, heroTagline, heroImageUrl, bio, story, contactEmail } = body;

  const [updated] = await db
    .update(athletes)
    .set({
      heroName: heroName || undefined,
      heroPosition: heroPosition || null,
      heroTeam: heroTeam || null,
      heroTagline: heroTagline || null,
      heroImageUrl: heroImageUrl || null,
      bio: bio || null,
      story: story || null,
      contactEmail: contactEmail || null,
      lastUpdatedAt: new Date(),
    })
    .where(eq(athletes.id, params.id))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true, athlete: updated });
}
