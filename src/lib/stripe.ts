import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export const TIERS = {
  college: {
    label: "College Scholarship",
    priceId: process.env.STRIPE_PRICE_COLLEGE!,
    amountCents: 39700,
    description: "5 personalized college coach cover letters",
    bestFor: "Players 18–21 chasing scholarships",
  },
  pro: {
    label: "Pro Tryout",
    priceId: process.env.STRIPE_PRICE_PRO!,
    amountCents: 49700,
    description: "3 agency intro emails + portfolio",
    bestFor: "Players 22–27 seeking contracts",
  },
  sponsorship: {
    label: "Sponsorship",
    priceId: process.env.STRIPE_PRICE_SPONSORSHIP!,
    amountCents: 49700,
    description: "5 brand pitch emails + portfolio",
    bestFor: "Players building their brand",
  },
  full_stack: {
    label: "Full Stack",
    priceId: process.env.STRIPE_PRICE_FULL_STACK!,
    amountCents: 99700,
    description: "Everything — college + pro + sponsorship outreach",
    bestFor: "Players who want all doors open",
  },
} as const;

export type TierKey = keyof typeof TIERS;
