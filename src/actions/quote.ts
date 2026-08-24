"use server";

import { revalidatePath } from "next/cache";

import { getSessionUserId } from "@/lib/auth";
import { sendQuoteReceivedToAdmin, sendQuoteReceivedToCustomer } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { savePhotos } from "@/lib/uploads";
import { makeReference } from "@/lib/utils";
import { fieldErrors, quoteSchema, type FormState } from "@/lib/validation";

export async function submitQuote(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = quoteSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    suburb: String(formData.get("suburb") ?? ""),
    postcode: String(formData.get("postcode") ?? ""),
    contactMethod: String(formData.get("contactMethod") || "PHONE"),
    vehicleMake: String(formData.get("vehicleMake") ?? ""),
    vehicleModel: String(formData.get("vehicleModel") ?? ""),
    vehicleYear: String(formData.get("vehicleYear") ?? ""),
    vehicleColour: String(formData.get("vehicleColour") ?? ""),
    paintCode: String(formData.get("paintCode") ?? ""),
    serviceType: String(formData.get("serviceType") || "OTHER"),
    description: String(formData.get("description") ?? ""),
    insuranceClaim: formData.get("insuranceClaim") === "on" || formData.get("insuranceClaim") === "true",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields and try again.",
      errors: fieldErrors(parsed.error),
    };
  }

  const files = formData.getAll("photos").filter((entry): entry is File => entry instanceof File);
  const { saved, error } = await savePhotos(files);
  if (error) {
    return { ok: false, message: error, errors: { photos: error } };
  }

  const userId = await getSessionUserId();
  const data = parsed.data;
  const reference = makeReference("Q");

  const quote = await prisma.quoteRequest.create({
    data: {
      reference,
      userId,
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      suburb: data.suburb,
      postcode: data.postcode,
      contactMethod: data.contactMethod,
      vehicleMake: data.vehicleMake,
      vehicleModel: data.vehicleModel,
      vehicleYear: data.vehicleYear,
      vehicleColour: data.vehicleColour,
      paintCode: data.paintCode || null,
      serviceType: data.serviceType,
      description: data.description,
      insuranceClaim: data.insuranceClaim,
      photos: { create: saved.map((p) => ({ url: p.url, filename: p.filename })) },
    },
  });

  const payload = { ...quote, photoCount: saved.length };
  await Promise.allSettled([
    sendQuoteReceivedToCustomer(payload),
    sendQuoteReceivedToAdmin(payload, quote.id),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/quotes");
  revalidatePath("/account");

  return {
    ok: true,
    reference,
    message: "Quote request received. We will be in touch shortly.",
  };
}
