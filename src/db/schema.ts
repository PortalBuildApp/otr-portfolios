import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const orderStatusEnum = pgEnum("order_status", [
  "paid",
  "intake_submitted",
  "drafting",
  "ready",
  "published",
  "delivered",
  "refunded",
]);

export const tierEnum = pgEnum("tier", [
  "college",
  "pro",
  "sponsorship",
  "full_stack",
]);

export const targetAudienceEnum = pgEnum("target_audience", [
  "college",
  "pro",
  "brand",
  "all",
]);

export const outreachKindEnum = pgEnum("outreach_kind", [
  "college_coach",
  "agency",
  "brand_pitch",
  "sponsor_followup",
]);

// NextAuth required tables
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable("accounts", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// App tables
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  stripeSessionId: text("stripe_session_id").unique(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  buyerEmail: text("buyer_email").notNull(),
  buyerName: text("buyer_name"),
  tier: tierEnum("tier").notNull(),
  amountPaidCents: integer("amount_paid_cents"),
  couponCode: text("coupon_code"),
  otrAttribution: boolean("otr_attribution").default(false).notNull(),
  status: orderStatusEnum("status").default("paid").notNull(),
  intakeToken: uuid("intake_token").defaultRandom().notNull(),
});

export const intakeResponses = pgTable("intake_responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id),
  submittedAt: timestamp("submitted_at", { mode: "date" }).defaultNow().notNull(),
  athleteName: text("athlete_name").notNull(),
  dob: text("dob"),
  heightCm: integer("height_cm"),
  position: text("position"),
  hometown: text("hometown"),
  currentTeam: text("current_team"),
  careerHighlights: text("career_highlights"),
  accolades: text("accolades"),
  statsJson: jsonb("stats_json"),
  goals: text("goals"),
  targetAudience: targetAudienceEnum("target_audience").default("all"),
  videoLinks: text("video_links").array(),
  photoLinks: text("photo_links").array(),
  parentFilled: boolean("parent_filled").default(false).notNull(),
  parentName: text("parent_name"),
  parentEmail: text("parent_email"),
});

export const athletes = pgTable("athletes", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  orderId: uuid("order_id").references(() => orders.id),
  publishedAt: timestamp("published_at", { mode: "date" }),
  lastUpdatedAt: timestamp("last_updated_at", { mode: "date" }).defaultNow(),
  heroName: text("hero_name").notNull(),
  heroPosition: text("hero_position"),
  heroTeam: text("hero_team"),
  heroImageUrl: text("hero_image_url"),
  heroTagline: text("hero_tagline"),
  bio: text("bio"),
  story: text("story"),
  scoutBreakdown: text("scout_breakdown"),
  statsJson: jsonb("stats_json"),
  highlightsJson: jsonb("highlights_json"),
  videoEmbeds: jsonb("video_embeds"),
  photoGallery: jsonb("photo_gallery"),
  contactEmail: text("contact_email"),
  socialLinks: jsonb("social_links"),
  aiDraftsJson: jsonb("ai_drafts_json"),
});

export const outreachAssets = pgTable("outreach_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  athleteId: uuid("athlete_id").notNull().references(() => athletes.id, { onDelete: "cascade" }),
  kind: outreachKindEnum("kind").notNull(),
  subject: text("subject"),
  body: text("body").notNull(),
  generatedAt: timestamp("generated_at", { mode: "date" }).defaultNow().notNull(),
  editedAt: timestamp("edited_at", { mode: "date" }),
});

// Relations
export const ordersRelations = relations(orders, ({ one }) => ({
  intake: one(intakeResponses, {
    fields: [orders.id],
    references: [intakeResponses.orderId],
  }),
  athlete: one(athletes, {
    fields: [orders.id],
    references: [athletes.orderId],
  }),
}));

export const athletesRelations = relations(athletes, ({ many }) => ({
  outreachAssets: many(outreachAssets),
}));
