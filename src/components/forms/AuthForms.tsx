"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { login, register } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field, FormNotice, Input } from "@/components/ui/Field";
import type { FormState } from "@/lib/validation";

const initialState: FormState = { ok: false };

export function LoginForm({ adminOnly = false }: { adminOnly?: boolean }) {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.message ? <FormNotice tone="error">{state.message}</FormNotice> : null}
      <input type="hidden" name="adminOnly" value={adminOnly ? "true" : "false"} />

      <Field label="Email" name="email" error={state.errors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" error={!!state.errors?.email} required />
      </Field>
      <Field label="Password" name="password" error={state.errors?.password}>
        <Input id="password" name="password" type="password" autoComplete="current-password" error={!!state.errors?.password} required />
      </Field>

      <SubmitButton label={adminOnly ? "Log In To Admin" : "Log In"} />

      {!adminOnly && (
        <p className="text-center text-sm text-white/50">
          No account yet?{" "}
          <Link href="/register" className="text-brand-500 hover:underline">
            Create one
          </Link>
        </p>
      )}
    </form>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(register, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.message ? <FormNotice tone="error">{state.message}</FormNotice> : null}

      <Field label="Your name" name="name" error={state.errors?.name}>
        <Input id="name" name="name" autoComplete="name" error={!!state.errors?.name} required />
      </Field>
      <Field label="Email" name="email" error={state.errors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" error={!!state.errors?.email} required />
      </Field>
      <Field label="Phone" name="phone" error={state.errors?.phone} hint="- optional">
        <Input id="phone" name="phone" type="tel" autoComplete="tel" error={!!state.errors?.phone} />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Password" name="password" error={state.errors?.password}>
          <Input id="password" name="password" type="password" autoComplete="new-password" error={!!state.errors?.password} required />
        </Field>
        <Field label="Confirm password" name="confirmPassword" error={state.errors?.confirmPassword}>
          <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" error={!!state.errors?.confirmPassword} required />
        </Field>
      </div>

      <SubmitButton label="Create Account" />

      <p className="text-center text-sm text-white/50">
        Already registered?{" "}
        <Link href="/login" className="text-brand-500 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-5 animate-spin" /> Please wait
        </>
      ) : (
        label
      )}
    </Button>
  );
}
