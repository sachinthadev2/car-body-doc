"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { sendBookingStatusToCustomer, sendQuotePriceToCustomer } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { parseDateOnly } from "@/lib/dates";
import { dollarsToCents } from "@/lib/utils";
import {
  bookingUpdateSchema,
  fieldErrors,
  quoteNotesSchema,
  quoteReplySchema,
  type FormState,
} from "@/lib/validation";

/** Send the customer their price and mark the request as quoted. */
export async function sendQuotePrice(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = quoteReplySchema.safeParse({
    quoteId: String(formData.get("quoteId") ?? ""),
    amount: String(formData.get("amount") ?? ""),
    message: String(formData.get("message") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, message: "Check the quote details.", errors: fieldErrors(parsed.error) };
  }

  const cents = dollarsToCents(parsed.data.amount);
  if (cents === null) return { ok: false, message: "That amount does not look right." };

  const quote = await prisma.quoteRequest.update({
    where: { id: parsed.data.quoteId },
    data: {
      quotedAmountCents: cents,
      quoteMessage: parsed.data.message,
      quotedAt: new Date(),
      status: "QUOTED",
    },
  });

  await sendQuotePriceToCustomer({
    reference: quote.reference,
    name: quote.name,
    email: quote.email,
    amountCents: cents,
    message: parsed.data.message,
    serviceType: quote.serviceType,
  });

  revalidatePath("/admin/quotes");
  revalidatePath(`/admin/quotes/${quote.id}`);
  revalidatePath("/account");

  return { ok: true, message: `Quote sent to ${quote.email}.` };
}

/** Status + internal notes, no email sent. */
export async function updateQuoteStatus(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = quoteNotesSchema.safeParse({
    quoteId: String(formData.get("quoteId") ?? ""),
    status: String(formData.get("status") ?? "NEW"),
    adminNotes: String(formData.get("adminNotes") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, message: "Check the details.", errors: fieldErrors(parsed.error) };
  }

  await prisma.quoteRequest.update({
    where: { id: parsed.data.quoteId },
    data: { status: parsed.data.status, adminNotes: parsed.data.adminNotes || null },
  });

  revalidatePath("/admin/quotes");
  revalidatePath(`/admin/quotes/${parsed.data.quoteId}`);

  return { ok: true, message: "Saved." };
}

export async function updateBooking(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = bookingUpdateSchema.safeParse({
    bookingId: String(formData.get("bookingId") ?? ""),
    status: String(formData.get("status") ?? "PENDING"),
    preferredDate: String(formData.get("preferredDate") ?? ""),
    timeSlot: String(formData.get("timeSlot") ?? "MORNING"),
    price: String(formData.get("price") ?? ""),
    adminNotes: String(formData.get("adminNotes") ?? ""),
    notifyCustomer: formData.get("notifyCustomer") === "on" || formData.get("notifyCustomer") === "true",
  });

  if (!parsed.success) {
    return { ok: false, message: "Check the booking details.", errors: fieldErrors(parsed.error) };
  }

  const data = parsed.data;
  const booking = await prisma.booking.update({
    where: { id: data.bookingId },
    data: {
      status: data.status,
      preferredDate: parseDateOnly(data.preferredDate),
      timeSlot: data.timeSlot,
      priceCents: data.price ? dollarsToCents(data.price) : null,
      adminNotes: data.adminNotes || null,
      completedAt: data.status === "COMPLETED" ? new Date() : null,
    },
  });

  if (data.notifyCustomer) {
    await sendBookingStatusToCustomer({
      reference: booking.reference,
      name: booking.name,
      email: booking.email,
      status: booking.status,
      preferredDate: booking.preferredDate,
      timeSlot: booking.timeSlot,
      note: booking.adminNotes,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${booking.id}`);
  revalidatePath("/account");

  return {
    ok: true,
    message: data.notifyCustomer ? "Booking updated and customer notified." : "Booking updated.",
  };
}

export async function toggleMessageHandled(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const message = await prisma.contactMessage.findUnique({ where: { id }, select: { handled: true } });
  if (!message) return;
  await prisma.contactMessage.update({ where: { id }, data: { handled: !message.handled } });
  revalidatePath("/admin/messages");
}

export async function addBlockedDate(formData: FormData) {
  await requireAdmin();
  const date = String(formData.get("date") ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
  await prisma.blockedDate.upsert({
    where: { date: parseDateOnly(date) },
    create: { date: parseDateOnly(date), reason: String(formData.get("reason") ?? "") || null },
    update: { reason: String(formData.get("reason") ?? "") || null },
  });
  revalidatePath("/admin/settings");
}

export async function removeBlockedDate(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.blockedDate.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/settings");
}
