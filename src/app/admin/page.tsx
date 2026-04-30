export const dynamic = "force-dynamic";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { formatCents } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  paid: "Paid",
  intake_submitted: "Intake Submitted",
  drafting: "Drafting",
  ready: "Ready to Publish",
  published: "Published",
  delivered: "Delivered",
  refunded: "Refunded",
};

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-yellow-500/20 text-yellow-400",
  intake_submitted: "bg-blue-500/20 text-blue-400",
  drafting: "bg-purple-500/20 text-purple-400",
  ready: "bg-orange-500/20 text-orange-400",
  published: "bg-green-500/20 text-green-400",
  delivered: "bg-green-500/20 text-green-400",
  refunded: "bg-red-500/20 text-red-400",
};

type Order = typeof orders.$inferSelect;

export default async function AdminDashboard() {
  let allOrders: Order[] = [];
  let dbError: string | null = null;

  try {
    allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
  } catch (e) {
    dbError = String(e);
  }

  // OTR attribution summary
  const otrOrders = allOrders.filter((o) => o.otrAttribution && o.status !== "refunded");
  const otrRevenue = otrOrders.reduce((sum, o) => sum + (o.amountPaidCents ?? 0), 0);
  const travisOwed = Math.round(otrRevenue * 0.2);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <span className="font-serif text-xl font-bold">OTR Portfolios — Admin</span>
        <SignOutButton />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {dbError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
            ⚠️ Database error: {dbError}
          </div>
        )}
        {/* OTR attribution */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total orders" value={String(allOrders.length)} />
          <StatCard
            label="Total revenue"
            value={formatCents(allOrders.reduce((s, o) => s + (o.amountPaidCents ?? 0), 0))}
          />
          <StatCard
            label="OTR-attributed revenue"
            value={formatCents(otrRevenue)}
            sub={`${otrOrders.length} orders`}
          />
          <StatCard
            label="Travis owes (20%)"
            value={formatCents(travisOwed)}
            highlight
          />
        </div>

        {/* Orders table */}
        <div>
          <h2 className="text-lg font-semibold mb-4">All Orders</h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 text-left">
                    <th className="px-4 py-3 font-medium">Buyer</th>
                    <th className="px-4 py-3 font-medium">Tier</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">OTR</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">{order.buyerName ?? "—"}</div>
                        <div className="text-white/40 text-xs">{order.buyerEmail}</div>
                      </td>
                      <td className="px-4 py-3 capitalize">{order.tier.replace("_", " ")}</td>
                      <td className="px-4 py-3">
                        {order.amountPaidCents ? formatCents(order.amountPaidCents) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {order.otrAttribution ? (
                          <span className="text-brand-400 font-semibold">OTR</span>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            STATUS_COLORS[order.status] ?? "bg-white/10 text-white/50"
                          }`}
                        >
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/40 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-brand-400 hover:text-brand-300 text-xs transition-colors"
                        >
                          Open →
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {allOrders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-white/30">
                        No orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`card p-4 ${highlight ? "border-brand-500/50" : ""}`}>
      <div className="text-xs text-white/40 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${highlight ? "text-brand-400" : ""}`}>{value}</div>
      {sub && <div className="text-xs text-white/30 mt-0.5">{sub}</div>}
    </div>
  );
}
