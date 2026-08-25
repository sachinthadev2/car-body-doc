"use client";

import { Check, Loader2, SendHorizontal } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { subscribeNewsletter } from "@/actions/engage";
import type { FormState } from "@/lib/validation";

const initialState: FormState = { ok: false };

export function NewsletterForm() {
  const [state, formAction] = useActionState(subscribeNewsletter, initialState);

  if (state.ok) {
    return (
      <div className="flex items-center gap-3 border-b-2 border-emerald-500/60 pb-3">
        <Check className="size-5 shrink-0 text-emerald-400" />
        <p className="text-base text-emerald-200">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="w-full">
      <div className="flex items-center gap-3 border-b-2 border-white/25 pb-2 transition-colors focus-within:border-brand-500">
        <label htmlFor="newsletter-email" className="sr-only">
          Your email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Enter your email..."
          className="w-full bg-transparent py-2 text-lg text-white placeholder:text-white/40 outline-none"
        />
        <SubmitButton />
      </div>
      {state.message && !state.ok ? <p className="mt-2 text-sm text-brand-400">{state.message}</p> : null}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Subscribe to the newsletter"
      className="sheen flex size-12 shrink-0 items-center justify-center bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-5 animate-spin" /> : <SendHorizontal className="size-5" />}
    </button>
  );
}
