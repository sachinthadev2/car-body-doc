"use client";

import { Loader2, Send } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { sendQuotePrice, updateQuoteStatus } from "@/actions/admin";
import { Button } from "@/components/ui/Button";
import { Field, FormNotice, Input, Select, Textarea } from "@/components/ui/Field";
import { QUOTE_STATUS_LABELS } from "@/lib/utils";
import type { FormState } from "@/lib/validation";
import type { QuoteStatus } from "@/generated/prisma/enums";

const initialState: FormState = { ok: false };

export function QuoteReplyForm({
  quoteId,
  defaultAmount,
  defaultMessage,
}: {
  quoteId: string;
  defaultAmount?: number | null;
  defaultMessage?: string | null;
}) {
  const [state, formAction] = useActionState(sendQuotePrice, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? <FormNotice tone={state.ok ? "success" : "error"}>{state.message}</FormNotice> : null}
      <input type="hidden" name="quoteId" value={quoteId} />

      <Field label="Price (AUD)" name="amount" error={state.errors?.amount} hint="- what the customer pays, inc GST">
        <Input
          id="amount"
          name="amount"
          inputMode="decimal"
          placeholder="450"
          defaultValue={defaultAmount ? (defaultAmount / 100).toFixed(2) : ""}
          error={!!state.errors?.amount}
        />
      </Field>

      <Field label="Message to the customer" name="message" error={state.errors?.message}>
        <Textarea
          id="message"
          name="message"
          rows={6}
          defaultValue={
            defaultMessage ??
            "Thanks for sending those photos through. Based on what I can see we can repair this on site in about half a day. The price covers all prep, colour matched paint, clear coat and polish.\n\nHappy to answer any questions - just reply or give me a call."
          }
          error={!!state.errors?.message}
        />
      </Field>

      <SubmitButton label="Send Quote To Customer" icon />
    </form>
  );
}

export function QuoteStatusForm({
  quoteId,
  status,
  adminNotes,
}: {
  quoteId: string;
  status: QuoteStatus;
  adminNotes?: string | null;
}) {
  const [state, formAction] = useActionState(updateQuoteStatus, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? <FormNotice tone={state.ok ? "success" : "error"}>{state.message}</FormNotice> : null}
      <input type="hidden" name="quoteId" value={quoteId} />

      <Field label="Status" name="status" error={state.errors?.status}>
        <Select id="status" name="status" defaultValue={status}>
          {(Object.keys(QUOTE_STATUS_LABELS) as QuoteStatus[]).map((value) => (
            <option key={value} value={value}>
              {QUOTE_STATUS_LABELS[value]}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Internal notes" name="adminNotes" error={state.errors?.adminNotes} hint="- not shown to the customer">
        <Textarea id="adminNotes" name="adminNotes" rows={4} defaultValue={adminNotes ?? ""} />
      </Field>

      <SubmitButton label="Save" />
    </form>
  );
}

function SubmitButton({ label, icon = false }: { label: string; icon?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : icon ? <Send className="size-4" /> : null}
      {pending ? "Working" : label}
    </Button>
  );
}
