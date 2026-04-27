import Anthropic from "@anthropic-ai/sdk";
import type { InferSelectModel } from "drizzle-orm";
import type { intakeResponses, orders } from "@/db/schema";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type IntakeData = InferSelectModel<typeof intakeResponses>;
type OrderData = InferSelectModel<typeof orders>;

export interface AIDrafts {
  hero_tagline: string;
  bio: string;
  story: string;
  scout_breakdown: string;
  outreach_assets: Array<{
    kind: "college_coach" | "agency" | "brand_pitch" | "sponsor_followup";
    subject: string;
    body: string;
  }>;
}

function outreachCountByTier(tier: OrderData["tier"], audience: IntakeData["targetAudience"]) {
  const assets: AIDrafts["outreach_assets"][0]["kind"][] = [];
  if (tier === "college" || tier === "full_stack") {
    for (let i = 0; i < 5; i++) assets.push("college_coach");
  }
  if (tier === "pro" || tier === "full_stack") {
    for (let i = 0; i < 3; i++) assets.push("agency");
  }
  if (tier === "sponsorship" || tier === "full_stack") {
    for (let i = 0; i < 5; i++) assets.push("brand_pitch");
  }
  return assets;
}

export async function generatePortfolioDrafts(
  intake: IntakeData,
  order: OrderData
): Promise<AIDrafts> {
  const outreachKinds = outreachCountByTier(order.tier, intake.targetAudience);

  const systemPrompt = `You are an editorial sports writer in the style of The Players' Tribune.
You write with specificity, honesty, and narrative drive.
Never use clichés like "rising star", "electrifying talent", "leave it all on the court", or "sky's the limit."
Ground every claim in the athlete's actual data from the intake form.
Be direct. Let the facts speak. Show character through details, not adjectives.`;

  const userPrompt = `Build a complete portfolio for this basketball player based on their intake data.

INTAKE DATA:
${JSON.stringify(intake, null, 2)}

ORDER TIER: ${order.tier}
TARGET AUDIENCE: ${intake.targetAudience}

Generate a JSON response with exactly this structure:
{
  "hero_tagline": "8–12 word line that captures who this player is (no hype, just truth)",
  "bio": "Two paragraphs. First: who they are today (position, team, measurables, role). Second: what makes them different — specific to their data.",
  "story": "Four to six paragraphs of narrative. Origin, defining moments, the work, where they're headed. All grounded in the intake data.",
  "scout_breakdown": "Markdown. Start with 4–6 bullet points (strengths, measurables, role fit). End with a 2-sentence summary a scout would actually say.",
  "outreach_assets": [
    ${outreachKinds
      .map(
        (kind, i) => `{
      "kind": "${kind}",
      "subject": "compelling subject line for a ${kind} email",
      "body": "full email body, professional, specific to the athlete's data${i < 3 ? ", personalized template with [COACH/CONTACT NAME] placeholder" : ""}"
    }`
      )
      .join(",\n    ")}
  ]
}

Return only valid JSON. No markdown code fences. No extra text.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  return JSON.parse(text) as AIDrafts;
}
