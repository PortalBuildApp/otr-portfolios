export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { db } from "@/db";
import { athletes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { maisonData } from "@/lib/maison-data";
import PortfolioPage from "@/components/portfolio/PortfolioPage";

export default async function PrintPage({ params }: { params: { slug: string } }) {
  const data =
    params.slug === "maison-scheibel"
      ? maisonData
      : await db
          .select()
          .from(athletes)
          .where(eq(athletes.slug, params.slug))
          .limit(1)
          .then((r) => r[0] ?? null);

  if (!data) notFound();

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          header { min-height: auto !important; }
          footer { display: none; }
          .video-wrapper { display: none; }
        }
        body { background: white !important; color: black !important; }
        .card { background: #f9f9f9 !important; border-color: #e5e5e5 !important; }
      `}</style>
      <PortfolioPage data={data as Parameters<typeof PortfolioPage>[0]["data"]} />
    </>
  );
}
