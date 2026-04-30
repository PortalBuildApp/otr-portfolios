import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { orders, intakeResponses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generatePortfolioDrafts } from "@/lib/anthropic";
import { sendDraftsReadyNotification } from "@/lib/resend";

export async function POST(req: Request) {
  const ok = await isAdmin();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orderId } = await req.json();

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const [intake] = await db
    .select()
    .from(intakeResponses)
    .where(eq(intakeResponses.orderId, orderId))
    .limit(1);
  if (!intake) return NextResponse.json({ error: "Intake not found" }, { status: 404 });

  await db.update(orders).set({ status: "drafting" }).where(eq(orders.id, orderId));

  const drafts = await generatePortfolioDrafts(intake, order);

  await db.update(orders).set({ status: "ready" }).where(eq(orders.id, orderId));

  try {
    await sendDraftsReadyNotification(orderId, intake.athleteName);
  } catch {}

  return NextResponse.json({ drafts });
}
