"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { updateBooking } from "@/actions/admin";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, FormNotice, Input, Select, Textarea } from "@/components/ui/Field";
import { BOOKING_STATUS_LABELS } from "@/lib/utils";
import type { FormState } from "@/lib/validation";
import type { BookingStatus, TimeSlot } from "@/generated/prisma/enums";

const initialState: FormState = { ok: false };

export function BookingUpdateForm({
  bookingId,
  status,
  preferredDate,
  timeSlot,
  priceCents,
  adminNotes,
}: {
  bookingId: string;
  status: BookingStatus;
  preferredDate: string;
  timeSlot: TimeSlot;
  priceCents: number | null;
  adminNotes: string | null;
}) {
  const [state, formAction] = useActionState(updateBooking, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? <FormNotice tone={state.ok ? "success" : "error"}>{state.message}</FormNotice> : null}
      <input type="hidden" name="bookingId" value={bookingId} />

      <Field label="Status" name="status" error={state.errors?.status}>
        <Select id="status" name="status" defaultValue={status}>
          {(Object.keys(BOOKING_STATUS_LABELS) as BookingStatus[]).map((value) => (
            <option key={value} value={value}>
              {BOOKING_STATUS_LABELS[value]}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Date" name="preferredDate" error={state.errors?.preferredDate}>
          <Input id="preferredDate" name="preferredDate" type="date" defaultValue={preferredDate} error={!!state.errors?.preferredDate} />
        </Field>
        <Field label="Time" name="timeSlot" error={state.errors?.timeSlot}>
          <Select id="timeSlot" name="timeSlot" defaultValue={timeSlot}>
            <option value="MORNING">Morning</option>
            <option value="AFTERNOON">Afternoon</option>
          </Select>
        </Field>
      </div>

      <Field label="Agreed price (AUD)" name="price" error={state.errors?.price} hint="- leave blank if not set yet">
        <Input
          id="price"
          name="price"
          inputMode="decimal"
          placeholder="450"
          defaultValue={priceCents ? (priceCents / 100).toFixed(2) : ""}
          error={!!state.errors?.price}
        />
      </Field>

      <Field label="Notes" name="adminNotes" error={state.errors?.adminNotes} hint="- included if you notify the customer">
        <Textarea id="adminNotes" name="adminNotes" rows={4} defaultValue={adminNotes ?? ""} />
      </Field>

      <Checkbox name="notifyCustomer" label="Email the customer about this update" defaultChecked />

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" /> Saving
        </>
      ) : (
        "Save Booking"
      )}
    </Button>
  );
}
