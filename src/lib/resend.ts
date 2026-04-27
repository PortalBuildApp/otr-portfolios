import { Resend } from "resend";

export const resend = new Resend(process.env.AUTH_RESEND_KEY!);

const FROM = process.env.RESEND_FROM ?? "OTR Portfolios <noreply@otrportfolios.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://otrportfolios.com";

export async function sendIntakeEmail(
  buyerEmail: string,
  buyerName: string | null,
  orderId: string,
  intakeToken: string
) {
  const intakeUrl = `${APP_URL}/intake/${orderId}?t=${intakeToken}`;
  await resend.emails.send({
    from: FROM,
    to: buyerEmail,
    subject: "Your OTR Portfolio — fill out your intake form",
    html: `
      <h2>Welcome${buyerName ? `, ${buyerName}` : ""}!</h2>
      <p>Thanks for your order. To build your portfolio, we need a bit of info about the athlete.</p>
      <p>
        <a href="${intakeUrl}" style="background:#5a6ef5;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
          Fill Out Intake Form →
        </a>
      </p>
      <p>This link is unique to your order. The form takes about 10 minutes.</p>
      <p>Once submitted, we'll build the first draft within 24 hours and reach out with a link to review.</p>
      <p>— The OTR Portfolios Team</p>
    `,
  });
}

export async function sendAdminIntakeNotification(
  orderId: string,
  athleteName: string,
  buyerEmail: string
) {
  const adminUrl = `${APP_URL}/admin/orders/${orderId}`;
  await resend.emails.send({
    from: FROM,
    to: process.env.ADMIN_EMAIL!,
    subject: `Intake submitted — ${athleteName}`,
    html: `
      <p>Intake form submitted for <strong>${athleteName}</strong> (${buyerEmail}).</p>
      <p><a href="${adminUrl}">Open in admin →</a></p>
    `,
  });
}

export async function sendDraftsReadyNotification(orderId: string, athleteName: string) {
  const adminUrl = `${APP_URL}/admin/orders/${orderId}`;
  await resend.emails.send({
    from: FROM,
    to: process.env.ADMIN_EMAIL!,
    subject: `Drafts ready — ${athleteName}`,
    html: `
      <p>AI drafts generated for <strong>${athleteName}</strong>. Ready to review and publish.</p>
      <p><a href="${adminUrl}">Edit and publish →</a></p>
    `,
  });
}

export async function sendDeliveryEmail(
  buyerEmail: string,
  athleteName: string,
  slug: string,
  pdfBuffer?: Buffer
) {
  const portfolioUrl = `${APP_URL}/p/${slug}`;
  const attachments = pdfBuffer
    ? [{ filename: `${slug}-portfolio.pdf`, content: pdfBuffer }]
    : [];

  await resend.emails.send({
    from: FROM,
    to: buyerEmail,
    subject: `${athleteName}'s portfolio is live!`,
    html: `
      <h2>${athleteName}'s Portfolio is Live</h2>
      <p>Your portfolio is published and ready to share with coaches, agents, and brands.</p>
      <p>
        <a href="${portfolioUrl}" style="background:#5a6ef5;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
          View Live Portfolio →
        </a>
      </p>
      <p>Copy this link to share: <strong>${portfolioUrl}</strong></p>
      ${pdfBuffer ? "<p>A PDF version is attached to this email.</p>" : ""}
      <p>Need changes? Reply to this email.</p>
      <p>— The OTR Portfolios Team</p>
    `,
    attachments,
  });
}

export async function sendIntakeReminderEmail(
  buyerEmail: string,
  buyerName: string | null,
  orderId: string,
  intakeToken: string
) {
  const intakeUrl = `${APP_URL}/intake/${orderId}?t=${intakeToken}`;
  await resend.emails.send({
    from: FROM,
    to: buyerEmail,
    subject: "Don't forget — your intake form is waiting",
    html: `
      <h2>Quick reminder${buyerName ? `, ${buyerName}` : ""}</h2>
      <p>You haven't filled out the intake form for your OTR Portfolio yet. It only takes 10 minutes.</p>
      <p>
        <a href="${intakeUrl}" style="background:#5a6ef5;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
          Complete Intake Form →
        </a>
      </p>
      <p>— The OTR Portfolios Team</p>
    `,
  });
}
