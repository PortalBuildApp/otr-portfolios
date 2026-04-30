export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { db } from "@/db";
import { athletes } from "@/db/schema";
import { eq } from "drizzle-orm";
import PortfolioPage from "@/components/portfolio/PortfolioPage";
import { maisonData } from "@/lib/maison-data";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getAthleteData(params.slug);
  if (!data) return { title: "Portfolio not found" };

  return {
    title: `${data.heroName} — Basketball Portfolio`,
    description: data.heroTagline ?? `${data.heroName} basketball portfolio`,
    openGraph: {
      title: `${data.heroName} — Basketball Portfolio`,
      description: data.heroTagline ?? undefined,
      images: [`/p/${params.slug}/opengraph-image`],
    },
  };
}

async function getAthleteData(slug: string) {
  // Serve the sample data for the demo slug without hitting the DB
  if (slug === "maison-scheibel") return maisonData;

  const [athlete] = await db
    .select()
    .from(athletes)
    .where(eq(athletes.slug, slug))
    .limit(1);

  return athlete ?? null;
}

export default async function PortfolioRoute({ params }: Props) {
  const data = await getAthleteData(params.slug);
  if (!data) notFound();

  return <PortfolioPage data={data as Parameters<typeof PortfolioPage>[0]["data"]} />;
}
