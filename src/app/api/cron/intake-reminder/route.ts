import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, and, lt, isNull } from "drizzle-orm";
import { sendIntakeReminderEmail } from "@/lib/resend";

// Called by Vercel Cron — runs daily
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Orders paid 3 days ago that are still in "paid" status (intake not submitted)
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const cutoff = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);

  const pendingOrders = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.status, "paid"),
        lt(orders.createdAt, threeDaysAgo)
      )
    );

  let sent = 0;
  for (const order of pendingOrders) {
    try {
      await sendIntakeReminderEmail(
        order.buyerEmail,
        order.buyerName,
        order.id,
        order.intakeToken
      );
      sent++;
    } catch (e) {
      console.error(`Reminder failed for order ${order.id}`, e);
    }
  }

  return NextResponse.json({ sent, total: pendingOrders.length });
}
