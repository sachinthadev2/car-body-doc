"use client";

import { Camera, CheckCircle2, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { submitQuote } from "@/actions/quote";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, FieldError, FormNotice, Input, Select, Textarea } from "@/components/ui/Field";
import { allSuburbs, business, serviceOptions } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { FormState } from "@/lib/validation";

const initialState: FormState = { ok: false };

const steps = [
  { id: 0, label: "The damage" },
  { id: 1, label: "Your vehicle" },
  { id: 2, label: "Your details" },
];

export function QuoteForm({ defaultService }: { defaultService?: string }) {
  const [state, formAction] = useActionState(submitQuote, initialState);
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  if (state.ok) {
    return (
      <div className="border border-emerald-500/30 bg-emerald-500/5 p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto size-14 text-emerald-400" />
        <h2 className="display mt-6 text-3xl text-white">Request received</h2>
        <p className="mx-auto mt-3 max-w-md text-white/60">{state.message}</p>
        <p className="mt-6 inline-block border border-hairline bg-panel-2 px-5 py-3">
          <span className="block text-[11px] uppercase tracking-widest text-white/40">Your reference</span>
          <span className="font-display text-2xl text-brand-500">{state.reference}</span>
        </p>
        <p className="mt-6 text-sm text-white/50">
          We have emailed you a copy. Need it sorted urgently? Call{" "}
          <a href={business.phoneHref} className="text-brand-500 hover:underline">
            {business.phoneDisplay}
          </a>
          .
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/gallery" className="border border-white/20 px-5 py-2.5 font-display uppercase text-white hover:border-brand-500">
            See our work
          </Link>
          <Link href="/" className="border border-white/20 px-5 py-2.5 font-display uppercase text-white hover:border-brand-500">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  /** Light client-side gate so people are not sent back and forth. */
  function next() {
    const form = formRef.current;
    if (!form) return;
    const required: Record<number, string[]> = {
      0: ["serviceType", "description"],
      1: ["vehicleMake", "vehicleModel", "vehicleYear", "vehicleColour"],
    };
    const missing = (required[step] ?? []).filter((name) => {
      const el = form.elements.namedItem(name) as HTMLInputElement | null;
      return !el?.value?.trim();
    });
    if (missing.length > 0) {
      const el = form.elements.namedItem(missing[0]) as HTMLInputElement | null;
      el?.focus();
      el?.reportValidity();
      return;
    }
    setStep((s) => Math.min(2, s + 1));
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-8">
      {/* Step indicator */}
      <ol className="flex items-center gap-2">
        {steps.map((s) => (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(s.id)}
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full font-display text-sm transition-colors",
                step === s.id ? "bg-brand-500 text-white" : step > s.id ? "bg-emerald-500/20 text-emerald-300" : "bg-panel-2 text-white/40",
              )}
            >
              {s.id + 1}
            </button>
            <span className={cn("hidden text-sm sm:block", step === s.id ? "text-white" : "text-white/40")}>{s.label}</span>
            {s.id < 2 && <span className="h-px flex-1 bg-hairline" />}
          </li>
        ))}
      </ol>

      {state.message && !state.ok ? <FormNotice tone="error">{state.message}</FormNotice> : null}

      {/* ------------------------------------------------ Step 1: the damage */}
      <div className={cn("space-y-6", step !== 0 && "hidden")}>
        <Field label="What do you need done?" name="serviceType" error={state.errors?.serviceType}>
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

        <Field
          label="Tell us about the damage"
          name="description"
          error={state.errors?.description}
          hint="- what happened, which panels, how big"
        >
          <Textarea
            id="description"
            name="description"
            rows={5}
            placeholder="e.g. Reversed into a pole. Dent and scratches on the rear bumper, about the size of a dinner plate. Paint is cracked."
            error={!!state.errors?.description}
            required
          />
        </Field>

        <div>
          <p className="mb-1.5 text-[13px] font-medium text-white/70">
            Photos of the damage <span className="font-normal text-white/35">- up to 5, this is what gets you an accurate price</span>
          </p>
          <label
            htmlFor="photos"
            className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-hairline bg-panel-2 px-6 py-9 text-center transition-colors hover:border-brand-500"
          >
            <Camera className="size-8 text-brand-500" />
            <span className="mt-3 font-display text-lg uppercase text-white">Add photos</span>
            <span className="mt-1 text-[13px] text-white/40">JPG, PNG, WEBP or HEIC &middot; max 8MB each</span>
          </label>
          <input
            ref={fileRef}
            id="photos"
            name="photos"
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => setPhotos(Array.from(e.target.files ?? []).slice(0, 5).map((f) => f.name))}
          />
          <FieldError>{state.errors?.photos}</FieldError>

          {photos.length > 0 && (
            <ul className="mt-3 space-y-2">
              {photos.map((name) => (
                <li key={name} className="flex items-center justify-between border border-hairline bg-panel-2 px-3 py-2 text-sm text-white/70">
                  <span className="truncate">{name}</span>
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (fileRef.current) fileRef.current.value = "";
                    setPhotos([]);
                  }}
                  className="flex items-center gap-1.5 text-[13px] text-white/40 hover:text-brand-400"
                >
                  <X className="size-3.5" /> Clear photos
                </button>
              </li>
            </ul>
          )}
        </div>

        <Checkbox name="insuranceClaim" label="This is (or might be) an insurance claim" />

        <div className="flex justify-end">
          <Button type="button" onClick={next}>
            Next: Vehicle
          </Button>
        </div>
      </div>

      {/* --------------------------------------------------- Step 2: vehicle */}
      <div className={cn("space-y-6", step !== 1 && "hidden")}>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Make" name="vehicleMake" error={state.errors?.vehicleMake}>
            <Input id="vehicleMake" name="vehicleMake" placeholder="Toyota" error={!!state.errors?.vehicleMake} />
          </Field>
          <Field label="Model" name="vehicleModel" error={state.errors?.vehicleModel}>
            <Input id="vehicleModel" name="vehicleModel" placeholder="Corolla" error={!!state.errors?.vehicleModel} />
          </Field>
          <Field label="Year" name="vehicleYear" error={state.errors?.vehicleYear}>
            <Input id="vehicleYear" name="vehicleYear" inputMode="numeric" placeholder="2019" error={!!state.errors?.vehicleYear} />
          </Field>
          <Field label="Colour" name="vehicleColour" error={state.errors?.vehicleColour}>
            <Input id="vehicleColour" name="vehicleColour" placeholder="Silver" error={!!state.errors?.vehicleColour} />
          </Field>
        </div>
        <Field
          label="Paint code"
          name="paintCode"
          error={state.errors?.paintCode}
          hint="- optional, found on the compliance plate"
        >
          <Input id="paintCode" name="paintCode" placeholder="e.g. 1F7" />
        </Field>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => setStep(0)}>
            Back
          </Button>
          <Button type="button" onClick={next}>
            Next: Your details
          </Button>
        </div>
      </div>

      {/* --------------------------------------------------- Step 3: contact */}
      <div className={cn("space-y-6", step !== 2 && "hidden")}>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Your name" name="name" error={state.errors?.name}>
            <Input id="name" name="name" autoComplete="name" error={!!state.errors?.name} />
          </Field>
          <Field label="Phone" name="phone" error={state.errors?.phone}>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="0400 000 000" error={!!state.errors?.phone} />
          </Field>
          <Field label="Email" name="email" error={state.errors?.email} className="sm:col-span-2">
            <Input id="email" name="email" type="email" autoComplete="email" error={!!state.errors?.email} />
          </Field>
          <Field label="Suburb the car is in" name="suburb" error={state.errors?.suburb}>
            <Input id="suburb" name="suburb" list="suburb-list" placeholder="Parramatta" error={!!state.errors?.suburb} />
            <datalist id="suburb-list">
              {allSuburbs.map((suburb) => (
                <option key={suburb} value={suburb} />
              ))}
            </datalist>
          </Field>
          <Field label="Postcode" name="postcode" error={state.errors?.postcode}>
            <Input id="postcode" name="postcode" inputMode="numeric" placeholder="2150" error={!!state.errors?.postcode} />
          </Field>
        </div>

        <Field label="Best way to reach you" name="contactMethod" error={state.errors?.contactMethod}>
          <Select id="contactMethod" name="contactMethod" defaultValue="PHONE">
            <option value="PHONE">Phone call</option>
            <option value="SMS">Text message</option>
            <option value="EMAIL">Email</option>
          </Select>
        </Field>

        <p className="text-[13px] leading-relaxed text-white/40">
          By sending this you agree to us contacting you about your repair. We never pass your details on. See our{" "}
          <Link href="/privacy" className="text-white/60 underline hover:text-brand-400">
            privacy policy
          </Link>
          .
        </p>

        <div className="flex justify-between gap-3">
          <Button type="button" variant="outline" onClick={() => setStep(1)}>
            Back
          </Button>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-5 animate-spin" /> Sending
        </>
      ) : (
        "Send My Free Quote Request"
      )}
    </Button>
  );
}
