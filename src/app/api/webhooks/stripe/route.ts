import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendIntakeEmail } from "@/lib/resend";
import type { TierKey } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const tier = (session.metadata?.tier ?? "college") as TierKey;
    const amountPaid = session.amount_total ?? 0;

    // Detect OTR coupon attribution
    const discounts = (session as unknown as { total_details?: { breakdown?: { discounts?: Array<{ discount: { coupon: { id: string } } }> } } }).total_details?.breakdown?.discounts ?? [];
    const otrAttribution = discounts.some(
      (d) => d.discount?.coupon?.id?.toUpperCase() === "OTR"
    );

    const couponCode = discounts[0]?.discount?.coupon?.id ?? null;

    const [order] = await db
      .insert(orders)
      .values({
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null,
        buyerEmail: session.customer_details?.email ?? "",
        buyerName: session.customer_details?.name ?? null,
        tier,
        amountPaidCents: amountPaid,
        couponCode,
        otrAttribution,
        status: "paid",
      })
      .returning();

    // Send intake email
    try {
      await sendIntakeEmail(
        order.buyerEmail,
        order.buyerName,
        order.id,
        order.intakeToken
      );
    } catch (e) {
      console.error("Failed to send intake email", e);
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId =
      typeof charge.payment_intent === "string" ? charge.payment_intent : null;

    if (paymentIntentId) {
      await db
        .update(orders)
        .set({ status: "refunded" })
        .where(eq(orders.stripePaymentIntentId, paymentIntentId));
    }
  }

  return NextResponse.json({ received: true });
}
