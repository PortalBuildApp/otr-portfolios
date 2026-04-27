import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { orders, intakeResponses } from "@/db/schema";
import { eq } from "drizzle-orm";
import IntakeForm from "./IntakeForm";

interface Props {
  params: { orderId: string };
  searchParams: { t?: string };
}

export default async function IntakePage({ params, searchParams }: Props) {
  const { orderId } = params;
  const token = searchParams.t;

  if (!token) notFound();

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order || order.intakeToken !== token) notFound();

  // If already submitted, show completion message
  const [existing] = await db
    .select()
    .from(intakeResponses)
    .where(eq(intakeResponses.orderId, orderId))
    .limit(1);

  if (existing) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <div className="text-4xl">✓</div>
          <h1 className="font-serif text-2xl font-bold">Intake submitted!</h1>
          <p className="text-white/60">
            We received your information for{" "}
            <strong>{existing.athleteName}</strong>. We'll have your portfolio
            ready within 24 hours and will email you with the live link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-10">
          <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-2">
            OTR Portfolios
          </p>
          <h1 className="font-serif text-3xl font-bold mb-2">
            Let's build your portfolio
          </h1>
          <p className="text-white/60">
            This takes about 10 minutes. Save after each section — your progress
            is kept automatically.
          </p>
        </div>
        <IntakeForm orderId={orderId} token={token} tier={order.tier} />
      </div>
    </div>
  );
}
