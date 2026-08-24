"use server";

import { revalidatePath } from "next/cache";

import { getSessionUserId } from "@/lib/auth";
import { sendBookingReceivedToAdmin, sendBookingReceivedToCustomer } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { parseDateOnly } from "@/lib/dates";
import { makeReference } from "@/lib/utils";
import { bookingSchema, fieldErrors, type FormState } from "@/lib/validation";

/** How many jobs we will take in a single half-day slot. */
const SLOT_CAPACITY = 2;

export async function submitBooking(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = bookingSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    addressLine: String(formData.get("addressLine") ?? ""),
    suburb: String(formData.get("suburb") ?? ""),
    postcode: String(formData.get("postcode") ?? ""),
    vehicleMake: String(formData.get("vehicleMake") ?? ""),
    vehicleModel: String(formData.get("vehicleModel") ?? ""),
    vehicleYear: String(formData.get("vehicleYear") ?? ""),
    vehicleColour: String(formData.get("vehicleColour") ?? ""),
    serviceType: String(formData.get("serviceType") || "OTHER"),
    preferredDate: String(formData.get("preferredDate") ?? ""),
    timeSlot: String(formData.get("timeSlot") || "MORNING"),
    notes: String(formData.get("notes") ?? ""),
    quoteReference: String(formData.get("quoteReference") ?? ""),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields and try again.",
      errors: fieldErrors(parsed.error),
    };
  }

  const data = parsed.data;
  const preferredDate = parseDateOnly(data.preferredDate);

  const blocked = await prisma.blockedDate.findFirst({ where: { date: preferredDate } });
  if (blocked) {
    return {
      ok: false,
      message: "We are not available that day. Please pick another date.",
      errors: { preferredDate: "Not available - please choose another day" },
    };
  }

  const taken = await prisma.booking.count({
    where: {
      preferredDate,
      timeSlot: data.timeSlot,
      status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
    },
  });
  if (taken >= SLOT_CAPACITY) {
    return {
      ok: false,
      message: "That slot is fully booked. Please choose another day or time.",
      errors: { preferredDate: "Fully booked - try another day or the other time slot" },
    };
  }

  const userId = await getSessionUserId();

  // If the customer already has a quote, link the booking to it.
  let quoteRequestId: string | null = null;
  if (data.quoteReference) {
    const quote = await prisma.quoteRequest.findUnique({
      where: { reference: data.quoteReference.trim().toUpperCase() },
      select: { id: true, booking: { select: { id: true } } },
    });
    if (quote && !quote.booking) quoteRequestId = quote.id;
  }

  const reference = makeReference("B");
  const booking = await prisma.booking.create({
    data: {
      reference,
      userId,
      quoteRequestId,
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      addressLine: data.addressLine,
      suburb: data.suburb,
      postcode: data.postcode,
      vehicleMake: data.vehicleMake,
      vehicleModel: data.vehicleModel,
      vehicleYear: data.vehicleYear,
      vehicleColour: data.vehicleColour,
      serviceType: data.serviceType,
      notes: data.notes || null,
      preferredDate,
      timeSlot: data.timeSlot,
    },
  });

  if (quoteRequestId) {
    await prisma.quoteRequest.update({
      where: { id: quoteRequestId },
      data: { status: "ACCEPTED" },
    });
  }

  await Promise.allSettled([
    sendBookingReceivedToCustomer(booking),
    sendBookingReceivedToAdmin(booking, booking.id),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/account");

  return {
    ok: true,
    reference,
    message: "Booking request received. We will confirm your slot shortly.",
  };
}
