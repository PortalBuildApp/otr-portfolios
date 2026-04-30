export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { db } from "@/db";
import { athletes } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import AthleteEditForm from "./AthleteEditForm";

export default async function EditAthletePage({ params }: { params: { id: string } }) {
  const [athlete] = await db.select().from(athletes).where(eq(athletes.id, params.id));
  if (!athlete) notFound();

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-white/40 hover:text-white/70 text-sm transition-colors">
          ← Admin
        </Link>
        <span className="text-white/20">/</span>
        <span className="font-semibold">{athlete.heroName}</span>
        <a
          href={`/p/${athlete.slug}`}
          target="_blank"
          className="ml-auto text-xs text-brand-400 hover:text-brand-300 transition-colors"
        >
          View live →
        </a>
      </div>
      <AthleteEditForm athlete={athlete} />
    </div>
  );
}
