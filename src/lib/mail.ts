import "server-only";

import { business, siteUrl } from "@/lib/site";
import { formatDateOnly } from "@/lib/dates";
import { formatMoney, SERVICE_LABELS, TIME_SLOT_LABELS } from "@/lib/utils";

type MailInput = {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  replyTo?: string;
};

const MAILERSEND_ENDPOINT = "https://api.mailersend.com/v1/email";

/**
 * Sends through MailerSend. With no API token configured the email is written
 * to the server console instead, so local development works out of the box.
 * Never throws - a failed email must not fail the customer's submission.
 */
export async function sendEmail({ to, toName, subject, html, replyTo }: MailInput) {
  const token = process.env.MAILERSEND_API_TOKEN;
  const fromEmail = process.env.MAIL_FROM_EMAIL ?? "noreply@example.com";
  const fromName = process.env.MAIL_FROM_NAME ?? business.name;

  if (!token) {
    console.info(`[mail:dev] To: ${to} | Subject: ${subject}`);
    return { ok: true, skipped: true as const };
  }

  try {
    const res = await fetch(MAILERSEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        from: { email: fromEmail, name: fromName },
        to: [{ email: to, ...(toName ? { name: toName } : {}) }],
        subject,
        html,
        text: htmlToText(html),
        ...(replyTo ? { reply_to: { email: replyTo } } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[mail] MailerSend responded ${res.status}: ${body}`);
      return { ok: false, skipped: false as const };
    }
    return { ok: true, skipped: false as const };
  } catch (error) {
    console.error("[mail] send failed", error);
    return { ok: false, skipped: false as const };
  }
}

function htmlToText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|h1|h2|h3|li)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function adminInbox() {
  return process.env.MAIL_ADMIN_TO ?? process.env.ADMIN_EMAIL ?? business.email;
}

/** Shared black + red email shell. */
function layout(opts: { heading: string; intro: string; rows?: [string, string][]; body?: string; cta?: { label: string; href: string } }) {
  const rows = (opts.rows ?? [])
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 0;color:#8a8a8a;font-size:13px;width:170px;vertical-align:top;">${label}</td>
          <td style="padding:8px 0;color:#111111;font-size:14px;font-weight:600;">${value}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 12px;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:#0a0a0a;padding:24px 28px;border-bottom:4px solid #e11414;">
              <div style="color:#ffffff;font-size:22px;font-weight:bold;letter-spacing:-0.5px;">${business.name}</div>
              <div style="color:#e11414;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">${business.tagline} &middot; ${business.promise}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <h1 style="margin:0 0 12px;font-size:20px;color:#0a0a0a;">${opts.heading}</h1>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#444444;">${opts.intro}</p>
              ${rows ? `<table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;margin-bottom:20px;">${rows}</table>` : ""}
              ${opts.body ?? ""}
              ${
                opts.cta
                  ? `<div style="margin:24px 0 8px;">
                       <a href="${opts.cta.href}" style="background:#e11414;color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:6px;font-weight:bold;font-size:14px;display:inline-block;">${opts.cta.label}</a>
                     </div>`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="background:#0a0a0a;padding:20px 28px;color:#9a9a9a;font-size:12px;line-height:1.6;">
              <div style="color:#ffffff;font-weight:bold;font-size:14px;">${business.name}</div>
              <div>${business.phoneDisplay} &middot; ${business.email}</div>
              <div>Mobile smash repairs across ${business.baseCity}</div>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

type QuoteLike = {
  reference: string;
  name: string;
  email: string;
  phone: string;
  suburb: string;
  postcode: string;
  serviceType: keyof typeof SERVICE_LABELS;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColour: string;
  description: string;
  insuranceClaim: boolean;
  photoCount?: number;
};

export async function sendQuoteReceivedToCustomer(quote: QuoteLike) {
  return sendEmail({
    to: quote.email,
    toName: quote.name,
    subject: `We have your quote request (${quote.reference})`,
    html: layout({
      heading: `Thanks ${quote.name.split(" ")[0]}, we've got it.`,
      intro:
        "Your quote request has landed with us. We review photos personally and usually come back with a firm price the same day, or first thing the next business day.",
      rows: [
        ["Reference", quote.reference],
        ["Service", SERVICE_LABELS[quote.serviceType]],
        ["Vehicle", `${quote.vehicleYear} ${quote.vehicleMake} ${quote.vehicleModel} (${quote.vehicleColour})`],
        ["Location", `${quote.suburb} ${quote.postcode}`],
        ["Photos received", String(quote.photoCount ?? 0)],
      ],
      body: `<p style="margin:0;font-size:14px;color:#444;line-height:1.6;">In a hurry? Call us on <strong>${business.phoneDisplay}</strong> and quote your reference.</p>`,
      cta: { label: "View our recent work", href: `${siteUrl}/gallery` },
    }),
  });
}

export async function sendQuoteReceivedToAdmin(quote: QuoteLike, quoteId: string) {
  return sendEmail({
    to: adminInbox(),
    subject: `New quote request - ${SERVICE_LABELS[quote.serviceType]} - ${quote.suburb}`,
    replyTo: quote.email,
    html: layout({
      heading: "New quote request",
      intro: `${quote.name} just submitted a request through the website.`,
      rows: [
        ["Reference", quote.reference],
        ["Name", quote.name],
        ["Phone", quote.phone],
        ["Email", quote.email],
        ["Location", `${quote.suburb} ${quote.postcode}`],
        ["Service", SERVICE_LABELS[quote.serviceType]],
        ["Vehicle", `${quote.vehicleYear} ${quote.vehicleMake} ${quote.vehicleModel} (${quote.vehicleColour})`],
        ["Insurance claim", quote.insuranceClaim ? "Yes" : "No"],
        ["Photos", String(quote.photoCount ?? 0)],
      ],
      body: `<p style="margin:0;font-size:14px;color:#444;line-height:1.6;"><strong>Damage described:</strong><br>${escapeHtml(quote.description)}</p>`,
      cta: { label: "Open in admin", href: `${siteUrl}/admin/quotes/${quoteId}` },
    }),
  });
}

export async function sendQuotePriceToCustomer(opts: {
  reference: string;
  name: string;
  email: string;
  amountCents: number;
  message: string;
  serviceType: keyof typeof SERVICE_LABELS;
}) {
  return sendEmail({
    to: opts.email,
    toName: opts.name,
    subject: `Your quote from ${business.name} - ${formatMoney(opts.amountCents)}`,
    html: layout({
      heading: `Your quote: ${formatMoney(opts.amountCents)}`,
      intro: `Hi ${opts.name.split(" ")[0]}, here is the fixed price for your ${SERVICE_LABELS[opts.serviceType].toLowerCase()}. No obligation, and the price holds for 30 days.`,
      rows: [
        ["Reference", opts.reference],
        ["Service", SERVICE_LABELS[opts.serviceType]],
        ["Price", formatMoney(opts.amountCents)],
      ],
      body: `<p style="margin:0;font-size:14px;color:#444;line-height:1.6;">${escapeHtml(opts.message).replace(/\n/g, "<br>")}</p>`,
      cta: { label: "Book this job in", href: `${siteUrl}/book?ref=${encodeURIComponent(opts.reference)}` },
    }),
  });
}

type BookingLike = {
  reference: string;
  name: string;
  email: string;
  phone: string;
  addressLine: string;
  suburb: string;
  postcode: string;
  serviceType: keyof typeof SERVICE_LABELS;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  preferredDate: Date;
  timeSlot: keyof typeof TIME_SLOT_LABELS;
};

export async function sendBookingReceivedToCustomer(booking: BookingLike) {
  return sendEmail({
    to: booking.email,
    toName: booking.name,
    subject: `Booking request received (${booking.reference})`,
    html: layout({
      heading: "Booking request received",
      intro:
        "We have your preferred date. We will confirm availability shortly - keep an eye out for a confirmation email or a call from us.",
      rows: [
        ["Reference", booking.reference],
        ["Service", SERVICE_LABELS[booking.serviceType]],
        ["Preferred date", formatDateOnly(booking.preferredDate)],
        ["Time", TIME_SLOT_LABELS[booking.timeSlot]],
        ["We come to", `${booking.addressLine}, ${booking.suburb} ${booking.postcode}`],
      ],
      body: `<p style="margin:0;font-size:14px;color:#444;line-height:1.6;">Need to change something? Call <strong>${business.phoneDisplay}</strong>.</p>`,
    }),
  });
}

export async function sendBookingReceivedToAdmin(booking: BookingLike, bookingId: string) {
  return sendEmail({
    to: adminInbox(),
    subject: `New booking - ${formatDateOnly(booking.preferredDate)} - ${booking.suburb}`,
    replyTo: booking.email,
    html: layout({
      heading: "New booking request",
      intro: `${booking.name} requested a booking through the website.`,
      rows: [
        ["Reference", booking.reference],
        ["Name", booking.name],
        ["Phone", booking.phone],
        ["Email", booking.email],
        ["Service", SERVICE_LABELS[booking.serviceType]],
        ["Vehicle", `${booking.vehicleYear} ${booking.vehicleMake} ${booking.vehicleModel}`],
        ["Date", `${formatDateOnly(booking.preferredDate)} - ${TIME_SLOT_LABELS[booking.timeSlot]}`],
        ["Address", `${booking.addressLine}, ${booking.suburb} ${booking.postcode}`],
      ],
      cta: { label: "Open in admin", href: `${siteUrl}/admin/bookings/${bookingId}` },
    }),
  });
}

export async function sendBookingStatusToCustomer(opts: {
  reference: string;
  name: string;
  email: string;
  status: string;
  preferredDate: Date;
  timeSlot: keyof typeof TIME_SLOT_LABELS;
  note?: string | null;
}) {
  const headings: Record<string, string> = {
    CONFIRMED: "Your booking is confirmed",
    IN_PROGRESS: "We are on the job",
    COMPLETED: "Job complete",
    CANCELLED: "Your booking has been cancelled",
    PENDING: "Booking updated",
  };
  return sendEmail({
    to: opts.email,
    toName: opts.name,
    subject: `${headings[opts.status] ?? "Booking update"} (${opts.reference})`,
    html: layout({
      heading: headings[opts.status] ?? "Booking update",
      intro:
        opts.status === "CONFIRMED"
          ? "You are locked in. We will see you then - please make sure the car is accessible with a bit of room around it."
          : "Here is the latest on your booking.",
      rows: [
        ["Reference", opts.reference],
        ["Date", formatDateOnly(opts.preferredDate)],
        ["Time", TIME_SLOT_LABELS[opts.timeSlot]],
        ["Status", opts.status.replace("_", " ")],
      ],
      body: opts.note
        ? `<p style="margin:0;font-size:14px;color:#444;line-height:1.6;">${escapeHtml(opts.note).replace(/\n/g, "<br>")}</p>`
        : "",
    }),
  });
}

export async function sendContactToAdmin(msg: { name: string; email: string; phone?: string | null; subject?: string | null; message: string }) {
  return sendEmail({
    to: adminInbox(),
    subject: `Website enquiry - ${msg.subject || msg.name}`,
    replyTo: msg.email,
    html: layout({
      heading: "New website enquiry",
      intro: `${msg.name} sent a message through the contact form.`,
      rows: [
        ["Name", msg.name],
        ["Email", msg.email],
        ["Phone", msg.phone || "Not supplied"],
        ["Subject", msg.subject || "General enquiry"],
      ],
      body: `<p style="margin:0;font-size:14px;color:#444;line-height:1.6;">${escapeHtml(msg.message).replace(/\n/g, "<br>")}</p>`,
    }),
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
