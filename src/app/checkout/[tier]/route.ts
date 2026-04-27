import { NextResponse } from "next/server";
import { stripe, TIERS, type TierKey } from "@/lib/stripe";

export async function GET(
  req: Request,
  { params }: { params: { tier: string } }
) {
  const tier = params.tier as TierKey;
  const tierConfig = TIERS[tier];
  if (!tierConfig) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: tierConfig.amountCents,
          product_data: {
            name: `OTR Portfolios — ${tierConfig.label}`,
            description: tierConfig.description,
          },
        },
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    metadata: { tier },
    billing_address_collection: "required",
    success_url: `${appUrl}/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/`,
  });

  return NextResponse.redirect(session.url!);
}
