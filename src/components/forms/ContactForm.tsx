"use client";

import { Loader2, Send } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { submitContact } from "@/actions/contact";
import { Button } from "@/components/ui/Button";
import { Field, FormNotice, Input, Textarea } from "@/components/ui/Field";
import type { FormState } from "@/lib/validation";

const initialState: FormState = { ok: false };

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.message ? <FormNotice tone={state.ok ? "success" : "error"}>{state.message}</FormNotice> : null}

      {!state.ok && (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Your name" name="name" error={state.errors?.name}>
              <Input id="name" name="name" autoComplete="name" error={!!state.errors?.name} />
            </Field>
            <Field label="Phone" name="phone" error={state.errors?.phone} hint="- optional">
              <Input id="phone" name="phone" type="tel" autoComplete="tel" error={!!state.errors?.phone} />
            </Field>
          </div>
          <Field label="Email" name="email" error={state.errors?.email}>
            <Input id="email" name="email" type="email" autoComplete="email" error={!!state.errors?.email} />
          </Field>
          <Field label="Subject" name="subject" error={state.errors?.subject} hint="- optional">
            <Input id="subject" name="subject" placeholder="Quote follow up" />
          </Field>
          <Field label="Message" name="message" error={state.errors?.message}>
            <Textarea id="message" name="message" rows={6} error={!!state.errors?.message} />
          </Field>
          <SubmitButton />
        </>
      )}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
      {pending ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-4" />}
      {pending ? "Sending" : "Send Message"}
    </Button>
  );
}
