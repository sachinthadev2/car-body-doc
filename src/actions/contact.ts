"use server";

import { revalidatePath } from "next/cache";

import { sendContactToAdmin } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { contactSchema, fieldErrors, type FormState } from "@/lib/validation";

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields and try again.",
      errors: fieldErrors(parsed.error),
    };
  }

  const data = parsed.data;
  await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
    },
  });

  await Promise.allSettled([sendContactToAdmin(data)]);
  revalidatePath("/admin/messages");

  return { ok: true, message: "Thanks - your message is with us. We usually reply within a few hours." };
}
