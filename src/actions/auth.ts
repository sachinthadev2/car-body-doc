"use server";

import { redirect } from "next/navigation";

import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fieldErrors, loginSchema, registerSchema, type FormState } from "@/lib/validation";

/** Attach any guest quotes/bookings made with this email to the account. */
async function claimGuestRecords(userId: string, email: string) {
  await Promise.all([
    prisma.quoteRequest.updateMany({ where: { email, userId: null }, data: { userId } }),
    prisma.booking.updateMany({ where: { email, userId: null }, data: { userId } }),
  ]);
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, message: "Check your details.", errors: fieldErrors(parsed.error) };
  }

  const adminOnly = formData.get("adminOnly") === "true";
  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { ok: false, message: "Email or password is incorrect." };
  }
  if (adminOnly && user.role !== "ADMIN") {
    return { ok: false, message: "That account does not have admin access." };
  }

  await createSession({ userId: user.id, email: user.email, name: user.name, role: user.role });
  await claimGuestRecords(user.id, user.email);

  redirect(user.role === "ADMIN" && adminOnly ? "/admin" : "/account");
}

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      errors: fieldErrors(parsed.error),
    };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    return { ok: false, message: "An account with that email already exists.", errors: { email: "Already registered" } };
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      phone: parsed.data.phone || null,
      passwordHash: await hashPassword(parsed.data.password),
      role: "CUSTOMER",
    },
  });

  await createSession({ userId: user.id, email: user.email, name: user.name, role: user.role });
  await claimGuestRecords(user.id, user.email);

  redirect("/account");
}

export async function logout() {
  await destroySession();
  redirect("/");
}
