"use server";

import { revalidatePath } from "next/cache";

import { sendChatRequestToAdmin, sendChatRequestToCustomer } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { makeReference } from "@/lib/utils";
import { chatRequestSchema, fieldErrors, newsletterSchema, type FormState } from "@/lib/validation";

/** Footer newsletter signup. */
export async function subscribeNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = newsletterSchema.safeParse({ email: String(formData.get("email") ?? "") });

  if (!parsed.success) {
    return { ok: false, message: "Enter a valid email address.", errors: fieldErrors(parsed.error) };
  }

  const email = parsed.data.email.toLowerCase();

  // Re-subscribing an existing address is a success, not an error.
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email },
    update: { active: true },
  });

  revalidatePath("/admin/leads");
  return { ok: true, message: "You're on the list. Watch your inbox for offers." };
}

/** Chat widget enquiry - saved and emailed through to the admin. */
export async function submitChatRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = chatRequestSchema.safeParse({
    topic: String(formData.get("topic") ?? ""),
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    suburb: String(formData.get("suburb") ?? ""),
    message: String(formData.get("message") ?? ""),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      errors: fieldErrors(parsed.error),
    };
  }

  const data = parsed.data;
  const reference = makeReference("C");

  const request = await prisma.chatRequest.create({
    data: {
      reference,
      topic: data.topic,
      name: data.name,
      phone: data.phone,
      email: data.email ? data.email.toLowerCase() : null,
      suburb: data.suburb || null,
      message: data.message || null,
    },
  });

  await Promise.allSettled([
    sendChatRequestToAdmin(request),
    request.email ? sendChatRequestToCustomer({ ...request, email: request.email }) : Promise.resolve(),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/leads");

  return { ok: true, reference, message: "Thanks - we've got your details and will call you shortly." };
}
