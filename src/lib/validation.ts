import { z } from "zod";

import { parseDateOnly, todayDateOnly } from "@/lib/dates";

const serviceType = z.enum(["SMASH_REPAIRS", "SPRAY_PAINT", "BUFF_POLISH", "DENT_SCRATCH", "OTHER"]);

const phone = z
  .string()
  .trim()
  .min(8, "Enter a valid phone number")
  .max(20, "Enter a valid phone number")
  .regex(/^[0-9+()\s-]+$/, "Enter a valid phone number");

const postcode = z
  .string()
  .trim()
  .regex(/^\d{4}$/, "Enter a 4 digit postcode");

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(80),
  email: z.email("Enter a valid email address"),
  phone,
  suburb: z.string().trim().min(2, "Which suburb is the car in?").max(60),
  postcode,
  contactMethod: z.enum(["PHONE", "SMS", "EMAIL"]).default("PHONE"),
  vehicleMake: z.string().trim().min(1, "Vehicle make is required").max(40),
  vehicleModel: z.string().trim().min(1, "Vehicle model is required").max(40),
  vehicleYear: z
    .string()
    .trim()
    .regex(/^(19|20)\d{2}$/, "Enter a 4 digit year"),
  vehicleColour: z.string().trim().min(2, "Vehicle colour is required").max(40),
  paintCode: z.string().trim().max(30).optional().or(z.literal("")),
  serviceType,
  description: z.string().trim().min(10, "Give us a few words about the damage").max(2000),
  insuranceClaim: z.boolean().default(false),
});

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(80),
  email: z.email("Enter a valid email address"),
  phone,
  addressLine: z.string().trim().min(4, "Street address is required").max(120),
  suburb: z.string().trim().min(2, "Suburb is required").max(60),
  postcode,
  vehicleMake: z.string().trim().min(1, "Vehicle make is required").max(40),
  vehicleModel: z.string().trim().min(1, "Vehicle model is required").max(40),
  vehicleYear: z
    .string()
    .trim()
    .regex(/^(19|20)\d{2}$/, "Enter a 4 digit year"),
  vehicleColour: z.string().trim().min(2, "Vehicle colour is required").max(40),
  serviceType,
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date")
    // Compared as calendar dates in UTC, with a day of slack so a customer whose
    // local date is ahead of the server's is never knocked back.
    .refine(
      (value) => parseDateOnly(value).getTime() >= todayDateOnly().getTime() - 86_400_000,
      "Choose a date from today onwards",
    ),
  timeSlot: z.enum(["MORNING", "AFTERNOON"]),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  quoteReference: z.string().trim().max(30).optional().or(z.literal("")),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(80),
  email: z.email("Enter a valid email address"),
  phone: phone.optional().or(z.literal("")),
  subject: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Your message is a little short").max(2000),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Tell us your name").max(80),
    email: z.email("Enter a valid email address"),
    phone: phone.optional().or(z.literal("")),
    password: z.string().min(8, "Use at least 8 characters").max(100),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const quoteReplySchema = z.object({
  quoteId: z.string().min(1),
  amount: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter an amount like 450 or 450.00"),
  message: z.string().trim().min(5, "Add a short message for the customer").max(2000),
});

export const quoteNotesSchema = z.object({
  quoteId: z.string().min(1),
  status: z.enum(["NEW", "REVIEWING", "QUOTED", "ACCEPTED", "DECLINED", "CLOSED"]),
  adminNotes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const bookingUpdateSchema = z.object({
  bookingId: z.string().min(1),
  status: z.enum(["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
  timeSlot: z.enum(["MORNING", "AFTERNOON"]),
  price: z
    .string()
    .trim()
    .regex(/^(\d+(\.\d{1,2})?)?$/, "Enter an amount like 450")
    .optional()
    .or(z.literal("")),
  adminNotes: z.string().trim().max(2000).optional().or(z.literal("")),
  notifyCustomer: z.boolean().default(false),
});

export type FormState = {
  ok: boolean;
  message?: string;
  reference?: string;
  errors?: Record<string, string>;
};

/** Turns a Zod failure into a flat { field: message } map for the forms. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
