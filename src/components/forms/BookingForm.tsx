"use client";

import { CalendarCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { submitBooking } from "@/actions/booking";
import { Button } from "@/components/ui/Button";
import { Field, FormNotice, Input, Select, Textarea } from "@/components/ui/Field";
import { allSuburbs, business, serviceOptions } from "@/lib/site";
import type { FormState } from "@/lib/validation";

const initialState: FormState = { ok: false };

export function BookingForm({
  quoteReference,
  defaultService,
  prefill,
}: {
  quoteReference?: string;
  defaultService?: string;
  prefill?: {
    name?: string;
    email?: string;
    phone?: string;
    suburb?: string;
    postcode?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    vehicleYear?: string;
    vehicleColour?: string;
  };
}) {
  const [state, formAction] = useActionState(submitBooking, initialState);
  // Local calendar date, so the picker minimum matches the customer's own day.
  const now = new Date();
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);

  if (state.ok) {
    return (
      <div className="border border-emerald-500/30 bg-emerald-500/5 p-8 text-center sm:p-12">
        <CalendarCheck className="mx-auto size-14 text-emerald-400" />
        <h2 className="display mt-6 text-3xl text-white">Booking requested</h2>
        <p className="mx-auto mt-3 max-w-md text-white/60">{state.message}</p>
        <p className="mt-6 inline-block border border-hairline bg-panel-2 px-5 py-3">
          <span className="block text-[11px] uppercase tracking-widest text-white/40">Your reference</span>
          <span className="font-display text-2xl text-brand-500">{state.reference}</span>
        </p>
        <p className="mt-6 text-sm text-white/50">
          We will confirm the slot by email. Anything urgent, call{" "}
          <a href={business.phoneHref} className="text-brand-500 hover:underline">
            {business.phoneDisplay}
          </a>
          .
        </p>
        <div className="mt-8">
          <Link href="/" className="border border-white/20 px-5 py-2.5 font-display uppercase text-white hover:border-brand-500">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      {state.message && !state.ok ? <FormNotice tone="error">{state.message}</FormNotice> : null}

      <input type="hidden" name="quoteReference" defaultValue={quoteReference ?? ""} />

      <fieldset className="space-y-6">
        <legend className="display mb-4 text-xl text-white">1. The job</legend>
        <Field label="Service" name="serviceType" error={state.errors?.serviceType}>
          <Select id="serviceType" name="serviceType" defaultValue={defaultService ?? ""} error={!!state.errors?.serviceType} required>
            <option value="" disabled>
              Choose a service
            </option>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Preferred date" name="preferredDate" error={state.errors?.preferredDate}>
            <Input id="preferredDate" name="preferredDate" type="date" min={today} error={!!state.errors?.preferredDate} required />
          </Field>
          <Field label="Time" name="timeSlot" error={state.errors?.timeSlot}>
            <Select id="timeSlot" name="timeSlot" defaultValue="MORNING">
              <option value="MORNING">Morning (7am - 12pm)</option>
              <option value="AFTERNOON">Afternoon (12pm - 5pm)</option>
            </Select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-6 border-t border-hairline pt-8">
        <legend className="display mb-4 text-xl text-white">2. Your vehicle</legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Make" name="vehicleMake" error={state.errors?.vehicleMake}>
            <Input id="vehicleMake" name="vehicleMake" defaultValue={prefill?.vehicleMake} placeholder="Toyota" error={!!state.errors?.vehicleMake} />
          </Field>
          <Field label="Model" name="vehicleModel" error={state.errors?.vehicleModel}>
            <Input id="vehicleModel" name="vehicleModel" defaultValue={prefill?.vehicleModel} placeholder="Corolla" error={!!state.errors?.vehicleModel} />
          </Field>
          <Field label="Year" name="vehicleYear" error={state.errors?.vehicleYear}>
            <Input id="vehicleYear" name="vehicleYear" defaultValue={prefill?.vehicleYear} inputMode="numeric" placeholder="2019" error={!!state.errors?.vehicleYear} />
          </Field>
          <Field label="Colour" name="vehicleColour" error={state.errors?.vehicleColour}>
            <Input id="vehicleColour" name="vehicleColour" defaultValue={prefill?.vehicleColour} placeholder="Silver" error={!!state.errors?.vehicleColour} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-6 border-t border-hairline pt-8">
        <legend className="display mb-4 text-xl text-white">3. Where we come to</legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Your name" name="name" error={state.errors?.name}>
            <Input id="name" name="name" defaultValue={prefill?.name} autoComplete="name" error={!!state.errors?.name} />
          </Field>
          <Field label="Phone" name="phone" error={state.errors?.phone}>
            <Input id="phone" name="phone" defaultValue={prefill?.phone} type="tel" autoComplete="tel" error={!!state.errors?.phone} />
          </Field>
          <Field label="Email" name="email" error={state.errors?.email} className="sm:col-span-2">
            <Input id="email" name="email" defaultValue={prefill?.email} type="email" autoComplete="email" error={!!state.errors?.email} />
          </Field>
          <Field label="Street address" name="addressLine" error={state.errors?.addressLine} className="sm:col-span-2">
            <Input id="addressLine" name="addressLine" autoComplete="street-address" placeholder="12 Smith Street" error={!!state.errors?.addressLine} />
          </Field>
          <Field label="Suburb" name="suburb" error={state.errors?.suburb}>
            <Input id="suburb" name="suburb" defaultValue={prefill?.suburb} list="booking-suburbs" error={!!state.errors?.suburb} />
            <datalist id="booking-suburbs">
              {allSuburbs.map((suburb) => (
                <option key={suburb} value={suburb} />
              ))}
            </datalist>
          </Field>
          <Field label="Postcode" name="postcode" error={state.errors?.postcode}>
            <Input id="postcode" name="postcode" defaultValue={prefill?.postcode} inputMode="numeric" error={!!state.errors?.postcode} />
          </Field>
        </div>

        <Field
          label="Anything we should know?"
          name="notes"
          error={state.errors?.notes}
          hint="- parking, gate codes, undercover space"
        >
          <Textarea id="notes" name="notes" rows={3} placeholder="Car is in the driveway, plenty of room. Gate code 1234." />
        </Field>
      </fieldset>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-5 animate-spin" /> Sending
        </>
      ) : (
        "Request This Booking"
      )}
    </Button>
  );
}
