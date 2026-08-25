"use client";

import { ArrowUp, Check, Loader2, MessageSquare, Phone, Wrench, X } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { submitChatRequest } from "@/actions/engage";
import { allSuburbs, business } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { FormState } from "@/lib/validation";

const initialState: FormState = { ok: false };

/** The opening menu. Each one becomes the saved enquiry topic. */
const TOPICS = [
  { label: "Get a free quote (send photos of the damage)", short: "Free quote" },
  { label: "Book a mobile repair at my home or work", short: "Booking" },
  { label: "Ask about pricing for a dent, scratch or bumper", short: "Pricing" },
  { label: "Check if you cover my suburb", short: "Service area" },
  { label: "Insurance claim / written quote", short: "Insurance" },
  { label: "Something else", short: "Other" },
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);
  const [state, formAction] = useActionState(submitChatRequest, initialState);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the newest message in view as the conversation grows.
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [topic, state.ok, state.message]);

  return (
    <>
      {/* ------------------------------------------------------------ Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with us"}
        aria-expanded={open}
        className={cn(
          "group fixed bottom-20 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-xl shadow-black/50 transition-all duration-300 hover:scale-105 lg:bottom-7 lg:right-7",
          open && "scale-95",
        )}
      >
        {open ? <X className="size-6" /> : <MessageSquare className="size-6" />}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-4 rounded-full bg-emerald-400" />
          </span>
        )}
      </button>

      {/* --------------------------------------------------------------- Panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Chat with Car Body Doc"
          data-lenis-prevent
          className="anim-in fixed bottom-[calc(1rem+var(--callbar-h)+4.5rem)] right-4 z-50 flex max-h-[calc(100dvh-var(--header-h)-var(--callbar-h)-7rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-hairline bg-panel shadow-2xl shadow-black/70 sm:right-5 lg:bottom-24 lg:right-7"
          style={{ animationDuration: "260ms" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-hairline bg-panel-2 p-4">
            <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
              <Wrench className="size-5" />
              <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-panel-2 bg-emerald-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg uppercase leading-tight text-white">{business.name}</p>
              <p className="text-xs text-white/45">Usually replies within a few minutes</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Conversation + form share one scroll region, so the whole thing is
              reachable once the panel hits its height cap. */}
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="space-y-4 p-4">
            <Bubble>
              G&rsquo;day! Welcome to <strong className="text-white">{business.name}</strong> - mobile smash repairs
              across {business.baseCity}. What can we help you with today?
            </Bubble>

            {!topic && (
              <div className="space-y-2">
                {TOPICS.map((item) => (
                  <button
                    key={item.short}
                    type="button"
                    onClick={() => setTopic(item.label)}
                    className="w-full rounded-lg border border-hairline bg-panel-2 px-4 py-3 text-left text-base text-white/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500 hover:text-white"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {topic && (
              <>
                <div className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand-500 px-4 py-2.5 text-base text-white">
                    {topic}
                  </p>
                </div>

                {state.ok ? (
                  <Bubble>
                    <span className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                      <span>
                        {state.message}
                        <span className="mt-2 block text-sm text-white/45">
                          Your reference is <span className="font-display text-brand-400">{state.reference}</span>
                        </span>
                      </span>
                    </span>
                  </Bubble>
                ) : (
                  <Bubble>Leave your details and we&rsquo;ll call you straight back.</Bubble>
                )}
              </>
            )}
          </div>

          {/* Details form */}
          {topic && !state.ok && (
            <form action={formAction} className="space-y-2.5 border-t border-hairline bg-panel-2 p-4">
              <input type="hidden" name="topic" value={topic} />

              <div className="grid grid-cols-2 gap-2.5">
                <ChatInput name="name" placeholder="Your name*" error={state.errors?.name} required />
                <ChatInput name="phone" type="tel" placeholder="Phone*" error={state.errors?.phone} required />
              </div>
              <ChatInput name="email" type="email" placeholder="Email (optional)" error={state.errors?.email} />
              <ChatInput name="suburb" placeholder="Suburb (optional)" list="chat-suburbs" error={state.errors?.suburb} />
              <datalist id="chat-suburbs">
                {allSuburbs.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>

              <div className="flex items-end gap-2">
                <textarea
                  name="message"
                  rows={2}
                  placeholder="Anything else we should know?"
                  className="w-full resize-none rounded-lg border border-hairline bg-panel px-3 py-2.5 text-base text-white placeholder:text-white/35 outline-none transition-colors focus:border-brand-500"
                />
                <SendButton />
              </div>

              {state.message && !state.ok ? <p className="text-sm text-brand-400">{state.message}</p> : null}

              <p className="pt-1 text-xs leading-relaxed text-white/35">
                By sending this you agree to us contacting you about your repair. See our{" "}
                <Link href="/privacy" className="underline hover:text-white/60" onClick={() => setOpen(false)}>
                  privacy policy
                </Link>
                .
              </p>
            </form>
          )}
          </div>

          {/* Footer shortcuts */}
          <div className="grid grid-cols-2 gap-px border-t border-hairline bg-hairline">
            <a
              href={business.phoneHref}
              className="flex items-center justify-center gap-2 bg-panel-2 py-3 font-display text-base uppercase text-white transition-colors hover:bg-panel"
            >
              <Phone className="size-4 text-brand-500" />
              Call now
            </a>
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 bg-brand-500 py-3 font-display text-base uppercase text-white transition-colors hover:bg-brand-600"
            >
              Photo quote
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-brand-400">
        <Wrench className="size-3.5" />
      </span>
      <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-panel-2 px-4 py-2.5 text-base leading-relaxed text-white/75">
        {children}
      </p>
    </div>
  );
}

function ChatInput({
  error,
  className,
  ...props
}: React.ComponentProps<"input"> & { error?: string }) {
  return (
    <div>
      <input
        {...props}
        className={cn(
          "w-full rounded-lg border bg-panel px-3 py-2.5 text-base text-white placeholder:text-white/35 outline-none transition-colors focus:border-brand-500",
          error ? "border-brand-500" : "border-hairline",
          className,
        )}
      />
      {error ? <p className="mt-1 text-xs text-brand-400">{error}</p> : null}
    </div>
  );
}

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Send enquiry"
      className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-5 animate-spin" /> : <ArrowUp className="size-5" />}
    </button>
  );
}
