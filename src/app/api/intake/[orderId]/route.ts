import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, intakeResponses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendAdminIntakeNotification } from "@/lib/resend";

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const body = await req.json();
  const { token, ...intakeData } = body;

  // Validate token
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, params.orderId))
    .limit(1);

  if (!order || order.intakeToken !== token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  // Upsert intake response
  const [intake] = await db
    .insert(intakeResponses)
    .values({
      orderId: order.id,
      athleteName: intakeData.athleteName,
      dob: intakeData.dob,
      heightCm: intakeData.heightCm,
      position: intakeData.position,
      hometown: intakeData.hometown,
      currentTeam: intakeData.currentTeam,
      careerHighlights: intakeData.careerHighlights,
      accolades: intakeData.accolades,
      statsJson: intakeData.statsJson,
      goals: intakeData.goals,
      targetAudience: intakeData.targetAudience,
      videoLinks: intakeData.videoLinks,
      photoLinks: intakeData.photoLinks,
      parentFilled: intakeData.parentFilled ?? false,
      parentName: intakeData.parentName,
      parentEmail: intakeData.parentEmail,
    })
    .returning();

  // Update order status
  await db
    .update(orders)
    .set({ status: "intake_submitted" })
    .where(eq(orders.id, order.id));

  // Notify admin
  try {
    await sendAdminIntakeNotification(
      order.id,
      intake.athleteName,
      order.buyerEmail
    );
  } catch (e) {
    console.error("Admin notification failed", e);
  }

  return NextResponse.json({ ok: true });
}
