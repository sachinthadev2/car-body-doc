import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

const control =
  "w-full rounded-sm border bg-panel-2 px-3.5 py-2.5 text-[15px] text-white placeholder:text-white/30 outline-none transition-colors focus:border-brand-500";

export function Label({ htmlFor, children, hint }: { htmlFor?: string; children: ReactNode; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium text-white/70">
      {children}
      {hint ? <span className="ml-1.5 font-normal text-white/35">{hint}</span> : null}
    </label>
  );
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-1.5 text-[13px] text-brand-400">{children}</p>;
}

export function Field({
  label,
  name,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={name} hint={hint}>
        {label}
      </Label>
      {children}
      <FieldError>{error}</FieldError>
    </div>
  );
}

export function Input({ error, className, ...props }: ComponentProps<"input"> & { error?: boolean }) {
  return <input className={cn(control, error ? "border-brand-500" : "border-hairline", className)} {...props} />;
}

export function Textarea({ error, className, ...props }: ComponentProps<"textarea"> & { error?: boolean }) {
  return (
    <textarea className={cn(control, "min-h-28 resize-y", error ? "border-brand-500" : "border-hairline", className)} {...props} />
  );
}

export function Select({ error, className, children, ...props }: ComponentProps<"select"> & { error?: boolean }) {
  return (
    <select
      className={cn(control, "appearance-none pr-9", error ? "border-brand-500" : "border-hairline", className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none' stroke='%23888' stroke-width='1.5'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        backgroundSize: "12px",
      }}
      {...props}
    >
      {children}
    </select>
  );
}

export function Checkbox({ label, ...props }: ComponentProps<"input"> & { label: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-[14px] text-white/75">
      <input
        type="checkbox"
        className="mt-0.5 size-4 shrink-0 accent-[var(--color-brand-500)]"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}

export function FormNotice({ tone, children }: { tone: "success" | "error"; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-sm border px-4 py-3 text-sm",
        tone === "success"
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
          : "border-brand-500/40 bg-brand-500/10 text-brand-200",
      )}
    >
      {children}
    </div>
  );
}
