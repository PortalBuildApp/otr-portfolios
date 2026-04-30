export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { db } from "@/db";
import { orders, intakeResponses, athletes } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import OrderDetailClient from "./OrderDetailClient";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, params.id))
    .limit(1);

  if (!order) notFound();

  const [intake] = await db
    .select()
    .from(intakeResponses)
    .where(eq(intakeResponses.orderId, order.id))
    .limit(1);

  const [athlete] = await db
    .select()
    .from(athletes)
    .where(eq(athletes.orderId, order.id))
    .limit(1);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-white/40 hover:text-white/60 text-sm transition-colors">
          ← Admin
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-sm font-medium">Order {order.id.slice(0, 8)}…</span>
        {athlete && (
          <>
            <span className="text-white/20">/</span>
            <Link
              href={`/p/${athlete.slug}`}
              target="_blank"
              className="text-brand-400 hover:text-brand-300 text-sm transition-colors"
            >
              View live portfolio →
            </Link>
          </>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <OrderDetailClient
          order={order as Parameters<typeof OrderDetailClient>[0]["order"]}
          intake={intake ?? null}
          athlete={athlete ?? null}
        />
      </div>
    </div>
  );
}
