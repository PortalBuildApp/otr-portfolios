import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  let buyerName: string | null = null;
  let buyerEmail = "";

  if (searchParams.session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(
        searchParams.session_id
      );
      buyerName = session.customer_details?.name ?? null;
      buyerEmail = session.customer_details?.email ?? "";
    } catch {}
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-5">
        <div className="text-5xl">🏀</div>
        <h1 className="font-serif text-3xl font-bold">
          {buyerName ? `You're in, ${buyerName.split(" ")[0]}!` : "Order confirmed!"}
        </h1>
        <p className="text-white/60 leading-relaxed">
          We sent an email{buyerEmail ? ` to ${buyerEmail}` : ""} with a link to
          fill out the intake form. It takes about 10 minutes. Once submitted,
          we'll have your portfolio ready within 24 hours.
        </p>
        <p className="text-white/40 text-sm">
          Don't see the email? Check your spam folder or reply to the order
          confirmation.
        </p>
        <Link href="/" className="btn-secondary inline-flex mt-4">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
