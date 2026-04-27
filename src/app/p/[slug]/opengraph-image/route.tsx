import { ImageResponse } from "@vercel/og";
import { db } from "@/db";
import { athletes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { maisonData } from "@/lib/maison-data";

export const runtime = "edge";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  let name = "Athlete";
  let position = "Basketball Player";
  let team = "";

  if (params.slug === "maison-scheibel") {
    name = maisonData.heroName;
    position = maisonData.heroPosition ?? position;
    team = maisonData.heroTeam ?? team;
  } else {
    try {
      const [athlete] = await db
        .select({ heroName: athletes.heroName, heroPosition: athletes.heroPosition, heroTeam: athletes.heroTeam })
        .from(athletes)
        .where(eq(athletes.slug, params.slug))
        .limit(1);
      if (athlete) {
        name = athlete.heroName;
        position = athlete.heroPosition ?? position;
        team = athlete.heroTeam ?? team;
      }
    } catch {}
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #1a1d4e 0%, #0a0a0f 60%)",
          color: "white",
          fontFamily: "Georgia, serif",
          padding: "60px",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ fontSize: 16, color: "#7b94fa", letterSpacing: "0.2em", marginBottom: 16, display: "flex" }}>
          OTR PORTFOLIOS
        </div>
        <div style={{ fontSize: 72, fontWeight: "bold", lineHeight: 1.1, marginBottom: 16, display: "flex" }}>
          {name}
        </div>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.6)", display: "flex", gap: 16 }}>
          <span>{position}</span>
          {team && <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>}
          {team && <span>{team}</span>}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 60,
            fontSize: 18,
            color: "#7b94fa",
            display: "flex",
          }}
        >
          View portfolio →
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
